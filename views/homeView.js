module.exports = function renderHome(stats, noticias, produtos = [], empresaInfo = {}, formModelos = [], formMateriais = [], popups = [], vagas = []) {
    
    const hoje = new Date().toISOString().slice(0, 10);
    
    // Lógica do Pop-up Genérico
    const popupAtivo = popups.find(p => {
        const inicio = new Date(p.data_inicio).toISOString().slice(0, 10);
        const fim = new Date(p.data_fim).toISOString().slice(0, 10);
        return hoje >= inicio && hoje <= fim;
    });

    // NOVO: Lógica da Vaga Ativa (Se existir uma vaga na data de hoje, mostra no modal)
    const vagaAtiva = vagas.find(v => {
        const inicio = new Date(v.data_inicio).toISOString().slice(0, 10);
        const fim = new Date(v.data_fim).toISOString().slice(0, 10);
        return hoje >= inicio && hoje <= fim;
    });

    // 1. Gerador de Notícias
    const noticiasSlides = noticias.map(item => `
        <div class="swiper-slide bg-white p-8 rounded-3xl shadow-lg border border-gray-100 cursor-pointer hover:shadow-xl transition-shadow" onclick="openModal('${item.titulo}', '${item.descricao.replace(/'/g, "\\'")}')">
            <span class="inline-block px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 ${item.tipo === 'promocao' ? 'bg-brandLight text-brand' : 'bg-gray-100 text-gray-600'}">${item.tipo}</span>
            <h4 class="text-2xl font-black mt-2 text-gray-800 leading-tight">${item.titulo}</h4>
            <p class="text-gray-500 mt-3 truncate">${item.descricao}</p>
            <div class="mt-6 flex items-center text-brand font-bold">Ler mais <i class="fa-solid fa-chevron-right ml-2 text-sm"></i></div>
        </div>
    `).join('');

    // 2. Gerador Dinâmico de Cards de Produtos
    const renderCaixaCard = (p) => `
        <div class="swiper-slide bg-white overflow-hidden border border-gray-100 flex flex-col h-full rounded-3xl shadow-sm">
            <div class="relative h-64 md:h-80 lg:h-96 overflow-hidden">
                <img src="${p.imagem_url}" class="w-full h-full object-cover transform hover:scale-110 transition duration-700" alt="${p.titulo}">
            </div>
            <div class="p-6 md:p-8 text-center flex-grow flex flex-col justify-center">
                <h4 class="text-xl md:text-2xl font-black text-gray-900">${p.titulo}</h4>
                <p class="mt-2 md:mt-3 text-gray-500 text-sm">${p.descricao}</p>
            </div>
        </div>
    `;

    // Filtramos os produtos do banco para cada slider
    let destaquesCards = produtos.filter(p => p.secao === 'destaque').map(renderCaixaCard).join('');
    let alimenticioCards = produtos.filter(p => p.secao === 'alimenticio').map(renderCaixaCard).join('');
    let industrialCards = produtos.filter(p => p.secao === 'industrial').map(renderCaixaCard).join('');

    // Duplicamos as variáveis HTML para garantir que o Loop infinito do Swiper sempre funcione, mesmo com poucas caixas cadastradas
    if(destaquesCards) destaquesCards += destaquesCards;
    if(alimenticioCards) alimenticioCards += alimenticioCards;
    if(industrialCards) industrialCards += industrialCards;

    // Fallbacks (Caso o usuário apague todos os itens do painel admin, mostramos avisos no lugar de um espaço quebrado)
    const fallbackHTML = `<div class="swiper-slide bg-gray-50 p-10 text-center rounded-3xl border border-gray-200"><i class="fa-solid fa-box-open text-4xl text-gray-300 mb-3"></i><p class="text-gray-500 font-bold">Nenhum modelo cadastrado nesta seção.</p></div>`;
    
    // Tratamento dos textos da Empresa
    const tituloEmpresa = empresaInfo.titulo || 'Nossa Raiz, Nossa Força';
    const textoEmpresa = empresaInfo.texto_historia ? empresaInfo.texto_historia.replace(/\n/g, '<br><br>') : 'A história da nossa fábrica será contada aqui em breve.';
    
    // Tratamento dos números de estatísticas
    const anosAlvo = stats.anos_historia || 0;
    const caixasAlvo = stats.caixas_vendidas ? Math.floor(stats.caixas_vendidas / 1000000) : 0; 

    return `
    <!DOCTYPE html>
    <html lang="pt-BR" class="scroll-smooth">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="description" content="Fábrica de caixas de papelão em Camaçari - BA. Soluções em embalagens para o ramo alimentício e industrial. Solicite seu orçamento direto da fábrica.">
        <meta name="keywords" content="caixas de papelão, fábrica de caixas, Camaçari, Bahia, embalagens de papelão, caixa maleta, caixa corte e vinco">
        <meta name="robots" content="index, follow">
        <title>Ecocaixas | Caixas de papelão personalizadas</title>
        
        <script src="https://cdn.tailwindcss.com"></script>
        <script>
            tailwind.config = {
                theme: {
                    extend: {
                        colors: { brand: '#029723', brandDark: '#015e15', brandLight: '#e6f5e9', darkBg: '#0a1910' },
                        fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'], }
                    }
                }
            }
        </script>

        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800;900&display=swap" rel="stylesheet">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@10/swiper-bundle.min.css" />
        <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
        
        <style>
            body { font-family: 'Inter', sans-serif; background-color: #fbfbfb; overflow-x: hidden; }
            
            .swiper-button-next, .swiper-button-prev { color: #029723 !important; background: white !important; width: 45px !important; height: 45px !important; border-radius: 50%; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); z-index: 50 !important; }
            .swiper-button-next:after, .swiper-button-prev:after { font-size: 20px !important; font-weight: bold; }
            .swiper-pagination-bullet-active { background-color: #029723 !important; }
            
            .productSwiper { padding: 50px 0; }
            .productSwiper .swiper-slide { transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1); transform: scale(0.85); opacity: 0.4; border-radius: 2rem; }
            .productSwiper .swiper-slide-active { transform: scale(1.05); opacity: 1; z-index: 10; box-shadow: 0 25px 50px -12px rgba(2, 151, 35, 0.15); }
            .catalogoSwiper { padding: 20px 0 50px 0; }
            
            input, select, textarea { transition: all 0.3s ease; }
            input:focus, select:focus, textarea:focus { transform: translateY(-2px); box-shadow: 0 10px 15px -3px rgba(2, 151, 35, 0.1); }

            .mosaico-container { position: relative; width: 100%; }
            .mosaico-img { position: absolute; transition: all 1.2s cubic-bezier(0.25, 1, 0.5, 1); border-radius: 1.5rem; object-fit: cover; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.3); }
            .slot-1 { top: 0; left: 0; width: 100%; height: 58%; z-index: 10; }
            .slot-2 { bottom: 0; left: 0; width: 48%; height: 38%; z-index: 1; }
            .slot-3 { bottom: 0; right: 0; width: 48%; height: 38%; z-index: 1; }
        </style>
    </head>
    <body class="text-gray-800 antialiased selection:bg-brand selection:text-white">

        <header class="bg-white/80 backdrop-blur-lg border-b border-gray-100 sticky top-0 z-50 transition-all duration-300">
            <div class="container mx-auto px-6 py-4 flex justify-between items-center relative z-50 bg-transparent">
                <div class="flex items-center cursor-pointer" onclick="window.scrollTo(0,0)">
                    <img src="/logo.png" alt="Logo Ecocaixas" class="h-12 w-auto">
                </div>
                
                <nav class="hidden lg:flex space-x-8 font-semibold items-center text-sm text-gray-600">
                    <a href="#produtos" class="hover:text-brand transition">Destaques</a>
                    <a href="#setores" class="hover:text-brand transition">Setores</a>
                    <a href="#catalogo" class="hover:text-brand transition">Catálogo</a>
                    <a href="#sobre" class="hover:text-brand transition">A Fábrica</a>
                    <a href="/vagas" class="text-brand font-bold hover:text-brandDark transition"><i class="fa-solid fa-briefcase mr-1"></i> Vagas</a>
                    <a href="/admin" class="text-brand font-bold hover:text-brandDark transition"><i class="fa-solid fa-gear mr-1"></i> Admin</a>
                    <a href="#contato" class="bg-brand text-white px-6 py-2.5 rounded-full hover:bg-brandDark hover:shadow-lg hover:shadow-brand/30 transition-all transform hover:-translate-y-0.5">Criar Orçamento</a>
                </nav>

                <button id="mobileMenuBtn" class="lg:hidden text-gray-800 text-2xl focus:outline-none" onclick="toggleMobileMenu()">
                    <i class="fa-solid fa-bars"></i>
                </button>
            </div>

            <div id="mobileMenu" class="absolute top-full left-0 w-full bg-white shadow-2xl origin-top transform scale-y-0 opacity-0 transition-all duration-300 flex flex-col lg:hidden z-40 border-b border-gray-100">
                <div class="px-6 py-6 flex flex-col space-y-5 font-bold text-gray-700 text-center">
                    <a href="#produtos" class="hover:text-brand" onclick="toggleMobileMenu()">Destaques</a>
                    <a href="#setores" class="hover:text-brand" onclick="toggleMobileMenu()">Setores</a>
                    <a href="#catalogo" class="hover:text-brand" onclick="toggleMobileMenu()">Catálogo</a>
                    <a href="#sobre" class="hover:text-brand" onclick="toggleMobileMenu()">A Fábrica</a>
                    <a href="/vagas" class="text-brand" onclick="toggleMobileMenu()"><i class="fa-solid fa-briefcase mr-1"></i> Vagas</a>
                    <a href="/admin" class="text-brand font-bold hover:text-brandDark transition"><i class="fa-solid fa-gear mr-1"></i> Admin</a>
                    <a href="#contato" class="bg-brand text-white px-6 py-4 rounded-xl hover:bg-brandDark transition-all mt-2" onclick="toggleMobileMenu()">Criar Orçamento</a>
                </div>
            </div>
        </header>

        <section id="produtos" class="relative pt-20 pb-28 overflow-hidden">
            <div class="absolute inset-0 z-0">
                <img src="/fabrica2.png" class="w-full h-full object-cover opacity-100" alt="Fábrica Ecocaixas">
                <div class="absolute inset-0 bg-gradient-to-b from-[#fbfbfb] via-[#fbfbfb]/60 to-gray-50"></div>
            </div>
            
            <div class="container mx-auto px-6 relative z-10">
                <div class="text-center mb-10" data-aos="fade-down" data-aos-duration="1000">
                    <span class="text-brand font-bold tracking-widest uppercase text-sm mb-2 block">Destaques da Produção</span>
                    <h2 class="text-4xl md:text-6xl font-black text-gray-900 mb-4 tracking-tight">Embalagens que <br class="md:hidden"><span class="text-brand">protegem</span> o seu negócio.</h2>
                </div>
                
                <div class="swiper productSwiper" data-aos="zoom-in" data-aos-delay="200" data-aos-duration="1200">
                    <div class="swiper-wrapper">
                        ${destaquesCards || fallbackHTML}
                    </div>
                    <div class="swiper-pagination mt-10"></div>
                    <div class="swiper-button-next hidden md:flex"></div>
                    <div class="swiper-button-prev hidden md:flex"></div>
                </div>
            </div>
        </section>

        <section id="setores" class="py-20 bg-white relative">
            <div class="container mx-auto px-6">
                <h2 class="text-3xl md:text-5xl font-black text-gray-900 mb-16 text-center tracking-tight" data-aos="fade-up">Feito para o seu setor.</h2>
                <div class="grid lg:grid-cols-2 gap-8 md:gap-12">
                    
                    <div class="bg-gray-50 rounded-[2.5rem] p-8 md:p-12 border-2 border-gray-300 hover:bg-brandLight hover:border-brand/40 transition-colors duration-500 group shadow-sm" data-aos="fade-right" data-aos-duration="1000">
                        <div class="w-20 h-20 bg-white rounded-2xl border border-gray-300 shadow-sm flex items-center justify-center text-4xl mb-8 text-brand transform group-hover:-translate-y-2 transition-transform duration-300">
                            <i class="fa-solid fa-burger"></i>
                        </div>
                        <h3 class="text-3xl font-black text-gray-900 mb-4">Ramo Alimentício</h3>
                        <p class="text-gray-600 mb-8 leading-relaxed">Embalagens atóxicas e térmicas. Papelão certificado para contato seguro com alimentos.</p>
                    </div>

                    <div class="bg-gray-50 rounded-[2.5rem] p-8 md:p-12 border-2 border-gray-300 hover:bg-gray-100 hover:border-gray-400 transition-colors duration-500 group shadow-sm" data-aos="fade-left" data-aos-duration="1000" data-aos-delay="200">
                        <div class="w-20 h-20 bg-white rounded-2xl border border-gray-300 shadow-sm flex items-center justify-center text-4xl mb-8 text-gray-800 transform group-hover:-translate-y-2 transition-transform duration-300">
                            <i class="fa-solid fa-industry"></i>
                        </div>
                        <h3 class="text-3xl font-black text-gray-900 mb-4">Ramo Industrial</h3>
                        <p class="text-gray-600 mb-8 leading-relaxed">Soluções robustas de alta gramatura. Integridade garantida no transporte pesado.</p>
                    </div>

                </div>
            </div>
        </section>

        <section id="catalogo" class="py-24 bg-gray-50">
            <div class="container mx-auto px-6">
                <div class="text-center mb-16" data-aos="fade-up">
                    <span class="text-brand font-bold tracking-widest uppercase text-sm mb-2 block">Nosso Portfólio</span>
                    <h2 class="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">Catálogo de Produtos</h2>
                </div>

                <div class="mb-20" data-aos="fade-up" data-aos-delay="100">
                    <h3 class="text-2xl font-black text-brand mb-6 flex items-center border-l-4 border-brand pl-4">
                        <i class="fa-solid fa-utensils mr-3"></i> Linha Alimentícia
                    </h3>
                    <div class="relative border-2 border-gray-300 rounded-[2rem] p-4 md:p-6 bg-white shadow-sm">
                        <div class="swiper catalogoSwiper swiperAlimentos">
                            <div class="swiper-wrapper">
                                ${alimenticioCards || fallbackHTML}
                            </div>
                            <div class="swiper-pagination mt-4 relative"></div>
                        </div>
                        <div class="swiper-button-next alimentos-next hidden md:flex absolute top-1/2 -right-5 transform -translate-y-1/2 z-10"></div>
                        <div class="swiper-button-prev alimentos-prev hidden md:flex absolute top-1/2 -left-5 transform -translate-y-1/2 z-10"></div>
                    </div>
                </div>

                <div data-aos="fade-up" data-aos-delay="200">
                    <h3 class="text-2xl font-black text-gray-800 mb-6 flex items-center border-l-4 border-gray-800 pl-4">
                        <i class="fa-solid fa-pallet mr-3"></i> Linha Industrial
                    </h3>
                    <div class="relative border-2 border-gray-300 rounded-[2rem] p-4 md:p-6 bg-white shadow-sm">
                        <div class="swiper catalogoSwiper swiperIndustrial">
                            <div class="swiper-wrapper">
                                ${industrialCards || fallbackHTML}
                            </div>
                            <div class="swiper-pagination mt-4 relative"></div>
                        </div>
                        <div class="swiper-button-next ind-next hidden md:flex absolute top-1/2 -right-5 transform -translate-y-1/2 z-10"></div>
                        <div class="swiper-button-prev ind-prev hidden md:flex absolute top-1/2 -left-5 transform -translate-y-1/2 z-10"></div>
                    </div>
                </div>
            </div>
        </section>

        <section id="sobre" class="py-24 bg-darkBg text-white relative overflow-hidden">
            <div class="absolute top-0 right-0 -mr-40 -mt-40 w-96 h-96 rounded-full bg-brand opacity-20 blur-[100px]"></div>
            
            <div class="container mx-auto px-6 relative z-10">
                <div class="text-center mb-16" data-aos="fade-up">
                    <div class="inline-block bg-white/10 backdrop-blur border border-white/20 px-6 py-2 rounded-full text-sm font-bold tracking-widest uppercase mb-6">
                        <i class="fa-solid fa-location-dot mr-2 text-brand"></i> Camaçari - BA
                    </div>
                    <h2 class="text-4xl md:text-6xl font-black mb-6 tracking-tight">Sobre a Ecocaixas</h2>
                </div>

                <div class="grid lg:grid-cols-2 gap-16 items-center mb-24">
                    <div data-aos="fade-right" data-aos-duration="1000">
                        <h3 class="text-3xl font-bold mb-6 text-white border-l-4 border-brand pl-4">${tituloEmpresa}</h3>
                        <div class="space-y-6 text-gray-300 text-lg leading-relaxed text-justify mb-10">
                            <p>${textoEmpresa}</p>
                        </div>
                        
                        <div class="grid grid-cols-2 gap-6" id="stats-container">
                            <div class="bg-white/5 border border-white/10 p-8 rounded-[2rem] backdrop-blur hover:bg-white/10 transition-colors text-center">
                                <div class="text-5xl md:text-6xl font-black mb-2 text-brand flex justify-center">
                                    <span class="contador" data-target="${anosAlvo}">0</span>
                                </div>
                                <span class="text-sm font-bold uppercase tracking-widest text-gray-400">Anos de História</span>
                            </div>
                            <div class="bg-white/5 border border-white/10 p-8 rounded-[2rem] backdrop-blur hover:bg-white/10 transition-colors text-center">
                                <div class="text-5xl md:text-6xl font-black mb-2 text-brand flex justify-center items-center">
                                    <span class="contador" data-target="${caixasAlvo}">0</span>
                                    <span class="text-4xl ml-1">M+</span>
                                </div>
                                <span class="text-sm font-bold uppercase tracking-widest text-gray-400">Caixas Produzidas</span>
                            </div>
                        </div>
                    </div>

                    <div class="mosaico-container h-80 md:h-[500px]" data-aos="fade-left" data-aos-duration="1200">
                        <img id="mosaico-1" src="${empresaInfo.img_mosaico_1 || 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=800&h=800&fit=crop'}" class="mosaico-img slot-1">
                        <img id="mosaico-2" src="${empresaInfo.img_mosaico_2 || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500&h=400&fit=crop'}" class="mosaico-img slot-2">
                        <img id="mosaico-3" src="${empresaInfo.img_mosaico_3 || 'https://images.unsplash.com/photo-1616423640778-28d1b53229bd?w=500&h=400&fit=crop'}" class="mosaico-img slot-3">
                    </div>
                </div>

                <div class="bg-gradient-to-br from-brand to-brandDark rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden max-w-5xl mx-auto" data-aos="fade-up">
                    <div class="flex flex-col md:flex-row items-center gap-8 relative z-10">
                        <div class="md:w-1/3 text-white">
                            <h3 class="text-3xl font-black mb-4 leading-tight">Mural da Fábrica</h3>
                            <p class="text-brandLight text-sm opacity-90">Deslize para ver novidades, recados da diretoria e promoções.</p>
                        </div>
                        <div class="md:w-2/3 w-full">
                            <div class="swiper newsSwiper">
                                <div class="swiper-wrapper pb-10">
                                    ${noticiasSlides || '<div class="swiper-slide bg-white/20 p-6 rounded-3xl text-white text-center backdrop-blur">Nenhuma atualização no momento.</div>'}
                                </div>
                                <div class="swiper-pagination"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section id="contato" class="py-24 bg-gray-50 relative">
            <div class="container mx-auto px-6 max-w-4xl relative z-10">
                <div class="text-center mb-16" data-aos="fade-down">
                    <h2 class="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">Monte seu Pedido</h2>
                    <p class="text-gray-500 text-lg">Processo rápido e direto para o WhatsApp do seu setor em Camaçari.</p>
                </div>

                <form id="formContato" class="bg-white p-6 md:p-12 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border-2 border-gray-300" onsubmit="prepararEnvio(event)" data-aos="fade-up" data-aos-delay="200">
                    
                    <div class="mb-10">
                        <h3 class="text-lg font-black text-gray-900 mb-6 flex items-center"><span class="bg-gray-100 text-brand w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">1</span> Dados da Empresa</h3>
                        <div class="grid md:grid-cols-2 gap-6">
                            <div>
                                <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Nome da Empresa</label>
                                <input class="w-full bg-gray-50 px-5 py-4 rounded-2xl border border-gray-300 ring-1 ring-gray-300 focus:ring-2 focus:ring-brand focus:border-brand focus:bg-white text-gray-900 font-medium" type="text" id="empresa" required placeholder="Ex: Mercado Silva LTDA">
                            </div>
                            <div>
                                <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Seu Nome e Contato</label>
                                <input class="w-full bg-gray-50 px-5 py-4 rounded-2xl border border-gray-300 ring-1 ring-gray-300 focus:ring-2 focus:ring-brand focus:border-brand focus:bg-white text-gray-900 font-medium" type="text" id="contatoNome" required placeholder="João - (71) 90000-0000">
                            </div>
                        </div>
                        <div class="grid md:grid-cols-2 gap-6 mt-6">
                            <div>
                                <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Instagram (Opcional)</label>
                                <input class="w-full bg-gray-50 px-5 py-4 rounded-2xl border border-gray-300 ring-1 ring-gray-300 focus:ring-2 focus:ring-brand focus:border-brand focus:bg-white text-gray-900 font-medium disabled:opacity-50" type="text" id="instagram" placeholder="@suaempresa">
                                <label class="flex items-center text-sm text-gray-500 mt-3 cursor-pointer select-none">
                                    <input type="checkbox" id="checkInsta" class="mr-2 rounded text-brand focus:ring-brand border-gray-300 w-4 h-4" onchange="toggleField('instagram', this.checked)"> Não possuo
                                </label>
                            </div>
                            <div>
                                <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Site / App (Opcional)</label>
                                <input class="w-full bg-gray-50 px-5 py-4 rounded-2xl border border-gray-300 ring-1 ring-gray-300 focus:ring-2 focus:ring-brand focus:border-brand focus:bg-white text-gray-900 font-medium disabled:opacity-50" type="text" id="site" placeholder="www.suaempresa.com.br">
                                <label class="flex items-center text-sm text-gray-500 mt-3 cursor-pointer select-none">
                                    <input type="checkbox" id="checkSite" class="mr-2 rounded text-brand focus:ring-brand border-gray-300 w-4 h-4" onchange="toggleField('site', this.checked)"> Não possuo
                                </label>
                            </div>
                        </div>
                    </div>

                    <div class="mb-10">
                        <h3 class="text-lg font-black text-gray-900 mb-6 flex items-center"><span class="bg-gray-100 text-brand w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">2</span> Direcionamento</h3>
                        <div class="bg-brandLight/50 p-6 rounded-3xl border-2 border-brand/30">
                            <label class="block text-sm font-bold text-gray-900 mb-3">Qual o Segmento Principal da sua Empresa?</label>
                            <select class="w-full bg-white px-5 py-4 rounded-2xl border border-gray-300 ring-1 ring-gray-300 focus:ring-2 focus:ring-brand focus:border-brand font-medium text-gray-800" id="setorPrincipal" required>
                                <option value="" disabled selected>Selecione uma opção...</option>
                                <option value="alimenticio">Ramo Alimentício</option>
                                <option value="industrial">Ramo Industrial</option>
                            </select>
                        </div>
                    </div>

                    <div class="mb-10">
                        <div class="flex justify-between items-center mb-6">
                            <h3 class="text-lg font-black text-gray-900 flex items-center"><span class="bg-gray-100 text-brand w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">3</span> Itens do Pedido</h3>
                            <button type="button" onclick="abrirModalCaixa()" class="bg-gray-900 text-white text-sm font-bold px-5 py-2.5 rounded-full hover:bg-brand transition-colors flex items-center shadow-md border border-gray-700">
                                <i class="fa-solid fa-plus mr-2"></i> Caixa
                            </button>
                        </div>
                        <div id="listaPedidos" class="space-y-4">
                            <div class="text-center p-8 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-300 text-gray-500 font-medium" id="emptyState">
                                Seu carrinho está vazio. Adicione os modelos de caixa acima.
                            </div>
                        </div>
                    </div>

                    <div class="mb-10">
                        <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Observações (Opcional)</label>
                        <textarea class="w-full bg-gray-50 px-5 py-4 rounded-2xl border border-gray-300 ring-1 ring-gray-300 focus:ring-2 focus:ring-brand focus:border-brand focus:bg-white text-gray-900 font-medium" id="descricaoGeral" rows="2" placeholder="Ex: Precisamos de impressão da logomarca..."></textarea>
                    </div>

                    <button type="submit" class="w-full bg-[#25D366] hover:bg-[#1fae53] text-white font-black py-5 rounded-full transition-all transform hover:-translate-y-1 shadow-xl shadow-green-500/30 text-lg flex justify-center items-center border-2 border-[#1fae53]">
                        <i class="fa-brands fa-whatsapp text-2xl mr-3"></i> Enviar Pedido via WhatsApp
                    </button>
                </form>
            </div>
        </section>

        <footer class="bg-gray-900 py-6 border-t border-gray-800 mt-auto relative z-10">
            <div class="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between text-sm text-gray-500">
                
                <div class="mb-4 md:mb-0 text-center md:text-left">
                    <span class="text-white font-bold tracking-wider">Ecocaixas</span> &copy; 2026 — Todos os direitos reservados.
                </div>
                
                <div class="flex items-center justify-center md:justify-end space-x-3">
                    <span class="text-xs">Desenvolvido por <a href="https://www.instagram.com/71dev_/" target="_blank" class="text-white font-bold hover:text-brand transition-colors">71dev</a></span>
                    
                    <span class="w-px h-4 bg-gray-700 mx-2"></span> <a href="https://www.instagram.com/71dev_/" target="_blank" rel="noopener noreferrer" class="text-gray-500 hover:text-white transition-colors duration-300 text-lg" aria-label="Instagram da 71dev">
                        <i class="fa-brands fa-instagram"></i>
                    </a>
                    <a href="https://wa.me/5571983174920" target="_blank" rel="noopener noreferrer" class="text-gray-500 hover:text-[#25D366] transition-colors duration-300 text-lg" aria-label="WhatsApp da 71dev">
                        <i class="fa-brands fa-whatsapp"></i>
                    </a>
                </div>

            </div>
        </footer>

        <a href="https://wa.me/5571987780304" target="_blank" class="fixed bottom-6 right-6 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:bg-[#1fae53] transition-all z-40 transform hover:scale-110 flex items-center justify-center h-16 w-16"><i class="fa-brands fa-whatsapp text-3xl"></i></a>

       ${popupAtivo ? `
        <div id="popupInicial" class="fixed inset-0 bg-gray-900/80 backdrop-blur-md z-[100] hidden flex items-center justify-center transition-opacity opacity-0 px-4" style="transition: opacity 0.4s ease;">
            <div class="bg-white rounded-xl max-w-4xl w-full p-2 relative shadow-2xl transform scale-95 transition-transform duration-500" id="popupContentBody">
                <button onclick="fecharPopupInicial()" class="absolute top-4 right-4 w-10 h-10 bg-gray-100/90 rounded-full text-gray-800 hover:bg-gray-200 flex items-center justify-center font-bold text-xl z-20 backdrop-blur">&times;</button>
                
                ${popupAtivo.tipo_conteudo === 'imagem' 
                    ? `<img src="${popupAtivo.conteudo}" class="w-full max-h-[85vh] rounded-lg object-contain mx-auto">` 
                    : `<div class="p-12 md:p-16 text-center">
                           <i class="fa-solid fa-circle-exclamation text-6xl text-brand mb-6"></i>
                           <h3 class="text-4xl md:text-5xl font-black text-gray-900 mb-6">${popupAtivo.titulo}</h3>
                           <p class="text-gray-600 text-xl md:text-2xl leading-relaxed">${popupAtivo.conteudo}</p>
                       </div>`
                }
            </div>
        </div>
        ` : ''}

        ${vagaAtiva ? `
        <div id="modalVagaEmprego" class="fixed inset-0 bg-gray-900/80 backdrop-blur-md z-[110] hidden flex items-center justify-center transition-opacity opacity-0 px-4" style="transition: opacity 0.4s ease;">
            <div class="bg-white rounded-xl max-w-2xl w-full relative shadow-2xl transform scale-95 transition-transform duration-500 overflow-hidden" id="modalVagaContent">
                <button onclick="fecharModalVaga()" class="absolute top-4 right-4 w-10 h-10 bg-black/50 text-white rounded-full hover:bg-black/70 flex items-center justify-center font-bold text-xl z-20 backdrop-blur">&times;</button>
                
                <div class="w-full h-48 sm:h-56 bg-gray-200">
                    <img src="${vagaAtiva.imagem_banner}" class="w-full h-full object-cover" alt="Vaga: ${vagaAtiva.titulo}">
                </div>
                
                <div class="p-8">
                    <h3 class="text-2xl font-black text-gray-900 mb-2">${vagaAtiva.titulo}</h3>
                    <p class="text-gray-500 text-sm mb-6">Preencha os dados e anexe seu currículo (PDF ou Imagem).</p>
                    
                    <form action="/vagas/candidatar" method="POST" enctype="multipart/form-data">
                        <input type="hidden" name="vaga_id" value="${vagaAtiva.id}">
                        
                        <div class="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Candidato</label>
                                <input type="text" name="nome" class="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 outline-none" required placeholder="Seu nome completo">
                            </div>
                            <div>
                                <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Contato (WhatsApp)</label>
                                <input type="text" name="contato" class="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 outline-none" required placeholder="(71) 90000-0000">
                            </div>
                        </div>
                        
                        <div class="mb-4">
                            <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Bairro / Cidade</label>
                            <input type="text" name="bairro" class="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 outline-none" required placeholder="Ex: Centro, Camaçari">
                        </div>
                        
                        <div class="mb-6">
                            <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Anexar Currículo</label>
                            <input type="file" name="curriculo" accept=".pdf,image/*" class="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-sm text-gray-600 outline-none" required>
                        </div>
                        
                        <button type="submit" class="w-full bg-brand text-white font-bold py-3 rounded-lg hover:bg-brandDark transition shadow-lg">Enviar Currículo</button>
                    </form>
                </div>
            </div>
        </div>
        ` : ''}

        <div id="modalCaixa" class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm hidden z-[70] flex items-center justify-center transition-opacity opacity-0" style="transition: opacity 0.3s ease;">
            <div class="bg-white rounded-[2rem] max-w-md w-full p-6 md:p-8 relative shadow-2xl transform scale-95 transition-transform duration-300" id="modalCaixaContent">
                <button onclick="fecharModalCaixa()" class="absolute top-5 right-5 w-10 h-10 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 flex items-center justify-center font-bold text-xl">&times;</button>
                <h3 class="text-2xl font-black text-gray-900 mb-6 tracking-tight">Nova Caixa</h3>
                <form id="formAddCaixa" onsubmit="salvarItem(event)">
                    <div class="mb-5">
                        <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Setor da Caixa</label>
                        <select id="itemSetor" class="w-full bg-gray-50 px-4 py-3 rounded-xl ring-1 ring-gray-200 focus:ring-2 focus:ring-brand font-medium text-gray-900" onchange="atualizarOpcoes()" required>
                            <option value="" disabled selected>Escolha o setor...</option><option value="alimenticio">Alimentício</option><option value="industrial">Industrial</option>
                        </select>
                    </div>
                    <div class="mb-5">
                        <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Modelo</label>
                        <select id="itemModelo" class="w-full bg-gray-50 px-4 py-3 rounded-xl ring-1 ring-gray-200 focus:ring-2 focus:ring-brand font-medium text-gray-900 disabled:opacity-50" onchange="atualizarTamanhoAuto()" required disabled><option value="" disabled selected>Selecione o setor...</option></select>
                    </div>
                    <div class="grid grid-cols-2 gap-4 mb-5">
                        <div><label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Tamanho</label><input type="text" id="itemTamanho" class="w-full bg-gray-100 px-4 py-3 rounded-xl ring-1 ring-gray-200 text-gray-500 font-bold cursor-not-allowed" readonly required></div>
                        <div><label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Qtd</label><input type="number" id="itemQtd" class="w-full bg-gray-50 px-4 py-3 rounded-xl ring-1 ring-gray-200 focus:ring-2 focus:ring-brand font-medium text-gray-900" placeholder="5000" min="1" required></div>
                    </div>
                    <div class="mb-8">
                        <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Papelão</label>
                        <select id="itemMaterial" class="w-full bg-gray-50 px-4 py-3 rounded-xl ring-1 ring-gray-200 focus:ring-2 focus:ring-brand font-medium text-gray-900 disabled:opacity-50" required disabled><option value="" disabled selected>Selecione o setor...</option></select>
                    </div>
                    <button type="submit" class="w-full bg-gray-900 text-white font-black py-4 rounded-xl hover:bg-brand transition-colors shadow-lg">Adicionar Caixa</button>
                </form>
            </div>
        </div>

        <div id="newsModal" class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm hidden z-[60] flex items-center justify-center transition-opacity opacity-0" style="transition: opacity 0.3s ease;">
            <div class="bg-white rounded-[2rem] max-w-lg w-full p-8 md:p-10 relative shadow-2xl transform scale-95 transition-transform duration-300" id="modalContent">
                <button onclick="closeModal()" class="absolute top-5 right-5 w-10 h-10 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 flex items-center justify-center font-bold text-xl">&times;</button>
                <h3 id="modalTitle" class="text-3xl font-black text-gray-900 mb-4">Título</h3>
                <p id="modalDesc" class="text-gray-600 leading-relaxed text-lg">Descrição</p>
            </div>
        </div>

        <script src="https://cdn.jsdelivr.net/npm/swiper@10/swiper-bundle.min.js"></script>
        <script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>
        
        <script>
            // INJETANDO DADOS DINÂMICOS DO BANCO
            const dbModelos = ${JSON.stringify(formModelos)};
            const dbMateriais = ${JSON.stringify(formMateriais)};

            AOS.init({ once: false, mirror: true, offset: 80 });

            setInterval(() => {
                const img1 = document.getElementById('mosaico-1'); const img2 = document.getElementById('mosaico-2'); const img3 = document.getElementById('mosaico-3');
                if(img1 && img2 && img3) {
                    const cls1 = img1.className.match(/slot-\\d/)[0]; const cls2 = img2.className.match(/slot-\\d/)[0]; const cls3 = img3.className.match(/slot-\\d/)[0];
                    img1.classList.replace(cls1, cls2); img2.classList.replace(cls2, cls3); img3.classList.replace(cls3, cls1);
                }
            }, 4000);

            new Swiper('.productSwiper', {
                slidesPerView: 1, centeredSlides: true, spaceBetween: 20, loop: true,
                autoplay: { delay: 3000, disableOnInteraction: false },
                navigation: { nextEl: '.productSwiper .swiper-button-next', prevEl: '.productSwiper .swiper-button-prev' },
                pagination: { el: '.productSwiper .swiper-pagination', clickable: true },
                breakpoints: { 768: { slidesPerView: 2, spaceBetween: 30 }, 1024: { slidesPerView: 3, spaceBetween: 40 } }
            });

            new Swiper('.swiperAlimentos', {
                slidesPerView: 1, spaceBetween: 20, loop: true,
                autoplay: { delay: 3000, disableOnInteraction: false },
                navigation: { nextEl: '.alimentos-next', prevEl: '.alimentos-prev' },
                pagination: { el: '.swiperAlimentos .swiper-pagination', clickable: true },
                breakpoints: { 640: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }
            });

            new Swiper('.swiperIndustrial', {
                slidesPerView: 1, spaceBetween: 20, loop: true,
                autoplay: { delay: 3000, disableOnInteraction: false, reverseDirection: true },
                navigation: { nextEl: '.ind-next', prevEl: '.ind-prev' },
                pagination: { el: '.swiperIndustrial .swiper-pagination', clickable: true },
                breakpoints: { 640: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }
            });
            
            new Swiper('.newsSwiper', { 
                slidesPerView: 1, spaceBetween: 20, loop: true,
                autoplay: { delay: 3000, disableOnInteraction: false }, 
                pagination: { el: '.newsSwiper .swiper-pagination', clickable: true } 
            });

            const counters = document.querySelectorAll('.contador'); let hasAnimated = false;
            const animateCounters = () => {
                counters.forEach(counter => {
                    const target = +counter.getAttribute('data-target'); const increment = target / 100;
                    let currentCount = 0;
                    const updateCount = () => {
                        currentCount += increment;
                        if (currentCount < target) { counter.innerText = Math.ceil(currentCount); requestAnimationFrame(updateCount); } 
                        else { counter.innerText = target; }
                    }; updateCount();
                });
            };

            const observer = new IntersectionObserver((entries) => {
                if(entries[0].isIntersecting && !hasAnimated) { animateCounters(); hasAnimated = true; }
            }, { threshold: 0.5 });
            const statsContainer = document.getElementById('stats-container');
            if(statsContainer) observer.observe(statsContainer);

            function toggleField(fieldId, isChecked) {
                const field = document.getElementById(fieldId);
                field.disabled = isChecked; if(isChecked) field.value = '';
            }

            let itensOrcamento = [];

            function abrirModalCaixa() {
                document.getElementById('formAddCaixa').reset();
                document.getElementById('itemModelo').disabled = true; 
                document.getElementById('itemMaterial').disabled = true;
                document.getElementById('itemModelo').innerHTML = '<option value="" disabled selected>Selecione o setor...</option>';
                document.getElementById('itemMaterial').innerHTML = '<option value="" disabled selected>Selecione o setor...</option>';
                document.getElementById('itemTamanho').value = ''; 
                const modal = document.getElementById('modalCaixa'); const content = document.getElementById('modalCaixaContent');
                modal.classList.remove('hidden'); setTimeout(() => { modal.classList.remove('opacity-0'); content.classList.remove('scale-95'); }, 10);
            }

            function fecharModalCaixa() { 
                const modal = document.getElementById('modalCaixa'); const content = document.getElementById('modalCaixaContent');
                modal.classList.add('opacity-0'); content.classList.add('scale-95'); setTimeout(() => modal.classList.add('hidden'), 300);
            }

            function atualizarOpcoes() {
                const setor = document.getElementById('itemSetor').value;
                const selectModelo = document.getElementById('itemModelo');
                const selectMaterial = document.getElementById('itemMaterial');
                
                document.getElementById('itemTamanho').value = ''; 
                selectModelo.innerHTML = '<option value="" disabled selected>Escolha o modelo...</option>';
                selectMaterial.innerHTML = '<option value="" disabled selected>Escolha o material...</option>';
                
                if(setor) {
                    selectModelo.disabled = false;
                    selectMaterial.disabled = false;
                    
                    const modelosFiltrados = dbModelos.filter(m => m.secao === setor);
                    if(modelosFiltrados.length === 0) selectModelo.innerHTML = '<option value="" disabled>Nenhum modelo cadastrado.</option>';
                    modelosFiltrados.forEach(mod => { selectModelo.innerHTML += \`<option value="\${mod.nome}" data-tamanho="\${mod.tamanho}">\${mod.nome}</option>\`; });

                    const materiaisFiltrados = dbMateriais.filter(m => m.secao === setor || m.secao === 'ambos');
                    if(materiaisFiltrados.length === 0) selectMaterial.innerHTML = '<option value="" disabled>Nenhum material cadastrado.</option>';
                    materiaisFiltrados.forEach(mat => { selectMaterial.innerHTML += \`<option value="\${mat.nome}">\${mat.nome}</option>\`; });
                }
            }

            function atualizarTamanhoAuto() {
                const selectModelo = document.getElementById('itemModelo'); 
                const opcaoSelecionada = selectModelo.options[selectModelo.selectedIndex];
                document.getElementById('itemTamanho').value = opcaoSelecionada.getAttribute('data-tamanho') || '';
            }

            function salvarItem(e) {
                e.preventDefault();
                const item = {
                    setor: document.getElementById('itemSetor').options[document.getElementById('itemSetor').selectedIndex].text,
                    modelo: document.getElementById('itemModelo').value, tamanho: document.getElementById('itemTamanho').value,
                    qtd: document.getElementById('itemQtd').value, material: document.getElementById('itemMaterial').value
                };
                itensOrcamento.push(item); renderizarLista(); fecharModalCaixa();
            }

            function removerItem(index) { itensOrcamento.splice(index, 1); renderizarLista(); }

            function renderizarLista() {
                const container = document.getElementById('listaPedidos'); const emptyState = document.getElementById('emptyState');
                if(itensOrcamento.length === 0) { container.innerHTML = ''; container.appendChild(emptyState); emptyState.style.display = 'block'; return; }
                emptyState.style.display = 'none'; let html = '';
                itensOrcamento.forEach((item, index) => {
                    html += \`
                    <div class="bg-white p-5 border border-gray-100 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div class="flex items-center gap-4">
                            <div class="w-12 h-12 rounded-full \${item.setor.includes('Alimentício') ? 'bg-brandLight text-brand' : 'bg-gray-100 text-gray-800'} flex items-center justify-center text-xl"><i class="fa-solid fa-box"></i></div>
                            <div>
                                <p class="font-black text-gray-900 text-lg">\${item.qtd}x \${item.modelo}</p>
                                <p class="text-sm text-gray-500 font-medium">\${item.tamanho} • \${item.material}</p>
                            </div>
                        </div>
                        <button type="button" onclick="removerItem(\${index})" class="w-full md:w-auto bg-red-50 text-red-500 hover:bg-red-100 px-4 py-2 rounded-full font-bold transition-colors text-sm"><i class="fa-solid fa-trash mr-2"></i> Remover</button>
                    </div>\`;
                });
                container.innerHTML = html;
            }

            function prepararEnvio(event) {
                event.preventDefault();
                if(itensOrcamento.length === 0) return alert("Adicione pelo menos uma caixa ao carrinho.");
                const empresa = document.getElementById('empresa').value; const contato = document.getElementById('contatoNome').value;
                const insta = document.getElementById('checkInsta').checked ? 'Não possui' : (document.getElementById('instagram').value || 'Não informado');
                const site = document.getElementById('checkSite').checked ? 'Não possui' : (document.getElementById('site').value || 'Não informado');
                const obs = document.getElementById('descricaoGeral').value || 'Nenhuma observação adicional.';
                const setorPrincipal = document.getElementById('setorPrincipal').value;

                let textoItens = '';
                itensOrcamento.forEach((item, i) => { textoItens += \`\\n📦 *Item \${i+1}*:\\n- Modelo: \${item.modelo} (\${item.setor})\\n- Tamanho: \${item.tamanho}\\n- Quantidade: \${item.qtd}\\n- Material: \${item.material}\\n\`; });

                let numeroWhatsApp = setorPrincipal === 'alimenticio' ? '5571987780304' : '5571999317529';
                const textoFinal = \`*NOVO ORÇAMENTO - ECOCAIXAS* 🏭\\n--------------------------------\\n*Empresa:* \${empresa}\\n*Contato:* \${contato}\\n*Instagram:* \${insta}\\n*Site/App:* \${site}\\n\\n*🛒 ITENS DO PEDIDO:* \${textoItens}\\n*📝 Observações:* \${obs}\`;
                window.open(\`https://wa.me/\${numeroWhatsApp}?text=\${encodeURIComponent(textoFinal)}\`, '_blank');
            }

            function openModal(title, desc) {
                document.getElementById('modalTitle').innerText = title; document.getElementById('modalDesc').innerText = desc;
                const m = document.getElementById('newsModal'), c = document.getElementById('modalContent');
                m.classList.remove('hidden'); setTimeout(() => { m.classList.remove('opacity-0'); c.classList.remove('scale-95'); }, 10);
            }
            function closeModal() {
                const m = document.getElementById('newsModal'), c = document.getElementById('modalContent');
                m.classList.add('opacity-0'); c.classList.add('scale-95'); setTimeout(() => m.classList.add('hidden'), 300);
            }

            // ==========================================
            // LÓGICA DO POP-UP INICIAL AUTOMÁTICO
            // ==========================================
            const popupAtivoHTML = document.getElementById('popupInicial');
            if (popupAtivoHTML) {
                // Espera 1 segundo e meio após abrir o site para mostrar o Pop-up
                setTimeout(() => {
                    popupAtivoHTML.classList.remove('hidden');
                    // Pequeno delay para a animação do CSS rodar
                    setTimeout(() => {
                        popupAtivoHTML.classList.remove('opacity-0');
                        document.getElementById('popupContentBody').classList.remove('scale-95');
                    }, 50);
                }, 1500);
            }

            function fecharPopupInicial() {
                if(popupAtivoHTML) {
                    popupAtivoHTML.classList.add('opacity-0');
                    document.getElementById('popupContentBody').classList.add('scale-95');
                    setTimeout(() => popupAtivoHTML.classList.add('hidden'), 400);
                }
            }

            // Lógica para abrir o Modal de Vagas automaticamente
            const modalVagaHTML = document.getElementById('modalVagaEmprego');
            if (modalVagaHTML) {
                // Abre o modal de vagas 2 segundos após entrar no site
                setTimeout(() => {
                    modalVagaHTML.classList.remove('hidden');
                    setTimeout(() => {
                        modalVagaHTML.classList.remove('opacity-0');
                        document.getElementById('modalVagaContent').classList.remove('scale-95');
                    }, 50);
                }, 2000);
            }

            function fecharModalVaga() {
                if(modalVagaHTML) {
                    modalVagaHTML.classList.add('opacity-0');
                    document.getElementById('modalVagaContent').classList.add('scale-95');
                    setTimeout(() => modalVagaHTML.classList.add('hidden'), 400);
                }
            }

            // Controle do Menu Mobile
            function toggleMobileMenu() {
                const menu = document.getElementById('mobileMenu');
                const icon = document.querySelector('#mobileMenuBtn i');
                
                // Se estiver fechado (escala 0), ele abre
                if (menu.classList.contains('scale-y-0')) {
                    menu.classList.remove('scale-y-0', 'opacity-0');
                    menu.classList.add('scale-y-100', 'opacity-100');
                    icon.classList.replace('fa-bars', 'fa-xmark'); // Troca pra ícone de Fechar (X)
                } else {
                    // Se estiver aberto, ele fecha
                    menu.classList.add('scale-y-0', 'opacity-0');
                    menu.classList.remove('scale-y-100', 'opacity-100');
                    icon.classList.replace('fa-xmark', 'fa-bars'); // Volta pro ícone Hamburguer
                }
            }
        </script>
    </body>
    </html>
    `;
};
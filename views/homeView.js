module.exports = function renderHome(stats, noticias, produtos = [], empresaInfo = {}, formModelos = [], formMateriais = [], popups = [], vagas = []) {
    
    const hoje = new Date().toISOString().slice(0, 10);
    
    const popupAtivo = popups.find(p => {
        const inicio = new Date(p.data_inicio).toISOString().slice(0, 10);
        const fim = new Date(p.data_fim).toISOString().slice(0, 10);
        return hoje >= inicio && hoje <= fim;
    });

    const vagaAtiva = vagas.find(v => {
        const inicio = new Date(v.data_inicio).toISOString().slice(0, 10);
        const fim = new Date(v.data_fim).toISOString().slice(0, 10);
        return hoje >= inicio && hoje <= fim;
    });

    const noticiasSlides = noticias.map(item => `
        <div class="swiper-slide bg-white p-6 md:p-8 rounded-xl shadow-md border border-gray-200 cursor-pointer hover:shadow-lg transition-shadow" onclick="openModal('${item.titulo}', '${item.descricao.replace(/'/g, "\\'")}')">
            <span class="inline-block px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider mb-3 md:mb-4 ${item.tipo === 'promocao' ? 'bg-brandLight text-brand' : 'bg-gray-100 text-gray-600'}">${item.tipo}</span>
            <h4 class="text-xl md:text-2xl font-black mt-1 text-gray-800 leading-tight">${item.titulo}</h4>
            <p class="text-gray-500 mt-2 md:mt-3 text-sm truncate">${item.descricao}</p>
            <div class="mt-4 md:mt-6 flex items-center text-brand text-sm font-bold">Ler mais <i class="fa-solid fa-chevron-right ml-2 text-xs"></i></div>
        </div>
    `).join('');

    const renderCaixaCard = (p) => `
        <div class="swiper-slide bg-white overflow-hidden border border-gray-200 flex flex-col h-full rounded-xl shadow-sm">
            <div class="relative h-56 md:h-72 lg:h-80 overflow-hidden">
                <img src="${p.imagem_url}" class="w-full h-full object-cover transform hover:scale-105 transition duration-700" alt="${p.titulo}">
            </div>
            <div class="p-5 md:p-6 text-center flex-grow flex flex-col justify-center">
                <h4 class="text-lg md:text-xl font-black text-gray-900">${p.titulo}</h4>
                <p class="mt-1 md:mt-2 text-gray-500 text-xs md:text-sm">${p.descricao}</p>
            </div>
        </div>
    `;

    let destaquesCards = produtos.filter(p => p.secao === 'destaque').map(renderCaixaCard).join('');
    let alimenticioCards = produtos.filter(p => p.secao === 'alimenticio').map(renderCaixaCard).join('');
    let industrialCards = produtos.filter(p => p.secao === 'industrial').map(renderCaixaCard).join('');

    if(destaquesCards) destaquesCards += destaquesCards;
    if(alimenticioCards) alimenticioCards += alimenticioCards;
    if(industrialCards) industrialCards += industrialCards;

    const fallbackHTML = `<div class="swiper-slide bg-gray-50 p-10 text-center rounded-xl border border-gray-200"><i class="fa-solid fa-box-open text-4xl text-gray-300 mb-3"></i><p class="text-gray-500 font-bold text-sm">Nenhum modelo cadastrado nesta seção.</p></div>`;
    
    const tituloEmpresa = empresaInfo.titulo || 'Nossa Raiz, Nossa Força';
    const textoEmpresa = empresaInfo.texto_historia ? empresaInfo.texto_historia.replace(/\n/g, '<br><br>') : 'A história da nossa fábrica será contada aqui em breve.';
    
    const anosAlvo = stats.anos_historia || 0;
    const caixasAlvo = stats.caixas_vendidas ? Math.floor(stats.caixas_vendidas / 1000000) : 0; 

    return `
    <!DOCTYPE html>
    <html lang="pt-BR" class="scroll-smooth">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="description" content="Fábrica de caixas de papelão personalizadas em Camaçari - BA. Embalagens sob medida para os setores alimentício e industrial. Peça seu orçamento direto da fábrica!">
        <meta name="keywords" content="caixas de papelão, papelão, caixas de papelão personalizadas, embalagens personalizadas Bahia, fábrica de caixas Camaçari, caixas para delivery, caixas industriais sob medida, embalagens de papelão personalizadas">
        <meta name="robots" content="index, follow">

        <link rel="icon" type="image/png" sizes="128x128" href="/favicon.png?v=3">
        <link rel="apple-touch-icon" href="/favicon.png?v=3">

        <link rel="canonical" href="https://ecocaixasba.com.br/" />

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
            
            .swiper-button-next, .swiper-button-prev { color: #029723 !important; background: white !important; width: 40px !important; height: 40px !important; border-radius: 0.5rem; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); z-index: 50 !important; }
            .swiper-button-next:after, .swiper-button-prev:after { font-size: 16px !important; font-weight: bold; }
            .swiper-pagination-bullet-active { background-color: #029723 !important; }
            
            .productSwiper { padding: 40px 0; }
            .productSwiper .swiper-slide { transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1); transform: scale(0.9); opacity: 0.5; border-radius: 0.75rem; }
            .productSwiper .swiper-slide-active { transform: scale(1.02); opacity: 1; z-index: 10; box-shadow: 0 20px 40px -10px rgba(2, 151, 35, 0.15); }
            .catalogoSwiper { padding: 15px 0 40px 0; }
            
            input, select, textarea { transition: all 0.2s ease; }
            input:focus, select:focus, textarea:focus { box-shadow: 0 4px 6px -1px rgba(2, 151, 35, 0.1); }

            .mosaico-container { position: relative; width: 100%; }
            .mosaico-img { position: absolute; transition: all 1.2s cubic-bezier(0.25, 1, 0.5, 1); border-radius: 0.75rem; object-fit: cover; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.3); }
            .slot-1 { top: 0; left: 0; width: 100%; height: 58%; z-index: 10; }
            .slot-2 { bottom: 0; left: 0; width: 48%; height: 38%; z-index: 1; }
            .slot-3 { bottom: 0; right: 0; width: 48%; height: 38%; z-index: 1; }
            
            @keyframes stepFadeIn { from { opacity: 0; transform: translateX(10px); } to { opacity: 1; transform: translateX(0); } }
            .animate-step { animation: stepFadeIn 0.3s ease-out forwards; }
            
            /* Custom Video Slider Styles */
            input[type=range].video-progress { -webkit-appearance: none; background: transparent; }
            input[type=range].video-progress::-webkit-slider-thumb { -webkit-appearance: none; height: 12px; width: 12px; border-radius: 50%; background: #029723; cursor: pointer; margin-top: -4px; box-shadow: 0 0 5px rgba(0,0,0,0.3); transition: transform 0.2s; }
            input[type=range].video-progress::-webkit-slider-thumb:hover { transform: scale(1.3); }
            input[type=range].video-progress::-webkit-slider-runnable-track { width: 100%; height: 4px; cursor: pointer; background: rgba(255, 255, 255, 0.4); border-radius: 2px; }
            input[type=range].video-progress:focus { outline: none; }
        </style>
    </head>
    <body class="text-gray-800 antialiased selection:bg-brand selection:text-white">

        <header class="bg-white/90 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
            <div class="container mx-auto max-w-6xl px-6 lg:px-16 py-4 flex justify-between items-center relative z-50 bg-transparent">
                <div class="flex items-center cursor-pointer" onclick="window.scrollTo(0,0)">
                    <img src="/logo.png" alt="Logo Ecocaixas" class="h-10 md:h-12 w-auto">
                </div>
                
                <nav class="hidden lg:flex space-x-8 font-semibold items-center text-sm text-gray-600">
                    <a href="#produtos" class="hover:text-brand transition">Destaques</a>
                    <a href="#setores" class="hover:text-brand transition">Setores</a>
                    <a href="#catalogo" class="hover:text-brand transition">Catálogo</a>
                    <a href="#sobre" class="hover:text-brand transition">A Fábrica</a>
                    <a href="/vagas" class="text-brand font-bold hover:text-brandDark transition"><i class="fa-solid fa-briefcase mr-1"></i> Vagas</a>
                    <a href="/admin" class="text-brand font-bold hover:text-brandDark transition"><i class="fa-solid fa-gear mr-1"></i> Admin</a>
                    <a href="#contato" class="bg-brand text-white px-5 py-2.5 rounded-lg hover:bg-brandDark transition-colors">Criar Orçamento</a>
                </nav>

                <button id="mobileMenuBtn" class="lg:hidden text-gray-800 text-2xl focus:outline-none" onclick="toggleMobileMenu()">
                    <i class="fa-solid fa-bars"></i>
                </button>
            </div>

            <div id="mobileMenu" class="absolute top-full left-0 w-full bg-white shadow-xl origin-top transform scale-y-0 opacity-0 transition-all duration-300 flex flex-col lg:hidden z-40 border-b border-gray-200">
                <div class="px-6 py-6 flex flex-col space-y-5 font-bold text-gray-700 text-center">
                    <a href="#produtos" class="hover:text-brand" onclick="toggleMobileMenu()">Destaques</a>
                    <a href="#setores" class="hover:text-brand" onclick="toggleMobileMenu()">Setores</a>
                    <a href="#catalogo" class="hover:text-brand" onclick="toggleMobileMenu()">Catálogo</a>
                    <a href="#sobre" class="hover:text-brand" onclick="toggleMobileMenu()">A Fábrica</a>
                    <a href="/vagas" class="text-brand" onclick="toggleMobileMenu()"><i class="fa-solid fa-briefcase mr-1"></i> Vagas</a>
                    <a href="/admin" class="text-brand font-bold hover:text-brandDark transition"><i class="fa-solid fa-gear mr-1"></i> Admin</a>
                    <a href="#contato" class="bg-brand text-white px-6 py-4 rounded-lg hover:bg-brandDark transition-colors mt-2" onclick="toggleMobileMenu()">Criar Orçamento</a>
                </div>
            </div>
        </header>

        <section id="produtos" class="relative pt-16 pb-20 overflow-hidden">
            <div class="absolute inset-0 z-0">
                <img src="/fabrica2.png" class="w-full h-full object-cover opacity-100" alt="Fábrica Ecocaixas">
                <div class="absolute inset-0 bg-gradient-to-b from-[#fbfbfb] via-[#fbfbfb]/60 to-gray-50"></div>
            </div>
            
            <div class="container mx-auto max-w-6xl px-6 lg:px-16 relative z-10">
                <div class="text-center mb-10" data-aos="fade-down" data-aos-duration="1000">
                    <span class="text-brand font-bold tracking-widest uppercase text-xs mb-2 block">Destaques da Produção</span>
                    <h2 class="text-3xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">Embalagens que <br class="md:hidden"><span class="text-brand">protegem</span> o seu negócio.</h2>
                </div>
                
                <div class="swiper productSwiper" data-aos="zoom-in" data-aos-delay="200" data-aos-duration="1200">
                    <div class="swiper-wrapper">
                        ${destaquesCards || fallbackHTML}
                    </div>
                    <div class="swiper-pagination mt-8"></div>
                    <div class="swiper-button-next hidden md:flex"></div>
                    <div class="swiper-button-prev hidden md:flex"></div>
                </div>
            </div>
        </section>

        <!-- SEÇÃO SETORES COM PLAYER DE VÍDEO CUSTOMIZADO -->
        <section id="setores" class="py-16 md:py-20 bg-white relative">
            <div class="container mx-auto max-w-6xl px-6 lg:px-16">
                <h2 class="text-3xl md:text-4xl font-black text-gray-900 mb-10 md:mb-12 text-center tracking-tight" data-aos="fade-up">Feito para o seu setor.</h2>
                
                <div class="grid lg:grid-cols-2 gap-6 md:gap-10 items-center">
                    
                    <div class="flex flex-col gap-6" data-aos="fade-right" data-aos-duration="1000">
                        <div class="bg-gray-50 rounded-xl p-6 md:p-8 border border-gray-200 hover:bg-brandLight hover:border-brand/40 transition-colors duration-300 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-5 h-full">
                            <div class="w-14 h-14 md:w-16 md:h-16 shrink-0 bg-white rounded-lg border border-gray-300 shadow-sm flex items-center justify-center text-2xl md:text-3xl text-brand">
                                <i class="fa-solid fa-burger"></i>
                            </div>
                            <div>
                                <h4 class="text-xl md:text-2xl font-black text-gray-900 mb-2">Setor Alimentício / Delivery</h4>
                                <p class="text-gray-600 leading-relaxed text-sm">Embalagens atóxicas e térmicas. Papelão certificado para contato seguro com alimentos.</p>
                            </div>
                        </div>

                        <div class="bg-gray-50 rounded-xl p-6 md:p-8 border border-gray-200 hover:bg-gray-100 hover:border-gray-400 transition-colors duration-300 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-5 h-full">
                            <div class="w-14 h-14 md:w-16 md:h-16 shrink-0 bg-white rounded-lg border border-gray-300 shadow-sm flex items-center justify-center text-2xl md:text-3xl text-gray-800">
                                <i class="fa-solid fa-industry"></i>
                            </div>
                            <div>
                                <h4 class="text-xl md:text-2xl font-black text-gray-900 mb-2">Setor Industrial / E-commerce</h4>
                                <p class="text-gray-600 leading-relaxed text-sm">Soluções robustas de alta gramatura. Integridade garantida no transporte pesado.</p>
                            </div>
                        </div>
                    </div>

                    <!-- PLAYER DE VÍDEO 16:9 (1920x1080) -->
                    <!-- Adicionado #t=2 na URL para extrair o frame do segundo 2 nativamente -->
                    <div id="videoContainer" class="relative w-full aspect-video rounded-xl overflow-hidden shadow-lg border border-gray-200 group bg-black cursor-pointer" data-aos="fade-left" data-aos-duration="1000" data-aos-delay="200">
                        
                        <video id="ecoVideo" src="/institucional-ecocaixas-2026.mp4#t=2" preload="metadata" class="absolute inset-0 w-full h-full object-cover">
                            Seu navegador não suporta a tag de vídeo.
                        </video>
                        
                        <!-- Overlay e Botão Play Central -->
                        <div id="centerPlayOverlay" class="absolute inset-0 bg-black/30 flex items-center justify-center transition-all duration-300 pointer-events-none group-hover:bg-black/10">
                            <button id="centerPlayBtn" class="w-16 h-16 md:w-20 md:h-20 bg-brand text-white rounded-full flex items-center justify-center text-2xl md:text-3xl hover:bg-brandDark hover:scale-110 transition-all shadow-xl pointer-events-auto">
                                <i class="fa-solid fa-play ml-1.5 md:ml-2"></i>
                            </button>
                        </div>

                        <!-- Barra de Controles Inferior -->
                        <div id="videoControls" class="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/90 to-transparent p-4 flex items-center gap-3 md:gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">
                            
                            <button id="playPauseBtn" class="text-white hover:text-brand transition-colors transform hover:scale-110 w-6 flex justify-center">
                                <i class="fa-solid fa-play text-sm md:text-base"></i>
                            </button>
                            
                            <div class="flex-grow flex items-center relative">
                                <input type="range" id="progressBar" class="video-progress w-full h-1.5" value="0" min="0" step="0.1">
                            </div>
                            
                            <span id="timeDisplay" class="text-white text-[10px] md:text-xs font-medium font-mono whitespace-nowrap">00:00 / 00:00</span>
                            
                            <button id="muteBtn" class="text-white hover:text-brand transition-colors transform hover:scale-110 w-6 flex justify-center">
                                <i class="fa-solid fa-volume-high text-sm md:text-base"></i>
                            </button>
                            
                            <button id="fullScreenBtn" class="text-white hover:text-brand transition-colors transform hover:scale-110 w-6 flex justify-center">
                                <i class="fa-solid fa-expand text-sm md:text-base"></i>
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </section>

        <section id="catalogo" class="py-16 md:py-20 bg-gray-50">
            <div class="container mx-auto max-w-6xl px-6 lg:px-16">
                <div class="text-center mb-12" data-aos="fade-up">
                    <span class="text-brand font-bold tracking-widest uppercase text-xs mb-2 block">Nosso Portfólio</span>
                    <h2 class="text-3xl md:text-4xl font-black text-gray-900 mb-4 tracking-tight">Catálogo de Produtos</h2>
                </div>

                <div class="mb-16" data-aos="fade-up" data-aos-delay="100">
                    <h3 class="text-xl md:text-2xl font-black text-brand mb-5 flex items-center border-l-4 border-brand pl-3 md:pl-4">
                        <i class="fa-solid fa-utensils mr-3"></i> Linha Alimentícia
                    </h3>
                    <div class="relative border border-gray-200 rounded-xl p-4 bg-white shadow-sm">
                        <div class="swiper catalogoSwiper swiperAlimentos">
                            <div class="swiper-wrapper">
                                ${alimenticioCards || fallbackHTML}
                            </div>
                            <div class="swiper-pagination mt-4 relative"></div>
                        </div>
                        <div class="swiper-button-next alimentos-next hidden md:flex absolute top-1/2 -right-4 transform -translate-y-1/2 z-10"></div>
                        <div class="swiper-button-prev alimentos-prev hidden md:flex absolute top-1/2 -left-4 transform -translate-y-1/2 z-10"></div>
                    </div>
                </div>

                <div data-aos="fade-up" data-aos-delay="200">
                    <h3 class="text-xl md:text-2xl font-black text-gray-800 mb-5 flex items-center border-l-4 border-gray-800 pl-3 md:pl-4">
                        <i class="fa-solid fa-pallet mr-3"></i> Linha Industrial
                    </h3>
                    <div class="relative border border-gray-200 rounded-xl p-4 bg-white shadow-sm">
                        <div class="swiper catalogoSwiper swiperIndustrial">
                            <div class="swiper-wrapper">
                                ${industrialCards || fallbackHTML}
                            </div>
                            <div class="swiper-pagination mt-4 relative"></div>
                        </div>
                        <div class="swiper-button-next ind-next hidden md:flex absolute top-1/2 -right-4 transform -translate-y-1/2 z-10"></div>
                        <div class="swiper-button-prev ind-prev hidden md:flex absolute top-1/2 -left-4 transform -translate-y-1/2 z-10"></div>
                    </div>
                </div>
            </div>
        </section>

        <section id="sobre" class="py-12 md:py-16 bg-darkBg text-white relative overflow-hidden">
            <div class="absolute top-0 right-0 -mr-40 -mt-40 w-80 h-80 rounded-full bg-brand opacity-20 blur-[100px]"></div>
            
            <div class="container mx-auto max-w-6xl px-6 lg:px-16 relative z-10">
                <div class="text-center mb-10" data-aos="fade-up">
                    <div class="inline-block bg-white/10 backdrop-blur border border-white/20 px-4 py-1.5 rounded-lg text-[10px] font-bold tracking-widest uppercase mb-3">
                        <i class="fa-solid fa-location-dot mr-1.5 text-brand"></i> Camaçari - BA
                    </div>
                    <h2 class="text-2xl md:text-4xl font-black mb-4 tracking-tight">Sobre a Ecocaixas</h2>
                </div>

                <div class="grid lg:grid-cols-2 gap-8 lg:gap-10 items-center mb-12">
                    <div data-aos="fade-right" data-aos-duration="1000">
                        <h3 class="text-xl md:text-2xl font-bold mb-4 text-white border-l-4 border-brand pl-3">${tituloEmpresa}</h3>
                        <div class="space-y-3 text-gray-300 text-sm md:text-base leading-relaxed text-justify mb-6">
                            <p>${textoEmpresa}</p>
                        </div>
                        
                        <div class="grid grid-cols-2 gap-4" id="stats-container">
                            <div class="bg-white/5 border border-white/10 p-5 rounded-xl backdrop-blur transition-colors text-center">
                                <div class="text-3xl md:text-4xl font-black mb-1 text-brand flex justify-center">
                                    <span class="contador" data-target="${anosAlvo}">0</span>
                                </div>
                                <span class="text-[10px] md:text-xs font-bold uppercase tracking-widest text-gray-400">Anos de História</span>
                            </div>
                            <div class="bg-white/5 border border-white/10 p-5 rounded-xl backdrop-blur transition-colors text-center">
                                <div class="text-3xl md:text-4xl font-black mb-1 text-brand flex justify-center items-center">
                                    <span class="contador" data-target="${caixasAlvo}">0</span>
                                    <span class="text-xl md:text-2xl ml-1">M+</span>
                                </div>
                                <span class="text-[10px] md:text-xs font-bold uppercase tracking-widest text-gray-400">Caixas Produzidas</span>
                            </div>
                        </div>
                    </div>

                    <div class="mosaico-container h-64 md:h-[380px]" data-aos="fade-left" data-aos-duration="1200">
                        <img id="mosaico-1" src="${empresaInfo.img_mosaico_1 || 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=800&h=800&fit=crop'}" class="mosaico-img slot-1">
                        <img id="mosaico-2" src="${empresaInfo.img_mosaico_2 || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500&h=400&fit=crop'}" class="mosaico-img slot-2">
                        <img id="mosaico-3" src="${empresaInfo.img_mosaico_3 || 'https://images.unsplash.com/photo-1616423640778-28d1b53229bd?w=500&h=400&fit=crop'}" class="mosaico-img slot-3">
                    </div>
                </div>

                <div class="bg-gradient-to-br from-brand to-brandDark rounded-xl p-5 md:p-8 shadow-xl relative overflow-hidden mx-auto" data-aos="fade-up">
                    <div class="flex flex-col md:flex-row items-center gap-5 md:gap-6 relative z-10">
                        <div class="md:w-1/3 text-white text-center md:text-left">
                            <h3 class="text-xl md:text-2xl font-black mb-2 leading-tight">Mural da Fábrica</h3>
                            <p class="text-brandLight text-xs md:text-sm opacity-90">Deslize para ver novidades, recados da diretoria e promoções.</p>
                        </div>
                        <div class="md:w-2/3 w-full">
                            <div class="swiper newsSwiper">
                                <div class="swiper-wrapper pb-8">
                                    ${noticiasSlides || '<div class="swiper-slide bg-white/20 p-5 rounded-xl text-white text-center backdrop-blur border border-white/10 text-sm">Nenhuma atualização no momento.</div>'}
                                </div>
                                <div class="swiper-pagination"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section id="contato" class="py-16 md:py-20 bg-gray-50 relative">
            <div class="container mx-auto max-w-3xl px-6 relative z-10">
                <div class="text-center mb-10" data-aos="fade-down">
                    <h2 class="text-3xl md:text-4xl font-black text-gray-900 mb-2 tracking-tight">Monte seu Pedido</h2>
                    <p class="text-gray-500 text-sm md:text-base">Processo rápido e direto para o WhatsApp do seu setor.</p>
                </div>

                <!-- Stepper Visual -->
                <div class="flex items-center justify-between mb-8 relative max-w-lg mx-auto" data-aos="fade-up">
                    <div class="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200 z-0 rounded-full">
                        <div id="wizard-progress" class="h-full bg-brand transition-all duration-300 w-0 rounded-full"></div>
                    </div>
                    
                    <div class="relative z-10 flex flex-col items-center">
                        <div id="indicator-1" class="w-10 h-10 rounded-full bg-brand text-white flex items-center justify-center font-bold border-4 border-white shadow-sm transition-colors text-sm">1</div>
                        <span id="text-indicator-1" class="text-[10px] md:text-xs font-bold mt-2 text-gray-800 transition-colors">Dados</span>
                    </div>
                    <div class="relative z-10 flex flex-col items-center">
                        <div id="indicator-2" class="w-10 h-10 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center font-bold border-4 border-white shadow-sm transition-colors text-sm">2</div>
                        <span id="text-indicator-2" class="text-[10px] md:text-xs font-bold mt-2 text-gray-400 transition-colors">Pedido</span>
                    </div>
                    <div class="relative z-10 flex flex-col items-center">
                        <div id="indicator-3" class="w-10 h-10 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center font-bold border-4 border-white shadow-sm transition-colors text-sm">3</div>
                        <span id="text-indicator-3" class="text-[10px] md:text-xs font-bold mt-2 text-gray-400 transition-colors">Envio</span>
                    </div>
                </div>

                <form id="formContato" class="bg-white p-6 md:p-8 rounded-xl shadow-md border border-gray-200" onsubmit="prepararEnvio(event)" data-aos="fade-up" data-aos-delay="100">
                    
                    <!-- PASSO 1: DADOS -->
                    <div id="step-1" class="wizard-step block animate-step">
                        <h3 class="text-lg md:text-xl font-black text-gray-900 mb-5 border-b border-gray-100 pb-3">Dados de Contato</h3>
                        <div class="grid md:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Nome da Empresa</label>
                                <input class="w-full bg-gray-50 px-3.5 py-2.5 rounded-lg border border-gray-200 focus:ring-1 focus:ring-brand focus:border-brand focus:bg-white text-gray-900 text-sm font-medium transition-colors" type="text" id="empresa" required placeholder="Ex: Mercado Silva LTDA">
                            </div>
                            <div>
                                <label class="block text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Seu Nome e Contato</label>
                                <input class="w-full bg-gray-50 px-3.5 py-2.5 rounded-lg border border-gray-200 focus:ring-1 focus:ring-brand focus:border-brand focus:bg-white text-gray-900 text-sm font-medium transition-colors" type="text" id="contatoNome" required placeholder="João - (71) 90000-0000">
                            </div>
                        </div>
                        <div class="grid md:grid-cols-2 gap-4 mt-4">
                            <div>
                                <label class="block text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Instagram (Opcional)</label>
                                <input class="w-full bg-gray-50 px-3.5 py-2.5 rounded-lg border border-gray-200 focus:ring-1 focus:ring-brand focus:border-brand focus:bg-white text-gray-900 text-sm font-medium disabled:opacity-50 transition-colors" type="text" id="instagram" placeholder="@suaempresa">
                                <label class="flex items-center text-xs text-gray-500 mt-2 cursor-pointer select-none">
                                    <input type="checkbox" id="checkInsta" class="mr-2 rounded text-brand focus:ring-brand border-gray-300 w-3.5 h-3.5" onchange="toggleField('instagram', this.checked)"> Não possuo
                                </label>
                            </div>
                            <div>
                                <label class="block text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Site / App (Opcional)</label>
                                <input class="w-full bg-gray-50 px-3.5 py-2.5 rounded-lg border border-gray-200 focus:ring-1 focus:ring-brand focus:border-brand focus:bg-white text-gray-900 text-sm font-medium disabled:opacity-50 transition-colors" type="text" id="site" placeholder="www.suaempresa.com.br">
                                <label class="flex items-center text-xs text-gray-500 mt-2 cursor-pointer select-none">
                                    <input type="checkbox" id="checkSite" class="mr-2 rounded text-brand focus:ring-brand border-gray-300 w-3.5 h-3.5" onchange="toggleField('site', this.checked)"> Não possuo
                                </label>
                            </div>
                        </div>

                        <div class="mt-8 flex justify-end">
                            <button type="button" onclick="nextStep(1)" class="w-full md:w-auto bg-gray-900 text-white font-bold py-2.5 px-6 rounded-lg hover:bg-brand transition-colors text-sm flex items-center justify-center">Próximo Passo <i class="fa-solid fa-arrow-right ml-2"></i></button>
                        </div>
                    </div>

                    <!-- PASSO 2: PEDIDO E ITENS -->
                    <div id="step-2" class="wizard-step hidden">
                        <h3 class="text-lg md:text-xl font-black text-gray-900 mb-5 border-b border-gray-100 pb-3">Detalhes do Pedido</h3>
                        
                        <div class="bg-brandLight/50 p-4 rounded-lg border border-brand/30 mb-6">
                            <label class="block text-sm font-bold text-gray-900 mb-2">Qual o Segmento Principal da sua Empresa?</label>
                            <select class="w-full bg-white px-3.5 py-2.5 rounded-lg border border-gray-200 focus:ring-1 focus:ring-brand focus:border-brand font-medium text-gray-800 text-sm transition-colors" id="setorPrincipal" required>
                                <option value="" disabled selected>Selecione uma opção...</option>
                                <option value="alimenticio">Ramo Alimentício</option>
                                <option value="industrial">Ramo Industrial</option>
                            </select>
                        </div>

                        <div class="mb-4">
                            <div class="flex justify-between items-center mb-4">
                                <h4 class="text-base md:text-lg font-bold text-gray-800">Itens do Orçamento</h4>
                                <button type="button" onclick="abrirModalCaixa()" class="bg-gray-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-brand transition-colors flex items-center shadow-sm">
                                    <i class="fa-solid fa-plus mr-1.5"></i> Caixa
                                </button>
                            </div>
                            <div id="listaPedidos" class="space-y-3">
                                <div class="text-center p-6 bg-gray-50 rounded-lg border border-dashed border-gray-300 text-gray-500 font-medium text-sm" id="emptyState">
                                    Seu carrinho está vazio. Adicione os modelos acima.
                                </div>
                            </div>
                        </div>

                        <div class="mt-8 flex flex-col md:flex-row justify-between gap-3">
                            <button type="button" onclick="prevStep()" class="w-full md:w-auto bg-gray-100 text-gray-600 font-bold py-2.5 px-6 rounded-lg hover:bg-gray-200 transition-colors text-sm flex items-center justify-center order-2 md:order-1"><i class="fa-solid fa-arrow-left mr-2"></i> Voltar</button>
                            <button type="button" onclick="nextStep(2)" class="w-full md:w-auto bg-gray-900 text-white font-bold py-2.5 px-6 rounded-lg hover:bg-brand transition-colors text-sm flex items-center justify-center order-1 md:order-2">Próximo Passo <i class="fa-solid fa-arrow-right ml-2"></i></button>
                        </div>
                    </div>

                    <!-- PASSO 3: FINALIZAÇÃO -->
                    <div id="step-3" class="wizard-step hidden">
                        <h3 class="text-lg md:text-xl font-black text-gray-900 mb-5 border-b border-gray-100 pb-3">Finalização e Pagamento</h3>
                        
                        <div class="mb-6">
                            <label class="block text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Observações (Opcional)</label>
                            <textarea class="w-full bg-gray-50 px-3.5 py-2.5 rounded-lg border border-gray-200 focus:ring-1 focus:ring-brand focus:border-brand focus:bg-white text-gray-900 text-sm font-medium transition-colors" id="descricaoGeral" rows="2" placeholder="Ex: Precisamos de impressão da logomarca..."></textarea>
                        </div>

                        <div class="border border-gray-200 rounded-lg p-4 md:p-5 mb-6 bg-gray-50/50">
                            <h4 class="font-bold text-gray-800 mb-3 flex items-center text-sm md:text-base"><i class="fa-solid fa-credit-card text-brand mr-2"></i> Pagamento</h4>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-[10px] md:text-xs font-bold text-gray-500 uppercase mb-1.5">Forma de Pagamento</label>
                                    <select id="formaPagamento" class="w-full bg-white px-3 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-brand text-sm font-medium text-gray-900 outline-none transition-colors" required onchange="toggleBandeirasCartao()">
                                        <option value="" disabled selected>Selecione...</option>
                                        <option value="À vista (Pix/Transferência)">À vista (Pix/Transferência)</option>
                                        <option value="Cartão de Crédito">Cartão de Crédito</option>
                                        <option value="Cartão de Débito">Cartão de Débito</option>
                                    </select>
                                </div>
                                
                                <div id="containerBandeira" class="hidden">
                                    <label class="block text-[10px] md:text-xs font-bold text-gray-500 uppercase mb-1.5">Bandeira do Cartão</label>
                                    <select id="bandeiraCartao" class="w-full bg-white px-3 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-brand text-sm font-medium text-gray-900 outline-none transition-colors">
                                        <option value="" disabled selected>Selecione a bandeira...</option>
                                        <option value="Visa">Visa</option>
                                        <option value="Mastercard">Mastercard</option>
                                        <option value="Elo">Elo</option>
                                        <option value="Hipercard">Hipercard</option>
                                        <option value="American Express">American Express</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div class="mt-8 flex flex-col md:flex-row justify-between gap-3">
                            <button type="button" onclick="prevStep()" class="w-full md:w-auto bg-gray-100 text-gray-600 font-bold py-2.5 px-6 rounded-lg hover:bg-gray-200 transition-colors text-sm flex items-center justify-center order-2 md:order-1"><i class="fa-solid fa-arrow-left mr-2"></i> Voltar</button>
                            <button type="submit" class="w-full md:w-auto px-6 py-2.5 flex justify-center items-center bg-[#25D366] hover:bg-[#1fae53] text-white font-bold rounded-lg transition-colors shadow-sm text-sm order-1 md:order-2">
                                <i class="fa-brands fa-whatsapp text-base mr-2"></i> Enviar pelo WhatsApp
                            </button>
                        </div>
                    </div>

                </form>
            </div>
        </section>

        <footer class="bg-gray-900 pt-12 pb-8 border-t border-gray-800 mt-auto relative z-10 text-gray-400">
            <div class="container mx-auto max-w-6xl px-6 lg:px-16">
                
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
                    
                    <div>
                        <img src="/logo.png" alt="Logo Ecocaixas" class="h-10 w-auto mb-5 brightness-0 invert opacity-90">
                        <p class="text-xs md:text-sm mb-5 leading-relaxed">Sua parceira em embalagens sob medida para os setores alimentício e industrial.</p>
                        
                        <div class="flex space-x-3">
                            <a href="https://www.instagram.com/ecocaixasba/" target="_blank" class="w-9 h-9 rounded-lg bg-gray-800 flex items-center justify-center text-white hover:bg-brand transition-colors" aria-label="Instagram">
                                <i class="fa-brands fa-instagram"></i>
                            </a>
                            <a href="https://www.facebook.com/ecocaixasba/" target="_blank" class="w-9 h-9 rounded-lg bg-gray-800 flex items-center justify-center text-white hover:bg-[#1877F2] transition-colors" aria-label="Facebook">
                                <i class="fa-brands fa-facebook-f"></i>
                            </a>
                            <a href="https://wa.me/5571987780304" target="_blank" class="w-9 h-9 rounded-lg bg-gray-800 flex items-center justify-center text-white hover:bg-[#25D366] transition-colors" aria-label="WhatsApp">
                                <i class="fa-brands fa-whatsapp"></i>
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 class="text-white font-black text-base md:text-lg mb-5 tracking-wide">Mapa do Site</h4>
                        <ul class="space-y-2 text-xs md:text-sm font-medium">
                            <li><a href="#produtos" class="hover:text-brand transition-colors flex items-center"><i class="fa-solid fa-chevron-right text-[10px] mr-2 text-brand"></i> Destaques</a></li>
                            <li><a href="#setores" class="hover:text-brand transition-colors flex items-center"><i class="fa-solid fa-chevron-right text-[10px] mr-2 text-brand"></i> Setores de Atuação</a></li>
                            <li><a href="#catalogo" class="hover:text-brand transition-colors flex items-center"><i class="fa-solid fa-chevron-right text-[10px] mr-2 text-brand"></i> Catálogo</a></li>
                            <li><a href="#sobre" class="hover:text-brand transition-colors flex items-center"><i class="fa-solid fa-chevron-right text-[10px] mr-2 text-brand"></i> A Fábrica</a></li>
                            <li><a href="/vagas" class="hover:text-brand transition-colors flex items-center"><i class="fa-solid fa-chevron-right text-[10px] mr-2 text-brand"></i> Vagas de Emprego</a></li>
                            <li><a href="#contato" class="hover:text-brand transition-colors flex items-center"><i class="fa-solid fa-chevron-right text-[10px] mr-2 text-brand"></i> Fazer Orçamento</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 class="text-white font-black text-base md:text-lg mb-5 tracking-wide">Localização</h4>
                        <ul class="space-y-3 text-xs md:text-sm">
                            <li class="flex items-start">
                                <i class="fa-solid fa-location-dot mt-1 mr-2.5 text-brand text-base"></i>
                                <span class="leading-relaxed">Rua Alameda - Jardim Limoeiro,<br>Camaçari-BA, CEP 42801-141</span>
                            </li>
                            <li class="flex items-center">
                                <i class="fa-solid fa-id-card mr-2.5 text-brand text-base"></i>
                                <span>CNPJ: 22.570.982/0001-90</span>
                            </li>
                        </ul>
                    </div>

                    <div class="h-40 md:h-full min-h-[140px] rounded-lg overflow-hidden border border-gray-700 shadow-inner relative group">
                        <iframe 
                            width="100%" 
                            height="100%" 
                            frameborder="0" 
                            scrolling="no" 
                            marginheight="0" 
                            marginwidth="0" 
                            src="https://maps.google.com/maps?q=Ecocaixas%20Ba&t=&z=16&ie=UTF8&iwloc=&output=embed"
                            class="absolute inset-0 grayscale group-hover:grayscale-0 transition-all duration-700">
                        </iframe>
                    </div>

                </div>

                <div class="border-t border-gray-800 pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500 space-y-4 md:space-y-0 text-center md:text-left">
                    
                    <div class="leading-relaxed">
                        <span class="text-gray-300 font-bold">Ecocaixas © 2026. Todos os direitos reservados.</span><br>
                        Ecocaixas comercio e personalização de caixas de papelão Ltda.
                    </div>
                    
                    <div class="flex items-center space-x-3 bg-gray-800/50 px-4 py-2 rounded-lg border border-gray-700/50 hover:border-gray-600 transition-colors">
                        <span>Desenvolvido por <a href="https://www.instagram.com/71dev_/" target="_blank" class="text-gray-300 font-bold hover:text-brand transition-colors">71dev</a></span>
                        <span class="w-px h-3 bg-gray-600 mx-1"></span> 
                        <a href="https://www.instagram.com/71dev_/" target="_blank" aria-label="Instagram da 71dev" class="hover:text-white transition-colors text-sm"><i class="fa-brands fa-instagram"></i></a>
                        <a href="https://wa.me/5571983174920" target="_blank" aria-label="WhatsApp da 71dev" class="hover:text-[#25D366] transition-colors text-sm"><i class="fa-brands fa-whatsapp"></i></a>
                    </div>

                </div>
            </div>
        </footer>

        <!-- BANNER DE COOKIES -->
        <div id="cookieBanner" class="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-[120] transform translate-y-full transition-transform duration-500">
            <div class="container mx-auto max-w-6xl px-6 lg:px-16 py-5 flex flex-col md:flex-row items-center justify-between gap-4">
                <div class="text-sm text-gray-600">
                    <h4 class="font-black text-gray-900 mb-1"><i class="fa-solid fa-cookie-bite text-brand mr-1"></i> Nós usamos cookies</h4>
                    <p>Utilizamos cookies para melhorar sua experiência, analisar o tráfego e personalizar conteúdos. Ao continuar navegando, você concorda com a nossa política.</p>
                </div>
                <div class="flex items-center gap-3 shrink-0 w-full md:w-auto">
                    <button onclick="recusarCookies()" class="flex-1 md:flex-none px-5 py-2.5 rounded-lg font-bold text-gray-500 hover:bg-gray-100 transition-colors text-sm">Recusar</button>
                    <button onclick="aceitarCookies()" class="flex-1 md:flex-none px-5 py-2.5 rounded-lg font-bold bg-gray-900 text-white hover:bg-brand transition-colors text-sm shadow-sm">Aceitar Todos</button>
                </div>
            </div>
        </div>

        <a id="whatsappBtn" href="https://wa.me/5571987780304" target="_blank" class="fixed bottom-6 right-6 bg-[#25D366] text-white p-3 rounded-lg shadow-xl hover:bg-[#1fae53] transition-all duration-500 ease-in-out z-40 flex items-center justify-center h-14 w-14"><i class="fa-brands fa-whatsapp text-2xl"></i></a>

       ${popupAtivo ? `
        <div id="popupInicial" class="fixed inset-0 bg-gray-900/80 backdrop-blur-md z-[100] hidden flex items-center justify-center transition-opacity opacity-0 px-4" style="transition: opacity 0.4s ease;">
            <div class="bg-white rounded-lg max-w-4xl w-full p-2 relative shadow-2xl transform scale-95 transition-transform duration-500" id="popupContentBody">
                <button onclick="fecharPopupInicial()" class="absolute top-4 right-4 w-10 h-10 bg-gray-100/90 rounded-lg text-gray-800 hover:bg-gray-200 flex items-center justify-center font-bold text-xl z-20 backdrop-blur">&times;</button>
                
                ${popupAtivo.tipo_conteudo === 'imagem' 
                    ? `<img src="${popupAtivo.conteudo}" class="w-full max-h-[80vh] rounded-md object-contain mx-auto">` 
                    : `<div class="p-10 md:p-14 text-center">
                           <i class="fa-solid fa-circle-exclamation text-5xl md:text-6xl text-brand mb-5 md:mb-6"></i>
                           <h3 class="text-3xl md:text-4xl font-black text-gray-900 mb-4 md:mb-6">${popupAtivo.titulo}</h3>
                           <p class="text-gray-600 text-lg md:text-xl leading-relaxed">${popupAtivo.conteudo}</p>
                       </div>`
                }
            </div>
        </div>
        ` : ''}

        ${vagaAtiva ? `
        <div id="modalVagaEmprego" class="fixed inset-0 bg-gray-900/80 backdrop-blur-md z-[110] hidden flex items-center justify-center transition-opacity opacity-0 px-4" style="transition: opacity 0.4s ease;">
            <div class="bg-white rounded-lg max-w-xl w-full relative shadow-2xl transform scale-95 transition-transform duration-500 overflow-hidden" id="modalVagaContent">
                <button onclick="fecharModalVaga()" class="absolute top-4 right-4 w-10 h-10 bg-black/50 text-white rounded-lg hover:bg-black/70 flex items-center justify-center font-bold text-xl z-20 backdrop-blur">&times;</button>
                
                <div class="w-full h-40 sm:h-48 bg-gray-200">
                    <img src="${vagaAtiva.imagem_banner}" class="w-full h-full object-cover" alt="Vaga: ${vagaAtiva.titulo}">
                </div>
                
                <div class="p-6 md:p-8">
                    <h3 class="text-xl md:text-2xl font-black text-gray-900 mb-2">${vagaAtiva.titulo}</h3>
                    <p class="text-gray-500 text-xs md:text-sm mb-5">Preencha os dados e anexe seu currículo (PDF ou Imagem).</p>
                    
                    <form action="/vagas/candidatar" method="POST" enctype="multipart/form-data">
                        <input type="hidden" name="vaga_id" value="${vagaAtiva.id}">
                        
                        <div class="grid grid-cols-2 gap-3 mb-4">
                            <div>
                                <label class="block text-[10px] md:text-xs font-bold text-gray-500 uppercase mb-1">Candidato</label>
                                <input type="text" name="nome" class="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 outline-none text-sm focus:border-brand focus:ring-1 focus:ring-brand" required placeholder="Seu nome">
                            </div>
                            <div>
                                <label class="block text-[10px] md:text-xs font-bold text-gray-500 uppercase mb-1">Contato</label>
                                <input type="text" name="contato" class="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 outline-none text-sm focus:border-brand focus:ring-1 focus:ring-brand" required placeholder="(71) 90000">
                            </div>
                        </div>
                        
                        <div class="mb-4">
                            <label class="block text-[10px] md:text-xs font-bold text-gray-500 uppercase mb-1">Bairro / Cidade</label>
                            <input type="text" name="bairro" class="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 outline-none text-sm focus:border-brand focus:ring-1 focus:ring-brand" required placeholder="Ex: Centro">
                        </div>
                        
                        <div class="mb-6">
                            <label class="block text-[10px] md:text-xs font-bold text-gray-500 uppercase mb-1">Anexar Currículo</label>
                            <input type="file" name="curriculo" accept=".pdf,image/*" class="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-xs md:text-sm text-gray-600 outline-none" required>
                        </div>
                        
                        <button type="submit" class="w-full bg-brand text-white font-bold py-3 rounded-lg hover:bg-brandDark transition shadow-md text-sm">Enviar Currículo</button>
                    </form>
                </div>
            </div>
        </div>
        ` : ''}

        <div id="modalCaixa" class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm hidden z-[70] flex items-center justify-center transition-opacity opacity-0 px-4" style="transition: opacity 0.3s ease;">
            <div class="bg-white rounded-xl max-w-sm w-full p-6 relative shadow-2xl transform scale-95 transition-transform duration-300" id="modalCaixaContent">
                <button onclick="fecharModalCaixa()" class="absolute top-4 right-4 w-8 h-8 bg-gray-100 rounded-lg text-gray-500 hover:bg-gray-200 flex items-center justify-center font-bold text-lg">&times;</button>
                <h3 class="text-xl font-black text-gray-900 mb-5 tracking-tight">Nova Caixa</h3>
                <form id="formAddCaixa" onsubmit="salvarItem(event)">
                    <div class="mb-4">
                        <label class="block text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Setor da Caixa</label>
                        <select id="itemSetor" class="w-full bg-gray-50 px-3 py-2.5 rounded-lg border border-gray-200 focus:ring-1 focus:ring-brand text-sm font-medium text-gray-900 outline-none" onchange="atualizarOpcoes()" required>
                            <option value="" disabled selected>Escolha o setor...</option><option value="alimenticio">Alimentício</option><option value="industrial">Industrial</option>
                        </select>
                    </div>
                    <div class="mb-4">
                        <label class="block text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Modelo</label>
                        <select id="itemModelo" class="w-full bg-gray-50 px-3 py-2.5 rounded-lg border border-gray-200 focus:ring-1 focus:ring-brand text-sm font-medium text-gray-900 disabled:opacity-50 outline-none" onchange="atualizarTamanhoAuto()" required disabled><option value="" disabled selected>Selecione o setor...</option></select>
                    </div>
                    <div class="grid grid-cols-2 gap-3 mb-4">
                        <div><label class="block text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Tamanho</label><input type="text" id="itemTamanho" class="w-full bg-gray-100 px-3 py-2.5 rounded-lg border border-gray-200 text-gray-500 text-sm font-bold cursor-not-allowed outline-none" readonly required></div>
                        <div><label class="block text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Qtd</label><input type="number" id="itemQtd" class="w-full bg-gray-50 px-3 py-2.5 rounded-lg border border-gray-200 focus:ring-1 focus:ring-brand text-sm font-medium text-gray-900 outline-none" placeholder="5000" min="1" required></div>
                    </div>
                    <div class="mb-6">
                        <label class="block text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Papelão</label>
                        <select id="itemMaterial" class="w-full bg-gray-50 px-3 py-2.5 rounded-lg border border-gray-200 focus:ring-1 focus:ring-brand text-sm font-medium text-gray-900 disabled:opacity-50 outline-none" required disabled><option value="" disabled selected>Selecione o setor...</option></select>
                    </div>
                    <button type="submit" class="w-full bg-gray-900 text-white font-black py-3 rounded-lg hover:bg-brand transition-colors shadow-md text-sm">Adicionar Caixa</button>
                </form>
            </div>
        </div>

        <div id="newsModal" class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm hidden z-[60] flex items-center justify-center transition-opacity opacity-0 px-4" style="transition: opacity 0.3s ease;">
            <div class="bg-white rounded-xl max-w-md w-full p-6 md:p-8 relative shadow-2xl transform scale-95 transition-transform duration-300" id="modalContent">
                <button onclick="closeModal()" class="absolute top-4 right-4 w-8 h-8 bg-gray-100 rounded-lg text-gray-500 hover:bg-gray-200 flex items-center justify-center font-bold text-lg">&times;</button>
                <h3 id="modalTitle" class="text-2xl font-black text-gray-900 mb-3">Título</h3>
                <p id="modalDesc" class="text-gray-600 leading-relaxed text-sm md:text-base">Descrição</p>
            </div>
        </div>

        <script src="https://cdn.jsdelivr.net/npm/swiper@10/swiper-bundle.min.js"></script>
        <script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>
        
        <script>
            // INICIALIZAÇÃO E ANIMAÇÕES
            const dbModelos = ${JSON.stringify(formModelos)};
            const dbMateriais = ${JSON.stringify(formMateriais)};

            AOS.init({ once: false, mirror: true, offset: 50 });

            setInterval(() => {
                const img1 = document.getElementById('mosaico-1'); const img2 = document.getElementById('mosaico-2'); const img3 = document.getElementById('mosaico-3');
                if(img1 && img2 && img3) {
                    const cls1 = img1.className.match(/slot-\\d/)[0]; const cls2 = img2.className.match(/slot-\\d/)[0]; const cls3 = img3.className.match(/slot-\\d/)[0];
                    img1.classList.replace(cls1, cls2); img2.classList.replace(cls2, cls3); img3.classList.replace(cls3, cls1);
                }
            }, 4000);

            // GESTÃO DE COOKIES E ALINHAMENTO DO WPP
            document.addEventListener('DOMContentLoaded', () => {
                const cookieConsent = localStorage.getItem('ecoCookiesConsent');
                if (!cookieConsent) {
                    setTimeout(() => {
                        const banner = document.getElementById('cookieBanner');
                        const wppBtn = document.getElementById('whatsappBtn');
                        if (banner) {
                            banner.classList.remove('translate-y-full');
                            // Empurra o botão do WhatsApp para cima para não ficar oculto pelo banner
                            if (wppBtn) {
                                wppBtn.style.bottom = (banner.offsetHeight + 24) + 'px';
                            }
                        }
                    }, 2000);
                }
                
                // Inicializa o Player Customizado se existir
                const video = document.getElementById('ecoVideo');
                const videoContainer = document.getElementById('videoContainer');
                if (video && videoContainer) {
                    const playPauseBtn = document.getElementById('playPauseBtn');
                    const centerPlayBtn = document.getElementById('centerPlayBtn');
                    const progressBar = document.getElementById('progressBar');
                    const muteBtn = document.getElementById('muteBtn');
                    const timeDisplay = document.getElementById('timeDisplay');
                    const fullScreenBtn = document.getElementById('fullScreenBtn');

                    let videoIniciado = false;

                    function togglePlay() {
                        if (video.paused) {
                            // Se for o primeiro play e a thumb estava ativa, zera o vídeo para começar do início
                            if(!videoIniciado) {
                                video.currentTime = 0;
                                videoIniciado = true;
                            }
                            
                            video.play();
                            playPauseBtn.innerHTML = '<i class="fa-solid fa-pause text-sm md:text-base"></i>';
                            centerPlayBtn.classList.add('opacity-0', 'scale-150', 'pointer-events-none');
                        } else {
                            video.pause();
                            playPauseBtn.innerHTML = '<i class="fa-solid fa-play text-sm md:text-base"></i>';
                            centerPlayBtn.classList.remove('opacity-0', 'scale-150', 'pointer-events-none');
                        }
                    }

                    playPauseBtn.addEventListener('click', (e) => { e.stopPropagation(); togglePlay(); });
                    centerPlayBtn.addEventListener('click', (e) => { e.stopPropagation(); togglePlay(); });
                    video.addEventListener('click', togglePlay);

                    muteBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        video.muted = !video.muted;
                        muteBtn.innerHTML = video.muted ? '<i class="fa-solid fa-volume-xmark text-sm md:text-base"></i>' : '<i class="fa-solid fa-volume-high text-sm md:text-base"></i>';
                    });

                    fullScreenBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        if (!document.fullscreenElement) {
                            if(videoContainer.requestFullscreen) videoContainer.requestFullscreen();
                            else if(videoContainer.webkitRequestFullscreen) videoContainer.webkitRequestFullscreen();
                        } else {
                            if(document.exitFullscreen) document.exitFullscreen();
                        }
                    });

                    function formatTime(secTotal) {
                        const min = Math.floor(secTotal / 60);
                        const sec = Math.floor(secTotal % 60);
                        return (min < 10 ? '0' + min : min) + ':' + (sec < 10 ? '0' + sec : sec);
                    }

                    video.addEventListener('loadedmetadata', () => {
                        timeDisplay.innerText = '00:00 / ' + formatTime(video.duration);
                    });

                    video.addEventListener('timeupdate', () => {
                        if(video.duration) {
                            progressBar.value = (video.currentTime / video.duration) * 100;
                            timeDisplay.innerText = formatTime(video.currentTime) + ' / ' + formatTime(video.duration);
                        }
                    });

                    progressBar.addEventListener('input', (e) => {
                        e.stopPropagation();
                        const time = (e.target.value / 100) * video.duration;
                        video.currentTime = time;
                    });
                    
                    progressBar.addEventListener('click', (e) => e.stopPropagation());

                    video.addEventListener('ended', () => {
                        playPauseBtn.innerHTML = '<i class="fa-solid fa-play text-sm md:text-base"></i>';
                        centerPlayBtn.classList.remove('opacity-0', 'scale-150', 'pointer-events-none');
                    });
                }
            });

            function aceitarCookies() {
                localStorage.setItem('ecoCookiesConsent', 'accepted');
                fecharCookieBanner();
            }

            function recusarCookies() {
                localStorage.setItem('ecoCookiesConsent', 'declined');
                fecharCookieBanner();
            }

            function fecharCookieBanner() {
                const banner = document.getElementById('cookieBanner');
                const wppBtn = document.getElementById('whatsappBtn');
                if(banner) banner.classList.add('translate-y-full');
                // Retorna o botão do WhatsApp para a posição original (bottom-6 ou 24px)
                if(wppBtn) wppBtn.style.bottom = '1.5rem';
            }

            // SWIPERS
            new Swiper('.productSwiper', { slidesPerView: 1, centeredSlides: true, spaceBetween: 20, loop: true, autoplay: { delay: 4000, disableOnInteraction: false }, navigation: { nextEl: '.productSwiper .swiper-button-next', prevEl: '.productSwiper .swiper-button-prev' }, pagination: { el: '.productSwiper .swiper-pagination', clickable: true }, breakpoints: { 768: { slidesPerView: 2, spaceBetween: 20 }, 1024: { slidesPerView: 3, spaceBetween: 30 } } });
            new Swiper('.swiperAlimentos', { slidesPerView: 1, spaceBetween: 20, loop: true, autoplay: { delay: 4000, disableOnInteraction: false }, navigation: { nextEl: '.alimentos-next', prevEl: '.alimentos-prev' }, pagination: { el: '.swiperAlimentos .swiper-pagination', clickable: true }, breakpoints: { 640: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } } });
            new Swiper('.swiperIndustrial', { slidesPerView: 1, spaceBetween: 20, loop: true, autoplay: { delay: 4000, disableOnInteraction: false, reverseDirection: true }, navigation: { nextEl: '.ind-next', prevEl: '.ind-prev' }, pagination: { el: '.swiperIndustrial .swiper-pagination', clickable: true }, breakpoints: { 640: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } } });
            new Swiper('.newsSwiper', { slidesPerView: 1, spaceBetween: 20, loop: true, autoplay: { delay: 4000, disableOnInteraction: false }, pagination: { el: '.newsSwiper .swiper-pagination', clickable: true } });

            // CONTADORES
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
            const observer = new IntersectionObserver((entries) => { if(entries[0].isIntersecting && !hasAnimated) { animateCounters(); hasAnimated = true; } }, { threshold: 0.5 });
            const statsContainer = document.getElementById('stats-container');
            if(statsContainer) observer.observe(statsContainer);

            function toggleField(fieldId, isChecked) {
                const field = document.getElementById(fieldId);
                field.disabled = isChecked; if(isChecked) field.value = '';
            }

            // =====================================
            // LÓGICA DO WIZARD (FORMULÁRIO MULTI-STEP)
            // =====================================
            let stepAtual = 1;
            let itensOrcamento = [];

            function atualizarWizard() {
                document.querySelectorAll('.wizard-step').forEach(el => {
                    el.classList.add('hidden');
                    el.classList.remove('block', 'animate-step');
                });
                
                const stepView = document.getElementById('step-' + stepAtual);
                stepView.classList.remove('hidden');
                stepView.classList.add('block', 'animate-step');
                
                for(let i=1; i<=3; i++) {
                    const ind = document.getElementById('indicator-' + i);
                    const txt = document.getElementById('text-indicator-' + i);
                    if(i <= stepAtual) {
                        ind.classList.replace('bg-gray-200', 'bg-brand');
                        ind.classList.replace('text-gray-500', 'text-white');
                        txt.classList.replace('text-gray-400', 'text-gray-800');
                    } else {
                        ind.classList.replace('bg-brand', 'bg-gray-200');
                        ind.classList.replace('text-white', 'text-gray-500');
                        txt.classList.replace('text-gray-800', 'text-gray-400');
                    }
                }
                
                const progress = document.getElementById('wizard-progress');
                if(stepAtual === 1) progress.style.width = '0%';
                if(stepAtual === 2) progress.style.width = '50%';
                if(stepAtual === 3) progress.style.width = '100%';
            }

            function nextStep(step) {
                const stepEl = document.getElementById('step-' + step);
                const inputs = stepEl.querySelectorAll('input[required], select[required], textarea[required]');
                
                let valid = true;
                
                inputs.forEach(inp => {
                    if(!inp.checkValidity()) {
                        inp.reportValidity();
                        valid = false;
                    }
                });

                if (valid && step === 2) {
                    if (itensOrcamento.length === 0) {
                        alert("Por favor, adicione pelo menos uma caixa ao seu pedido antes de avançar.");
                        valid = false;
                    }
                }

                if(valid) {
                    stepAtual++;
                    atualizarWizard();
                }
            }

            function prevStep() {
                stepAtual--;
                atualizarWizard();
            }

            // =====================================
            // MODAL E LISTA DE CAIXAS (PEDIDO)
            // =====================================
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
                const container = document.getElementById('listaPedidos'); 
                const emptyState = document.getElementById('emptyState');
                
                if(itensOrcamento.length === 0) { 
                    container.innerHTML = ''; 
                    if(emptyState) { container.appendChild(emptyState); emptyState.style.display = 'block'; }
                    return; 
                }
                
                if(emptyState) emptyState.style.display = 'none'; 
                
                let html = '';
                itensOrcamento.forEach((item, index) => {
                    html += \`
                    <div class="bg-white p-3 md:p-4 border border-gray-200 rounded-lg shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3 mt-3">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 rounded-lg \${item.setor.includes('Alimentício') ? 'bg-brandLight text-brand' : 'bg-gray-100 text-gray-800'} flex items-center justify-center text-lg shrink-0"><i class="fa-solid fa-box"></i></div>
                            <div>
                                <p class="font-black text-gray-900 text-sm md:text-base">\${item.qtd}x \${item.modelo}</p>
                                <p class="text-xs text-gray-500 font-medium">\${item.tamanho} • \${item.material}</p>
                            </div>
                        </div>
                        <button type="button" onclick="removerItem(\${index})" class="w-full md:w-auto bg-red-50 text-red-500 hover:bg-red-100 px-3 py-1.5 rounded-lg font-bold transition-colors text-xs flex items-center justify-center"><i class="fa-solid fa-trash mr-1.5"></i> Remover</button>
                    </div>\`;
                });
                
                container.innerHTML = '';
                if(emptyState) container.appendChild(emptyState);
                container.insertAdjacentHTML('beforeend', html);
            }

            // =====================================
            // ENVIO PARA O WHATSAPP E FECHAMENTOS
            // =====================================
            function prepararEnvio(event) {
                event.preventDefault();
                
                if(itensOrcamento.length === 0) {
                    alert("Adicione pelo menos uma caixa ao carrinho.");
                    return;
                }
                
                const empresa = document.getElementById('empresa').value; 
                const contato = document.getElementById('contatoNome').value;
                const insta = document.getElementById('checkInsta').checked ? 'Não possui' : (document.getElementById('instagram').value || 'Não informado');
                const site = document.getElementById('checkSite').checked ? 'Não possui' : (document.getElementById('site').value || 'Não informado');
                const obs = document.getElementById('descricaoGeral').value || 'Nenhuma observação adicional.';
                const setorPrincipal = document.getElementById('setorPrincipal').value;

                const formaPagamento = document.getElementById('formaPagamento').value;
                const bandeiraCartao = document.getElementById('bandeiraCartao').value;
                
                let textoPagamento = \`*\uD83D\uDCB3 Pagamento:* \${formaPagamento}\`;
                if (formaPagamento.includes('Cartão') && bandeiraCartao) {
                    textoPagamento += \` (\${bandeiraCartao})\`;
                }

                let textoItens = '';
                itensOrcamento.forEach((item, i) => { 
                    textoItens += \`\\n\uD83D\uDCE6 *Item \${i+1}*:\\n- Modelo: \${item.modelo} (\${item.setor})\\n- Tamanho: \${item.tamanho}\\n- Quantidade: \${item.qtd}\\n- Material: \${item.material}\\n\`; 
                });

                let numeroWhatsApp = setorPrincipal === 'alimenticio' ? '5571987780304' : '5571999317529';
                
                const textoFinal = \`*NOVO ORÇAMENTO - ECOCAIXAS* \uD83C\uDFED\\n--------------------------------\\n*Empresa:* \${empresa}\\n*Contato:* \${contato}\\n*Instagram:* \${insta}\\n*Site/App:* \${site}\\n\\n*\uD83D\uDED2 ITENS DO PEDIDO:* \${textoItens}\\n\${textoPagamento}\\n\\n*\uD83D\uDCDD Observações:* \${obs}\`;
                
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

            const popupAtivoHTML = document.getElementById('popupInicial');
            if (popupAtivoHTML) {
                setTimeout(() => {
                    popupAtivoHTML.classList.remove('hidden');
                    setTimeout(() => { popupAtivoHTML.classList.remove('opacity-0'); document.getElementById('popupContentBody').classList.remove('scale-95'); }, 50);
                }, 1000);
            }
            function fecharPopupInicial() {
                if(popupAtivoHTML) {
                    popupAtivoHTML.classList.add('opacity-0'); document.getElementById('popupContentBody').classList.add('scale-95');
                    setTimeout(() => popupAtivoHTML.classList.add('hidden'), 400);
                }
            }

            const modalVagaHTML = document.getElementById('modalVagaEmprego');
            if (modalVagaHTML) {
                setTimeout(() => {
                    modalVagaHTML.classList.remove('hidden');
                    setTimeout(() => { modalVagaHTML.classList.remove('opacity-0'); document.getElementById('modalVagaContent').classList.remove('scale-95'); }, 50);
                }, 1500);
            }
            function fecharModalVaga() {
                if(modalVagaHTML) {
                    modalVagaHTML.classList.add('opacity-0'); document.getElementById('modalVagaContent').classList.add('scale-95');
                    setTimeout(() => modalVagaHTML.classList.add('hidden'), 400);
                }
            }

            function toggleMobileMenu() {
                const menu = document.getElementById('mobileMenu');
                const icon = document.querySelector('#mobileMenuBtn i');
                
                if (menu.classList.contains('scale-y-0')) {
                    menu.classList.remove('scale-y-0', 'opacity-0'); menu.classList.add('scale-y-100', 'opacity-100');
                    icon.classList.replace('fa-bars', 'fa-xmark');
                } else {
                    menu.classList.add('scale-y-0', 'opacity-0'); menu.classList.remove('scale-y-100', 'opacity-100');
                    icon.classList.replace('fa-xmark', 'fa-bars');
                }
            }

            function toggleBandeirasCartao() {
                const forma = document.getElementById('formaPagamento').value;
                const containerBandeira = document.getElementById('containerBandeira');
                const bandeiraCartao = document.getElementById('bandeiraCartao');
                
                if (forma.includes('Cartão')) {
                    containerBandeira.classList.remove('hidden'); bandeiraCartao.required = true;
                } else {
                    containerBandeira.classList.add('hidden'); bandeiraCartao.required = false; bandeiraCartao.value = '';
                }
            }
        </script>
    </body>
    </html>
    `;
};
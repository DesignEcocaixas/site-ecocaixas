module.exports = function renderVagas(vagas = []) {
    
    // Gerador dos Cards de Vagas
    const renderVagasCards = () => {
        if(vagas.length === 0) {
            return `
            <div class="col-span-full text-center py-20 bg-white rounded-[2rem] border-2 border-dashed border-gray-300">
                <i class="fa-solid fa-face-frown-open text-6xl text-gray-300 mb-4"></i>
                <h3 class="text-2xl font-black text-gray-800 mb-2">Poxa, não temos vagas abertas no momento.</h3>
                <p class="text-gray-500">Fique de olho em nossas redes sociais para futuras oportunidades!</p>
            </div>`;
        }

        return vagas.map(v => {
            // Verifica se a vaga está disponível (1/true) ou encerrada (0/false)
            const isDisponivel = v.disponivel == 1 || v.disponivel === true;
            
            // Badge visual responsiva (menor no celular)
            const badgeHTML = isDisponivel 
                ? `<span class="absolute top-3 right-3 md:top-4 md:right-4 bg-[#25D366] text-white text-[10px] md:text-xs font-black px-2 py-1 md:px-3 md:py-1.5 rounded-full uppercase tracking-wider shadow-lg z-10 flex items-center"><i class="fa-solid fa-circle-check mr-1 md:mr-2"></i> Aberta</span>`
                : `<span class="absolute top-3 right-3 md:top-4 md:right-4 bg-red-500 text-white text-[10px] md:text-xs font-black px-2 py-1 md:px-3 md:py-1.5 rounded-full uppercase tracking-wider shadow-lg z-10 flex items-center"><i class="fa-solid fa-lock mr-1 md:mr-2"></i> Encerrada</span>`;
                
            // Botão Interativo responsivo
            const buttonHTML = isDisponivel
                ? `<button onclick="abrirModalVaga(${v.id}, '${v.titulo}')" class="mt-auto w-full bg-gray-900 text-white font-black py-3 md:py-4 text-sm md:text-base rounded-xl hover:bg-brand transition-colors shadow-lg">Participar da Seleção</button>`
                : `<button disabled class="mt-auto w-full bg-gray-200 text-gray-400 font-black py-3 md:py-4 text-sm md:text-base rounded-xl cursor-not-allowed border border-gray-300">Seleção Encerrada</button>`;

            return `
            <div class="bg-white rounded-2xl md:rounded-[2rem] shadow-sm border-2 border-gray-200 overflow-hidden ${isDisponivel ? 'hover:border-brand/50 hover:shadow-xl' : 'opacity-80'} transition-all duration-300 flex flex-col relative group">
                ${badgeHTML}
                <div class="h-32 md:h-48 relative overflow-hidden bg-gray-100 border-b border-gray-200">
                    <img src="${v.imagem_banner}" class="w-full h-full object-cover transform ${isDisponivel ? 'group-hover:scale-105' : 'grayscale'} transition duration-500" alt="${v.titulo}">
                </div>
                
                <div class="p-5 md:p-8 flex flex-col flex-grow">
                    <h3 class="text-xl md:text-2xl font-black text-gray-900 mb-4 md:mb-6">${v.titulo}</h3>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 text-xs md:text-sm text-gray-600 mb-5 md:mb-6 flex-grow">
                        <div class="flex items-start"><i class="fa-solid fa-money-bill-wave text-brand mt-0.5 md:mt-1 w-5 md:w-6"></i> <div><strong class="block text-gray-900">Salário</strong> ${v.salario}</div></div>
                        <div class="flex items-start"><i class="fa-solid fa-location-dot text-brand mt-0.5 md:mt-1 w-5 md:w-6"></i> <div><strong class="block text-gray-900">Local</strong> ${v.local_residencia}</div></div>
                        <div class="flex items-start"><i class="fa-regular fa-clock text-brand mt-0.5 md:mt-1 w-5 md:w-6"></i> <div><strong class="block text-gray-900">Horário</strong> ${v.disponibilidade}</div></div>
                        <div class="flex items-start"><i class="fa-solid fa-briefcase text-brand mt-0.5 md:mt-1 w-5 md:w-6"></i> <div><strong class="block text-gray-900">Experiência</strong> ${v.experiencia}</div></div>
                        <div class="col-span-full flex items-start"><i class="fa-solid fa-graduation-cap text-brand mt-0.5 md:mt-1 w-5 md:w-6"></i> <div><strong class="block text-gray-900">Conhecimentos</strong> ${v.conhecimento}</div></div>
                    </div>

                    <div class="bg-brandLight/30 p-3 md:p-4 rounded-xl mb-5 md:mb-8 border border-brand/10">
                        <strong class="text-brand flex items-center mb-1 text-xs md:text-sm"><i class="fa-solid fa-gift mr-2"></i> Benefícios</strong>
                        <p class="text-xs md:text-sm text-gray-700 leading-relaxed">${v.beneficios}</p>
                    </div>

                    ${buttonHTML}
                </div>
            </div>
            `;
        }).join('');
    };

    return `
    <!DOCTYPE html>
    <html lang="pt-BR" class="scroll-smooth">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Trabalhe Conosco | Ecocaixas</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <script>
            tailwind.config = { theme: { extend: { colors: { brand: '#029723', brandDark: '#015e15', brandLight: '#e6f5e9', darkBg: '#0a1910' } } } }
        </script>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800;900&display=swap" rel="stylesheet">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
        <style>body { font-family: 'Inter', sans-serif; background-color: #fbfbfb; }</style>
    </head>
    <body class="text-gray-800 antialiased selection:bg-brand selection:text-white flex flex-col min-h-screen">

        <header class="bg-white/80 backdrop-blur-lg border-b border-gray-100 sticky top-0 z-50 transition-all duration-300">
            <div class="container mx-auto px-6 py-4 flex justify-between items-center relative z-50 bg-transparent">
                <div class="flex items-center cursor-pointer" onclick="window.scrollTo(0,0)">
                    <img src="/logo.png" alt="Logo Ecocaixas" class="h-12 w-auto">
                </div>
                
                <nav class="hidden lg:flex space-x-8 font-semibold items-center text-sm text-gray-600">
                    <a href="/#produtos" class="hover:text-brand transition">Destaques</a>
                    <a href="/#setores" class="hover:text-brand transition">Setores</a>
                    <a href="/#catalogo" class="hover:text-brand transition">Catálogo</a>
                    <a href="/#sobre" class="hover:text-brand transition">A Fábrica</a>
                    <a href="/vagas" class="text-brand font-bold hover:text-brandDark transition"><i class="fa-solid fa-briefcase mr-1"></i> Vagas</a>
                    <a href="/#contato" class="bg-brand text-white px-6 py-2.5 rounded-full hover:bg-brandDark hover:shadow-lg hover:shadow-brand/30 transition-all transform hover:-translate-y-0.5">Criar Orçamento</a>
                </nav>

                <button id="mobileMenuBtn" class="lg:hidden text-gray-800 text-2xl focus:outline-none" onclick="toggleMobileMenu()">
                    <i class="fa-solid fa-bars"></i>
                </button>
            </div>

            <div id="mobileMenu" class="absolute top-full left-0 w-full bg-white shadow-2xl origin-top transform scale-y-0 opacity-0 transition-all duration-300 flex flex-col lg:hidden z-40 border-b border-gray-100">
                <div class="px-6 py-6 flex flex-col space-y-5 font-bold text-gray-700 text-center">
                    <a href="/#produtos" class="hover:text-brand" onclick="toggleMobileMenu()">Destaques</a>
                    <a href="/#setores" class="hover:text-brand" onclick="toggleMobileMenu()">Setores</a>
                    <a href="/#catalogo" class="hover:text-brand" onclick="toggleMobileMenu()">Catálogo</a>
                    <a href="/#sobre" class="hover:text-brand" onclick="toggleMobileMenu()">A Fábrica</a>
                    <a href="/vagas" class="text-brand" onclick="toggleMobileMenu()"><i class="fa-solid fa-briefcase mr-1"></i> Vagas</a>
                    <a href="/#contato" class="bg-brand text-white px-6 py-4 rounded-xl hover:bg-brandDark transition-all mt-2" onclick="toggleMobileMenu()">Criar Orçamento</a>
                </div>
            </div>
        </header>

        <section class="pt-16 pb-12 bg-darkBg text-white text-center relative overflow-hidden">
            <div class="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1920&q=80')] bg-cover bg-center"></div>
            <div class="container mx-auto px-6 relative z-10">
                <span class="text-brand font-bold tracking-widest uppercase text-sm mb-2 block">Oportunidades</span>
                <h1 class="text-4xl md:text-5xl font-black mb-4">Trabalhe na Ecocaixas</h1>
                <p class="text-gray-400 text-sm md:text-lg max-w-2xl mx-auto">Faça parte do time que impulsiona a indústria baiana. Confira nossas vagas abertas e envie seu currículo.</p>
            </div>
        </section>

        <section class="py-12 md:py-16 flex-grow">
            <div class="container mx-auto px-4 md:px-6">
                <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5 md:gap-8">
                    ${renderVagasCards()}
                </div>
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

        <div id="modalVaga" class="fixed inset-0 bg-gray-900/80 backdrop-blur-md z-[100] hidden flex items-center justify-center transition-opacity opacity-0 px-4" style="transition: opacity 0.3s ease;">
            <div class="bg-white rounded-2xl max-w-lg w-full relative shadow-2xl transform scale-95 transition-transform duration-300" id="modalVagaContent">
                <button onclick="fecharModalVaga()" class="absolute top-4 right-4 w-10 h-10 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 flex items-center justify-center font-bold text-xl z-20">&times;</button>
                
                <div class="p-6 md:p-10">
                    <div class="mb-5 md:mb-6 border-b border-gray-100 pb-5 md:pb-6">
                        <span class="bg-brandLight text-brand px-3 py-1 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider mb-2 md:mb-3 inline-block">Candidatura</span>
                        <h3 class="text-xl md:text-2xl font-black text-gray-900" id="nomeVagaModal">Nome da Vaga</h3>
                    </div>
                    
                    <form action="/vagas/candidatar" method="POST" enctype="multipart/form-data">
                        <input type="hidden" name="vaga_id" id="inputIdVaga" value="">
                        
                        <div class="mb-4">
                            <label class="block text-[10px] md:text-xs font-bold text-gray-500 uppercase mb-1 md:mb-2">Seu Nome Completo</label>
                            <input type="text" name="nome" class="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-brand focus:border-brand transition-all text-sm" required placeholder="Digite seu nome">
                        </div>
                        
                        <div class="grid grid-cols-2 gap-3 md:gap-4 mb-4">
                            <div>
                                <label class="block text-[10px] md:text-xs font-bold text-gray-500 uppercase mb-1 md:mb-2">WhatsApp</label>
                                <input type="text" name="contato" class="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-brand transition-all text-sm" required placeholder="(71) 90000-0000">
                            </div>
                            <div>
                                <label class="block text-[10px] md:text-xs font-bold text-gray-500 uppercase mb-1 md:mb-2">Bairro/Cidade</label>
                                <input type="text" name="bairro" class="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-brand transition-all text-sm" required placeholder="Ex: Centro, Camaçari">
                            </div>
                        </div>
                        
                        <div class="mb-6 md:mb-8">
                            <label class="block text-[10px] md:text-xs font-bold text-gray-500 uppercase mb-1 md:mb-2">Anexar Currículo</label>
                            <div class="border-2 border-dashed border-gray-300 bg-gray-50 rounded-xl p-4 text-center hover:border-brand transition-colors cursor-pointer relative">
                                <i class="fa-solid fa-file-arrow-up text-2xl md:text-3xl text-gray-400 mb-2"></i>
                                <p class="text-xs md:text-sm text-gray-500 font-medium">Toque para escolher arquivo</p>
                                <input type="file" name="curriculo" accept=".pdf,image/*" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer" required>
                            </div>
                        </div>
                        
                        <button type="submit" class="w-full bg-brand text-white font-black py-3 md:py-4 text-sm md:text-lg rounded-xl hover:bg-brandDark transition shadow-lg flex justify-center items-center">
                            <i class="fa-solid fa-paper-plane mr-2"></i> Enviar Candidatura
                        </button>
                    </form>
                </div>
            </div>
        </div>

        <script>
            function abrirModalVaga(id, titulo) {
                document.getElementById('inputIdVaga').value = id;
                document.getElementById('nomeVagaModal').innerText = titulo;
                
                const modal = document.getElementById('modalVaga');
                const content = document.getElementById('modalVagaContent');
                modal.classList.remove('hidden');
                setTimeout(() => { 
                    modal.classList.remove('opacity-0'); 
                    content.classList.remove('scale-95'); 
                }, 10);
            }

            function fecharModalVaga() {
                const modal = document.getElementById('modalVaga');
                const content = document.getElementById('modalVagaContent');
                modal.classList.add('opacity-0');
                content.classList.add('scale-95');
                setTimeout(() => modal.classList.add('hidden'), 300);
            }

            // Controle do Menu Mobile
            function toggleMobileMenu() {
                const menu = document.getElementById('mobileMenu');
                const icon = document.querySelector('#mobileMenuBtn i');
                
                if (menu.classList.contains('scale-y-0')) {
                    menu.classList.remove('scale-y-0', 'opacity-0');
                    menu.classList.add('scale-y-100', 'opacity-100');
                    icon.classList.replace('fa-bars', 'fa-xmark');
                } else {
                    menu.classList.add('scale-y-0', 'opacity-0');
                    menu.classList.remove('scale-y-100', 'opacity-100');
                    icon.classList.replace('fa-xmark', 'fa-bars');
                }
            }
        </script>
    </body>
    </html>
    `;
};
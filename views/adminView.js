module.exports = function renderAdmin(produtos = [], empresaInfo = {}, noticias = [], stats = {}, formModelos = [], formMateriais = [], popups = [], vagas = [], candidaturas = []) {
    
    const renderVagasRow = () => {
        if(vagas.length === 0) return `<tr><td colspan="4" class="p-6 text-center text-gray-400">Nenhuma vaga ativa ou programada.</td></tr>`;
        return vagas.map(v => {
            const dataIn = new Date(v.data_inicio).toLocaleDateString('pt-BR');
            const dataFim = new Date(v.data_fim).toLocaleDateString('pt-BR');
            
            // Formatando as datas para o input type="date" do Javascript aceitar (YYYY-MM-DD)
            const dateInISO = new Date(v.data_inicio).toISOString().slice(0, 10);
            const dateFimISO = new Date(v.data_fim).toISOString().slice(0, 10);
            
            const isChecked = v.disponivel ? 'checked' : '';
            
            // Montando o objeto seguro para passar para o JavaScript do Modal
            const vData = `{ id: ${v.id}, titulo: '${v.titulo}', salario: '${v.salario}', local: '${v.local_residencia}', disp: '${v.disponibilidade}', conhec: '${v.conhecimento}', exp: '${v.experiencia}', ben: '${v.beneficios.replace(/\r?\n|\r/g, ' ')}', dIn: '${dateInISO}', dFim: '${dateFimISO}' }`;

            return `
            <tr class="border-b border-gray-100 hover:bg-gray-50 transition text-sm">
                <td class="py-3 px-4 flex items-center">
                    <img src="${v.imagem_banner}" class="w-16 h-10 rounded object-cover mr-3 shadow-sm border" alt="${v.titulo}">
                    <p class="font-bold text-gray-800">${v.titulo}</p>
                </td>
                <td class="py-3 px-4 text-xs font-bold text-gray-600">${dataIn} a ${dataFim}</td>
                
                <td class="py-3 px-4">
                    <form action="/admin/vagas/toggle/${v.id}" method="POST" class="m-0">
                        <label class="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" name="disponivel" class="sr-only peer" ${isChecked} onchange="this.form.submit()">
                            <div class="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand"></div>
                            <span class="ml-2 text-xs font-bold ${v.disponivel ? 'text-brand' : 'text-gray-400'}">${v.disponivel ? 'Aberta' : 'Fechada'}</span>
                        </label>
                    </form>
                </td>

                <td class="py-3 px-4 text-right whitespace-nowrap">
                    <button type="button" onclick="abrirModalEditarVaga(${vData})" class="text-blue-500 hover:text-blue-700 bg-blue-50 px-3 py-1 rounded mr-2 transition"><i class="fa-solid fa-pen"></i></button>
                    <form action="/admin/vagas/delete/${v.id}" method="POST" class="inline" onsubmit="return confirm('Tem certeza que deseja excluir esta vaga?')">
                        <button type="submit" class="text-red-500 hover:text-red-700 bg-red-50 px-3 py-1 rounded transition"><i class="fa-solid fa-trash"></i></button>
                    </form>
                </td>
            </tr>
            `;
        }).join('');
    };

    // NOVO HELPER: Tabela de Currículos
    const renderCandidaturasRow = () => {
        if(candidaturas.length === 0) return `<tr><td colspan="5" class="p-6 text-center text-gray-400">Nenhum currículo recebido ainda.</td></tr>`;
        return candidaturas.map(c => {
            const dataEnvio = new Date(c.data_envio).toLocaleDateString('pt-BR');
            return `
            <tr class="border-b border-gray-100 hover:bg-gray-50 transition text-sm">
                <td class="py-3 px-4 font-bold text-gray-800">${c.nome} <br><span class="text-xs text-gray-400 font-normal">Enviado em: ${dataEnvio}</span></td>
                <td class="py-3 px-4 text-gray-600 font-medium">${c.vaga_titulo}</td>
                <td class="py-3 px-4 text-gray-600">${c.bairro}</td>
                <td class="py-3 px-4 text-gray-600 font-bold">${c.contato}</td>
                <td class="py-3 px-4 text-right">
                    <a href="${c.curriculo_url}" target="_blank" class="bg-brandLight text-brand hover:bg-brand hover:text-white px-3 py-1.5 rounded transition font-bold text-xs inline-block mb-1 sm:mb-0 shadow-sm border border-brand/20"><i class="fa-solid fa-file-pdf mr-1"></i> Ver CV</a>
                    <form action="/admin/candidaturas/delete/${c.id}" method="POST" class="inline" onsubmit="return confirm('Excluir este candidato?')">
                        <button type="submit" class="text-red-500 hover:text-red-700 bg-red-50 px-3 py-1 rounded"><i class="fa-solid fa-trash"></i></button>
                    </form>
                </td>
            </tr>
            `;
        }).join('');
    };

    
    const renderRow = (arr, type, deleteRoute) => {
        if(arr.length === 0) return `<tr><td colspan="3" class="p-6 text-center text-gray-400">Nenhum item cadastrado.</td></tr>`;
        return arr.map(item => `
            <tr class="border-b border-gray-100 hover:bg-gray-50 transition text-sm">
                <td class="py-3 px-4 font-bold text-gray-800">${item.nome} ${item.tamanho ? `<span class="block text-xs text-gray-500 font-normal">Tam: ${item.tamanho}</span>` : ''}</td>
                <td class="py-3 px-4"><span class="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-bold uppercase">${item.secao}</span></td>
                <td class="py-3 px-4 text-right">
                    <form action="${deleteRoute}/${item.id}" method="POST" class="inline" onsubmit="return confirm('Excluir este item?')">
                        <button type="submit" class="text-red-500 hover:text-red-700 bg-red-50 px-3 py-1 rounded"><i class="fa-solid fa-trash"></i></button>
                    </form>
                </td>
            </tr>
        `).join('');
    };

    const renderProdutosRow = (secaoFiltro, badgeColor, badgeLabel) => {
        return produtos.filter(p => p.secao === secaoFiltro).map(p => `
            <tr class="border-b border-gray-100 hover:bg-gray-50 transition">
                <td class="py-3 px-4 flex items-center">
                    <img src="${p.imagem_url}" class="w-12 h-12 rounded object-cover mr-3 shadow-sm border" alt="${p.titulo}">
                    <div>
                        <p class="font-bold text-gray-800">${p.titulo}</p>
                        <p class="text-xs text-gray-500 truncate w-48">${p.descricao}</p>
                    </div>
                </td>
                <td class="py-3 px-4"><span class="bg-${badgeColor}-100 text-${badgeColor}-700 px-2 py-1 rounded text-xs font-bold">${badgeLabel}</span></td>
                <td class="py-3 px-4 text-right">
                    <form action="/admin/produtos/delete/${p.id}" method="POST" class="inline" onsubmit="return confirm('Tem certeza que deseja excluir esta caixa?')">
                        <button type="submit" class="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1 rounded transition"><i class="fa-solid fa-trash"></i></button>
                    </form>
                </td>
            </tr>
        `).join('');
    };

    const renderNoticiasRow = () => {
        return noticias.map(n => `
            <tr class="border-b border-gray-100 hover:bg-gray-50 transition">
                <td class="py-3 px-4">
                    <p class="font-bold text-gray-800">${n.titulo}</p>
                    <p class="text-xs text-gray-500 truncate w-64">${n.descricao}</p>
                </td>
                <td class="py-3 px-4">
                    <span class="${n.tipo === 'promocao' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'} px-2 py-1 rounded text-xs font-bold uppercase">${n.tipo}</span>
                </td>
                <td class="py-3 px-4 text-right">
                    <form action="/admin/noticias/delete/${n.id}" method="POST" class="inline" onsubmit="return confirm('Tem certeza que deseja excluir este aviso?')">
                        <button type="submit" class="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1 rounded transition"><i class="fa-solid fa-trash"></i></button>
                    </form>
                </td>
            </tr>
        `).join('');
    };

    // Helper para as linhas de Notificações Pop-up
    const renderPopupRow = () => {
        if(popups.length === 0) return `<tr><td colspan="4" class="p-6 text-center text-gray-400">Nenhum pop-up ativo ou programado.</td></tr>`;
        return popups.map(p => {
            const dataIn = new Date(p.data_inicio).toLocaleDateString('pt-BR');
            const dataFim = new Date(p.data_fim).toLocaleDateString('pt-BR');
            return `
            <tr class="border-b border-gray-100 hover:bg-gray-50 transition text-sm">
                <td class="py-3 px-4">
                    <p class="font-bold text-gray-800">${p.titulo}</p>
                    <p class="text-xs text-gray-500">Tipo: <span class="uppercase">${p.tipo_conteudo}</span></p>
                </td>
                <td class="py-3 px-4 text-xs font-bold text-gray-600">${dataIn} a ${dataFim}</td>
                <td class="py-3 px-4 text-right">
                    <form action="/admin/popup/delete/${p.id}" method="POST" class="inline" onsubmit="return confirm('Tem certeza que deseja excluir esta notificação?')">
                        <button type="submit" class="text-red-500 hover:text-red-700 bg-red-50 px-3 py-1 rounded"><i class="fa-solid fa-trash"></i></button>
                    </form>
                </td>
            </tr>
            `;
        }).join('');
    };

    return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Ecocaixas | Painel Administrativo</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <script>
            tailwind.config = { theme: { extend: { colors: { brand: '#029723', brandDark: '#015e15', brandLight: '#e6f5e9', darkBg: '#0a1910' }, fontFamily: { sans: ['Inter', 'sans-serif'], } } } }
        </script>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800;900&display=swap" rel="stylesheet">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
        <style>
            body { font-family: 'Inter', sans-serif; background-color: #f1f5f9; }
            .tab-content { display: none; }
            .tab-content.active { display: block; animation: fadeIn 0.3s ease-in-out; }
            @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            .tab-btn.active { border-bottom-width: 4px; border-color: #029723; color: #029723; background-color: #e6f5e9; }
            input[type=file]::file-selector-button {
                margin-right: 10px; border: none; background: #029723; padding: 8px 16px; border-radius: 8px; color: #fff; cursor: pointer; font-weight: bold; transition: background .2s ease-in-out;
            }
            input[type=file]::file-selector-button:hover { background: #015e15; }
        </style>
    </head>
    <body class="text-gray-800 flex h-screen overflow-hidden bg-gray-50">

        <div id="mobileOverlay" class="fixed inset-0 bg-gray-900/60 z-30 hidden lg:hidden backdrop-blur-sm transition-opacity opacity-0" onclick="toggleAdminMenu()"></div>

        <aside id="adminSidebar" class="w-64 flex-shrink-0 bg-gray-900 text-white flex flex-col shadow-2xl z-40 absolute inset-y-0 left-0 transform -translate-x-full transition-transform duration-300 lg:relative lg:translate-x-0">
            <div class="p-6 border-b border-gray-800 flex items-center justify-between">
                <div class="flex items-center">
                    <img src="/logo.png" alt="Logo Ecocaixas" class="h-8 w-auto mr-3">
                    <span class="text-xl font-black tracking-tight">EcoAdmin</span>
                </div>
                <button class="lg:hidden text-gray-400 hover:text-white" onclick="toggleAdminMenu()">
                    <i class="fa-solid fa-xmark text-2xl"></i>
                </button>
            </div>
            <nav class="flex-grow p-4 space-y-2 overflow-y-auto">
                <button onclick="openTab('tab-produtos', this)" class="tab-btn active w-full flex items-center px-4 py-3 rounded-lg text-left font-bold transition-colors hover:bg-gray-800">
                    <i class="fa-solid fa-boxes-packing w-6"></i> Catálogo e Slides
                </button>
                <button onclick="openTab('tab-empresa', this)" class="tab-btn w-full flex items-center px-4 py-3 rounded-lg text-left font-bold text-gray-400 transition-colors hover:bg-gray-800">
                    <i class="fa-solid fa-industry w-6"></i> A Empresa
                </button>
                <button onclick="openTab('tab-mural', this)" class="tab-btn w-full flex items-center px-4 py-3 rounded-lg text-left font-bold text-gray-400 transition-colors hover:bg-gray-800">
                    <i class="fa-solid fa-bullhorn w-6"></i> Mural de Notícias
                </button>
                <button onclick="openTab('tab-form', this)" class="tab-btn w-full flex items-center px-4 py-3 rounded-lg text-left font-bold text-gray-400 transition-colors hover:bg-gray-800">
                    <i class="fa-solid fa-clipboard-list w-6"></i> Opções do Orçamento
                </button>
                <div class="h-px bg-gray-800 my-2"></div>
                <button onclick="openTab('tab-popup', this)" class="tab-btn w-full flex items-center px-4 py-3 rounded-lg text-left font-bold text-gray-400 transition-colors hover:bg-gray-800">
                    <i class="fa-solid fa-window-restore w-6"></i> Pop-up Inicial
                </button>
                <button onclick="openTab('tab-vagas', this)" class="tab-btn w-full flex items-center px-4 py-3 rounded-lg text-left font-bold text-gray-400 transition-colors hover:bg-gray-800">
                    <i class="fa-solid fa-briefcase w-6"></i> Vagas de Emprego
                </button>
            </nav>
            <div class="p-4 border-t border-gray-800">
                <a href="/" target="_blank" class="flex items-center justify-center w-full bg-brand hover:bg-brandDark text-white py-2 rounded-lg font-bold transition-colors">
                    <i class="fa-solid fa-arrow-up-right-from-square mr-2"></i> Ver Site
                </a>
                <a href="/logout" class="flex items-center justify-center w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-bold transition-colors mt-2">
                <i class="fa-solid fa-power-off mr-2"></i> Sair
            </a>
            </div>
        </aside>

        <div class="flex-1 flex flex-col overflow-hidden relative w-full">
            
            <header class="bg-white shadow-sm border-b border-gray-200 p-4 flex items-center justify-between lg:hidden z-20">
                <div class="flex items-center">
                    <img src="/logo.png" alt="Logo" class="h-8 w-auto mr-2">
                    <span class="text-lg font-black text-gray-800">EcoAdmin</span>
                </div>
                <button class="text-gray-800 focus:outline-none bg-gray-100 w-10 h-10 rounded-lg flex items-center justify-center" onclick="toggleAdminMenu()">
                    <i class="fa-solid fa-bars text-xl"></i>
                </button>
            </header>

            <main class="flex-1 overflow-y-auto p-4 lg:p-8 relative w-full">
                <header class="mb-6 lg:mb-8 flex justify-between items-center">
                    <div>
                        <h2 class="text-2xl lg:text-3xl font-black text-gray-800">Gestão de Conteúdo</h2>
                        <p class="text-gray-500 text-sm lg:text-base">Atualize os dados do site em tempo real.</p>
                    </div>
                </header>

            <section id="tab-produtos" class="tab-content active">
                <div class="grid lg:grid-cols-3 gap-8">
                    <div class="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-200 h-fit">
                        <h3 class="text-xl font-bold mb-4 flex items-center border-b pb-2"><i class="fa-solid fa-plus-circle text-brand mr-2"></i> Adicionar Card / Slide</h3>
                        <form action="/admin/produtos/add" method="POST" enctype="multipart/form-data">
                            <div class="mb-4">
                                <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Seção do Site</label>
                                <select name="secao" class="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand outline-none font-medium" required>
                                    <option value="destaque">Destaques da Linha (Topo)</option>
                                    <option value="alimenticio">Linha Alimentícia</option>
                                    <option value="industrial">Linha Industrial</option>
                                </select>
                            </div>
                            <div class="mb-4">
                                <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Título da Caixa</label>
                                <input type="text" name="titulo" class="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 outline-none" required placeholder="Ex: Caixa Maleta">
                            </div>
                            <div class="mb-4">
                                <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Descrição</label>
                                <textarea name="descricao" rows="3" class="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 outline-none" required placeholder="Detalhes do produto..."></textarea>
                            </div>
                            <div class="mb-6">
                                <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Upload da Imagem</label>
                                <input type="file" name="imagem" accept="image/*" class="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-sm text-gray-600 outline-none" required>
                            </div>
                            <button type="submit" class="w-full bg-brand text-white font-bold py-3 rounded-lg hover:bg-brandDark transition shadow">Salvar Card</button>
                        </form>
                    </div>

                    <div class="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <div class="p-4 border-b bg-gray-50"><h3 class="font-bold text-gray-700">Cards Cadastrados nos Slides</h3></div>
                        <div class="overflow-x-auto max-h-[600px] overflow-y-auto">
                            <table class="w-full text-left border-collapse">
                                <thead>
                                    <tr class="bg-gray-100 text-gray-500 text-xs uppercase">
                                        <th class="py-2 px-4 font-bold">Imagem e Título</th>
                                        <th class="py-2 px-4 font-bold">Seção do Slide</th>
                                        <th class="py-2 px-4 font-bold text-right">Ação</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${produtos.length > 0 ? renderProdutosRow('destaque', 'blue', 'Destaque') + renderProdutosRow('alimenticio', 'green', 'Alimentício') + renderProdutosRow('industrial', 'gray', 'Industrial') : '<tr><td colspan="3" class="p-6 text-center text-gray-400">Nenhuma caixa cadastrada.</td></tr>'}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section>

            <section id="tab-empresa" class="tab-content">
                <form action="/admin/empresa/update" method="POST" enctype="multipart/form-data" class="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 max-w-4xl mx-auto">
                    <h3 class="text-2xl font-black mb-6 border-b pb-4 text-gray-800"><i class="fa-solid fa-industry text-brand mr-2"></i> Atualizar Dados da Fábrica</h3>
                    
                    <div class="grid grid-cols-2 gap-6 mb-6">
                        <div>
                            <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Anos de História</label>
                            <input type="number" name="anos_historia" value="${stats.anos_historia || 0}" class="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 outline-none font-bold text-lg" required>
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Caixas Produzidas (Total)</label>
                            <input type="number" name="caixas_vendidas" value="${stats.caixas_vendidas || 0}" class="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 outline-none font-bold text-lg" required>
                        </div>
                    </div>

                    <div class="mb-6">
                        <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Título da Seção História</label>
                        <input type="text" name="titulo_historia" value="${empresaInfo.titulo || ''}" class="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 outline-none font-bold" required>
                    </div>

                    <div class="mb-8">
                        <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Texto da História</label>
                        <textarea name="texto_historia" rows="6" class="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 outline-none" required>${empresaInfo.texto_historia || ''}</textarea>
                    </div>

                    <h4 class="font-bold text-gray-700 mb-4 border-b pb-2"><i class="fa-solid fa-images mr-2"></i>Substituir Imagens do Mosaico (Opcional)</h4>
                    <p class="text-xs text-gray-400 mb-4">Envie um arquivo apenas se quiser trocar a imagem atual.</p>
                    
                    <div class="grid md:grid-cols-3 gap-6 mb-8">
                        <div class="bg-gray-50 p-4 rounded-xl border border-gray-200">
                            <label class="block text-xs font-bold text-gray-600 mb-2">Imagem Principal (Fundo)</label>
                            ${empresaInfo.img_mosaico_1 ? `<img src="${empresaInfo.img_mosaico_1}" class="h-20 w-full object-cover rounded-lg mb-3 shadow-sm">` : ''}
                            <input type="file" name="img_mosaico_1" accept="image/*" class="text-xs w-full text-gray-500">
                        </div>
                        <div class="bg-gray-50 p-4 rounded-xl border border-gray-200">
                            <label class="block text-xs font-bold text-gray-600 mb-2">Imagem Menor 1 (Esq)</label>
                            ${empresaInfo.img_mosaico_2 ? `<img src="${empresaInfo.img_mosaico_2}" class="h-20 w-full object-cover rounded-lg mb-3 shadow-sm">` : ''}
                            <input type="file" name="img_mosaico_2" accept="image/*" class="text-xs w-full text-gray-500">
                        </div>
                        <div class="bg-gray-50 p-4 rounded-xl border border-gray-200">
                            <label class="block text-xs font-bold text-gray-600 mb-2">Imagem Menor 2 (Dir)</label>
                            ${empresaInfo.img_mosaico_3 ? `<img src="${empresaInfo.img_mosaico_3}" class="h-20 w-full object-cover rounded-lg mb-3 shadow-sm">` : ''}
                            <input type="file" name="img_mosaico_3" accept="image/*" class="text-xs w-full text-gray-500">
                        </div>
                    </div>

                    <button type="submit" class="w-full bg-brand text-white font-bold py-4 rounded-xl hover:bg-brandDark transition shadow-lg text-lg"><i class="fa-solid fa-save mr-2"></i> Salvar Alterações na Empresa</button>
                </form>
            </section>

            <section id="tab-mural" class="tab-content">
                <div class="grid lg:grid-cols-3 gap-8">
                    <div class="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-200 h-fit">
                        <h3 class="text-xl font-bold mb-4 flex items-center border-b pb-2"><i class="fa-solid fa-bullhorn text-brand mr-2"></i> Postar no Mural</h3>
                        <form action="/admin/noticias/add" method="POST">
                            <div class="mb-4">
                                <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Tipo de Postagem</label>
                                <select name="tipo" class="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 outline-none font-medium" required>
                                    <option value="noticia">Notícia / Aviso</option>
                                    <option value="promocao">Promoção</option>
                                </select>
                            </div>
                            <div class="mb-4">
                                <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Título</label>
                                <input type="text" name="titulo" class="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 outline-none" required placeholder="Nova máquina chegou...">
                            </div>
                            <div class="mb-6">
                                <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Texto Completo</label>
                                <textarea name="descricao" rows="4" class="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 outline-none" required placeholder="Detalhes do aviso..."></textarea>
                            </div>
                            <button type="submit" class="w-full bg-gray-800 text-white font-bold py-3 rounded-lg hover:bg-gray-900 transition shadow">Publicar</button>
                        </form>
                    </div>

                    <div class="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <div class="p-4 border-b bg-gray-50"><h3 class="font-bold text-gray-700">Mural Ativo</h3></div>
                        <div class="overflow-x-auto max-h-[600px] overflow-y-auto">
                            <table class="w-full text-left border-collapse">
                                <thead>
                                    <tr class="bg-gray-100 text-gray-500 text-xs uppercase">
                                        <th class="py-2 px-4 font-bold">Aviso</th>
                                        <th class="py-2 px-4 font-bold">Tipo</th>
                                        <th class="py-2 px-4 font-bold text-right">Ação</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${noticias.length > 0 ? renderNoticiasRow() : '<tr><td colspan="3" class="p-6 text-center text-gray-400">Mural vazio.</td></tr>'}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section>

            <section id="tab-form" class="tab-content">
                <div class="grid lg:grid-cols-2 gap-8">
                    
                    <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                        <h3 class="text-xl font-bold mb-4 flex items-center border-b pb-2"><i class="fa-solid fa-box text-brand mr-2"></i> Modelos de Caixas e Tamanhos</h3>
                        <form action="/admin/form/modelo/add" method="POST" class="mb-8 bg-gray-50 p-4 rounded-xl border border-gray-200">
                            <div class="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Setor</label>
                                    <select name="secao" class="w-full border-gray-300 rounded-lg px-3 py-2 outline-none">
                                        <option value="alimenticio">Alimentício</option>
                                        <option value="industrial">Industrial</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Nome do Modelo</label>
                                    <input type="text" name="nome" class="w-full border-gray-300 rounded-lg px-3 py-2 outline-none" required placeholder="Ex: Caixa Pizza">
                                </div>
                            </div>
                            <div class="mb-4">
                                <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Tamanho Automático</label>
                                <input type="text" name="tamanho" class="w-full border-gray-300 rounded-lg px-3 py-2 outline-none" required placeholder="Ex: 35x35x4 cm ou Sob Medida">
                            </div>
                            <button type="submit" class="w-full bg-gray-800 text-white font-bold py-2 rounded-lg hover:bg-gray-900 transition">Adicionar Modelo</button>
                        </form>
                        
                        <div class="overflow-y-auto max-h-80 border rounded-lg">
                            <table class="w-full text-left border-collapse">
                                <thead class="bg-gray-100 text-xs text-gray-500 uppercase sticky top-0">
                                    <tr>
                                        <th class="py-2 px-4">Modelo/Tamanho</th>
                                        <th class="py-2 px-4">Setor</th>
                                        <th class="py-2 px-4 text-right">Ação</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${renderRow(formModelos, 'modelo', '/admin/form/modelo/delete')}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 h-fit">
                        <h3 class="text-xl font-bold mb-4 flex items-center border-b pb-2"><i class="fa-solid fa-layer-group text-brand mr-2"></i> Materiais Disponíveis</h3>
                        <form action="/admin/form/material/add" method="POST" class="mb-8 bg-gray-50 p-4 rounded-xl border border-gray-200">
                            <div class="mb-4">
                                <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Disponível para Setor</label>
                                <select name="secao" class="w-full border-gray-300 rounded-lg px-3 py-2 outline-none">
                                    <option value="ambos">Ambos (Alimentício e Industrial)</option>
                                    <option value="alimenticio">Apenas Alimentício</option>
                                    <option value="industrial">Apenas Industrial</option>
                                </select>
                            </div>
                            <div class="mb-4">
                                <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Nome do Material</label>
                                <input type="text" name="nome" class="w-full border-gray-300 rounded-lg px-3 py-2 outline-none" required placeholder="Ex: Pardo (KRAFT)">
                            </div>
                            <button type="submit" class="w-full bg-gray-800 text-white font-bold py-2 rounded-lg hover:bg-gray-900 transition">Adicionar Material</button>
                        </form>
                        
                        <div class="overflow-y-auto max-h-80 border rounded-lg">
                            <table class="w-full text-left border-collapse">
                                <thead class="bg-gray-100 text-xs text-gray-500 uppercase sticky top-0">
                                    <tr>
                                        <th class="py-2 px-4">Material</th>
                                        <th class="py-2 px-4">Setor</th>
                                        <th class="py-2 px-4 text-right">Ação</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${renderRow(formMateriais, 'material', '/admin/form/material/delete')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section>

            <section id="tab-popup" class="tab-content">
                <div class="grid lg:grid-cols-3 gap-8">
                    
                    <div class="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-200 h-fit">
                        <h3 class="text-xl font-bold mb-4 flex items-center border-b pb-2"><i class="fa-solid fa-window-restore text-brand mr-2"></i> Criar Pop-up</h3>
                        <form action="/admin/popup/add" method="POST" enctype="multipart/form-data">
                            <div class="mb-4">
                                <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Título do Pop-up</label>
                                <input type="text" name="titulo" class="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 outline-none" required placeholder="Ex: Recesso de Fim de Ano">
                            </div>
                            <div class="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Início</label>
                                    <input type="date" name="data_inicio" class="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 outline-none text-sm" required>
                                </div>
                                <div>
                                    <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Fim</label>
                                    <input type="date" name="data_fim" class="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 outline-none text-sm" required>
                                </div>
                            </div>
                            
                            <div class="mb-4">
                                <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Tipo de Conteúdo</label>
                                <select name="tipo_conteudo" id="popup_tipo" class="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 outline-none font-medium" onchange="togglePopupInput()" required>
                                    <option value="texto">Mensagem de Texto</option>
                                    <option value="imagem">Imagem (Banner)</option>
                                </select>
                            </div>
                            
                            <div id="popup_texto_container" class="mb-6">
                                <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Texto da Notificação</label>
                                <textarea name="texto_conteudo" rows="4" class="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 outline-none" placeholder="Digite o aviso..."></textarea>
                            </div>

                            <div id="popup_imagem_container" class="mb-6" style="display: none;">
                                <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Upload do Banner (Imagem)</label>
                                <input type="file" name="imagem_popup" accept="image/*" class="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-sm text-gray-600 outline-none">
                            </div>
                            
                            <button type="submit" class="w-full bg-brand text-white font-bold py-3 rounded-lg hover:bg-brandDark transition shadow">Programar Notificação</button>
                        </form>
                    </div>

                    <div class="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <div class="p-4 border-b bg-gray-50"><h3 class="font-bold text-gray-700">Pop-ups Programados</h3></div>
                        <div class="overflow-x-auto max-h-[600px] overflow-y-auto">
                            <table class="w-full text-left border-collapse">
                                <thead>
                                    <tr class="bg-gray-100 text-gray-500 text-xs uppercase">
                                        <th class="py-2 px-4 font-bold">Título / Conteúdo</th>
                                        <th class="py-2 px-4 font-bold">Período de Exibição</th>
                                        <th class="py-2 px-4 font-bold text-right">Ação</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${renderPopupRow()}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </section>

            <section id="tab-vagas" class="tab-content">
                
                <div class="grid lg:grid-cols-3 gap-8 mb-8">
                    <div class="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-200 h-fit">
                        <h3 class="text-xl font-bold mb-4 flex items-center border-b pb-2"><i class="fa-solid fa-briefcase text-brand mr-2"></i> Criar Vaga</h3>
                        <form action="/admin/vagas/add" method="POST" enctype="multipart/form-data">
                            
                            <div class="mb-4">
                                <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Título da Vaga</label>
                                <input type="text" name="titulo" class="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 outline-none" required placeholder="Ex: Operador de Vincadeira">
                            </div>

                            <div class="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Salário</label>
                                    <input type="text" name="salario" class="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 outline-none text-sm" required placeholder="Ex: R$ 1.609,00 ou A combinar">
                                </div>
                                <div>
                                    <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Onde Morar</label>
                                    <input type="text" name="local_residencia" class="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 outline-none text-sm" required placeholder="Ex: Camaçari - BA">
                                </div>
                            </div>

                            <div class="mb-4">
                                <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Disponibilidade</label>
                                <input type="text" name="disponibilidade" class="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 outline-none text-sm" required placeholder="Ex: De 6h30 às 16h30">
                            </div>

                            <div class="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Conhecimento</label>
                                    <input type="text" name="conhecimento" class="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 outline-none text-sm" required placeholder="Ex: Máquina de Corte">
                                </div>
                                <div>
                                    <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Experiência</label>
                                    <input type="text" name="experiencia" class="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 outline-none text-sm" required placeholder="Ex: Mínimo 6 meses">
                                </div>
                            </div>

                            <div class="mb-4">
                                <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Benefícios</label>
                                <textarea name="beneficios" rows="2" class="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 outline-none text-sm" required placeholder="Ex: Vale Transporte, Alimentação no local..."></textarea>
                            </div>

                            <div class="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Início da Captação</label>
                                    <input type="date" name="data_inicio" class="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 outline-none text-sm" required>
                                </div>
                                <div>
                                    <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Fim da Captação</label>
                                    <input type="date" name="data_fim" class="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 outline-none text-sm" required>
                                </div>
                            </div>

                            <div class="mb-6">
                                <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Banner da Vaga (Imagem)</label>
                                <input type="file" name="imagem_banner" accept="image/*" class="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-sm text-gray-600 outline-none" required>
                            </div>
                            
                            <button type="submit" class="w-full bg-brand text-white font-bold py-3 rounded-lg hover:bg-brandDark transition shadow">Publicar Vaga</button>
                        </form>
                    </div>

                    <div class="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden h-fit">
                        <div class="p-4 border-b bg-gray-50"><h3 class="font-bold text-gray-700">Vagas Anunciadas</h3></div>
                        <div class="overflow-x-auto max-h-[350px] overflow-y-auto">
                            <table class="w-full text-left border-collapse">
                                <thead class="sticky top-0 bg-gray-100 z-10 text-gray-500 text-xs uppercase">
                                    <tr>
                                        <th class="py-2 px-4 font-bold">Vaga</th>
                                        <th class="py-2 px-4 font-bold">Período</th>
                                        <th class="py-2 px-4 font-bold text-right">Ação</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${renderVagasRow()}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div class="p-4 border-b bg-gray-50 flex justify-between items-center">
                        <h3 class="font-bold text-gray-700"><i class="fa-solid fa-users text-brand mr-2"></i> Candidatos Recebidos</h3>
                        <span class="bg-brandLight text-brand text-xs font-bold px-3 py-1 rounded-full">${candidaturas.length} Currículos</span>
                    </div>
                    <div class="overflow-x-auto max-h-[500px] overflow-y-auto">
                        <table class="w-full text-left border-collapse min-w-[800px]">
                            <thead class="sticky top-0 bg-gray-100 z-10 text-gray-500 text-xs uppercase">
                                <tr>
                                    <th class="py-3 px-4 font-bold">Candidato</th>
                                    <th class="py-3 px-4 font-bold">Vaga Desejada</th>
                                    <th class="py-3 px-4 font-bold">Bairro</th>
                                    <th class="py-3 px-4 font-bold">Contato</th>
                                    <th class="py-3 px-4 font-bold text-right">Currículo</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${renderCandidaturasRow()}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            <div id="modalEditVaga" class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm hidden z-[100] flex items-center justify-center transition-opacity opacity-0 px-4" style="transition: opacity 0.3s ease;">
                <div class="bg-white rounded-2xl max-w-lg w-full p-6 md:p-8 relative shadow-2xl transform scale-95 transition-transform duration-300 overflow-y-auto max-h-[90vh]" id="modalEditVagaContent">
                    <button type="button" onclick="fecharModalEditarVaga()" class="absolute top-5 right-5 w-10 h-10 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 flex items-center justify-center font-bold text-xl">&times;</button>
                    <h3 class="text-2xl font-black text-gray-900 mb-6 border-b pb-2"><i class="fa-solid fa-pen text-blue-500 mr-2"></i> Editar Vaga</h3>
                    
                    <form id="formEditVaga" method="POST" enctype="multipart/form-data">
                        <div class="mb-4">
                            <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Título da Vaga</label>
                            <input type="text" id="editVaga_titulo" name="titulo" class="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 outline-none" required>
                        </div>
                        <div class="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Salário</label>
                                <input type="text" id="editVaga_salario" name="salario" class="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 outline-none text-sm" required>
                            </div>
                            <div>
                                <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Onde Morar</label>
                                <input type="text" id="editVaga_local" name="local_residencia" class="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 outline-none text-sm" required>
                            </div>
                        </div>
                        <div class="mb-4">
                            <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Disponibilidade</label>
                            <input type="text" id="editVaga_disp" name="disponibilidade" class="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 outline-none text-sm" required>
                        </div>
                        <div class="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Conhecimento</label>
                                <input type="text" id="editVaga_conhec" name="conhecimento" class="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 outline-none text-sm" required>
                            </div>
                            <div>
                                <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Experiência</label>
                                <input type="text" id="editVaga_exp" name="experiencia" class="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 outline-none text-sm" required>
                            </div>
                        </div>
                        <div class="mb-4">
                            <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Benefícios</label>
                            <textarea id="editVaga_ben" name="beneficios" rows="2" class="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 outline-none text-sm" required></textarea>
                        </div>
                        <div class="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Início</label>
                                <input type="date" id="editVaga_dIn" name="data_inicio" class="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 outline-none text-sm" required>
                            </div>
                            <div>
                                <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Fim</label>
                                <input type="date" id="editVaga_dFim" name="data_fim" class="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 outline-none text-sm" required>
                            </div>
                        </div>
                        <div class="mb-6">
                            <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Substituir Banner (Opcional)</label>
                            <input type="file" name="imagem_banner" accept="image/*" class="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-sm text-gray-500 outline-none">
                        </div>
                        <button type="submit" class="w-full bg-blue-500 text-white font-bold py-3 rounded-lg hover:bg-blue-600 transition shadow">Salvar Alterações</button>
                    </form>
                </div>
            </div>

            </main>
        </div>
        
        <script>
            // Controle do Menu Lateral no Mobile
            function toggleAdminMenu() {
                const sidebar = document.getElementById('adminSidebar');
                const overlay = document.getElementById('mobileOverlay');
                
                if (sidebar.classList.contains('-translate-x-full')) {
                    sidebar.classList.remove('-translate-x-full');
                    overlay.classList.remove('hidden');
                    setTimeout(() => overlay.classList.remove('opacity-0'), 10);
                } else {
                    sidebar.classList.add('-translate-x-full');
                    overlay.classList.add('opacity-0');
                    setTimeout(() => overlay.classList.add('hidden'), 300);
                }
            }

            // Controle das Abas (Tabs) do Painel
            function openTab(tabId, btn) {
                // Fecha o menu lateral no celular após clicar em uma aba
                if (window.innerWidth < 1024 && !document.getElementById('adminSidebar').classList.contains('-translate-x-full')) {
                    toggleAdminMenu();
                }

                document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
                document.querySelectorAll('.tab-btn').forEach(b => {
                    b.classList.remove('active', 'border-brand', 'text-brand', 'bg-brandLight', 'border-b-4');
                    b.classList.add('text-gray-400');
                });
                document.getElementById(tabId).classList.add('active');
                btn.classList.add('active', 'border-b-4', 'border-brand', 'text-brand', 'bg-brandLight');
                btn.classList.remove('text-gray-400');
            }

            // Controle de visualização do Formulário de Pop-up
            function togglePopupInput() {
                const tipo = document.getElementById('popup_tipo').value;
                const textoCont = document.getElementById('popup_texto_container');
                const imgCont = document.getElementById('popup_imagem_container');
                const textoInput = document.getElementsByName('texto_conteudo')[0];
                const imgInput = document.getElementsByName('imagem_popup')[0];
                
                if (tipo === 'texto') {
                    textoCont.style.display = 'block';
                    imgCont.style.display = 'none';
                    textoInput.required = true;
                    imgInput.required = false;
                } else {
                    textoCont.style.display = 'none';
                    imgCont.style.display = 'block';
                    textoInput.required = false;
                    imgInput.required = true;
                }
            }

            // Controle do Modal de Edição de Vagas
            function abrirModalEditarVaga(v) {
                document.getElementById('formEditVaga').action = '/admin/vagas/edit/' + v.id;
                
                document.getElementById('editVaga_titulo').value = v.titulo;
                document.getElementById('editVaga_salario').value = v.salario;
                document.getElementById('editVaga_local').value = v.local;
                document.getElementById('editVaga_disp').value = v.disp;
                document.getElementById('editVaga_conhec').value = v.conhec;
                document.getElementById('editVaga_exp').value = v.exp;
                document.getElementById('editVaga_ben').value = v.ben;
                document.getElementById('editVaga_dIn').value = v.dIn;
                document.getElementById('editVaga_dFim').value = v.dFim;

                const modal = document.getElementById('modalEditVaga');
                const content = document.getElementById('modalEditVagaContent');
                modal.classList.remove('hidden');
                setTimeout(() => { 
                    modal.classList.remove('opacity-0'); 
                    content.classList.remove('scale-95'); 
                }, 10);
            }

            function fecharModalEditarVaga() {
                const modal = document.getElementById('modalEditVaga');
                const content = document.getElementById('modalEditVagaContent');
                modal.classList.add('opacity-0');
                content.classList.add('scale-95');
                setTimeout(() => modal.classList.add('hidden'), 300);
            }

            // Controle das Abas (Tabs) do Painel
            function openTab(tabId, btn) {
                // Fecha o menu lateral no celular
                if (window.innerWidth < 1024 && !document.getElementById('adminSidebar').classList.contains('-translate-x-full')) {
                    toggleAdminMenu();
                }

                // NOVO: Salva a aba atual na memória do navegador
                localStorage.setItem('ecoAdminAbaAtiva', tabId);

                document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
                document.querySelectorAll('.tab-btn').forEach(b => {
                    b.classList.remove('active', 'border-brand', 'text-brand', 'bg-brandLight', 'border-b-4');
                    b.classList.add('text-gray-400');
                });
                
                document.getElementById(tabId).classList.add('active');
                
                // NOVO: Se o botão não veio no clique (ex: no carregamento da página), o JS procura ele
                if (!btn) {
                    btn = document.querySelector(\`button[onclick*="\${tabId}"]\`);
                }
                
                if (btn) {
                    btn.classList.add('active', 'border-b-4', 'border-brand', 'text-brand', 'bg-brandLight');
                    btn.classList.remove('text-gray-400');
                }
            }

            // NOVO: Assim que a página carrega, ele puxa a aba salva na memória e abre
            document.addEventListener('DOMContentLoaded', () => {
                const abaSalva = localStorage.getItem('ecoAdminAbaAtiva');
                // Se existe uma aba salva e ela existe no HTML, abre ela. Se não, deixa na padrão.
                if (abaSalva && document.getElementById(abaSalva)) {
                    openTab(abaSalva);
                }
            });
        </script>
    </body>
    </html>
    `;
};
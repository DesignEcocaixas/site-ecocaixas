module.exports = function renderAdmin(produtos = [], empresaInfo = {}, noticias = [], stats = {}, formModelos = [], formMateriais = [], popups = [], vagas = [], candidaturas = [], configs = {}, webhooks = []) {
    
    const renderVagasRow = () => {
        if(vagas.length === 0) return `<tr><td colspan="4" class="p-5 text-center text-gray-400 text-sm">Nenhuma vaga ativa ou programada.</td></tr>`;
        return vagas.map(v => {
            const dataIn = new Date(v.data_inicio).toLocaleDateString('pt-BR');
            const dataFim = new Date(v.data_fim).toLocaleDateString('pt-BR');
            
            const dateInISO = new Date(v.data_inicio).toISOString().slice(0, 10);
            const dateFimISO = new Date(v.data_fim).toISOString().slice(0, 10);
            const isChecked = v.disponivel ? 'checked' : '';
            
            const vData = `{ id: ${v.id}, titulo: '${v.titulo}', salario: '${v.salario}', local: '${v.local_residencia}', disp: '${v.disponibilidade}', conhec: '${v.conhecimento}', exp: '${v.experiencia}', ben: '${v.beneficios.replace(/\r?\n|\r/g, ' ')}', dIn: '${dateInISO}', dFim: '${dateFimISO}' }`;

            return `
            <tr class="border-b border-gray-100 hover:bg-gray-50 transition text-sm">
                <td class="py-2 px-3 flex items-center">
                    <img src="${v.imagem_banner}" class="w-12 h-8 rounded object-cover mr-3 shadow-sm border" alt="${v.titulo}">
                    <p class="font-bold text-gray-800 text-[13px]">${v.titulo}</p>
                </td>
                <td class="py-2 px-3 text-xs font-bold text-gray-600">${dataIn} a ${dataFim}</td>
                
                <td class="py-2 px-3">
                    <form action="/admin/vagas/toggle/${v.id}" method="POST" class="m-0">
                        <label class="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" name="disponivel" class="sr-only peer" ${isChecked} onchange="this.form.submit()">
                            <div class="w-7 h-4 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-brand"></div>
                            <span class="ml-2 text-[11px] font-bold uppercase ${v.disponivel ? 'text-brand' : 'text-gray-400'}">${v.disponivel ? 'Aberta' : 'Fechada'}</span>
                        </label>
                    </form>
                </td>

                <td class="py-2 px-3 text-right whitespace-nowrap">
                    <button type="button" onclick="abrirModalEditarVaga(${vData})" class="text-blue-500 hover:text-blue-700 bg-blue-50 px-2.5 py-1 rounded text-xs mr-1 transition"><i class="fa-solid fa-pen"></i></button>
                    <form action="/admin/vagas/delete/${v.id}" method="POST" class="inline" onsubmit="return confirm('Tem certeza que deseja excluir esta vaga?')">
                        <button type="submit" class="text-red-500 hover:text-red-700 bg-red-50 px-2.5 py-1 rounded text-xs transition"><i class="fa-solid fa-trash"></i></button>
                    </form>
                </td>
            </tr>
            `;
        }).join('');
    };

    const renderCandidaturasRow = () => {
        if(candidaturas.length === 0) return `<tr><td colspan="5" class="p-5 text-center text-gray-400 text-sm" id="linhaSemCandidatos">Nenhum currículo recebido ainda.</td></tr>`;
        return candidaturas.map(c => {
            const dataEnvio = new Date(c.data_envio).toLocaleDateString('pt-BR');
            const nomeLimpo = c.nome.replace(/"/g, '').toLowerCase();
            const bairroLimpo = c.bairro.replace(/"/g, '').toLowerCase();

            return `
            <tr class="candidato-row border-b border-gray-100 hover:bg-gray-50 transition text-[13px]" data-nome="${nomeLimpo}" data-vaga="${c.vaga_id}" data-bairro="${bairroLimpo}">
                <td class="py-2 px-3 font-bold text-gray-800">${c.nome} <br><span class="text-[11px] text-gray-400 font-normal">Enviado em: ${dataEnvio}</span></td>
                <td class="py-2 px-3 text-gray-600 font-medium">${c.vaga_titulo}</td>
                <td class="py-2 px-3 text-gray-600">${c.bairro}</td>
                <td class="py-2 px-3 text-gray-600 font-bold text-xs">${c.contato}</td>
                <td class="py-2 px-3 text-right whitespace-nowrap">
                    <a href="${c.curriculo_url}" target="_blank" class="bg-brandLight text-brand hover:bg-brand hover:text-white px-2.5 py-1 rounded transition font-bold text-xs inline-block mr-1 shadow-sm border border-brand/20"><i class="fa-solid fa-file-pdf mr-1"></i> CV</a>
                    <form action="/admin/candidaturas/delete/${c.id}" method="POST" class="inline" onsubmit="return confirm('Excluir este candidato?')">
                        <button type="submit" class="text-red-500 hover:text-red-700 bg-red-50 px-2.5 py-1 text-xs rounded"><i class="fa-solid fa-trash"></i></button>
                    </form>
                </td>
            </tr>
            `;
        }).join('');
    };

    const renderWebhooksList = () => {
        if (webhooks.length === 0) return `<p class="text-gray-400 text-xs p-3 text-center">Nenhuma integração cadastrada.</p>`;
        return webhooks.map(w => {
            const wData = `{ id: ${w.id}, nome: '${w.nome.replace(/'/g, "\\'")}', url: '${w.url.replace(/'/g, "\\'")}', api_key: '${(w.api_key || '').replace(/'/g, "\\'")}' }`;

            return `
            <div class="flex items-center justify-between bg-gray-800/50 p-2.5 rounded-lg border border-gray-700 mb-2">
                <div class="flex-1 pr-2 overflow-hidden">
                    <p class="font-bold text-brand text-xs flex items-center">
                        ${w.nome} 
                        <span class="${w.ativo == 0 ? 'bg-gray-700 text-gray-400' : 'bg-brand/10 text-brand'} text-[9px] px-1.5 py-0.5 rounded-full ml-2 uppercase tracking-wide">
                            ${w.ativo == 0 ? 'Pausado' : 'Ativo'}
                        </span>
                    </p>
                    <p class="text-[10px] text-gray-400 mt-0.5 truncate" title="${w.url}">${w.url}</p>
                </div>
                <div class="flex items-center space-x-1.5">
                    <form action="/admin/webhooks/toggle/${w.id}" method="POST" class="m-0 flex items-center mr-1">
                        <label class="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" name="ativo" class="sr-only peer" ${w.ativo == 0 ? '' : 'checked'} onchange="this.form.submit()">
                            <div class="w-7 h-4 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-brand"></div>
                        </label>
                    </form>
                    
                    <button type="button" onclick="abrirModalEditarWebhook(${wData})" class="text-blue-400 bg-blue-400/10 hover:bg-blue-400/20 transition text-[10px] w-6 h-6 flex items-center justify-center rounded">
                        <i class="fa-solid fa-pen"></i>
                    </button>

                    <form action="/admin/webhooks/delete/${w.id}" method="POST" class="m-0 flex items-center" onsubmit="return confirm('Excluir esta integração permanentemente?')">
                        <button type="submit" class="text-red-400 bg-red-400/10 hover:bg-red-400/20 transition text-[10px] w-6 h-6 flex items-center justify-center rounded">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </form>
                </div>
            </div>
            `;
        }).join('');
    };

    const renderRow = (arr, type, deleteRoute) => {
        if(arr.length === 0) return `<tr><td colspan="3" class="p-5 text-center text-gray-400 text-sm">Nenhum item cadastrado.</td></tr>`;
        return arr.map(item => {
            const itemData = `{ id: ${item.id}, secao: '${item.secao}', nome: '${item.nome.replace(/'/g, "\\'")}', tamanho: '${(item.tamanho || '').replace(/'/g, "\\'")}' }`;
            const editFunction = type === 'modelo' ? `abrirModalEditarModelo(${itemData})` : `abrirModalEditarMaterial(${itemData})`;

            return `
            <tr class="border-b border-gray-100 hover:bg-gray-50 transition text-[13px]">
                <td class="py-2 px-3 font-bold text-gray-800">${item.nome} ${item.tamanho ? `<span class="block text-[11px] text-gray-500 font-normal">Tam: ${item.tamanho}</span>` : ''}</td>
                <td class="py-2 px-3"><span class="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase">${item.secao}</span></td>
                <td class="py-2 px-3 text-right whitespace-nowrap">
                    <button type="button" onclick="${editFunction}" class="text-blue-500 hover:text-blue-700 bg-blue-50 px-2.5 py-1 rounded text-xs mr-1 transition"><i class="fa-solid fa-pen"></i></button>
                    <form action="${deleteRoute}/${item.id}" method="POST" class="inline" onsubmit="return confirm('Excluir este item?')">
                        <button type="submit" class="text-red-500 hover:text-red-700 bg-red-50 px-2.5 py-1 rounded text-xs transition"><i class="fa-solid fa-trash"></i></button>
                    </form>
                </td>
            </tr>
            `;
        }).join('');
    };

    const renderProdutosRow = (secaoFiltro, badgeColor, badgeLabel) => {
        return produtos.filter(p => p.secao === secaoFiltro).map(p => {
            const pData = `{ id: ${p.id}, secao: '${p.secao}', titulo: '${p.titulo.replace(/'/g, "\\'")}', descricao: '${p.descricao.replace(/\r?\n|\r/g, ' ').replace(/'/g, "\\'")}' }`;

            return `
            <tr class="border-b border-gray-100 hover:bg-gray-50 transition text-sm">
                <td class="py-2 px-3 flex items-center">
                    <img src="${p.imagem_url}" class="w-10 h-10 rounded object-cover mr-3 shadow-sm border" alt="${p.titulo}">
                    <div>
                        <p class="font-bold text-gray-800 text-[13px]">${p.titulo}</p>
                        <p class="text-[11px] text-gray-500 truncate w-40">${p.descricao}</p>
                    </div>
                </td>
                <td class="py-2 px-3"><span class="bg-${badgeColor}-100 text-${badgeColor}-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase">${badgeLabel}</span></td>
                <td class="py-2 px-3 text-right whitespace-nowrap">
                    <button type="button" onclick="abrirModalEditarProduto(${pData})" class="text-blue-500 hover:text-blue-700 bg-blue-50 px-2.5 py-1 rounded text-xs mr-1 transition"><i class="fa-solid fa-pen"></i></button>
                    <form action="/admin/produtos/delete/${p.id}" method="POST" class="inline" onsubmit="return confirm('Tem certeza que deseja excluir esta caixa?')">
                        <button type="submit" class="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-2.5 py-1 rounded text-xs transition"><i class="fa-solid fa-trash"></i></button>
                    </form>
                </td>
            </tr>
            `;
        }).join('');
    };

    const renderNoticiasRow = () => {
        return noticias.map(n => `
            <tr class="border-b border-gray-100 hover:bg-gray-50 transition text-sm">
                <td class="py-2 px-3">
                    <p class="font-bold text-gray-800 text-[13px]">${n.titulo}</p>
                    <p class="text-[11px] text-gray-500 truncate w-48">${n.descricao}</p>
                </td>
                <td class="py-2 px-3">
                    <span class="${n.tipo === 'promocao' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'} px-2 py-0.5 rounded text-[10px] font-bold uppercase">${n.tipo}</span>
                </td>
                <td class="py-2 px-3 text-right">
                    <form action="/admin/noticias/delete/${n.id}" method="POST" class="inline" onsubmit="return confirm('Tem certeza que deseja excluir este aviso?')">
                        <button type="submit" class="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-2.5 py-1 rounded text-xs transition"><i class="fa-solid fa-trash"></i></button>
                    </form>
                </td>
            </tr>
        `).join('');
    };

    const renderPopupRow = () => {
        if(popups.length === 0) return `<tr><td colspan="4" class="p-5 text-center text-gray-400 text-sm">Nenhum pop-up ativo ou programado.</td></tr>`;
        return popups.map(p => {
            const dataIn = new Date(p.data_inicio).toLocaleDateString('pt-BR');
            const dataFim = new Date(p.data_fim).toLocaleDateString('pt-BR');
            return `
            <tr class="border-b border-gray-100 hover:bg-gray-50 transition text-[13px]">
                <td class="py-2 px-3">
                    <p class="font-bold text-gray-800">${p.titulo}</p>
                    <p class="text-[11px] text-gray-500">Tipo: <span class="uppercase">${p.tipo_conteudo}</span></p>
                </td>
                <td class="py-2 px-3 text-xs font-bold text-gray-600">${dataIn} a ${dataFim}</td>
                <td class="py-2 px-3 text-right">
                    <form action="/admin/popup/delete/${p.id}" method="POST" class="inline" onsubmit="return confirm('Tem certeza que deseja excluir esta notificação?')">
                        <button type="submit" class="text-red-500 hover:text-red-700 bg-red-50 px-2.5 py-1 rounded text-xs"><i class="fa-solid fa-trash"></i></button>
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
            .tab-content.active { display: block; animation: fadeIn 0.2s ease-in-out; }
            @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
            .tab-btn.active { border-bottom-width: 3px; border-color: #029723; color: #029723; background-color: #e6f5e9; }
            input[type=file]::file-selector-button { margin-right: 8px; border: none; background: #029723; padding: 6px 12px; border-radius: 6px; color: #fff; cursor: pointer; font-weight: bold; transition: background .2s ease-in-out; font-size: 12px; }
            input[type=file]::file-selector-button:hover { background: #015e15; }
        </style>
    </head>
    <body class="text-gray-800 flex h-screen overflow-hidden bg-gray-50">

        <div id="mobileOverlay" class="fixed inset-0 bg-gray-900/60 z-30 hidden lg:hidden backdrop-blur-sm transition-opacity opacity-0" onclick="toggleAdminMenu()"></div>

        <aside id="adminSidebar" class="w-56 flex-shrink-0 bg-gray-900 text-white flex flex-col shadow-xl z-40 absolute inset-y-0 left-0 transform -translate-x-full transition-transform duration-300 lg:relative lg:translate-x-0">
            <div class="p-4 border-b border-gray-800 flex items-center justify-between">
                <div class="flex items-center">
                    <img src="/logo.png" alt="Logo Ecocaixas" class="h-6 w-auto mr-2.5">
                    <span class="text-lg font-black tracking-tight">EcoAdmin</span>
                </div>
                <button class="lg:hidden text-gray-400 hover:text-white" onclick="toggleAdminMenu()">
                    <i class="fa-solid fa-xmark text-xl"></i>
                </button>
            </div>
            <nav class="flex-grow p-3 space-y-1.5 overflow-y-auto">
                <button onclick="openTab('tab-produtos', this)" class="tab-btn active w-full flex items-center px-3 py-2.5 rounded-lg text-sm text-left font-bold transition-colors hover:bg-gray-800">
                    <i class="fa-solid fa-boxes-packing w-5 text-center mr-1"></i> Catálogo
                </button>
                <button onclick="openTab('tab-empresa', this)" class="tab-btn w-full flex items-center px-3 py-2.5 rounded-lg text-sm text-left font-bold text-gray-400 transition-colors hover:bg-gray-800">
                    <i class="fa-solid fa-industry w-5 text-center mr-1"></i> Empresa
                </button>
                <button onclick="openTab('tab-mural', this)" class="tab-btn w-full flex items-center px-3 py-2.5 rounded-lg text-sm text-left font-bold text-gray-400 transition-colors hover:bg-gray-800">
                    <i class="fa-solid fa-bullhorn w-5 text-center mr-1"></i> Mural
                </button>
                <button onclick="openTab('tab-form', this)" class="tab-btn w-full flex items-center px-3 py-2.5 rounded-lg text-sm text-left font-bold text-gray-400 transition-colors hover:bg-gray-800">
                    <i class="fa-solid fa-clipboard-list w-5 text-center mr-1"></i> Opções Form
                </button>
                <div class="h-px bg-gray-800 my-1.5"></div>
                <button onclick="openTab('tab-popup', this)" class="tab-btn w-full flex items-center px-3 py-2.5 rounded-lg text-sm text-left font-bold text-gray-400 transition-colors hover:bg-gray-800">
                    <i class="fa-solid fa-window-restore w-5 text-center mr-1"></i> Pop-ups
                </button>
                <button onclick="openTab('tab-vagas', this)" class="tab-btn w-full flex items-center px-3 py-2.5 rounded-lg text-sm text-left font-bold text-gray-400 transition-colors hover:bg-gray-800">
                    <i class="fa-solid fa-briefcase w-5 text-center mr-1"></i> Vagas
                </button>
            </nav>
            <div class="p-3 border-t border-gray-800">
                <a href="/" target="_blank" class="flex items-center justify-center w-full bg-brand hover:bg-brandDark text-white py-1.5 rounded-lg text-sm font-bold transition-colors">
                    <i class="fa-solid fa-arrow-up-right-from-square mr-1.5 text-xs"></i> Ver Site
                </a>
                <a href="/logout" class="flex items-center justify-center w-full bg-red-500 hover:bg-red-600 text-white py-1.5 rounded-lg text-sm font-bold transition-colors mt-1.5">
                    <i class="fa-solid fa-power-off mr-1.5 text-xs"></i> Sair
                </a>
            </div>
        </aside>

        <div class="flex-1 flex flex-col overflow-hidden relative w-full">
            <header class="bg-white shadow-sm border-b border-gray-200 p-3 flex items-center justify-between lg:hidden z-20">
                <div class="flex items-center">
                    <img src="/logo.png" alt="Logo" class="h-6 w-auto mr-2">
                    <span class="text-base font-black text-gray-800">EcoAdmin</span>
                </div>
                <button class="text-gray-800 focus:outline-none bg-gray-100 w-8 h-8 rounded-lg flex items-center justify-center" onclick="toggleAdminMenu()">
                    <i class="fa-solid fa-bars text-lg"></i>
                </button>
            </header>

            <main class="flex-1 overflow-y-auto p-4 lg:p-6 relative w-full">
                
                <div class="max-w-7xl mx-auto w-full"> 
                
                <header class="mb-4 lg:mb-6 flex justify-between items-center">
                    <div>
                        <h2 class="text-xl lg:text-2xl font-black text-gray-800">Gestão de Conteúdo</h2>
                        <p class="text-gray-500 text-xs lg:text-sm">Atualize os dados do site em tempo real.</p>
                    </div>
                </header>

            <section id="tab-produtos" class="tab-content active">
                <div class="grid lg:grid-cols-3 gap-5">
                    <div class="lg:col-span-1 bg-white p-5 rounded-xl shadow-sm border border-gray-200 h-fit">
                        <h3 class="text-lg font-bold mb-3 flex items-center border-b pb-2"><i class="fa-solid fa-plus-circle text-brand mr-2"></i> Adicionar Card</h3>
                        <form action="/admin/produtos/add" method="POST" enctype="multipart/form-data">
                            <div class="mb-3">
                                <label class="block text-[10px] font-bold text-gray-500 uppercase mb-1">Seção do Site</label>
                                <select name="secao" class="w-full bg-gray-50 border border-gray-300 rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-brand outline-none text-sm font-medium" required>
                                    <option value="destaque">Destaques (Topo)</option>
                                    <option value="alimenticio">Linha Alimentícia</option>
                                    <option value="industrial">Linha Industrial</option>
                                </select>
                            </div>
                            <div class="mb-3">
                                <label class="block text-[10px] font-bold text-gray-500 uppercase mb-1">Título</label>
                                <input type="text" name="titulo" class="w-full bg-gray-50 border border-gray-300 rounded-lg px-2.5 py-1.5 outline-none text-sm" required placeholder="Ex: Caixa Maleta">
                            </div>
                            <div class="mb-3">
                                <label class="block text-[10px] font-bold text-gray-500 uppercase mb-1">Descrição</label>
                                <textarea name="descricao" rows="2" class="w-full bg-gray-50 border border-gray-300 rounded-lg px-2.5 py-1.5 outline-none text-sm" required placeholder="Detalhes..."></textarea>
                            </div>
                            <div class="mb-4">
                                <label class="block text-[10px] font-bold text-gray-500 uppercase mb-1">Imagem</label>
                                <input type="file" name="imagem" accept="image/*" class="w-full bg-gray-50 border border-gray-300 rounded-lg p-1.5 text-xs text-gray-600 outline-none" required>
                            </div>
                            <button type="submit" class="w-full bg-brand text-white font-bold py-2 rounded-lg text-sm hover:bg-brandDark transition shadow">Salvar Card</button>
                        </form>
                    </div>

                    <div class="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div class="p-3.5 border-b bg-gray-50"><h3 class="font-bold text-gray-700 text-sm">Cards Cadastrados</h3></div>
                        <div class="overflow-x-auto max-h-[500px] overflow-y-auto">
                            <table class="w-full text-left border-collapse">
                                <thead>
                                    <tr class="bg-gray-100 text-gray-500 text-[10px] uppercase">
                                        <th class="py-2 px-3 font-bold">Imagem e Título</th>
                                        <th class="py-2 px-3 font-bold">Seção</th>
                                        <th class="py-2 px-3 font-bold text-right">Ação</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${produtos.length > 0 ? renderProdutosRow('destaque', 'blue', 'Destaque') + renderProdutosRow('alimenticio', 'green', 'Alimentício') + renderProdutosRow('industrial', 'gray', 'Industrial') : '<tr><td colspan="3" class="p-5 text-center text-gray-400 text-sm">Nenhuma caixa cadastrada.</td></tr>'}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section>

            <section id="tab-empresa" class="tab-content">
                <form action="/admin/empresa/update" method="POST" enctype="multipart/form-data" class="bg-white p-6 rounded-xl shadow-sm border border-gray-200 max-w-3xl mx-auto">
                    <h3 class="text-xl font-black mb-5 border-b pb-3 text-gray-800"><i class="fa-solid fa-industry text-brand mr-2"></i> Atualizar Dados da Fábrica</h3>
                    
                    <div class="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label class="block text-[10px] font-bold text-gray-500 uppercase mb-1">Anos de História</label>
                            <input type="number" name="anos_historia" value="${stats.anos_historia || 0}" class="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 outline-none font-bold text-base" required>
                        </div>
                        <div>
                            <label class="block text-[10px] font-bold text-gray-500 uppercase mb-1">Caixas Produzidas (Total)</label>
                            <input type="number" name="caixas_vendidas" value="${stats.caixas_vendidas || 0}" class="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 outline-none font-bold text-base" required>
                        </div>
                    </div>

                    <div class="mb-4">
                        <label class="block text-[10px] font-bold text-gray-500 uppercase mb-1">Título da Seção História</label>
                        <input type="text" name="titulo_historia" value="${empresaInfo.titulo || ''}" class="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 outline-none font-bold text-sm" required>
                    </div>

                    <div class="mb-6">
                        <label class="block text-[10px] font-bold text-gray-500 uppercase mb-1">Texto da História</label>
                        <textarea name="texto_historia" rows="5" class="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 outline-none text-sm" required>${empresaInfo.texto_historia || ''}</textarea>
                    </div>

                    <h4 class="font-bold text-gray-700 text-sm mb-3 border-b pb-2"><i class="fa-solid fa-images mr-1.5"></i>Imagens do Mosaico</h4>
                    
                    <div class="grid md:grid-cols-3 gap-4 mb-6">
                        <div class="bg-gray-50 p-3 rounded-lg border border-gray-200">
                            <label class="block text-[10px] font-bold text-gray-600 mb-1.5">Principal (Fundo)</label>
                            ${empresaInfo.img_mosaico_1 ? `<img src="${empresaInfo.img_mosaico_1}" class="h-16 w-full object-cover rounded mb-2 shadow-sm">` : ''}
                            <input type="file" name="img_mosaico_1" accept="image/*" class="text-[10px] w-full text-gray-500">
                        </div>
                        <div class="bg-gray-50 p-3 rounded-lg border border-gray-200">
                            <label class="block text-[10px] font-bold text-gray-600 mb-1.5">Menor 1 (Esq)</label>
                            ${empresaInfo.img_mosaico_2 ? `<img src="${empresaInfo.img_mosaico_2}" class="h-16 w-full object-cover rounded mb-2 shadow-sm">` : ''}
                            <input type="file" name="img_mosaico_2" accept="image/*" class="text-[10px] w-full text-gray-500">
                        </div>
                        <div class="bg-gray-50 p-3 rounded-lg border border-gray-200">
                            <label class="block text-[10px] font-bold text-gray-600 mb-1.5">Menor 2 (Dir)</label>
                            ${empresaInfo.img_mosaico_3 ? `<img src="${empresaInfo.img_mosaico_3}" class="h-16 w-full object-cover rounded mb-2 shadow-sm">` : ''}
                            <input type="file" name="img_mosaico_3" accept="image/*" class="text-[10px] w-full text-gray-500">
                        </div>
                    </div>

                    <button type="submit" class="w-full bg-brand text-white font-bold py-2.5 rounded-lg text-sm hover:bg-brandDark transition shadow"><i class="fa-solid fa-save mr-1.5"></i> Salvar Empresa</button>
                </form>
            </section>

            <section id="tab-mural" class="tab-content">
                <div class="grid lg:grid-cols-3 gap-5">
                    <div class="lg:col-span-1 bg-white p-5 rounded-xl shadow-sm border border-gray-200 h-fit">
                        <h3 class="text-lg font-bold mb-3 flex items-center border-b pb-2"><i class="fa-solid fa-bullhorn text-brand mr-2"></i> Postar no Mural</h3>
                        <form action="/admin/noticias/add" method="POST">
                            <div class="mb-3">
                                <label class="block text-[10px] font-bold text-gray-500 uppercase mb-1">Tipo de Postagem</label>
                                <select name="tipo" class="w-full bg-gray-50 border border-gray-300 rounded-lg px-2.5 py-1.5 outline-none text-sm font-medium" required>
                                    <option value="noticia">Notícia / Aviso</option>
                                    <option value="promocao">Promoção</option>
                                </select>
                            </div>
                            <div class="mb-3">
                                <label class="block text-[10px] font-bold text-gray-500 uppercase mb-1">Título</label>
                                <input type="text" name="titulo" class="w-full bg-gray-50 border border-gray-300 rounded-lg px-2.5 py-1.5 outline-none text-sm" required placeholder="Nova máquina...">
                            </div>
                            <div class="mb-4">
                                <label class="block text-[10px] font-bold text-gray-500 uppercase mb-1">Texto</label>
                                <textarea name="descricao" rows="3" class="w-full bg-gray-50 border border-gray-300 rounded-lg px-2.5 py-1.5 outline-none text-sm" required placeholder="Detalhes..."></textarea>
                            </div>
                            <button type="submit" class="w-full bg-gray-800 text-white font-bold py-2 rounded-lg text-sm hover:bg-gray-900 transition shadow">Publicar</button>
                        </form>
                    </div>

                    <div class="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div class="p-3.5 border-b bg-gray-50"><h3 class="font-bold text-gray-700 text-sm">Mural Ativo</h3></div>
                        <div class="overflow-x-auto max-h-[500px] overflow-y-auto">
                            <table class="w-full text-left border-collapse">
                                <thead>
                                    <tr class="bg-gray-100 text-gray-500 text-[10px] uppercase">
                                        <th class="py-2 px-3 font-bold">Aviso</th>
                                        <th class="py-2 px-3 font-bold">Tipo</th>
                                        <th class="py-2 px-3 font-bold text-right">Ação</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${noticias.length > 0 ? renderNoticiasRow() : '<tr><td colspan="3" class="p-5 text-center text-gray-400 text-sm">Mural vazio.</td></tr>'}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section>

            <section id="tab-form" class="tab-content">
                <div class="grid lg:grid-cols-2 gap-5">
                    
                    <div class="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                        <h3 class="text-lg font-bold mb-3 flex items-center border-b pb-2"><i class="fa-solid fa-box text-brand mr-2"></i> Modelos / Tamanhos</h3>
                        <form action="/admin/form/modelo/add" method="POST" class="mb-5 bg-gray-50 p-3.5 rounded-lg border border-gray-200">
                            <div class="grid grid-cols-2 gap-3 mb-3">
                                <div>
                                    <label class="block text-[10px] font-bold text-gray-500 uppercase mb-1">Setor</label>
                                    <select name="secao" class="w-full border-gray-300 rounded-lg px-2.5 py-1.5 outline-none text-sm">
                                        <option value="alimenticio">Alimentício</option>
                                        <option value="industrial">Industrial</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="block text-[10px] font-bold text-gray-500 uppercase mb-1">Nome do Modelo</label>
                                    <input type="text" name="nome" class="w-full border-gray-300 rounded-lg px-2.5 py-1.5 outline-none text-sm" required placeholder="Ex: Caixa Pizza">
                                </div>
                            </div>
                            <div class="mb-3">
                                <label class="block text-[10px] font-bold text-gray-500 uppercase mb-1">Tamanho Automático</label>
                                <input type="text" name="tamanho" class="w-full border-gray-300 rounded-lg px-2.5 py-1.5 outline-none text-sm" required placeholder="Ex: 35x35x4 cm">
                            </div>
                            <button type="submit" class="w-full bg-gray-800 text-white font-bold py-1.5 text-sm rounded-lg hover:bg-gray-900 transition">Adicionar Modelo</button>
                        </form>
                        
                        <div class="overflow-y-auto max-h-64 border rounded-lg">
                            <table class="w-full text-left border-collapse">
                                <thead class="bg-gray-100 text-[10px] text-gray-500 uppercase sticky top-0">
                                    <tr>
                                        <th class="py-1.5 px-3">Modelo</th>
                                        <th class="py-1.5 px-3">Setor</th>
                                        <th class="py-1.5 px-3 text-right">Ação</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${renderRow(formModelos, 'modelo', '/admin/form/modelo/delete')}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div class="bg-white p-5 rounded-xl shadow-sm border border-gray-200 h-fit">
                        <h3 class="text-lg font-bold mb-3 flex items-center border-b pb-2"><i class="fa-solid fa-layer-group text-brand mr-2"></i> Materiais</h3>
                        <form action="/admin/form/material/add" method="POST" class="mb-5 bg-gray-50 p-3.5 rounded-lg border border-gray-200">
                            <div class="mb-3">
                                <label class="block text-[10px] font-bold text-gray-500 uppercase mb-1">Disponível para</label>
                                <select name="secao" class="w-full border-gray-300 rounded-lg px-2.5 py-1.5 outline-none text-sm">
                                    <option value="ambos">Ambos</option>
                                    <option value="alimenticio">Apenas Alimentício</option>
                                    <option value="industrial">Apenas Industrial</option>
                                </select>
                            </div>
                            <div class="mb-3">
                                <label class="block text-[10px] font-bold text-gray-500 uppercase mb-1">Nome do Material</label>
                                <input type="text" name="nome" class="w-full border-gray-300 rounded-lg px-2.5 py-1.5 outline-none text-sm" required placeholder="Ex: Pardo (KRAFT)">
                            </div>
                            <button type="submit" class="w-full bg-gray-800 text-white font-bold py-1.5 text-sm rounded-lg hover:bg-gray-900 transition">Adicionar Material</button>
                        </form>
                        
                        <div class="overflow-y-auto max-h-64 border rounded-lg">
                            <table class="w-full text-left border-collapse">
                                <thead class="bg-gray-100 text-[10px] text-gray-500 uppercase sticky top-0">
                                    <tr>
                                        <th class="py-1.5 px-3">Material</th>
                                        <th class="py-1.5 px-3">Setor</th>
                                        <th class="py-1.5 px-3 text-right">Ação</th>
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
                <div class="grid lg:grid-cols-3 gap-5">
                    
                    <div class="lg:col-span-1 bg-white p-5 rounded-xl shadow-sm border border-gray-200 h-fit">
                        <h3 class="text-lg font-bold mb-3 flex items-center border-b pb-2"><i class="fa-solid fa-window-restore text-brand mr-2"></i> Criar Pop-up</h3>
                        <form action="/admin/popup/add" method="POST" enctype="multipart/form-data">
                            <div class="mb-3">
                                <label class="block text-[10px] font-bold text-gray-500 uppercase mb-1">Título do Pop-up</label>
                                <input type="text" name="titulo" class="w-full bg-gray-50 border border-gray-300 rounded-lg px-2.5 py-1.5 outline-none text-sm" required placeholder="Ex: Recesso">
                            </div>
                            <div class="grid grid-cols-2 gap-3 mb-3">
                                <div>
                                    <label class="block text-[10px] font-bold text-gray-500 uppercase mb-1">Início</label>
                                    <input type="date" name="data_inicio" class="w-full bg-gray-50 border border-gray-300 rounded-lg px-2.5 py-1.5 outline-none text-xs" required>
                                </div>
                                <div>
                                    <label class="block text-[10px] font-bold text-gray-500 uppercase mb-1">Fim</label>
                                    <input type="date" name="data_fim" class="w-full bg-gray-50 border border-gray-300 rounded-lg px-2.5 py-1.5 outline-none text-xs" required>
                                </div>
                            </div>
                            
                            <div class="mb-3">
                                <label class="block text-[10px] font-bold text-gray-500 uppercase mb-1">Tipo de Conteúdo</label>
                                <select name="tipo_conteudo" id="popup_tipo" class="w-full bg-gray-50 border border-gray-300 rounded-lg px-2.5 py-1.5 outline-none font-medium text-sm" onchange="togglePopupInput()" required>
                                    <option value="texto">Texto</option>
                                    <option value="imagem">Imagem</option>
                                </select>
                            </div>
                            
                            <div id="popup_texto_container" class="mb-4">
                                <label class="block text-[10px] font-bold text-gray-500 uppercase mb-1">Texto</label>
                                <textarea name="texto_conteudo" rows="3" class="w-full bg-gray-50 border border-gray-300 rounded-lg px-2.5 py-1.5 outline-none text-sm" placeholder="Aviso..."></textarea>
                            </div>

                            <div id="popup_imagem_container" class="mb-4" style="display: none;">
                                <label class="block text-[10px] font-bold text-gray-500 uppercase mb-1">Upload</label>
                                <input type="file" name="imagem_popup" accept="image/*" class="w-full bg-gray-50 border border-gray-300 rounded-lg p-1.5 text-xs text-gray-600 outline-none">
                            </div>
                            
                            <button type="submit" class="w-full bg-brand text-white font-bold py-2 rounded-lg text-sm hover:bg-brandDark transition shadow">Programar</button>
                        </form>
                    </div>

                    <div class="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div class="p-3.5 border-b bg-gray-50"><h3 class="font-bold text-gray-700 text-sm">Pop-ups Programados</h3></div>
                        <div class="overflow-x-auto max-h-[500px] overflow-y-auto">
                            <table class="w-full text-left border-collapse">
                                <thead>
                                    <tr class="bg-gray-100 text-gray-500 text-[10px] uppercase">
                                        <th class="py-2 px-3 font-bold">Título / Conteúdo</th>
                                        <th class="py-2 px-3 font-bold">Período</th>
                                        <th class="py-2 px-3 font-bold text-right">Ação</th>
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
                
                <div class="grid lg:grid-cols-2 gap-5 mb-5">
                    
                    <div class="bg-gray-900 p-5 rounded-xl shadow-sm border border-gray-700 h-fit">
                        <div class="flex items-center justify-between mb-3 border-b border-gray-700 pb-2">
                            <h3 class="font-bold text-white flex items-center text-sm">
                                <i class="fa-solid fa-envelope text-brand mr-1.5"></i> E-mail de Recebimento
                                
                                <div class="relative group cursor-help ml-2 flex items-center">
                                    <i class="fa-solid fa-circle-info text-gray-500 hover:text-brand transition text-xs"></i>
                                    <div class="absolute left-0 sm:-left-4 top-5 w-56 p-2 bg-gray-800 text-[10px] text-gray-200 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 border border-gray-600 pointer-events-none">
                                        Destino dos currículos enviados pelo site.
                                    </div>
                                </div>
                            </h3>
                        </div>
                        
                        <form action="/admin/config/email_vagas" method="POST" class="flex flex-col sm:flex-row gap-2.5 mt-1">
                            <input type="email" name="email_vagas" value="${configs.email_vagas || 'designecocaixasba@gmail.com'}" class="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-3 py-1.5 outline-none font-medium text-white placeholder-gray-400 text-sm focus:ring-1 focus:ring-brand" required placeholder="rh@ecocaixas.com.br">
                            <button type="submit" class="bg-brand text-white font-bold py-1.5 px-4 rounded-lg hover:bg-brandDark transition text-sm">Salvar</button>
                        </form>
                    </div>

                    <div class="bg-gray-900 p-5 rounded-xl shadow-sm border border-gray-700 h-fit">
                        <div class="flex items-center justify-between mb-3 border-b border-gray-700 pb-2">
                            <h3 class="font-bold text-white flex items-center text-sm">
                                <i class="fa-solid fa-plug text-brand mr-1.5"></i> Integrações
                            </h3>
                            <button type="button" onclick="abrirModalWebhook()" class="bg-brand/10 hover:bg-brand/20 text-brand font-bold py-1 px-2.5 rounded text-[11px] flex items-center">
                                <i class="fa-solid fa-plus mr-1"></i> Nova
                            </button>
                        </div>
                        <div class="max-h-48 overflow-y-auto pr-1">
                            ${renderWebhooksList()}
                        </div>
                    </div>
                </div>

                <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-5">
                    <div class="p-3.5 border-b bg-gray-50 flex justify-between items-center">
                        <h3 class="font-bold text-gray-700 text-sm"><i class="fa-solid fa-briefcase text-brand mr-1.5"></i> Vagas Anunciadas</h3>
                        <button type="button" onclick="abrirModalAddVaga()" class="bg-brand hover:bg-brandDark text-white font-bold py-1.5 px-3 rounded-lg transition text-xs flex items-center shadow-sm">
                            <i class="fa-solid fa-plus mr-1.5"></i> Nova Vaga
                        </button>
                    </div>
                    <div class="overflow-x-auto max-h-[350px] overflow-y-auto">
                        <table class="w-full text-left border-collapse">
                            <thead class="sticky top-0 bg-gray-100 z-10 text-gray-500 text-[10px] uppercase">
                                <tr>
                                    <th class="py-2 px-3 font-bold">Vaga</th>
                                    <th class="py-2 px-3 font-bold">Período</th>
                                    <th class="py-2 px-3 font-bold text-center">Status</th>
                                    <th class="py-2 px-3 font-bold text-right">Ação</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${renderVagasRow()}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    
                    <div class="p-3.5 border-b bg-gray-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                        <div class="flex items-center">
                            <h3 class="font-bold text-gray-700 text-sm"><i class="fa-solid fa-users text-brand mr-1.5"></i> Candidatos</h3>
                            <span id="contadorCandidatos" class="bg-brandLight text-brand text-[10px] font-bold px-2 py-0.5 rounded-full ml-2">${candidaturas.length} CVs</span>
                        </div>
                        
                        <div class="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                            <div class="relative w-full sm:w-48">
                                <div class="absolute inset-y-0 left-0 flex items-center pl-2.5 pointer-events-none">
                                    <i class="fa-solid fa-search text-gray-400 text-[10px]"></i>
                                </div>
                                <input type="text" id="filtroNomeCandidato" onkeyup="filtrarCandidatos()" class="bg-white border border-gray-300 text-gray-700 text-xs rounded-lg focus:ring-1 focus:ring-brand block w-full pl-7 p-1.5 outline-none" placeholder="Nome/bairro...">
                            </div>
                            
                            <select id="filtroVagaCandidato" onchange="filtrarCandidatos()" class="bg-white border border-gray-300 text-gray-700 text-xs rounded-lg focus:ring-1 focus:ring-brand block w-full sm:w-40 p-1.5 outline-none cursor-pointer">
                                <option value="todas">Todas Vagas</option>
                                ${vagas.map(v => `<option value="${v.id}">${v.titulo}</option>`).join('')}
                            </select>
                        </div>
                    </div>

                    <div class="overflow-x-auto max-h-[400px] overflow-y-auto">
                        <table class="w-full text-left border-collapse min-w-[700px]">
                            <thead class="sticky top-0 bg-gray-100 z-10 text-gray-500 text-[10px] uppercase shadow-sm">
                                <tr>
                                    <th class="py-2 px-3 font-bold">Candidato</th>
                                    <th class="py-2 px-3 font-bold">Vaga</th>
                                    <th class="py-2 px-3 font-bold">Bairro</th>
                                    <th class="py-2 px-3 font-bold">Contato</th>
                                    <th class="py-2 px-3 font-bold text-right">Currículo</th>
                                </tr>
                            </thead>
                            <tbody id="tabelaCandidatosBody">
                                ${renderCandidaturasRow()}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
            
            </div> <!-- FIM DO NOVO CONTAINER LIMITADOR DE LARGURA -->

            <!-- MODAIS MENORES -->
            <div id="modalEditVaga" class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm hidden z-[100] flex items-center justify-center transition-opacity opacity-0 px-4" style="transition: opacity 0.2s ease;">
                <div class="bg-white rounded-xl max-w-md w-full p-5 relative shadow-xl transform scale-95 transition-transform duration-200 overflow-y-auto max-h-[85vh]" id="modalEditVagaContent">
                    <button type="button" onclick="fecharModalEditarVaga()" class="absolute top-4 right-4 w-8 h-8 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 flex items-center justify-center font-bold text-lg">&times;</button>
                    <h3 class="text-lg font-black text-gray-900 mb-4 border-b pb-2"><i class="fa-solid fa-pen text-blue-500 mr-1.5"></i> Editar Vaga</h3>
                    
                    <form id="formEditVaga" method="POST" enctype="multipart/form-data">
                        <div class="mb-3">
                            <label class="block text-[10px] font-bold text-gray-500 uppercase mb-1">Título</label>
                            <input type="text" id="editVaga_titulo" name="titulo" class="w-full bg-gray-50 border border-gray-300 rounded-lg px-2.5 py-1.5 outline-none text-sm" required>
                        </div>
                        <div class="grid grid-cols-2 gap-3 mb-3">
                            <div><label class="block text-[10px] font-bold text-gray-500 uppercase mb-1">Salário</label><input type="text" id="editVaga_salario" name="salario" class="w-full bg-gray-50 border border-gray-300 rounded-lg px-2.5 py-1.5 outline-none text-xs" required></div>
                            <div><label class="block text-[10px] font-bold text-gray-500 uppercase mb-1">Local</label><input type="text" id="editVaga_local" name="local_residencia" class="w-full bg-gray-50 border border-gray-300 rounded-lg px-2.5 py-1.5 outline-none text-xs" required></div>
                        </div>
                        <div class="mb-3">
                            <label class="block text-[10px] font-bold text-gray-500 uppercase mb-1">Horário</label>
                            <input type="text" id="editVaga_disp" name="disponibilidade" class="w-full bg-gray-50 border border-gray-300 rounded-lg px-2.5 py-1.5 outline-none text-xs" required>
                        </div>
                        <div class="grid grid-cols-2 gap-3 mb-3">
                            <div><label class="block text-[10px] font-bold text-gray-500 uppercase mb-1">Conhecimento</label><input type="text" id="editVaga_conhec" name="conhecimento" class="w-full bg-gray-50 border border-gray-300 rounded-lg px-2.5 py-1.5 outline-none text-xs" required></div>
                            <div><label class="block text-[10px] font-bold text-gray-500 uppercase mb-1">Experiência</label><input type="text" id="editVaga_exp" name="experiencia" class="w-full bg-gray-50 border border-gray-300 rounded-lg px-2.5 py-1.5 outline-none text-xs" required></div>
                        </div>
                        <div class="mb-3">
                            <label class="block text-[10px] font-bold text-gray-500 uppercase mb-1">Benefícios</label>
                            <textarea id="editVaga_ben" name="beneficios" rows="2" class="w-full bg-gray-50 border border-gray-300 rounded-lg px-2.5 py-1.5 outline-none text-xs" required></textarea>
                        </div>
                        <div class="grid grid-cols-2 gap-3 mb-3">
                            <div><label class="block text-[10px] font-bold text-gray-500 uppercase mb-1">Início</label><input type="date" id="editVaga_dIn" name="data_inicio" class="w-full bg-gray-50 border border-gray-300 rounded-lg px-2.5 py-1.5 outline-none text-xs" required></div>
                            <div><label class="block text-[10px] font-bold text-gray-500 uppercase mb-1">Fim</label><input type="date" id="editVaga_dFim" name="data_fim" class="w-full bg-gray-50 border border-gray-300 rounded-lg px-2.5 py-1.5 outline-none text-xs" required></div>
                        </div>
                        <div class="mb-4">
                            <label class="block text-[10px] font-bold text-gray-500 uppercase mb-1">Banner (Opcional)</label>
                            <input type="file" name="imagem_banner" accept="image/*" class="w-full bg-gray-50 border border-gray-300 rounded-lg p-1.5 text-xs text-gray-500 outline-none">
                        </div>
                        <button type="submit" class="w-full bg-blue-500 text-white font-bold py-2 rounded-lg text-sm hover:bg-blue-600 transition">Salvar Alterações</button>
                    </form>
                </div>
            </div>

            <div id="modalEditProduto" class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm hidden z-[100] flex items-center justify-center transition-opacity opacity-0 px-4" style="transition: opacity 0.2s ease;">
                <div class="bg-white rounded-xl max-w-md w-full p-5 relative shadow-xl transform scale-95 transition-transform duration-200">
                    <button type="button" onclick="fecharModalEditarProduto()" class="absolute top-4 right-4 w-8 h-8 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 flex items-center justify-center font-bold text-lg">&times;</button>
                    <h3 class="text-lg font-black text-gray-900 mb-4 border-b pb-2"><i class="fa-solid fa-pen text-blue-500 mr-1.5"></i> Editar Card</h3>
                    
                    <form id="formEditProduto" method="POST" enctype="multipart/form-data">
                        <div class="mb-3">
                            <label class="block text-[10px] font-bold text-gray-500 uppercase mb-1">Seção</label>
                            <select id="editProd_secao" name="secao" class="w-full bg-gray-50 border border-gray-300 rounded-lg px-2.5 py-1.5 outline-none text-sm" required>
                                <option value="destaque">Destaques</option>
                                <option value="alimenticio">Alimentício</option>
                                <option value="industrial">Industrial</option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label class="block text-[10px] font-bold text-gray-500 uppercase mb-1">Título</label>
                            <input type="text" id="editProd_titulo" name="titulo" class="w-full bg-gray-50 border border-gray-300 rounded-lg px-2.5 py-1.5 outline-none text-sm" required>
                        </div>
                        <div class="mb-3">
                            <label class="block text-[10px] font-bold text-gray-500 uppercase mb-1">Descrição</label>
                            <textarea id="editProd_descricao" name="descricao" rows="2" class="w-full bg-gray-50 border border-gray-300 rounded-lg px-2.5 py-1.5 outline-none text-sm" required></textarea>
                        </div>
                        <div class="mb-4">
                            <label class="block text-[10px] font-bold text-gray-500 uppercase mb-1">Nova Imagem (Opcional)</label>
                            <input type="file" name="imagem" accept="image/*" class="w-full bg-gray-50 border border-gray-300 rounded-lg p-1.5 text-xs text-gray-500 outline-none">
                        </div>
                        <button type="submit" class="w-full bg-blue-500 text-white font-bold py-2 rounded-lg text-sm hover:bg-blue-600 transition">Salvar</button>
                    </form>
                </div>
            </div>

            <div id="modalAddVaga" class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm hidden z-[100] flex items-center justify-center transition-opacity opacity-0 px-4" style="transition: opacity 0.2s ease;">
                <div class="bg-white rounded-xl max-w-md w-full p-5 relative shadow-xl transform scale-95 transition-transform duration-200 overflow-y-auto max-h-[85vh]" id="modalAddVagaContent">
                    <button type="button" onclick="fecharModalAddVaga()" class="absolute top-4 right-4 w-8 h-8 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 flex items-center justify-center font-bold text-lg">&times;</button>
                    <h3 class="text-lg font-black text-gray-900 mb-4 border-b pb-2"><i class="fa-solid fa-plus-circle text-brand mr-1.5"></i> Nova Vaga</h3>
                    
                    <form action="/admin/vagas/add" method="POST" enctype="multipart/form-data">
                        <div class="mb-3">
                            <label class="block text-[10px] font-bold text-gray-500 uppercase mb-1">Título</label>
                            <input type="text" name="titulo" class="w-full bg-gray-50 border border-gray-300 rounded-lg px-2.5 py-1.5 outline-none text-sm" required>
                        </div>
                        <div class="grid grid-cols-2 gap-3 mb-3">
                            <div><label class="block text-[10px] font-bold text-gray-500 uppercase mb-1">Salário</label><input type="text" name="salario" class="w-full bg-gray-50 border border-gray-300 rounded-lg px-2.5 py-1.5 outline-none text-xs" required></div>
                            <div><label class="block text-[10px] font-bold text-gray-500 uppercase mb-1">Onde Morar</label><input type="text" name="local_residencia" class="w-full bg-gray-50 border border-gray-300 rounded-lg px-2.5 py-1.5 outline-none text-xs" required></div>
                        </div>
                        <div class="mb-3">
                            <label class="block text-[10px] font-bold text-gray-500 uppercase mb-1">Disponibilidade</label>
                            <input type="text" name="disponibilidade" class="w-full bg-gray-50 border border-gray-300 rounded-lg px-2.5 py-1.5 outline-none text-xs" required>
                        </div>
                        <div class="grid grid-cols-2 gap-3 mb-3">
                            <div><label class="block text-[10px] font-bold text-gray-500 uppercase mb-1">Conhecimento</label><input type="text" name="conhecimento" class="w-full bg-gray-50 border border-gray-300 rounded-lg px-2.5 py-1.5 outline-none text-xs" required></div>
                            <div><label class="block text-[10px] font-bold text-gray-500 uppercase mb-1">Experiência</label><input type="text" name="experiencia" class="w-full bg-gray-50 border border-gray-300 rounded-lg px-2.5 py-1.5 outline-none text-xs" required></div>
                        </div>
                        <div class="mb-3">
                            <label class="block text-[10px] font-bold text-gray-500 uppercase mb-1">Benefícios</label>
                            <textarea name="beneficios" rows="2" class="w-full bg-gray-50 border border-gray-300 rounded-lg px-2.5 py-1.5 outline-none text-xs" required></textarea>
                        </div>
                        <div class="grid grid-cols-2 gap-3 mb-3">
                            <div><label class="block text-[10px] font-bold text-gray-500 uppercase mb-1">Início</label><input type="date" name="data_inicio" class="w-full bg-gray-50 border border-gray-300 rounded-lg px-2.5 py-1.5 outline-none text-xs" required></div>
                            <div><label class="block text-[10px] font-bold text-gray-500 uppercase mb-1">Fim</label><input type="date" name="data_fim" class="w-full bg-gray-50 border border-gray-300 rounded-lg px-2.5 py-1.5 outline-none text-xs" required></div>
                        </div>
                        <div class="mb-4">
                            <label class="block text-[10px] font-bold text-gray-500 uppercase mb-1">Banner (Imagem)</label>
                            <input type="file" name="imagem_banner" accept="image/*" class="w-full bg-gray-50 border border-gray-300 rounded-lg p-1.5 text-xs text-gray-600 outline-none" required>
                        </div>
                        <button type="submit" class="w-full bg-brand text-white font-bold py-2 text-sm rounded-lg hover:bg-brandDark transition">Publicar</button>
                    </form>
                </div>
            </div>

            <div id="modalAddWebhook" class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm hidden z-[100] flex items-center justify-center transition-opacity opacity-0 px-4" style="transition: opacity 0.2s ease;">
                <div class="bg-gray-900 rounded-xl max-w-sm w-full p-5 relative shadow-xl border border-gray-700 transform scale-95 transition-transform duration-200">
                    <button type="button" onclick="fecharModalWebhook()" class="absolute top-4 right-4 w-8 h-8 bg-gray-800 rounded-full text-gray-400 hover:bg-gray-700 flex items-center justify-center font-bold text-lg">&times;</button>
                    <h3 class="text-lg font-black text-white mb-4 border-b border-gray-700 pb-2"><i class="fa-solid fa-plug text-brand mr-1.5"></i> Integração</h3>
                    <form action="/admin/webhooks/add" method="POST">
                        <div class="mb-3">
                            <label class="block text-[10px] font-bold text-gray-400 uppercase mb-1">Nome</label>
                            <input type="text" name="nome" class="w-full bg-gray-800 border border-gray-600 rounded-lg px-2.5 py-1.5 outline-none text-white text-sm" required>
                        </div>
                        <div class="mb-3">
                            <label class="block text-[10px] font-bold text-gray-400 uppercase mb-1">URL (Endpoint)</label>
                            <input type="url" name="url" class="w-full bg-gray-800 border border-gray-600 rounded-lg px-2.5 py-1.5 outline-none text-white text-sm" required>
                        </div>
                        <div class="mb-4">
                            <label class="block text-[10px] font-bold text-gray-400 uppercase mb-1">API Key (Opção)</label>
                            <input type="text" name="api_key" class="w-full bg-gray-800 border border-gray-600 rounded-lg px-2.5 py-1.5 outline-none text-white text-sm">
                        </div>
                        <button type="submit" class="w-full bg-brand text-white font-bold py-2 text-sm rounded-lg hover:bg-brandDark transition">Salvar</button>
                    </form>
                </div>
            </div>

            <div id="modalEditWebhook" class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm hidden z-[100] flex items-center justify-center transition-opacity opacity-0 px-4" style="transition: opacity 0.2s ease;">
                <div class="bg-gray-900 rounded-xl max-w-sm w-full p-5 relative shadow-xl border border-gray-700 transform scale-95 transition-transform duration-200">
                    <button type="button" onclick="fecharModalEditarWebhook()" class="absolute top-4 right-4 w-8 h-8 bg-gray-800 rounded-full text-gray-400 hover:bg-gray-700 flex items-center justify-center font-bold text-lg">&times;</button>
                    <h3 class="text-lg font-black text-white mb-4 border-b border-gray-700 pb-2"><i class="fa-solid fa-pen text-blue-500 mr-1.5"></i> Editar Webhook</h3>
                    <form id="formEditWebhook" method="POST">
                        <div class="mb-3">
                            <label class="block text-[10px] font-bold text-gray-400 uppercase mb-1">Nome</label>
                            <input type="text" id="editWebhook_nome" name="nome" class="w-full bg-gray-800 border border-gray-600 rounded-lg px-2.5 py-1.5 outline-none text-white text-sm" required>
                        </div>
                        <div class="mb-3">
                            <label class="block text-[10px] font-bold text-gray-400 uppercase mb-1">URL (Endpoint)</label>
                            <input type="url" id="editWebhook_url" name="url" class="w-full bg-gray-800 border border-gray-600 rounded-lg px-2.5 py-1.5 outline-none text-white text-sm" required>
                        </div>
                        <div class="mb-4">
                            <label class="block text-[10px] font-bold text-gray-400 uppercase mb-1">API Key (Opção)</label>
                            <input type="text" id="editWebhook_apikey" name="api_key" class="w-full bg-gray-800 border border-gray-600 rounded-lg px-2.5 py-1.5 outline-none text-white text-sm">
                        </div>
                        <button type="submit" class="w-full bg-blue-600 text-white font-bold py-2 text-sm rounded-lg hover:bg-blue-700 transition">Atualizar</button>
                    </form>
                </div>
            </div>

            <div id="modalEditModelo" class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm hidden z-[100] flex items-center justify-center transition-opacity opacity-0 px-4" style="transition: opacity 0.2s ease;">
                <div class="bg-white rounded-xl max-w-sm w-full p-5 relative shadow-xl transform scale-95 transition-transform duration-200">
                    <button type="button" onclick="fecharModalEditarModelo()" class="absolute top-4 right-4 w-8 h-8 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 flex items-center justify-center font-bold text-lg">&times;</button>
                    <h3 class="text-lg font-black text-gray-900 mb-4 border-b pb-2"><i class="fa-solid fa-pen text-blue-500 mr-1.5"></i> Editar Modelo</h3>
                    <form id="formEditModelo" method="POST">
                        <div class="grid grid-cols-2 gap-3 mb-3">
                            <div>
                                <label class="block text-[10px] font-bold text-gray-500 uppercase mb-1">Setor</label>
                                <select id="editModelo_secao" name="secao" class="w-full bg-gray-50 border border-gray-300 rounded-lg px-2.5 py-1.5 outline-none text-sm">
                                    <option value="alimenticio">Alimentício</option>
                                    <option value="industrial">Industrial</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-[10px] font-bold text-gray-500 uppercase mb-1">Nome</label>
                                <input type="text" id="editModelo_nome" name="nome" class="w-full bg-gray-50 border border-gray-300 rounded-lg px-2.5 py-1.5 outline-none text-sm" required>
                            </div>
                        </div>
                        <div class="mb-4">
                            <label class="block text-[10px] font-bold text-gray-500 uppercase mb-1">Tamanho</label>
                            <input type="text" id="editModelo_tamanho" name="tamanho" class="w-full bg-gray-50 border border-gray-300 rounded-lg px-2.5 py-1.5 outline-none text-sm" required>
                        </div>
                        <button type="submit" class="w-full bg-blue-500 text-white font-bold py-2 text-sm rounded-lg hover:bg-blue-600 transition">Salvar</button>
                    </form>
                </div>
            </div>

            <div id="modalEditMaterial" class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm hidden z-[100] flex items-center justify-center transition-opacity opacity-0 px-4" style="transition: opacity 0.2s ease;">
                <div class="bg-white rounded-xl max-w-sm w-full p-5 relative shadow-xl transform scale-95 transition-transform duration-200">
                    <button type="button" onclick="fecharModalEditarMaterial()" class="absolute top-4 right-4 w-8 h-8 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 flex items-center justify-center font-bold text-lg">&times;</button>
                    <h3 class="text-lg font-black text-gray-900 mb-4 border-b pb-2"><i class="fa-solid fa-pen text-blue-500 mr-1.5"></i> Editar Material</h3>
                    <form id="formEditMaterial" method="POST">
                        <div class="mb-3">
                            <label class="block text-[10px] font-bold text-gray-500 uppercase mb-1">Setor</label>
                            <select id="editMaterial_secao" name="secao" class="w-full bg-gray-50 border border-gray-300 rounded-lg px-2.5 py-1.5 outline-none text-sm">
                                <option value="ambos">Ambos</option>
                                <option value="alimenticio">Alimentício</option>
                                <option value="industrial">Industrial</option>
                            </select>
                        </div>
                        <div class="mb-4">
                            <label class="block text-[10px] font-bold text-gray-500 uppercase mb-1">Material</label>
                            <input type="text" id="editMaterial_nome" name="nome" class="w-full bg-gray-50 border border-gray-300 rounded-lg px-2.5 py-1.5 outline-none text-sm" required>
                        </div>
                        <button type="submit" class="w-full bg-blue-500 text-white font-bold py-2 text-sm rounded-lg hover:bg-blue-600 transition">Salvar</button>
                    </form>
                </div>
            </div>

            </main>
        </div>
        
        <script>
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
                    setTimeout(() => overlay.classList.add('hidden'), 200);
                }
            }

            function openTab(tabId, btn) {
                if (window.innerWidth < 1024 && !document.getElementById('adminSidebar').classList.contains('-translate-x-full')) {
                    toggleAdminMenu();
                }

                localStorage.setItem('ecoAdminAbaAtiva', tabId);

                document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
                document.querySelectorAll('.tab-btn').forEach(b => {
                    b.classList.remove('active', 'border-brand', 'text-brand', 'bg-brandLight', 'border-b-3');
                    b.classList.add('text-gray-400');
                });
                
                document.getElementById(tabId).classList.add('active');
                
                if (!btn) {
                    btn = document.querySelector(\`button[onclick*="\${tabId}"]\`);
                }
                
                if (btn) {
                    btn.classList.add('active', 'border-b-3', 'border-brand', 'text-brand', 'bg-brandLight');
                    btn.classList.remove('text-gray-400');
                }
            }

            document.addEventListener('DOMContentLoaded', () => {
                const abaSalva = localStorage.getItem('ecoAdminAbaAtiva');
                if (abaSalva && document.getElementById(abaSalva)) {
                    openTab(abaSalva);
                }
            });

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
                setTimeout(() => { modal.classList.remove('opacity-0'); content.classList.remove('scale-95'); }, 10);
            }

            function fecharModalEditarVaga() {
                const modal = document.getElementById('modalEditVaga');
                const content = document.getElementById('modalEditVagaContent');
                modal.classList.add('opacity-0'); content.classList.add('scale-95');
                setTimeout(() => modal.classList.add('hidden'), 200);
            }

            function abrirModalEditarProduto(p) {
                document.getElementById('formEditProduto').action = '/admin/produtos/edit/' + p.id;
                document.getElementById('editProd_secao').value = p.secao;
                document.getElementById('editProd_titulo').value = p.titulo;
                document.getElementById('editProd_descricao').value = p.descricao;

                const modal = document.getElementById('modalEditProduto');
                const content = document.getElementById('modalEditProdutoContent');
                modal.classList.remove('hidden');
                setTimeout(() => { modal.classList.remove('opacity-0'); content.classList.remove('scale-95'); }, 10);
            }

            function fecharModalEditarProduto() {
                const modal = document.getElementById('modalEditProduto');
                const content = document.getElementById('modalEditProdutoContent');
                modal.classList.add('opacity-0'); content.classList.add('scale-95');
                setTimeout(() => modal.classList.add('hidden'), 200);
            }

            function abrirModalWebhook() {
                const modal = document.getElementById('modalAddWebhook');
                const content = document.getElementById('modalAddWebhookContent');
                modal.classList.remove('hidden');
                setTimeout(() => { modal.classList.remove('opacity-0'); content.classList.remove('scale-95'); }, 10);
            }

            function fecharModalWebhook() {
                const modal = document.getElementById('modalAddWebhook');
                const content = document.getElementById('modalAddWebhookContent');
                modal.classList.add('opacity-0'); content.classList.add('scale-95');
                setTimeout(() => modal.classList.add('hidden'), 200);
            }

            function abrirModalEditarWebhook(w) {
                document.getElementById('formEditWebhook').action = '/admin/webhooks/edit/' + w.id;
                document.getElementById('editWebhook_nome').value = w.nome;
                document.getElementById('editWebhook_url').value = w.url;
                document.getElementById('editWebhook_apikey').value = w.api_key;

                const modal = document.getElementById('modalEditWebhook');
                const content = document.getElementById('modalEditWebhookContent');
                modal.classList.remove('hidden');
                setTimeout(() => { modal.classList.remove('opacity-0'); content.classList.remove('scale-95'); }, 10);
            }

            function fecharModalEditarWebhook() {
                const modal = document.getElementById('modalEditWebhook');
                const content = document.getElementById('modalEditWebhookContent');
                modal.classList.add('opacity-0'); content.classList.add('scale-95');
                setTimeout(() => modal.classList.add('hidden'), 200);
            }

            function filtrarCandidatos() {
                const inputTexto = document.getElementById('filtroNomeCandidato').value.toLowerCase();
                const inputVaga = document.getElementById('filtroVagaCandidato').value;
                const linhas = document.querySelectorAll('.candidato-row');
                const contador = document.getElementById('contadorCandidatos');
                
                let visiveis = 0;

                linhas.forEach(linha => {
                    const nome = linha.getAttribute('data-nome');
                    const bairro = linha.getAttribute('data-bairro');
                    const vagaId = linha.getAttribute('data-vaga');

                    const matchTexto = nome.includes(inputTexto) || bairro.includes(inputTexto);
                    const matchVaga = (inputVaga === 'todas') || (vagaId === inputVaga);

                    if (matchTexto && matchVaga) {
                        linha.style.display = '';
                        visiveis++;
                    } else {
                        linha.style.display = 'none';
                    }
                });

                contador.innerText = visiveis + (visiveis === 1 ? ' CV' : ' CVs');
                contador.classList.remove('bg-brandLight', 'text-brand');
                contador.classList.add('bg-gray-200', 'text-gray-600');
                setTimeout(() => {
                    contador.classList.remove('bg-gray-200', 'text-gray-600');
                    contador.classList.add('bg-brandLight', 'text-brand');
                }, 150);
            }

            function abrirModalAddVaga() {
                const modal = document.getElementById('modalAddVaga');
                const content = document.getElementById('modalAddVagaContent');
                modal.classList.remove('hidden');
                setTimeout(() => { modal.classList.remove('opacity-0'); content.classList.remove('scale-95'); }, 10);
            }

            function fecharModalAddVaga() {
                const modal = document.getElementById('modalAddVaga');
                const content = document.getElementById('modalAddVagaContent');
                modal.classList.add('opacity-0'); content.classList.add('scale-95');
                setTimeout(() => modal.classList.add('hidden'), 200);
            }

            function abrirModalEditarModelo(item) {
                document.getElementById('formEditModelo').action = '/admin/form/modelo/edit/' + item.id;
                document.getElementById('editModelo_secao').value = item.secao;
                document.getElementById('editModelo_nome').value = item.nome;
                document.getElementById('editModelo_tamanho').value = item.tamanho;
                
                const modal = document.getElementById('modalEditModelo');
                const content = document.getElementById('modalEditModeloContent');
                modal.classList.remove('hidden');
                setTimeout(() => { modal.classList.remove('opacity-0'); content.classList.remove('scale-95'); }, 10);
            }

            function fecharModalEditarModelo() {
                const modal = document.getElementById('modalEditModelo');
                const content = document.getElementById('modalEditModeloContent');
                modal.classList.add('opacity-0'); content.classList.add('scale-95');
                setTimeout(() => modal.classList.add('hidden'), 200);
            }

            function abrirModalEditarMaterial(item) {
                document.getElementById('formEditMaterial').action = '/admin/form/material/edit/' + item.id;
                document.getElementById('editMaterial_secao').value = item.secao;
                document.getElementById('editMaterial_nome').value = item.nome;
                
                const modal = document.getElementById('modalEditMaterial');
                const content = document.getElementById('modalEditMaterialContent');
                modal.classList.remove('hidden');
                setTimeout(() => { modal.classList.remove('opacity-0'); content.classList.remove('scale-95'); }, 10);
            }

            function fecharModalEditarMaterial() {
                const modal = document.getElementById('modalEditMaterial');
                const content = document.getElementById('modalEditMaterialContent');
                modal.classList.add('opacity-0'); content.classList.add('scale-95');
                setTimeout(() => modal.classList.add('hidden'), 200);
            }
        </script>
    </body>
    </html>
    `;
};
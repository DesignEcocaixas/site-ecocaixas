module.exports = function renderAdmin(produtos = [], empresaInfo = {}, noticias = [], stats = {}, formModelos = [], formMateriais = []) {
    
    // Helper para renderizar a tabela da nova aba "Opções do Orçamento"
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
            /* Estilo para input file ficar mais bonito */
            input[type=file]::file-selector-button {
                margin-right: 10px; border: none; background: #029723; padding: 8px 16px; border-radius: 8px; color: #fff; cursor: pointer; font-weight: bold; transition: background .2s ease-in-out;
            }
            input[type=file]::file-selector-button:hover { background: #015e15; }
        </style>
    </head>
    <body class="text-gray-800 flex h-screen overflow-hidden">

        <aside class="w-64 bg-gray-900 text-white flex flex-col shadow-2xl z-20">
            <div class="p-6 border-b border-gray-800 flex items-center">
                <i class="fa-solid fa-leaf text-brand text-2xl mr-3"></i>
                <span class="text-xl font-black tracking-tight">EcoAdmin</span>
            </div>
            <nav class="flex-grow p-4 space-y-2">
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
            </nav>
            <div class="p-4 border-t border-gray-800">
                <a href="/" target="_blank" class="flex items-center justify-center w-full bg-brand hover:bg-brandDark text-white py-2 rounded-lg font-bold transition-colors">
                    <i class="fa-solid fa-arrow-up-right-from-square mr-2"></i> Ver Site
                </a>
            </div>
        </aside>

        <main class="flex-1 overflow-y-auto p-8 relative">
            <header class="mb-8 flex justify-between items-center">
                <div>
                    <h2 class="text-3xl font-black text-gray-800">Gestão de Conteúdo</h2>
                    <p class="text-gray-500">Atualize os dados do site em tempo real.</p>
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

        </main>

        <script>
            function openTab(tabId, btn) {
                document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
                document.querySelectorAll('.tab-btn').forEach(b => {
                    b.classList.remove('active', 'border-brand', 'text-brand', 'bg-brandLight', 'border-b-4');
                    b.classList.add('text-gray-400');
                });
                document.getElementById(tabId).classList.add('active');
                btn.classList.add('active', 'border-b-4', 'border-brand', 'text-brand', 'bg-brandLight');
                btn.classList.remove('text-gray-400');
            }
        </script>
    </body>
    </html>
    `;
};
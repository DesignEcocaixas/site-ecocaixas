const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer'); // Biblioteca de upload
const db = require('./db');
const renderHome = require('./views/homeView');
const renderAdmin = require('./views/adminView'); 

const app = express();
const port = 3000;

// ==========================================
// CONFIGURAÇÃO DE UPLOAD DE IMAGENS (MULTER)
// ==========================================
// Garante que a pasta public/uploads exista
const uploadDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configura onde e com qual nome salvar o arquivo
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir); // Salva na pasta public/uploads
    },
    filename: function (req, file, cb) {
        // Cria um nome único: carimbo de tempo + nome original (ex: 16788888-caixa.jpg)
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); 
    }
});

const upload = multer({ storage: storage });

// ==========================================
// CONFIGURAÇÕES GERAIS DO EXPRESS
// ==========================================
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ==========================================
// ROTA PRINCIPAL (SITE PÚBLICO)
// ==========================================
app.get('/', async (req, res) => {
    try {
        const [stats] = await db.query('SELECT * FROM empresa_stats LIMIT 1');
        const [noticias] = await db.query('SELECT * FROM mural_noticias ORDER BY data_publicacao DESC');
        
        // Buscando os produtos e as informações do mosaico/empresa
        const [produtos] = await db.query('SELECT * FROM produtos');
        const [empresaInfo] = await db.query('SELECT * FROM empresa_info LIMIT 1');

        // Buscando os dados dinâmicos das opções do formulário
        const [formModelos] = await db.query('SELECT * FROM form_modelos');
        const [formMateriais] = await db.query('SELECT * FROM form_materiais');

        // Tratamento caso o banco esteja vazio
        const info = empresaInfo[0] || {};
        const st = stats[0] || { anos_historia: 11, caixas_vendidas: 8000000 };

        // Passamos os 6 conjuntos de dados para o homeView.js
        const html = renderHome(st, noticias, produtos, info, formModelos, formMateriais);
        res.send(html);
    } catch (error) {
        console.error('Erro ao buscar dados do site:', error);
        res.status(500).send('Erro interno do servidor');
    }
});

// ==========================================
// ROTAS DO PAINEL ADMINISTRATIVO
// ==========================================

// --- Tela do Painel ---
app.get('/admin', async (req, res) => {
    try {
        const [produtos] = await db.query('SELECT * FROM produtos ORDER BY id DESC');
        const [empresaInfo] = await db.query('SELECT * FROM empresa_info LIMIT 1');
        const [stats] = await db.query('SELECT * FROM empresa_stats LIMIT 1');
        const [noticias] = await db.query('SELECT * FROM mural_noticias ORDER BY data_publicacao DESC');

        // Buscando os dados dinâmicos do formulário para listar na tabela do Admin
        const [formModelos] = await db.query('SELECT * FROM form_modelos ORDER BY secao, nome');
        const [formMateriais] = await db.query('SELECT * FROM form_materiais ORDER BY secao, nome');

        const info = empresaInfo[0] || {};
        const st = stats[0] || { anos_historia: 0, caixas_vendidas: 0 };

        // Passando tudo para o adminView
        const html = renderAdmin(produtos, info, noticias, st, formModelos, formMateriais);
        res.send(html);
    } catch (error) {
        console.error('Erro ao carregar o painel admin:', error);
        res.status(500).send('Erro ao processar o painel administrativo.');
    }
});

// --- Rota: Adicionar novo Produto/Caixa com Imagem ---
app.post('/admin/produtos/add', upload.single('imagem'), async (req, res) => {
    const { secao, titulo, descricao } = req.body;
    
    // Se a imagem subiu com sucesso, salva o caminho. Se não, fica vazio.
    const imagem_url = req.file ? `/uploads/${req.file.filename}` : '';
    
    try {
        await db.query('INSERT INTO produtos (secao, titulo, descricao, imagem_url) VALUES (?, ?, ?, ?)', 
            [secao, titulo, descricao, imagem_url]);
        res.redirect('/admin');
    } catch (error) {
        console.error('Erro ao adicionar produto:', error);
        res.status(500).send('Erro ao salvar caixa no banco.');
    }
});

// --- Rota: Excluir Produto/Caixa ---
app.post('/admin/produtos/delete/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM produtos WHERE id = ?', [req.params.id]);
        res.redirect('/admin');
    } catch (error) {
        console.error('Erro ao deletar produto:', error);
        res.status(500).send('Erro ao excluir caixa do banco.');
    }
});

// --- Rota: Atualizar Dados da Empresa e Mosaico de Imagens ---
app.post('/admin/empresa/update', upload.fields([
    { name: 'img_mosaico_1', maxCount: 1 },
    { name: 'img_mosaico_2', maxCount: 1 },
    { name: 'img_mosaico_3', maxCount: 1 }
]), async (req, res) => {
    const { anos_historia, caixas_vendidas, titulo_historia, texto_historia } = req.body;
    
    try {
        const [infoCheck] = await db.query('SELECT * FROM empresa_info LIMIT 1');
        
        let img1 = infoCheck.length > 0 ? infoCheck[0].img_mosaico_1 : '';
        let img2 = infoCheck.length > 0 ? infoCheck[0].img_mosaico_2 : '';
        let img3 = infoCheck.length > 0 ? infoCheck[0].img_mosaico_3 : '';

        if (req.files && req.files['img_mosaico_1']) img1 = `/uploads/${req.files['img_mosaico_1'][0].filename}`;
        if (req.files && req.files['img_mosaico_2']) img2 = `/uploads/${req.files['img_mosaico_2'][0].filename}`;
        if (req.files && req.files['img_mosaico_3']) img3 = `/uploads/${req.files['img_mosaico_3'][0].filename}`;

        const [statsCheck] = await db.query('SELECT id FROM empresa_stats LIMIT 1');
        if (statsCheck.length > 0) {
            await db.query('UPDATE empresa_stats SET anos_historia = ?, caixas_vendidas = ? WHERE id = ?', 
                [anos_historia, caixas_vendidas, statsCheck[0].id]);
        } else {
            await db.query('INSERT INTO empresa_stats (anos_historia, caixas_vendidas) VALUES (?, ?)', 
                [anos_historia, caixas_vendidas]);
        }

        if (infoCheck.length > 0) {
            await db.query('UPDATE empresa_info SET titulo = ?, texto_historia = ?, img_mosaico_1 = ?, img_mosaico_2 = ?, img_mosaico_3 = ? WHERE id = ?', 
                [titulo_historia, texto_historia, img1, img2, img3, infoCheck[0].id]);
        } else {
            await db.query('INSERT INTO empresa_info (titulo, texto_historia, img_mosaico_1, img_mosaico_2, img_mosaico_3) VALUES (?, ?, ?, ?, ?)', 
                [titulo_historia, texto_historia, img1, img2, img3]);
        }
        
        res.redirect('/admin');
    } catch (error) {
        console.error('Erro ao atualizar empresa:', error);
        res.status(500).send('Erro ao atualizar as informações da fábrica.');
    }
});

// --- Rota: Postar nova Notícia ---
app.post('/admin/noticias/add', async (req, res) => {
    const { tipo, titulo, descricao } = req.body;
    const data_publicacao = new Date().toISOString().slice(0, 10); 
    
    try {
        await db.query('INSERT INTO mural_noticias (tipo, titulo, descricao, data_publicacao) VALUES (?, ?, ?, ?)', 
            [tipo, titulo, descricao, data_publicacao]);
        res.redirect('/admin');
    } catch (error) {
        console.error('Erro ao adicionar notícia:', error);
        res.status(500).send('Erro ao postar aviso.');
    }
});

// --- Rota: Excluir Notícia ---
app.post('/admin/noticias/delete/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM mural_noticias WHERE id = ?', [req.params.id]);
        res.redirect('/admin');
    } catch (error) {
        console.error('Erro ao deletar notícia:', error);
        res.status(500).send('Erro ao excluir aviso do mural.');
    }
});

// ==========================================
// ROTAS DE OPÇÕES DO ORÇAMENTO (Formulário)
// ==========================================

// --- Adicionar e Excluir Modelos de Caixas ---
app.post('/admin/form/modelo/add', async (req, res) => {
    const { secao, nome, tamanho } = req.body;
    try {
        await db.query('INSERT INTO form_modelos (secao, nome, tamanho) VALUES (?, ?, ?)', [secao, nome, tamanho]);
        res.redirect('/admin');
    } catch (error) {
        console.error('Erro ao adicionar modelo do form:', error);
        res.status(500).send('Erro ao salvar modelo.');
    }
});

app.post('/admin/form/modelo/delete/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM form_modelos WHERE id = ?', [req.params.id]);
        res.redirect('/admin');
    } catch (error) {
        console.error('Erro ao deletar modelo do form:', error);
        res.status(500).send('Erro ao excluir modelo.');
    }
});

// --- Adicionar e Excluir Materiais ---
app.post('/admin/form/material/add', async (req, res) => {
    const { secao, nome } = req.body;
    try {
        await db.query('INSERT INTO form_materiais (secao, nome) VALUES (?, ?)', [secao, nome]);
        res.redirect('/admin');
    } catch (error) {
        console.error('Erro ao adicionar material do form:', error);
        res.status(500).send('Erro ao salvar material.');
    }
});

app.post('/admin/form/material/delete/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM form_materiais WHERE id = ?', [req.params.id]);
        res.redirect('/admin');
    } catch (error) {
        console.error('Erro ao deletar material do form:', error);
        res.status(500).send('Erro ao excluir material.');
    }
});

// ==========================================
// INICIALIZAÇÃO
// ==========================================
app.listen(port, '0.0.0.0',() => {
    console.log(`🏭 Servidor da Fábrica rodando em http://localhost:${port}`);
    console.log(`⚙️  Acesso ao Painel: http://localhost:${port}/admin`);
});
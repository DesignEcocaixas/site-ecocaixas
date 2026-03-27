const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer'); // Biblioteca de upload
const db = require('./db');
const cookieParser = require('cookie-parser');
const nodemailer = require('nodemailer');

const renderHome = require('./views/homeView');
const renderAdmin = require('./views/adminView');
const renderVagas = require('./views/vagasView');
const renderLogin = require('./views/loginView');

const app = express();
const port = 3054;

// ==========================================
// CONFIGURAÇÃO DE UPLOAD DE IMAGENS (MULTER)
// ==========================================
const uploadDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
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
app.use(cookieParser());

// ==========================================
// CONFIGURAÇÃO DE E-MAIL (NODEMAILER)
// ==========================================
// 2. CRIANDO O TRANSPORTER AQUI
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'ecocaixassetorpessoal@gmail.com',
        pass: 'hyjs pyas yndb ivxe'
    }
});

// ==========================================
// SISTEMA DE AUTENTICAÇÃO
// ==========================================
const ADMIN_TOKEN = '@Admineco2026';

// Middleware que verifica se o usuário tem o "crachá" (cookie)
const requireAuth = (req, res, next) => {
    if (req.cookies.authToken === ADMIN_TOKEN) {
        next(); // Se o token estiver correto, deixa passar para o Admin
    } else {
        res.redirect('/login'); // Se não, expulsa para a tela de login
    }
};

app.use((req, res, next) => {
    if (req.headers.host.slice(0, 4) === 'www.') {
        const newHost = req.headers.host.slice(4);
        return res.redirect(301, 'https://' + newHost + req.originalUrl);
    }
    next();
});

// Tela de Login
app.get('/login', (req, res) => {
    const error = req.query.error === '1';
    res.send(renderLogin(error));
});

// Processa o botão "Entrar"
app.post('/login', (req, res) => {
    const { token } = req.body;
    if (token === ADMIN_TOKEN) {
        // Se acertou o token, gera um cookie válido por 24 horas e manda pro painel
        res.cookie('authToken', ADMIN_TOKEN, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
        res.redirect('/admin');
    } else {
        // Se errou, volta pra página de login mostrando o aviso de erro
        res.redirect('/login?error=1');
    }
});

// Botão de Sair
app.get('/logout', (req, res) => {
    res.clearCookie('authToken');
    res.redirect('/login');
});

// ==========================================
// ROTAS DO PAINEL ADMINISTRATIVO
// ==========================================
// A MÁGICA ACONTECE AQUI: Qualquer rota que comece com /admin terá que passar pelo "requireAuth" antes!
app.use('/admin', requireAuth);

// ==========================================
// ROTA PRINCIPAL (SITE PÚBLICO)
// ==========================================
app.get('/', async (req, res) => {
    try {
        const [stats] = await db.query('SELECT * FROM empresa_stats LIMIT 1');
        const [noticias] = await db.query('SELECT * FROM mural_noticias ORDER BY data_publicacao DESC');
        const [produtos] = await db.query('SELECT * FROM produtos');
        const [empresaInfo] = await db.query('SELECT * FROM empresa_info LIMIT 1');
        const [formModelos] = await db.query('SELECT * FROM form_modelos');
        const [formMateriais] = await db.query('SELECT * FROM form_materiais');
        const [popups] = await db.query('SELECT * FROM notificacoes_popup');
        
        // Buscando as vagas de emprego
        const [vagas] = await db.query('SELECT * FROM vagas');

        const info = empresaInfo[0] || {};
        const st = stats[0] || { anos_historia: 11, caixas_vendidas: 8000000 };

        // Adicionado "vagas" no final da função renderHome
        const html = renderHome(st, noticias, produtos, info, formModelos, formMateriais, popups, vagas);
        res.send(html);
    } catch (error) {
        console.error('Erro ao buscar dados do site:', error);
        res.status(500).send('Erro interno do servidor');
    }
});

// --- Tela do Painel ---
app.get('/admin', async (req, res) => {
    try {
        const [produtos] = await db.query('SELECT * FROM produtos ORDER BY id DESC');
        const [empresaInfo] = await db.query('SELECT * FROM empresa_info LIMIT 1');
        const [stats] = await db.query('SELECT * FROM empresa_stats LIMIT 1');
        const [noticias] = await db.query('SELECT * FROM mural_noticias ORDER BY data_publicacao DESC');
        const [formModelos] = await db.query('SELECT * FROM form_modelos ORDER BY secao, nome');
        const [formMateriais] = await db.query('SELECT * FROM form_materiais ORDER BY secao, nome');
        const [popups] = await db.query('SELECT * FROM notificacoes_popup ORDER BY id DESC');
        const [vagas] = await db.query('SELECT * FROM vagas ORDER BY id DESC');

        const [candidaturas] = await db.query(`
            SELECT c.*, v.titulo as vaga_titulo 
            FROM candidaturas c 
            JOIN vagas v ON c.vaga_id = v.id 
            ORDER BY c.data_envio DESC
        `);

        // Busca as configurações (E-mail RH e etc)
        const [configsDb] = await db.query('SELECT * FROM configuracoes LIMIT 1');
        
        // Busca a nova tabela de Webhooks (Integrações)
        const [webhooks] = await db.query('SELECT * FROM webhooks ORDER BY id DESC');

        const info = empresaInfo[0] || {};
        const st = stats[0] || { anos_historia: 0, caixas_vendidas: 0 };
        const configs = configsDb[0] || {}; 

        // Envia todos os dados certinhos para a tela (incluindo o novo webhooks)
        const html = renderAdmin(produtos, info, noticias, st, formModelos, formMateriais, popups, vagas, candidaturas, configs, webhooks);
        res.send(html);
    } catch (error) {
        console.error('Erro ao carregar o painel admin:', error);
        res.status(500).send('Erro ao processar o painel administrativo.');
    }
});

// ==========================================
// ROTAS: CONFIGURAÇÕES GERAIS (E-MAIL E INTEGRAÇÕES)
// ==========================================
app.post('/admin/config/email_vagas', async (req, res) => {
    const { email_vagas } = req.body;
    try {
        // Verifica se já existe alguma configuração salva
        const [check] = await db.query('SELECT id FROM configuracoes LIMIT 1');
        
        if (check.length > 0) {
            // Se existir, atualiza a linha
            await db.query('UPDATE configuracoes SET email_vagas = ? WHERE id = ?', [email_vagas, check[0].id]);
        } else {
            // Se a tabela estiver vazia, cria a primeira linha já com o e-mail novo
            await db.query('INSERT INTO configuracoes (email_vagas, onstude_ativo) VALUES (?, 1)', [email_vagas]);
        }
        res.redirect('/admin');
    } catch (error) {
        console.error('Erro ao atualizar e-mail de vagas:', error);
        res.status(500).send('Erro ao atualizar configuração de e-mail.');
    }
});

app.post('/admin/config/toggle_onstude', async (req, res) => {
    const onstude_ativo = req.body.onstude_ativo === 'on' ? 1 : 0;
    try {
        const [check] = await db.query('SELECT id FROM configuracoes LIMIT 1');
        
        if (check.length > 0) {
            await db.query('UPDATE configuracoes SET onstude_ativo = ? WHERE id = ?', [onstude_ativo, check[0].id]);
        } else {
            await db.query('INSERT INTO configuracoes (email_vagas, onstude_ativo) VALUES ("designecocaixasba@gmail.com", ?)', [onstude_ativo]);
        }
        res.redirect('/admin');
    } catch (error) {
        console.error('Erro ao alternar integração do Onstude:', error);
        res.status(500).send('Erro ao atualizar integração.');
    }
});

// ==========================================
// ROTA: PÁGINA PÚBLICA DE VAGAS (/vagas)
// ==========================================
app.get('/vagas', async (req, res) => {
    try {
        // Busca apenas as vagas que estão dentro da data de validade (início <= hoje E fim >= hoje)
        const hoje = new Date().toISOString().slice(0, 10);
        const [vagas] = await db.query(
            'SELECT * FROM vagas WHERE data_inicio <= ? AND data_fim >= ? ORDER BY id DESC',
            [hoje, hoje]
        );

        const html = renderVagas(vagas);
        res.send(html);
    } catch (error) {
        console.error('Erro ao carregar a página de vagas:', error);
        res.status(500).send('Erro interno do servidor');
    }
});

// --- Rota: Alternar Disponibilidade (Switch) ---
app.post('/admin/vagas/toggle/:id', async (req, res) => {
    // O checkbox envia 'on' se estiver marcado
    const disponivel = req.body.disponivel === 'on' ? 1 : 0;
    try {
        await db.query('UPDATE vagas SET disponivel = ? WHERE id = ?', [disponivel, req.params.id]);
        res.redirect('/admin');
    } catch (error) {
        console.error('Erro ao alternar vaga:', error);
        res.status(500).send('Erro ao atualizar status.');
    }
});

// --- Rota: Editar Vaga ---
app.post('/admin/vagas/edit/:id', upload.single('imagem_banner'), async (req, res) => {
    const { titulo, data_inicio, data_fim, disponibilidade, conhecimento, experiencia, local_residencia, salario, beneficios } = req.body;

    try {
        // Se enviou uma nova foto, atualiza a foto junto. Se não, atualiza só os textos.
        if (req.file) {
            const imagem_banner = `/uploads/${req.file.filename}`;
            await db.query(
                `UPDATE vagas SET titulo=?, imagem_banner=?, data_inicio=?, data_fim=?, disponibilidade=?, conhecimento=?, experiencia=?, local_residencia=?, salario=?, beneficios=? WHERE id=?`,
                [titulo, imagem_banner, data_inicio, data_fim, disponibilidade, conhecimento, experiencia, local_residencia, salario, beneficios, req.params.id]
            );
        } else {
            await db.query(
                `UPDATE vagas SET titulo=?, data_inicio=?, data_fim=?, disponibilidade=?, conhecimento=?, experiencia=?, local_residencia=?, salario=?, beneficios=? WHERE id=?`,
                [titulo, data_inicio, data_fim, disponibilidade, conhecimento, experiencia, local_residencia, salario, beneficios, req.params.id]
            );
        }
        res.redirect('/admin');
    } catch (error) {
        console.error('Erro ao editar vaga:', error);
        res.status(500).send('Erro ao atualizar a vaga.');
    }
});

// --- Tela do Painel ---
app.get('/admin', async (req, res) => {
    try {
        const [produtos] = await db.query('SELECT * FROM produtos ORDER BY id DESC');
        const [empresaInfo] = await db.query('SELECT * FROM empresa_info LIMIT 1');
        const [stats] = await db.query('SELECT * FROM empresa_stats LIMIT 1');
        const [noticias] = await db.query('SELECT * FROM mural_noticias ORDER BY data_publicacao DESC');
        const [formModelos] = await db.query('SELECT * FROM form_modelos ORDER BY secao, nome');
        const [formMateriais] = await db.query('SELECT * FROM form_materiais ORDER BY secao, nome');
        const [popups] = await db.query('SELECT * FROM notificacoes_popup ORDER BY id DESC');
        const [vagas] = await db.query('SELECT * FROM vagas ORDER BY id DESC');

        // NOVO: Buscando os currículos e juntando com o nome da vaga
        const [candidaturas] = await db.query(`
            SELECT c.*, v.titulo as vaga_titulo 
            FROM candidaturas c 
            JOIN vagas v ON c.vaga_id = v.id 
            ORDER BY c.data_envio DESC
        `);

        const info = empresaInfo[0] || {};
        const st = stats[0] || { anos_historia: 0, caixas_vendidas: 0 };

        // NOVO: Passando "candidaturas" no final
        const html = renderAdmin(produtos, info, noticias, st, formModelos, formMateriais, popups, vagas, candidaturas);
        res.send(html);
    } catch (error) {
        console.error('Erro ao carregar o painel admin:', error);
        res.status(500).send('Erro ao processar o painel administrativo.');
    }
});

// Rota para apagar um currículo recebido
app.post('/admin/candidaturas/delete/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM candidaturas WHERE id = ?', [req.params.id]);
        res.redirect('/admin');
    } catch (error) {
        console.error('Erro ao deletar candidato:', error);
        res.status(500).send('Erro ao excluir candidato.');
    }
});

// ==========================================
// ROTAS: VAGAS DE EMPREGO (ADMIN)
// ==========================================
app.post('/admin/vagas/add', upload.single('imagem_banner'), async (req, res) => {
    const {
        titulo, data_inicio, data_fim,
        disponibilidade, conhecimento, experiencia,
        local_residencia, salario, beneficios
    } = req.body;

    const imagem_banner = req.file ? `/uploads/${req.file.filename}` : '';

    try {
        // 1. Salva a vaga no banco de dados da Ecocaixas
        await db.query(
            `INSERT INTO vagas (titulo, imagem_banner, data_inicio, data_fim, disponibilidade, conhecimento, experiencia, local_residencia, salario, beneficios) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [titulo, imagem_banner, data_inicio, data_fim, disponibilidade, conhecimento, experiencia, local_residencia, salario, beneficios]
        );

        // ==========================================
        // 2. DISPARO DINÂMICO DE WEBHOOKS
        // ==========================================
        const [activeWebhooks] = await db.query('SELECT * FROM webhooks WHERE ativo = 1');
        
        if (activeWebhooks.length > 0) {
            // URL base da Ecocaixas (ajuste para https://ecocaixasba.com.br quando for para produção)
            const dominioEcocaixas = 'http://127.0.0.1:3054'; 
            
            const payload = {
                titulo: `Vaga: ${titulo}`,
                mensagem: `Nova oportunidade na Ecocaixas! Salário: ${salario || 'A combinar'}. Clique para ver os detalhes.`,
                link_url: `${dominioEcocaixas}/vagas`,
                imagem_url: imagem_banner ? `${dominioEcocaixas}${imagem_banner}` : null
            };

            const axios = require('axios');
            
            // Faz um loop e dispara para TODOS os webhooks que estiverem ativos!
            activeWebhooks.forEach(hook => {
                axios.post(hook.url, payload, {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': hook.api_key || '' // Se não tiver chave, envia vazio
                    }
                }).then(() => {
                    console.log(`[Webhook] Disparado com sucesso para: ${hook.nome}`);
                }).catch(err => {
                    console.error(`[Webhook] Falha ao notificar ${hook.nome}:`, err.message);
                });
            });
        } else {
            console.log('Aviso: Nenhum webhook ativo para ser notificado.');
        }
        // ==========================================

        // Redireciona de volta para a aba de vagas
        res.redirect('/admin');
    } catch (error) {
        console.error('Erro ao adicionar vaga:', error);
        res.status(500).send('Erro ao salvar a vaga.');
    }
});

app.post('/admin/vagas/delete/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM vagas WHERE id = ?', [req.params.id]);
        res.redirect('/admin');
    } catch (error) {
        console.error('Erro ao deletar vaga:', error);
        res.status(500).send('Erro ao excluir a vaga.');
    }
});

// ==========================================
// ROTA: RECEBER CURRÍCULO (SITE -> BANCO E E-MAIL)
// ==========================================
app.post('/vagas/candidatar', upload.single('curriculo'), async (req, res) => {
    const { vaga_id, nome, bairro, contato } = req.body;

    // Captura o arquivo para enviar por e-mail e salvar no banco
    const arquivoCurriculo = req.file;
    const curriculo_url = arquivoCurriculo ? `/uploads/${arquivoCurriculo.filename}` : '';

    try {
        // 1. Salva no banco de dados normalmente
        await db.query('INSERT INTO candidaturas (vaga_id, nome, bairro, contato, curriculo_url) VALUES (?, ?, ?, ?, ?)',
            [vaga_id, nome, bairro, contato, curriculo_url]);

        // 2. Busca o nome da vaga no banco para colocar no título do e-mail
        const [vagaDb] = await db.query('SELECT titulo FROM vagas WHERE id = ?', [vaga_id]);
        const tituloDaVaga = vagaDb.length > 0 ? vagaDb[0].titulo : 'Vaga não especificada';

        // Busca o email do RH configurado no painel
        const [configDb] = await db.query('SELECT email_vagas FROM configuracoes LIMIT 1');
        const emailRH = configDb.length > 0 ? configDb[0].email_vagas : 'designecocaixasba@gmail.com';

        // Monta o e-mail com os dados e o anexo
        const mailOptions = {
            from: 'designecocaixasba@gmail.com',
            to: emailRH,
            subject: `Novo Currículo Recebido: ${nome} - ${tituloDaVaga}`,
            text: `Olá equipe,\n\nUm novo candidato enviou currículo através do site.\n\n📌 DADOS DO CANDIDATO:\n- Nome: ${nome}\n- Vaga Desejada: ${tituloDaVaga}\n- Contato (WhatsApp): ${contato}\n- Localidade: ${bairro}\n\n📄 O arquivo do currículo está em anexo neste e-mail.\n\nAtenciosamente,\nSistema Ecocaixas`,
            attachments: arquivoCurriculo ? [
                {
                    filename: arquivoCurriculo.originalname,
                    path: arquivoCurriculo.path
                }
            ] : []
        };

        // 4. Dispara o e-mail em segundo plano
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) console.error('Erro ao enviar e-mail de notificação:', error);
            else console.log('E-mail com currículo enviado com sucesso!');
        });

        // 5. Retorna a mensagem de sucesso para a tela do candidato
        res.send("<script>alert('Currículo enviado com sucesso! Boa sorte.'); window.location.href='/';</script>");
    } catch (error) {
        console.error('Erro ao enviar currículo:', error);
        res.status(500).send('Erro ao processar candidatura.');
    }
});

// --- Rotas de Produtos ---
app.post('/admin/produtos/add', upload.single('imagem'), async (req, res) => {
    const { secao, titulo, descricao } = req.body;
    const imagem_url = req.file ? `/uploads/${req.file.filename}` : '';
    try {
        await db.query('INSERT INTO produtos (secao, titulo, descricao, imagem_url) VALUES (?, ?, ?, ?)', [secao, titulo, descricao, imagem_url]);
        res.redirect('/admin');
    } catch (error) {
        console.error('Erro ao adicionar produto:', error);
        res.status(500).send('Erro ao salvar caixa no banco.');
    }
});

app.post('/admin/produtos/delete/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM produtos WHERE id = ?', [req.params.id]);
        res.redirect('/admin');
    } catch (error) {
        console.error('Erro ao deletar produto:', error);
        res.status(500).send('Erro ao excluir caixa do banco.');
    }
});

// --- Rota de Empresa ---
app.post('/admin/empresa/update', upload.fields([
    { name: 'img_mosaico_1', maxCount: 1 }, { name: 'img_mosaico_2', maxCount: 1 }, { name: 'img_mosaico_3', maxCount: 1 }
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
            await db.query('UPDATE empresa_stats SET anos_historia = ?, caixas_vendidas = ? WHERE id = ?', [anos_historia, caixas_vendidas, statsCheck[0].id]);
        } else {
            await db.query('INSERT INTO empresa_stats (anos_historia, caixas_vendidas) VALUES (?, ?)', [anos_historia, caixas_vendidas]);
        }

        if (infoCheck.length > 0) {
            await db.query('UPDATE empresa_info SET titulo = ?, texto_historia = ?, img_mosaico_1 = ?, img_mosaico_2 = ?, img_mosaico_3 = ? WHERE id = ?', [titulo_historia, texto_historia, img1, img2, img3, infoCheck[0].id]);
        } else {
            await db.query('INSERT INTO empresa_info (titulo, texto_historia, img_mosaico_1, img_mosaico_2, img_mosaico_3) VALUES (?, ?, ?, ?, ?)', [titulo_historia, texto_historia, img1, img2, img3]);
        }
        res.redirect('/admin');
    } catch (error) {
        console.error('Erro ao atualizar empresa:', error);
        res.status(500).send('Erro ao atualizar as informações da fábrica.');
    }
});

// --- Rotas do Mural ---
app.post('/admin/noticias/add', async (req, res) => {
    const { tipo, titulo, descricao } = req.body;
    const data_publicacao = new Date().toISOString().slice(0, 10);
    try {
        await db.query('INSERT INTO mural_noticias (tipo, titulo, descricao, data_publicacao) VALUES (?, ?, ?, ?)', [tipo, titulo, descricao, data_publicacao]);
        res.redirect('/admin');
    } catch (error) {
        console.error('Erro ao adicionar notícia:', error);
        res.status(500).send('Erro ao postar aviso.');
    }
});

app.post('/admin/noticias/delete/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM mural_noticias WHERE id = ?', [req.params.id]);
        res.redirect('/admin');
    } catch (error) {
        console.error('Erro ao deletar notícia:', error);
        res.status(500).send('Erro ao excluir aviso do mural.');
    }
});

// --- Rotas de Opções do Formulário ---
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

// --- Rota: Editar Modelo do Form ---
app.post('/admin/form/modelo/edit/:id', async (req, res) => {
    const { secao, nome, tamanho } = req.body;
    try {
        await db.query('UPDATE form_modelos SET secao = ?, nome = ?, tamanho = ? WHERE id = ?', [secao, nome, tamanho, req.params.id]);
        res.redirect('/admin');
    } catch (error) {
        console.error('Erro ao editar modelo do form:', error);
        res.status(500).send('Erro ao atualizar modelo.');
    }
});

// --- Rota: Editar Material do Form ---
app.post('/admin/form/material/edit/:id', async (req, res) => {
    const { secao, nome } = req.body;
    try {
        await db.query('UPDATE form_materiais SET secao = ?, nome = ? WHERE id = ?', [secao, nome, req.params.id]);
        res.redirect('/admin');
    } catch (error) {
        console.error('Erro ao editar material do form:', error);
        res.status(500).send('Erro ao atualizar material.');
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

// --- NOVAS ROTAS: Pop-ups Iniciais ---
app.post('/admin/popup/add', upload.single('imagem_popup'), async (req, res) => {
    const { titulo, tipo_conteudo, texto_conteudo, data_inicio, data_fim } = req.body;

    // Se for imagem, pega o caminho do arquivo enviado. Se for texto, pega o que foi digitado.
    const conteudo = (tipo_conteudo === 'imagem' && req.file) ? `/uploads/${req.file.filename}` : texto_conteudo;

    try {
        await db.query('INSERT INTO notificacoes_popup (titulo, tipo_conteudo, conteudo, data_inicio, data_fim) VALUES (?, ?, ?, ?, ?)',
            [titulo, tipo_conteudo, conteudo, data_inicio, data_fim]);
        res.redirect('/admin');
    } catch (error) {
        console.error('Erro ao adicionar popup:', error);
        res.status(500).send('Erro ao salvar notificação.');
    }
});

app.post('/admin/popup/delete/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM notificacoes_popup WHERE id = ?', [req.params.id]);
        res.redirect('/admin');
    } catch (error) {
        console.error('Erro ao deletar popup:', error);
        res.status(500).send('Erro ao excluir notificação.');
    }
});

// --- Rota para Editar Produto (Caixa) ---
app.post('/admin/produtos/edit/:id', upload.single('imagem'), async (req, res) => {
    const { secao, titulo, descricao } = req.body;

    try {
        // Se o usuário selecionou uma nova imagem no formulário
        if (req.file) {
            const imagem_url = `/uploads/${req.file.filename}`;
            await db.query(
                'UPDATE produtos SET secao = ?, titulo = ?, descricao = ?, imagem_url = ? WHERE id = ?',
                [secao, titulo, descricao, imagem_url, req.params.id]
            );
        } else {
            // Se NÃO enviou imagem, atualiza apenas os textos e mantém a imagem atual intacta
            await db.query(
                'UPDATE produtos SET secao = ?, titulo = ?, descricao = ? WHERE id = ?',
                [secao, titulo, descricao, req.params.id]
            );
        }
        res.redirect('/admin');
    } catch (error) {
        console.error('Erro ao editar produto:', error);
        res.status(500).send('Erro ao atualizar caixa no banco de dados.');
    }
});

// ==========================================
// ROTAS: CRUD DE WEBHOOKS (INTEGRAÇÕES)
// ==========================================
app.post('/admin/webhooks/add', async (req, res) => {
    const { nome, url, api_key } = req.body;
    try {
        await db.query('INSERT INTO webhooks (nome, url, api_key, ativo) VALUES (?, ?, ?, 1)', [nome, url, api_key]);
        res.redirect('/admin');
    } catch (error) {
        console.error('Erro ao adicionar webhook:', error);
        res.status(500).send('Erro ao salvar integração.');
    }
});

app.post('/admin/webhooks/toggle/:id', async (req, res) => {
    const ativo = req.body.ativo === 'on' ? 1 : 0;
    try {
        await db.query('UPDATE webhooks SET ativo = ? WHERE id = ?', [ativo, req.params.id]);
        res.redirect('/admin');
    } catch (error) {
        console.error('Erro ao alternar webhook:', error);
        res.status(500).send('Erro ao atualizar status.');
    }
});

app.post('/admin/webhooks/delete/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM webhooks WHERE id = ?', [req.params.id]);
        res.redirect('/admin');
    } catch (error) {
        console.error('Erro ao deletar webhook:', error);
        res.status(500).send('Erro ao excluir integração.');
    }
});

app.post('/admin/webhooks/edit/:id', async (req, res) => {
    const { nome, url, api_key } = req.body;
    try {
        await db.query('UPDATE webhooks SET nome = ?, url = ?, api_key = ? WHERE id = ?', [nome, url, api_key, req.params.id]);
        res.redirect('/admin');
    } catch (error) {
        console.error('Erro ao editar webhook:', error);
        res.status(500).send('Erro ao atualizar integração.');
    }
});

// ==========================================
// INICIALIZAÇÃO
// ==========================================
app.listen(port, '0.0.0.0', () => {
    console.log(`Servidor da Fábrica rodando em http://localhost:${port}`);
    console.log(`Acesso ao Painel: http://localhost:${port}/admin`);
});
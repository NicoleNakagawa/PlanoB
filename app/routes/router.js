var express = require('express');
var router = express.Router();
const { body, validationResult } = require('express-validator');

// ========== USUÁRIOS FIXOS (PARA TESTE) ==========

const USUARIOS = {
    alunos: [
        { id: 1, email: 'aluno@teste.com', senha: '12345678', nome: 'João Aluno' },
        { id: 2, email: 'maria@teste.com', senha: 'senha123', nome: 'Maria Silva' }
    ],
    professores: [
        { id: 1, email: 'professor@teste.com', senha: '12345678', nome: 'Carlos Professor', cref: '12345-G/SP' },
        { id: 2, email: 'ana@professor.com', senha: 'prof1234', nome: 'Ana Santos', cref: '67890-G/RJ' }
    ]
};

// ========== MIDDLEWARES DE AUTENTICAÇÃO ==========

// Verifica se o usuário está logado
function verificaLogin(req, res, next) {
    if (req.session && req.session.user) {
        return next();
    }
    // Salva a URL que o usuário tentou acessar
    req.session.redirectTo = req.originalUrl;
    return res.redirect('/login?erro=login_necessario');
}

// Verifica se é aluno
function verificaAluno(req, res, next) {
    if (req.session && req.session.user && req.session.user.tipo === 'aluno') {
        return next();
    }
    // Salva a URL que o usuário tentou acessar
    if (!req.session.user) {
        req.session.redirectTo = req.originalUrl;
    }
    return res.redirect('/login?erro=acesso_negado');
}

// Verifica se é professor
function verificaProfessor(req, res, next) {
    if (req.session && req.session.user && req.session.user.tipo === 'professor') {
        return next();
    }
    return res.redirect('/login?erro=acesso_negado');
}

// ========== HELPERS E VALIDADORES ==========

const UF_LIST = [
  'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG',
  'PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO'
];

function onlyDigits(v='') { 
  return String(v).replace(/\D/g, ''); 
}

function isValidCPF(cpf) {
  cpf = onlyDigits(cpf);
  if (!cpf || cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
  let sum = 0, rest;
  for (let i=1; i<=9; i++) sum += parseInt(cpf.substring(i-1, i))*(11-i);
  rest = (sum*10)%11; if (rest===10||rest===11) rest=0;
  if (rest !== parseInt(cpf.substring(9,10))) return false;
  sum = 0;
  for (let i=1; i<=10; i++) sum += parseInt(cpf.substring(i-1, i))*(12-i);
  rest = (sum*10)%11; if (rest===10||rest===11) rest=0;
  return rest === parseInt(cpf.substring(10,11));
}

function isValidCEP(cep) { 
  return /^\d{5}-?\d{3}$/.test(String(cep)); 
}

function isValidUF(uf) { 
  return UF_LIST.includes(String(uf||'').toUpperCase()); 
}

function isValidPhoneBR(p) {
  return /^\+?55?\s?\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/.test(String(p||''));
}

function isValidCREF(v) {
  const str = String(v || '').trim().toUpperCase();
  const only = /^\d{5,10}$/;
  const withUF = /^\d{4,8}-[A-Z]\/([A-Z]{2})$/;
  if (only.test(str)) return true;
  const m = str.match(withUF);
  return !!(m && UF_LIST.includes(m[1]));
}

// ========== ROTAS PÚBLICAS ==========

router.get('/', function(req,res){
    res.render('pages/index');
});

router.get('/login', function(req,res){
    const erro = req.query.erro;
    let mensagemErro = '';
    
    if (erro === 'credenciais_invalidas') {
        mensagemErro = 'E-mail ou senha incorretos.';
    } else if (erro === 'login_necessario') {
        mensagemErro = 'Você precisa fazer login para acessar esta página.';
    } else if (erro === 'acesso_negado') {
        mensagemErro = 'Acesso negado. Você não tem permissão para acessar esta área.';
    }
    
    res.render('pages/login', { 
        errors: {},
        values: {},
        mensagemErro
    });
});

router.get('/cadastroaluno', function(req,res){
    res.render('pages/cadastroaluno', { errors: {}, values: {} });
});

router.get('/cadastroprofessor', function(req,res){
    res.render('pages/cadastroprofessor', { errors: {}, values: {} });
});

router.get('/sobre', function(req,res){
    res.render('pages/sobre');
});

// ========== ROTAS PROTEGIDAS - ALUNO ==========

router.get('/planofree', function(req,res){
    res.render('pages/planofree');
});

router.get('/nossosplanos', function(req,res){
    res.render('pages/nossosplanos');
});

router.get('/confpag', verificaAluno, function(req,res){
    res.render('pages/confpag');
});

router.get('/pagamento', verificaAluno, function(req,res){
    res.render('pages/pagamento', { errors: {}, values: {} });
});

router.get('/assistir', verificaLogin, function(req,res){
    res.render('pages/assistir');
});

router.get('/videosfree', verificaAluno, function(req,res){
    res.render('pages/videosfree');
});

router.get('/todosvideos', verificaAluno, function(req,res){
    res.render('pages/todosvideos');
});

// ========== ROTAS PROTEGIDAS - PROFESSOR ==========

router.get('/professoredita', verificaProfessor, function(req,res){
    res.render('pages/professoredita');
});

router.get('/videosprofessor', verificaProfessor, function(req,res){
    res.render('pages/videosprofessor');
});

router.get('/professormain', verificaProfessor, function(req,res){
    res.render('pages/professormain');
});

// ========== ROTA DE LOGOUT ==========

router.get('/logout', function(req, res) {
    req.session.destroy((err) => {
        if (err) {
            console.error('Erro ao fazer logout:', err);
        }
        res.redirect('/login');
    });
});

// ========== POST LOGIN ==========

router.post('/login',
    [
        body('email')
            .trim()
            .notEmpty().withMessage('E-mail é obrigatório.')
            .isEmail().withMessage('E-mail inválido.')
            .normalizeEmail(),
        body('password')
            .notEmpty().withMessage('Senha é obrigatória.')
    ],
    (req, res) => {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            const errors = result.array().reduce((acc, err) => {
                acc[err.param] = err.msg;
                return acc;
            }, {});
            return res.status(422).render('pages/login', {
                errors,
                values: { email: req.body.email || '' },
                mensagemErro: ''
            });
        }

        const { email, password, tipoUsuario } = req.body;

        // Busca o usuário baseado no tipo selecionado
        let usuarioEncontrado = null;
        let tipo = '';

        if (tipoUsuario === 'aluno') {
            usuarioEncontrado = USUARIOS.alunos.find(u => 
                u.email === email && u.senha === password
            );
            tipo = 'aluno';
        } else if (tipoUsuario === 'professor') {
            usuarioEncontrado = USUARIOS.professores.find(u => 
                u.email === email && u.senha === password
            );
            tipo = 'professor';
        }

        if (!usuarioEncontrado) {
            return res.redirect('/login?erro=credenciais_invalidas');
        }

        // Cria a sessão do usuário
        req.session.user = {
            id: usuarioEncontrado.id,
            email: usuarioEncontrado.email,
            nome: usuarioEncontrado.nome,
            tipo: tipo
        };

        // Pega o destino salvo (se houver)
        const redirectTo = req.session.redirectTo || null;
        delete req.session.redirectTo; // Limpa o destino

        // Salva a sessão e redireciona
        req.session.save((err) => {
            if (err) {
                console.error('Erro ao salvar sessão:', err);
                return res.redirect('/login?erro=erro_sistema');
            }
            
            // Se tem destino específico, vai para lá
            if (redirectTo) {
                return res.redirect(redirectTo);
            }
            
            // Senão, redireciona para a página inicial correspondente
            if (tipo === 'aluno') {
                return res.redirect('/diamante'); // CORRIGIDO: caminho absoluto
            } else {
                return res.redirect('/professormain'); // Página inicial do professor
            }
        });
    }
);

// POST CADASTRO ALUNO
router.post('/cadastroaluno',
    [
        body('email')
            .trim()
            .notEmpty().withMessage('E-mail é obrigatório.')
            .isEmail().withMessage('E-mail inválido.')
            .normalizeEmail(),
        body('password')
            .notEmpty().withMessage('Senha é obrigatória.')
            .isLength({ min: 8 }).withMessage('Senha deve ter no mínimo 8 caracteres.')
            .matches(/[A-Za-z]/).withMessage('A senha deve conter letras.')
            .matches(/\d/).withMessage('A senha deve conter números.'),
        body('confirmPassword')
            .notEmpty().withMessage('Confirmação de senha é obrigatória.')
            .custom((v, { req }) => v === req.body.password)
            .withMessage('As senhas não coincidem.')
    ],
    (req, res) => {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            const errors = result.array().reduce((acc, err) => {
                acc[err.param] = err.msg;
                return acc;
            }, {});
            return res.status(422).render('pages/cadastroaluno', {
                errors,
                values: { email: req.body.email || '' }
            });
        }
        // >>> Salvar no banco aqui (quando tiver)
        // Por enquanto, apenas redireciona para login
        return res.redirect('/login');
    }
);

// POST CADASTRO PROFESSOR
router.post('/cadastroprofessor',
    [
        body('email')
            .trim()
            .notEmpty().withMessage('E-mail é obrigatório.')
            .isEmail().withMessage('E-mail inválido.')
            .normalizeEmail(),
        body('password')
            .notEmpty().withMessage('Senha é obrigatória.')
            .isLength({ min: 8 }).withMessage('Senha deve ter no mínimo 8 caracteres.')
            .matches(/[A-Za-z]/).withMessage('A senha deve conter letras.')
            .matches(/\d/).withMessage('A senha deve conter números.'),
        body('confirmPassword')
            .notEmpty().withMessage('Confirmação de senha é obrigatória.')
            .custom((v, { req }) => v === req.body.password)
            .withMessage('As senhas não coincidem.'),
        body('cref')
            .trim()
            .notEmpty().withMessage('CREF é obrigatório.')
            .custom(isValidCREF).withMessage('CREF inválido.')
    ],
    (req, res) => {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            const errors = result.array().reduce((acc, err) => {
                acc[err.param] = err.msg;
                return acc;
            }, {});
            return res.status(422).render('pages/cadastroprofessor', {
                errors,
                values: { email: req.body.email || '', cref: req.body.cref || '' }
            });
        }
        // >>> Salvar no banco aqui (quando tiver)
        return res.redirect('/login');
    }
);

// POST PAGAMENTO
router.post('/pagamento',
    verificaAluno,
    [
        body('fullName').trim().notEmpty().withMessage('Nome completo é obrigatório.'),
        body('cpf').trim().notEmpty().withMessage('CPF é obrigatório.')
            .custom(isValidCPF).withMessage('CPF inválido.'),
        body('phone').trim().notEmpty().withMessage('Telefone é obrigatório.')
            .custom(isValidPhoneBR).withMessage('Telefone inválido.'),
        body('cep').trim().notEmpty().withMessage('CEP é obrigatório.')
            .custom(isValidCEP).withMessage('CEP inválido.'),
        body('state').trim().notEmpty().withMessage('Estado é obrigatório.')
            .custom(isValidUF).withMessage('UF inválida.'),
        body('city').trim().notEmpty().withMessage('Cidade é obrigatória.'),
        body('district').trim().notEmpty().withMessage('Bairro é obrigatório.'),
        body('street').trim().notEmpty().withMessage('Rua é obrigatória.'),
        body('number').trim().notEmpty().withMessage('Número é obrigatório.'),
        body('paymentMethod').isIn(['pix','debit','credit'])
            .withMessage('Método de pagamento inválido.')
    ],
    (req, res) => {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            const errors = result.array().reduce((acc, err) => {
                acc[err.param] = err.msg;
                return acc;
            }, {});
            return res.status(422).render('pages/pagamento', { errors, values: req.body });
        }
        return res.redirect('/confpag');
    }
);

// Adicione esta rota (rotas protegidas - aluno)
router.get('/diamante', verificaAluno, function(req, res){
    // opcional: passe dados do usuário para a view
    res.render('pages/diamante', { user: req.session.user || {} });
});

// Novas rotas para os templates de planos
router.get('/free', verificaAluno, function(req, res){
    res.render('pages/free', { user: req.session.user || {} });
});

router.get('/lazuli', verificaAluno, function(req, res){
    res.render('pages/lazuli', { user: req.session.user || {} });
});

router.get('/prata', verificaAluno, function(req, res){
    res.render('pages/prata', { user: req.session.user || {} });
});

module.exports = router;
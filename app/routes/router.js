var express = require('express');
var router = express.Router();
const { body, validationResult } = require('express-validator');

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

// ========== ROTAS GET EXISTENTES (não alteradas) ==========

router.get('/', function(req,res){
    res.render('pages/index');
});

router.get('/login', function(req,res){
    res.render('pages/login', { 
        title: 'Login', 
        errors: {}, 
        values: { email: '' } 
    });
});

router.get('/cadastroaluno', function(req,res){
    res.render('pages/cadastroaluno', {
        title: 'Cadastro Aluno',
        errors: {},
        values: { email: '' }
    });
});

router.get('/cadastroprofessor', function(req,res){
    res.render('pages/cadastroprofessor', {
        title: 'Cadastro Professor',
        errors: {},
        values: { email: '', cref: '' }
    });
});

router.get('/planofree', function(req,res){
    res.render('pages/planofree');
});

router.get('/nossosplanos', function(req,res){
    res.render('pages/nossosplanos');
});

router.get('/sobre', function(req,res){
    res.render('pages/sobre');
});

router.get('/confpag', function(req,res){
    res.render('pages/confpag');
});

router.get('/pagamento', function(req,res){
    res.render('pages/pagamento', {
        title: 'Dados Pessoais',
        errors: {},
        values: {
            fullName: '', cpf: '', phone: '', cep: '', state: '',
            city: '', district: '', street: '', number: '', complement: '',
            paymentMethod: 'pix'
        },
        plan: {
            name: 'PLANO DIAMANTE; ANUAL',
            installments: 12,
            perInstallment: 105.00,
            total: 1260.00
        }
    });
});

router.get('/professor', function(req,res){
    res.render('pages/professor');
});

router.get('/videosfree', function(req,res){
    res.render('pages/videosfree');
});

// ========== NOVAS ROTAS POST (BACK-END) ==========

// POST LOGIN
router.post(
    '/login',
    [
        body('email')
            .trim()
            .notEmpty().withMessage('E-mail é obrigatório.')
            .isEmail().withMessage('E-mail inválido.')
            .normalizeEmail(),
        body('password')
            .notEmpty().withMessage('Senha é obrigatória.')
            .isLength({ min: 8 }).withMessage('Senha deve ter no mínimo 8 caracteres.')
    ],
    (req, res) => {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            const errors = result.array().reduce((acc, err) => {
                acc[err.param] = err.msg;
                return acc;
            }, {});
            return res.status(422).render('pages/login', {
                title: 'Login',
                errors,
                values: { email: req.body.email || '' }
            });
        }
        // >>> Implemente aqui sua autenticação
        return res.send('Login válido! (implemente a autenticação)');
    }
);

// POST CADASTRO ALUNO
router.post(
    '/cadastroaluno',
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
                title: 'Cadastro Aluno',
                errors,
                values: { email: req.body.email || '' }
            });
        }
        // >>> Implemente aqui o salvamento no banco
        return res.send('Cadastro de aluno válido! (implemente a criação no banco)');
    }
);

// POST CADASTRO PROFESSOR
router.post(
    '/cadastroprofessor',
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
            .custom(isValidCREF).withMessage('CREF inválido. Use dígitos (5–10) ou ex.: 012345-G/SP.')
    ],
    (req, res) => {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            const errors = result.array().reduce((acc, err) => {
                acc[err.param] = err.msg;
                return acc;
            }, {});
            return res.status(422).render('pages/cadastroprofessor', {
                title: 'Cadastro Professor',
                errors,
                values: { email: req.body.email || '', cref: req.body.cref || '' }
            });
        }
        const crefNormalized = onlyDigits(req.body.cref);
        // >>> Implemente aqui o salvamento no banco
        return res.send('Cadastro de professor válido! (implemente a criação no banco)');
    }
);

// POST PAGAMENTO/CHECKOUT
router.post(
    '/pagamento',
    [
        body('fullName').trim().notEmpty().withMessage('Nome completo é obrigatório.')
            .isLength({ min: 2, max: 120 }).withMessage('Nome deve ter entre 2 e 120 caracteres.'),
        body('cpf').trim().notEmpty().withMessage('CPF é obrigatório.')
            .custom(isValidCPF).withMessage('CPF inválido.')
            .customSanitizer(onlyDigits),
        body('phone').trim().notEmpty().withMessage('Telefone é obrigatório.')
            .custom(isValidPhoneBR).withMessage('Telefone inválido. Use DDD e 8–9 dígitos.'),
        body('cep').trim().notEmpty().withMessage('CEP é obrigatório.')
            .custom(isValidCEP).withMessage('CEP inválido.')
            .customSanitizer(onlyDigits),
        body('state').trim().notEmpty().withMessage('Estado é obrigatório.')
            .custom(isValidUF).withMessage('UF inválida.'),
        body('city').trim().notEmpty().withMessage('Cidade é obrigatória.'),
        body('district').trim().notEmpty().withMessage('Bairro é obrigatório.'),
        body('street').trim().notEmpty().withMessage('Rua é obrigatória.'),
        body('number').trim().notEmpty().withMessage('Número é obrigatório.')
            .isLength({ max: 10 }).withMessage('Número muito longo.')
            .customSanitizer(v => onlyDigits(v) || String(v)),
        body('complement').optional({ values:'falsy' }).trim().isLength({ max: 60 })
            .withMessage('Complemento muito longo.'),
        body('paymentMethod').isIn(['pix','debit','credit'])
            .withMessage('Selecione um método de pagamento válido.')
    ],
    (req, res) => {
        const result = validationResult(req);
        const plan = {
            name: 'PLANO DIAMANTE; ANUAL',
            installments: 12,
            perInstallment: 105.00,
            total: 1260.00
        };

        if (!result.isEmpty()) {
            const errors = result.array().reduce((acc, err) => {
                acc[err.param] = err.msg;
                return acc;
            }, {});
            return res.status(422).render('pages/pagamento', {
                title: 'Dados Pessoais',
                errors,
                values: {
                    fullName: req.body.fullName || '',
                    cpf: req.body.cpf || '',
                    phone: req.body.phone || '',
                    cep: req.body.cep || '',
                    state: req.body.state || '',
                    city: req.body.city || '',
                    district: req.body.district || '',
                    street: req.body.street || '',
                    number: req.body.number || '',
                    complement: req.body.complement || '',
                    paymentMethod: req.body.paymentMethod || 'pix'
                },
                plan
            });
        }

        // >>> Implemente aqui: criar pedido, processar pagamento
        return res.redirect('/confpag');
    }
);

module.exports = router;
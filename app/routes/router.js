var express = require('express')
var router = express.Router()

router.get('/', function(req,res){
    res.render('pages/index')
})

router.get('/login', function(req,res){
    res.render('pages/login')
})

router.get('/cadastroaluno', function(req,res){
    res.render('pages/cadastroaluno')
})

router.get('/cadastroprofessor', function(req,res){
    res.render('pages/cadastroprofessor')
})

router.get('/planofree', function(req,res){
    res.render('pages/planofree')
})

router.get('/nossosplanos', function(req,res){
    res.render('pages/nossosplanos')
})

router.get('/sobre', function(req,res){
    res.render('pages/sobre')
})

router.get('/confpag', function(req,res){
    res.render('pages/confpag')
})


router.get('/pagamento', function(req,res){
    res.render('pages/pagamento')
})

router.get('/professor', function(req,res){
    res.render('pages/professor')
})

router.get('/videosfree', function(req,res){
    res.render('pages/videosfree')
})

module.exports = router
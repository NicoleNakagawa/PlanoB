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

module.exports = router
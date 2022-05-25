require('dotenv').config()
const { Router } = require('express')
const express = require('express')
const router = express.Router()
const jwtVerify = require("../middleware/jwtvalidation")


// ! LOGIN
var RouteToLogin = require('../controllers/login.controller')
router.post('/login', function(req, res){
    RouteToLogin.login(req, res)
})

// ! Pengguna
var RouteToPengguna = require('../controllers/pengguna.controller')
router.get('/pengguna', jwtVerify, function(req, res){
    RouteToPengguna.allPengguna(req, res)
})
router.post('/pengguna', jwtVerify, function(req, res){
    RouteToPengguna.addPengguna(req, res)
})
router.put('/pengguna/:idpengguna', jwtVerify, function(req, res){
    RouteToPengguna.updatePengguna(req, res)
})

// ! Setting 
var RouteToSetting = require('../controllers/setting.controller')
router.get('/setting', jwtVerify, function(req, res){
    RouteToSetting.allSetting(req, res)
})
router.post('/setting', jwtVerify, function(req, res){
    RouteToSetting.addSetting(req, res)
})
router.put('/setting/:idsetting', jwtVerify, function(req, res){
    RouteToSetting.updateSetting(req, res)
})

module.exports = router
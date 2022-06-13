require('dotenv').config()
const { Router } = require('express')
const express = require('express')
const router = express.Router()
const jwtVerify = require("../middleware/jwtvalidation")

// ! Dashboard
var RouteToDashboard = require('../controllers/dashboard')
router.get('/jmlpegawai', jwtVerify, function (req, res) {
    RouteToDashboard.getCountPegawai(req, res)
})
router.get('/dashboardpresensi', jwtVerify, function (req, res) {
    RouteToDashboard.DayCountPresensi(req, res)
})

// ! LOGIN
var RouteToLogin = require('../controllers/login.controller')
router.post('/login', function (req, res) {
    RouteToLogin.login(req, res)
})

// ! Pengguna
var RouteToPengguna = require('../controllers/pengguna.controller')
router.get('/pengguna', jwtVerify, function (req, res) {
    RouteToPengguna.allPengguna(req, res)
})
router.post('/pengguna', jwtVerify, function (req, res) {
    RouteToPengguna.addPengguna(req, res)
})
router.put('/pengguna/:idpengguna', jwtVerify, function (req, res) {
    RouteToPengguna.updatePengguna(req, res)
})
router.put('/updaterekamwajah', jwtVerify, function (req, res) {
    RouteToPengguna.updateRekamWajah(req, res)
})

// ! Presensi
var RouteToPresensi = require('../controllers/presensi')
router.get('/presensi', jwtVerify, function (req, res) {
    RouteToPresensi.allPresensi(req, res)
})
router.post('/presensi', jwtVerify, function (req, res) {
    RouteToPresensi.addPresensi(req, res, req.decode)
})

// ! Setting 
var RouteToSetting = require('../controllers/setting.controller')
router.get('/setting', jwtVerify, function (req, res) {
    RouteToSetting.allSetting(req, res)
})
router.post('/setting', jwtVerify, function (req, res) {
    RouteToSetting.addSetting(req, res, req.decode)
})
router.put('/setting/:idsetting', jwtVerify, function (req, res) {
    RouteToSetting.updateSetting(req, res)
})

module.exports = router
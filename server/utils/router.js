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
router.post('/updaterekamwajah', jwtVerify, function (req, res) {
    RouteToPengguna.updateRekamWajah(req, res, req.decode)
})

// ! Presensi
var RouteToPresensi = require('../controllers/presensi')
router.get('/presensi', jwtVerify, function (req, res) {
    RouteToPresensi.allPresensi(req, res)
})
router.get('/presensipengguna', jwtVerify, function (req, res) {
    RouteToPresensi.getPresensiPengguna(req, res, req.decode)
})
router.post('/presensi', jwtVerify, function (req, res) {
    RouteToPresensi.addPresensi(req, res, req.decode)
})

// ! Setting 
var RouteToSetting = require('../controllers/setting.controller')
router.get('/setting', jwtVerify, function (req, res) {
    RouteToSetting.allSetting(req, res)
})
router.get('/settingaktif', jwtVerify, function (req, res) {
    RouteToSetting.activeSetting(req, res)
})
router.post('/setting', jwtVerify, function (req, res) {
    RouteToSetting.addSetting(req, res, req.decode)
})
router.put('/setting/:idsetting', jwtVerify, function (req, res) {
    RouteToSetting.updateSetting(req, res)
})

// ! Lokasi 
var RouteToLokasi = require('../controllers/lokasi')
router.get('/lokasi', jwtVerify, function (req, res) {
    RouteToLokasi.getLokasi(req, res)
})
router.post('/lokasi', jwtVerify, function (req, res) {
    RouteToLokasi.addLokasi(req, res, req.decode)
})
router.put('/lokasi/:idlokasi', jwtVerify, function (req, res) {
    RouteToLokasi.updateLokasi(req, res)
})

// ! Tugas 
var RouteToTugas = require('../controllers/tugas.controller')
router.get('/tugas', jwtVerify, function (req, res) {
    RouteToTugas.getTugas(req, res)
})
router.post('/tugas', jwtVerify, function (req, res) {
    RouteToTugas.addTugas(req, res, req.decode)
})
router.put('/tugas/:idtugas', jwtVerify, function (req, res) {
    RouteToTugas.updateTugas(req, res)
})

module.exports = router
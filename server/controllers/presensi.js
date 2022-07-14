/// import component
require('dotenv').config()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
var connection = require('../utils/connection')

/// configure function for js to mysql using toSqlString 😊
var nows = { toSqlString: function () { return "NOW()" } }
var waktu = new Date()

/// getting all data pengguna
/**
 * * endpoint : GET /pengguna
 * * requirement : jwt token in header
 */
async function allPresensi(req, res) {
    const { periode, tanggalawal, tanggalakhir } = req.query
    var switchtanggalawal = ''
    var switchtanggalakhir = ''
    /// for switching date when first date more than last date
    if (tanggalawal > tanggalakhir) {
        switchtanggalawal = tanggalakhir
        switchtanggalakhir = tanggalawal
    } else {
        switchtanggalawal = tanggalawal
        switchtanggalakhir = tanggalakhir
    }
    /// getting connection with pool
    connection.getConnection(function (error, connect) {
        /// if connection to mysql using pool error will be run code below!
        if (error) {
            return res.status(400).send({
                message: 'Sorry 😞, your connection has refushed!',
                error: error,
                data: null
            })
        } else {
            ///  filtering data by query 
            if (periode == 'now') {
                var sqlquery = `SELECT * FROM pengguna left join presensi on  presensi.idpengguna=pengguna.idpengguna where date(presensi.timestamp)=date(now())`
            } else if (periode == 'periode') {
                var sqlquery = `SELECT * FROM presensi, pengguna where presensi.idpengguna=pengguna.idpengguna and date(presensi.timestamp) between date('${switchtanggalawal}') and date('${switchtanggalakhir}')`
            }
            /// query sql define here!

            connect.query(sqlquery, (error, data) => {
                /// close connection when query has been execute
                connect.release()
                /// if query fail to run will be run code below!
                if (error) {
                    return res.status(500).send({
                        message: 'Sorry 😞, server fail to execute query',
                        error: error,
                        data: null
                    })
                } else {
                    /// if data presensi empty will be run code below!
                    if (data.length <= 0) {
                        return res.status(204).send({
                            message: 'Sorry 😞, Data empty',
                            error: null,
                            data: data
                        })
                    } else {
                        return res.status(200).send({
                            message: 'Data has fetching!',
                            error: null,
                            data: data
                        })
                    }
                }
            })
        }
    })

}

/// getting  data presensi pengguna
/**
 * * endpoint : GET /pengguna
 * * requirement : jwt token in header
 */
 async function getPresensiPengguna(req, res, decode) {
    const { filter } = req.query
    
    /// getting connection with pool
    connection.getConnection(function (error, connect) {
        /// if connection to mysql using pool error will be run code below!
        if (error) {
            return res.status(400).send({
                message: 'Sorry 😞, your connection has refushed!',
                error: error,
                data: null
            })
        } else {
            ///  filtering data by query 
            if (filter == 'semua') {
                var sqlquery = `SELECT *, DATE_FORMAT( timestamp, "%Y-%m-%d") as tanggal, '-' as lokasi FROM presensi WHERE idpengguna = ${decode.idpengguna} ORDER BY timestamp DESC`
            } else if (filter != 'semua' && filter !='') {
                var sqlquery = `SELECT *, DATE_FORMAT( timestamp, "%%Y-%m-%d") as tanggal, '-' as lokasi FROM presensi WHERE idpengguna = ${decode.idpengguna} and date(timestamp) - INTERVAL ${filter} DAY ORDER BY timestamp DESC`
            }else{
                var sqlquery = `SELECT *, DATE_FORMAT( timestamp, "%Y-%m-%d") as tanggal, '-' as lokasi FROM presensi WHERE idpengguna = ${decode.idpengguna} and date(timestamp)=date(now()) ORDER BY timestamp DESC`
            }
            connect.query(sqlquery, (error, data) => {
                /// close connection when query has been execute
                connect.release()
                /// if query fail to run will be run code below!
                if (error) {
                    return res.status(500).send({
                        message: 'Sorry 😞, server fail to execute query',
                        error: error,
                        data: null
                    })
                } else {
                    /// if data presensi empty will be run code below!
                    if (data.length <= 0) {
                        return res.status(204).send({
                            message: 'Sorry 😞, Data empty',
                            error: null,
                            data: data
                        })
                    } else {
                        return res.status(200).send({
                            message: 'Data has fetching!',
                            error: null,
                            data: data
                        })
                    }
                }
            })
        }
    })

}

/// Adding data Presensi
/**
 * * endpoint : POST /presensi
 * * requirement jwt token in header, flag_presensi, latitude, longitude in body
 */
async function addPresensi(req, res, datatoken) {
    /// parameter configuration
    const { latitude, longitude, device, idpengguna } = req.body
    var flag_presensi = 0
    const jam = waktu.getHours()
    const menit = waktu.getMinutes()
    const jammenit = jam.toString()+':'+menit.toString()+':'+waktu.getSeconds()
    var idpenggunas = datatoken.idpengguna;
    if(idpengguna!=''){
        idpenggunas = idpengguna
    }
    /// getting connection with pool
    connection.getConnection(function (error, connect) {
        /// if connection to mysql using pool error will be run code below!
        if (error) {
            return res.status(400).send({
                message: 'Sorry 😞, your connection has refushed!',
                error: error,
                data: null
            })
        } else {
            /// using begin transaction for conversion traffict to queue
            connect.beginTransaction(function (error) {
                /// if begin transaction fail to handling traffic will be run code below!
                if (error) {
                    return res.status(400).send({
                        message: 'Sorry 😞, we have over traffic right now, please take a minute and try again...',
                        error: error,
                        data: null
                    })
                } else {
                    /// select setting active
                    var sqlquery = 'select * from setting where flag_aktif=1'
                    connect.query(sqlquery, (error, resultsetting) => {
                        if (error) {
                            /// rollback connection when query has been error to execute
                            connect.rollback(function () {
                                return res.status(407).send({
                                    message: 'Sorry 😞, we have problems with sql query...',
                                    error: error,
                                    data: null
                                })
                            })
                        } else {
                            /// filtering flag presensi when time presensi <= jam masuk from database  or <= jam keluar from database
                            if (jammenit <= resultsetting[0].jam_masuk) {
                                flag_presensi = 1
                            } else if (jam >= resultsetting[0].jam_keluar) {
                                flag_presensi = 0
                            } else {
                                flag_presensi = 2
                            }
                            /// declare input form for save to database
                            let datapresensi = {
                                timestamp: nows,
                                flag_presensi: flag_presensi,
                                idpengguna: idpenggunas,
                                idsetting: resultsetting[0].idsetting,
                                latitude: latitude,
                                longitude: longitude,
                                waktu: nows,
                                device: device
                            }
                            /// query sql define here!
                            var sqlquery = "INSERT INTO presensi SET ?"
                            /// execute sql query
                            connect.query(sqlquery, datapresensi, (error, result) => {
                                /// close connection when query has been execute
                                connect.release()
                                ///checking query
                                if (error) {
                                    /// rollback connection when query has been error to execute
                                    connect.rollback(function () {
                                        return res.status(407).send({
                                            message: 'Sorry 😞, we have problems with sql query...',
                                            error: error,
                                            data: null
                                        })
                                    })
                                } else {
                                    /// commit query when query doesn't have error 
                                    connect.commit(function (errorcommit) {
                                        /// if commit error connection will be rollback
                                        if (errorcommit) {
                                            connect.rollback(function () {
                                                return res.status(407).send({
                                                    message: 'Sorry 😞, we fail to store your data..., please try again.',
                                                    error: errorcommit,
                                                    data: null
                                                })
                                            })
                                        } else {
                                            return res.status(201).send({
                                                message: 'Congrats! 😉, your data has been stored!, refresh your page.',
                                                error: null,
                                                data: null
                                            })
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            })
        }
    })

}

module.exports = {
    allPresensi,
    getPresensiPengguna,
    addPresensi
}
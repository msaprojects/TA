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
    const { periode, tanggalawal, tanggalakhir, idpengguna } = req.query
    console.log("🚀 ~ file: presensi.controller.js ~ line 18 ~ allPresensi ~ periode", periode)
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
            var sqlquery = ''
            ///  filtering data by query 
            switch (periode) {
                case 'now':
                    sqlquery = `SELECT *, DATE_FORMAT( presensi.timestamp, "%d-%m-%Y %H:%m") as timestamp, if(presensi.flag_presensi=1, if(presensi.waktu>setting.jam_masuk, timediff(presensi.waktu, setting.jam_masuk), 'Tidak Terlambat'), presensi.waktu) as terlambat FROM pengguna left join presensi on  presensi.idpengguna=pengguna.idpengguna left join setting on presensi.idsetting=setting.idsetting where date(presensi.timestamp)=date(now()) order by presensi.idpresensi desc`
                    break
                case 'periode':
                    sqlquery = `SELECT *, DATE_FORMAT( presensi.timestamp, "%d-%m-%Y %H:%m") as timestamp, if(presensi.flag_presensi=1, if(presensi.waktu>setting.jam_masuk, timediff(presensi.waktu, setting.jam_masuk), 'Tidak Terlambat'), presensi.waktu) as terlambat FROM pengguna left join presensi on  presensi.idpengguna=pengguna.idpengguna left join setting on presensi.idsetting=setting.idsetting where date(presensi.timestamp) between date('${switchtanggalawal}') and date('${switchtanggalakhir}') and presensi.idpengguna='${idpengguna}'`
                    break
                case 'all':
                    sqlquery = `SELECT *, DATE_FORMAT( presensi.timestamp, "%d-%m-%Y %H:%m") as timestamp, if(presensi.flag_presensi=1, if(presensi.waktu>setting.jam_masuk, timediff(presensi.waktu, setting.jam_masuk), 'Tidak Terlambat'), presensi.waktu) as terlambat FROM pengguna left join presensi on  presensi.idpengguna=pengguna.idpengguna left join setting on presensi.idsetting=setting.idsetting;`
                    break
                default:
                    return res.status(404).send({
                        message: 'Sorry 😞, parameter tidak sesuai',
                        error: error,
                        data: null
                    })

            }
            // if (periode == 'now') {
            //     sqlquery = `SELECT *, if(presensi.flag_presensi=1, if(presensi.waktu>setting.jam_masuk, timediff(presensi.waktu, setting.jam_masuk), 'Tidak Terlambat'), presensi.waktu) as terlambat FROM pengguna left join presensi on  presensi.idpengguna=pengguna.idpengguna left join setting on presensi.idsetting=setting.idsetting where date(presensi.timestamp)=date(now()) order by presensi.idpresensi desc`
            // } else if (periode == 'periode') {
            //     // sqlquery = `SELECT * FROM presensi, pengguna where presensi.idpengguna=pengguna.idpengguna and date(presensi.timestamp) between date('${switchtanggalawal}') and date('${switchtanggalakhir}')`
            //     sqlquery = `SELECT *, if(presensi.flag_presensi=1, if(presensi.waktu>setting.jam_masuk, timediff(presensi.waktu, setting.jam_masuk), 'Tidak Terlambat'), presensi.waktu) as terlambat FROM pengguna left join presensi on  presensi.idpengguna=pengguna.idpengguna left join setting on presensi.idsetting=setting.idsetting where date(presensi.timestamp) between date('${switchtanggalawal}') and date('${switchtanggalakhir}')`
            // } else if (periode == 'terlambat') {
            //     sqlquery = `SELECT * FROM presensi, pengguna where presensi.idpengguna=pengguna.idpengguna and date(presensi.timestamp) between date('${switchtanggalawal}') and date('${switchtanggalakhir}')`
            // } else if (periode == 'all') {
            //     sqlquery = `SELECT * FROM presensi, pengguna where presensi.idpengguna=pengguna.idpengguna `
            // }
            /// query sql define here!
console.log(sqlquery)
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
                var sqlquery = `select *, DATE_FORMAT( p.timestamp, "%d-%m-%Y %H:%m") as tanggalpresensi, DATE_FORMAT( t.created, "%d-%m-%Y %H:%m") as tanggaltugasdibuat from presensi p left join tugas t on t.idtugas=p.idtugas left join lokasi l on t.idlokasi=l.idlokasi where p.idpengguna=${decode.idpengguna} order by p.idpresensi DESC;`
            } else if (filter != 'semua' && filter != '') {
                var sqlquery = `select * from presensi p left join tugas t on t.idtugas=p.idtugas left join lokasi l on t.idlokasi=l.idlokasi where p.idpengguna=${decode.idpengguna} and date(p.timestamp) - INTERVAL ${filter} DAY order by p.idpresensi DESC;`
            } else {
                var sqlquery = `select * from presensi p left join tugas t on t.idtugas=p.idtugas left join lokasi l on t.idlokasi=l.idlokasi where p.idpengguna=${decode.idpengguna} order by p.idpresensi DESC;`
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
 * !case on this function
 * | checking flag presensi
 * | checking active setting
 * | insert presensi in
 * | update flag tugas in
 * | insert presensi out
 * | update flag tugas out
 */
async function addPresensi(req, res, datatoken) {
    /// parameter configuration
    const { latitude, longitude, device, idpengguna, idtugas } = req.body
    const jam = waktu.getHours()
    const menit = waktu.getMinutes()
    const jammenit = jam.toString() + ':' + menit.toString() + ':' + waktu.getSeconds()
    // console.log(latitude, longitude, device, idpengguna, idtugas)
    ///testing check duplicate values
    // for (var key in req.body) {
    // if (req.body.hasOwnProperty(key)) {
    const z = Object.values(req.body)

    // var item = key
    // console.log('je', key.length, item)
    if (Array.isArray(z)) {
        var removeduplicatevalues = z.filter((val, index) => z.indexOf(val) == index)
    }
    // }
    // }

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
                    ///checking status presensi pegawai
                    var checkpresensi = `SELECT * from presensi where idpengguna=? and date(timestamp)=date(now()) ORDER BY idpresensi DESC limit 1`
                    connect.query(checkpresensi, [idpengguna], (error, resultcheckpresensi) => {
                        // console.log(resultcheckpresensi)
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
                            // ! checking status presensi jika belum melakukan presensi maka akan di lakukan presensi masuk dan jika sudah maka akan dilakukan presensi keluar
                            if (resultcheckpresensi.length <= 0) {
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
                                        /// declare input form for save to database
                                        let datapresensi = {
                                            timestamp: nows,
                                            flag_presensi: 1,
                                            idpengguna: idpengguna,
                                            idsetting: resultsetting[0].idsetting,
                                            latitude: latitude,
                                            longitude: longitude,
                                            waktu: nows,
                                            device: device,
                                            idtugas: idtugas
                                        }
                                        console.log(datapresensi)
                                        /// query sql define here!
                                        var sqlquery = "INSERT INTO presensi SET ?"
                                        /// execute sql query
                                        connect.query(sqlquery, datapresensi, (error, result) => {
                                            /// close connection when query has been execute
                                            // connect.release()
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
                                                ///  filtering, when presensi fot task change flag aktif to 1 for set task on going or set to 2 set flag done!
                                                if (idtugas != 0 || idtugas != '0') {
                                                    let datatugas = {
                                                        flag_aktif: 1
                                                    }
                                                    /// query sql define here!
                                                    // update flag tugas
                                                    var updatetugas = "UPDATE tugas SET ? WHERE idtugas=?"
                                                    /// execute sql query
                                                    connect.query(updatetugas, [datatugas, idtugas], (errortugas, resulttugas) => {
                                                        connect.release()
                                                        if (errortugas) {
                                                            /// rollback connection when query has been error to execute
                                                            connect.rollback(function () {
                                                                return res.status(407).send({
                                                                    message: 'Sorry 😞, we have problems with sql queryx...',
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
                                                                        message: `ada berhasil melakukan presensi!`,
                                                                        error: null,
                                                                        data: null
                                                                    })
                                                                }
                                                            })
                                                        }
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
                                                            connect.release()
                                                            return res.status(201).send({
                                                                message: `ada berhasil melakukan presensi!`,
                                                                error: null,
                                                                data: null
                                                            })
                                                        }
                                                    })
                                                }
                                            }
                                        })
                                    }
                                })
                            } else {
                                // ! insert data presensi out
                                if (resultcheckpresensi[0].flag_presensi == 1) {
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
                                            /// declare input form for save to database
                                            let datapresensi = {
                                                timestamp: nows,
                                                flag_presensi: 2,
                                                idpengguna: idpengguna,
                                                idsetting: resultsetting[0].idsetting,
                                                latitude: latitude,
                                                longitude: longitude,
                                                waktu: nows,
                                                device: device,
                                                idtugas: idtugas
                                            }
                                            /// query sql define here!
                                            var sqlquery = "INSERT INTO presensi SET ?"
                                            /// execute sql query
                                            connect.query(sqlquery, datapresensi, (errortugas, resulttugas) => {
                                                /// close connection when query has been execute
                                                connect.release()
                                                ///checking query
                                                if (errortugas) {
                                                    /// rollback connection when query has been error to execute
                                                    connect.rollback(function () {
                                                        return res.status(407).send({
                                                            message: 'Sorry 😞, we have problems with sql query...',
                                                            error: error,
                                                            data: null
                                                        })
                                                    })
                                                } else {
                                                    if (idtugas != 0 || idtugas != '0') {
                                                        let datatugas = {
                                                            flag_aktif: 2
                                                        }
                                                        /// query sql define here!
                                                        // update flag tugas
                                                        var sqlquery = "UPDATE tugas SET ? WHERE idtugas=?"
                                                        /// execute sql query
                                                        connect.query(sqlquery, [datatugas, idtugas], (error, result) => {
                                                            connect.release()
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
                                                                            message: `ada berhasil melakukan presensi!`,
                                                                            error: null,
                                                                            data: null
                                                                        })
                                                                    }
                                                                })
                                                            }
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
                                                                connect.release()
                                                                return res.status(201).send({
                                                                    message: `ada berhasil melakukan presensi!`,
                                                                    error: null,
                                                                    data: null
                                                                })
                                                            }
                                                        })
                                                    }
                                                }
                                            })
                                        }
                                    })
                                } else if (resultcheckpresensi[0].flag_presensi == 2) {
                                    return res.status(201).send({
                                        message: `anda sudah melakukan presensi` + jammenit.toString(),
                                        error: null,
                                        data: null
                                    })
                                }
                            }
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
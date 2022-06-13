/// import component
require('dotenv').config()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
var connection = require('../utils/connection')

/// configure function for js to mysql using toSqlString 😊
var nows = { toSqlString: function () { return "NOW()" } }

/// getting count data pegawai
/**
 * * endpoint : GET /jmlpegawai
 * * requirement : jwt token in header
 */
async function getCountPegawai(req, res) {
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
            /// query sql define here!
            var sqlquery = "SELECT count(idpengguna) as jml_pengguna FROM pengguna"
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

/// getting day of data presensi
/**
 * * endpoint : GET /summarypreseni
 * * requirement : jwt token in header
 */
 async function DayCountPresensi(req, res) {
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
            /// query sql define here!
            var sqlquery = `SELECT (SELECT count(idpresensi) FROM presensi WHERE date(timestamp)=date(now())) as jml_presensi, (SELECT count(idpresensi) FROM presensi WHERE device='Mobile' and date(timestamp)=date(now())) as jml_presensi_mobile, (SELECT count(idpresensi) FROM presensi WHERE device='Site' and date(timestamp)=date(now())) as jml_presensi_site`
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

module.exports = {
    getCountPegawai,
    DayCountPresensi
}
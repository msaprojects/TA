/// import component
const { database } = require('firebase-admin')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const connection = require('../utils/connection')

/// Login
/**
 * * endpoint : /login
 * * requirement username and password in body
 */

async function login(req, res) {
    /// define variable here!
    const { username, password, device, uuid } = req.body
    try {
        /// getting connection with pool
        connection.getConnection(function (error, connect) {
            /// checking connection with pool
            if (error) {
                return res.status(501).send({
                    message: 'Sorry 😞, your connection has refushed!',
                    error: error,
                    data: null
                })
            } else {
                var sqlquery = "";

                /// define sqlquery here!
                if (device == 'WEB') {
                    sqlquery = 'SELECT * FROM pengguna where username = ?'
                } else {
                    sqlquery = 'SELECT * FROM pengguna where username = ? and uuid = ?'
                }
                connect.query(sqlquery, [username, uuid], function (error, rows) {
                    /// close connection when sql query has been execute!
                    connect.release()
                    /// checing query if sql query has been error will be message code below!
                    if (error) {
                        return res.status(407).send({
                            message: 'Sorry 😞, we wehave problem with sql query ...',
                            error: error,
                            data: null
                        })
                    } else {
                        /// checking when result null or '' will be message code below!
                        if (rows.length <= 0) {
                            return res.status(400).send({
                                message: 'Sorry 😞, username not found or your device not valid!',
                                error: rows.length,
                                data: null
                            })
                        } else {
                            /// comparing password string and password inside database within bcrypt
                            bcrypt.compare(password, rows[0].password, (errorreadcrypt, resultcrypt) => {
                                if (resultcrypt) {
                                    /// value inside token validation!
                                    const dataToken = {
                                        idpengguna: rows[0].idpengguna,
                                        device: device,
                                        uuid: rows[0].uuid
                                    }
                                    /// set access token with value and token expired
                                    const access_token = jwt.sign(dataToken, process.env.ACCESS_SECRET, {
                                        expiresIn: process.env.ACCESS_EXPIRED
                                    })
                                    /// return code when password match
                                    return res.status(200).send({
                                        message: 'Login anda berhasil, 😉',
                                        access_token: access_token,
                                        nama: rows[0].nama,
                                        jabatan: rows[0].jabatan,
                                        rekam_wajah: rows[0].rekam_wajah,
                                        data: resultcrypt,
                                        /// idpengguna ditampilkan untuk keperluan presensi, karena api presensi belum bisa filter otomatis antara presensi by mobile atauu web
                                        idpengguna: rows[0].idpengguna,
                                    })
                                } else {
                                    /// return when password not match!
                                    return res.status(401).send({
                                        message: 'Sorry 😞, your password was wrong!',
                                        error: errorreadcrypt,
                                        data: null
                                    })
                                }
                            })
                        }
                    }
                })
            }
        })
    } catch (error) {
        return res.status(401).send({
            message: 'forbidden',
            error: error,
            data: null
        })
    }
}

module.exports = {
    login
}
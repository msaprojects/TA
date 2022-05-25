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
    const {username, password, device} = req.body
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
                /// define sqlquery here!
                var sqlquery = 'SELECT * FROM pengguna where username = ?'
                connect.query(sqlquery, [username], function (error, rows) {
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
                                message: 'Sorry 😞, username not found!',
                                error: rows.length,
                                data: null
                            })
                        } else {
                            console.log(password, rows[0].password)
                            /// comparing password string and password inside database within bcrypt
                            bcrypt.compare(password, rows[0].password, (errorreadcrypt, resultcrypt) => {
                                console.log(errorreadcrypt, resultcrypt)
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
                                        data: resultcrypt
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
        console.log('Error Login?', error)
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
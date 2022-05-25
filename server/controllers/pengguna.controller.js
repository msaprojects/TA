/// import component
require('dotenv').config()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
var connection = require('../utils/connection')

/// configure function for js to mysql using toSqlString 😊
var nows = { toSqlString: function () { return "NOW()" } }

/// getting all data pengguna
/**
 * * endpoint : GET /pengguna
 * * requirement : jwt token in header
 */
async function allPengguna(req, res) {
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
            var sqlquery = "SELECT * FROM pengguna"
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
                    /// if data pengguna empty will be run code below!
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

/// Adding data pengguna
/**
 * * endpoint : POST /pengguna
 * * requirement jwt token in header, nama, username, password, jabatan, flag_aktif in body
 */
async function addPengguna(req, res) {
    /// parameter configuration
    const { nama, username, password, jabatan, flag_aktif, uuid } = req.body
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
                }
                /// encrypt password using bcrypt
                bcrypt.hash(password, 10, (errorencrypt, encrypted) => {
                    /// handling if password fail to encrypted
                    if (errorencrypt) {
                        return res.status(407).send({
                            message: 'Sorry 😞, we fail encrypt your password, please try again...',
                            error: errorencrypt,
                            data: null
                        })
                    } else {
                        /// declare input form for save to database
                        let dataPengguna = {
                            nama: nama,
                            username: username,
                            password: encrypted,
                            jabatan: jabatan,
                            flag_aktif: flag_aktif,
                            created: nows,
                            uuid: uuid
                        }
                        /// query sql define here!
                        var sqlquery = "INSERT INTO pengguna SET ?"
                        /// execute sql query
                        connect.query(sqlquery, dataPengguna, (error, result) => {
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
            })
        }
    })

}

/// Update data pengguna
/**
 * * endpoint : PUT /pengguna
 * * requirement jwt token in header, nama, username, password, jabatan, flag_aktif in body and idpengguna in path
 */
async function updatePengguna(req, res) {
    /// parameter configuration
    const { nama, username, password, jabatan, flag_aktif, uuid } = req.body
    const { idpengguna } = req.params
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
                }
                /// encrypt password using bcrypt
                bcrypt.hash(password, 10, (errorencrypt, encrypted) => {
                    /// handling if password fail to encrypted
                    if (errorencrypt) {
                        return res.status(407).send({
                            message: 'Sorry 😞, we fail encrypt your password, please try again...',
                            error: errorencrypt,
                            data: null
                        })
                    } else {
                        /// declare update form for save to database
                        let dataPengguna = {
                            nama: nama,
                            username: username,
                            password: encrypted,
                            jabatan: jabatan,
                            flag_aktif: flag_aktif,
                            created: nows,
                            uuid: uuid
                        }
                        /// query sql define here!
                        var sqlquery = "UPDATE pengguna SET ? WHERE idpengguna = ?"
                        /// execute sql query
                        connect.query(sqlquery, [dataPengguna, idpengguna], (error, result) => {
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
                                        return res.status(200).send({
                                            message: 'Congrats! 😉, your data has been updated!, refresh your page.',
                                            error: null,
                                            data: null
                                        })
                                    }
                                })
                            }
                        })
                    }
                })
            })
        }
    })
}

module.exports = {
    allPengguna,
    addPengguna,
    updatePengguna
}
/// import component
require('dotenv').config()
const jwt = require('jsonwebtoken')
const connection = require('../utils/connection')


/// configure function for js to mysql using toSqlString 😊
var nows = { toSqlString: function () { return "NOW()" } }

/// getting all data setting
/**
 * * endpoint : GET /setting
 * * requirement : jwt token in header
 */
async function allSetting(req, res) {

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
            var sqlquery = "SELECT * FROM setting"
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
                    /// if data setting empty will be run code below!
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

/// Adding data Setting
/**
 * * endpoint : POST /setting
 * * requirement jwt token in header, jam_masuk, jam_keluar, toleransi, flag_aktif in body
 */
async function addSetting(req, res, datatoken) {
    /// parameter configuration
    const { jam_masuk, jam_keluar, toleransi, flag_aktif } = req.body
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
                /// declare input form for save to database
                let dataSetting = {
                    jam_masuk: jam_masuk,
                    jam_keluar: jam_keluar,
                    toleransi: toleransi,
                    flag_aktif: flag_aktif,
                    created: nows,
                    idpengguna: datatoken.idpengguna
                }
                /// query sql define here!
                var sqlquery = "INSERT INTO setting SET ?"
                /// execute sql query
                connect.query(sqlquery, dataSetting, (error, result) => {
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
            })
        }
    })
}

/// Update data Setting
/**
 * * endpoint : PUT /setting
 * * requirement jwt token in header, jam_masuk, jam_keluar, toleransi, flag_aktif in body and idsetting in path
 */
async function updateSetting(req, res) {
    /// parameter configuration
    const { jam_masuk, jam_keluar, toleransi, flag_aktif } = req.body
    const { idsetting } = req.params
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
                /// declare update form for save to database
                let dataSetting = {
                    jam_masuk: jam_masuk,
                    jam_keluar: jam_keluar,
                    toleransi: toleransi,
                    flag_aktif: flag_aktif,
                    edited: nows,
                    idpengguna: jwtresult.idpengguna
                }
                /// query sql define here!
                var sqlquery = "UPDATE setting SET ? WHERE idsetting = ?"
                /// execute sql query
                connect.query(sqlquery, [dataSetting, idsetting], (error, result) => {
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
            })
        }
    })
}

module.exports = {
    allSetting,
    addSetting,
    updateSetting
}
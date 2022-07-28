/// import component
require('dotenv').config()
const jwt = require('jsonwebtoken')
const connection = require('../utils/connection')


/// configure function for js to mysql using toSqlString 😊
var nows = { toSqlString: function () { return "NOW()" } }

/// getting all data lokasi
/**
 * * endpoint : GET /setting
 * * requirement : jwt token in header
 */
async function getTugas(req, res) {
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
            var sqlquery = "SELECT t.*, l.nama as lokasi, l.longitude, l.latitude, p.nama FROM tugas t, pengguna p, lokasi l where t.idpengguna=p.idpengguna and l.idlokasi=t.idlokasi"
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

/// getting all data lokasi
/**
 * * endpoint : GET /setting
 * * requirement : jwt token in header
 */
async function getTugasByPenggua(req, res, datatoken) {
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
            var sqlquery = "SELECT t.*, l.nama as lokasi, l.longitude, l.latitude, p.nama FROM tugas t, pengguna p, lokasi l where t.idpengguna=p.idpengguna and l.idlokasi=t.idlokasi and p.idpengguna = ?"
            connect.query(sqlquery, [datatoken.idpengguna], (error, data) => {
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

/// Adding data lokasi
/**
 * * endpoint : POST /lokasi
 * * requirement jwt token in header, keterangan, idlokasi, idpengguna in body
 */
async function addTugas(req, res, datatoken) {
    /// parameter configuration
    const { keterangan, idpengguna, idlokasi, flag_aktif } = req.body
    console.log(keterangan, idpengguna, idlokasi, flag_aktif)
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
                let addData = {
                    keterangan: keterangan,
                    idpengguna: idpengguna,
                    idlokasi: idlokasi,
                    flag_aktif: flag_aktif,
                    created: nows
                }

                /// query sql define here!
                var sqlquery = "INSERT INTO tugas SET ?"
                /// execute sql query
                connect.query(sqlquery, addData, (error, result) => {
                    console.log(result, error)
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
 * * requirement jwt token in header, lokasi, latitude, longitude, flag_aktif in body and idsetting in path
 */
async function updateTugas(req, res) {
    /// parameter configuration
    const { keterangan, idpengguna, idlokasi } = req.body
    const { idtugas } = req.params
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
                let updateData = {
                    keteranga: keterangan,
                    idpengguna: idpengguna,
                    idlokasi: lokasi,
                    flag_aktif: flag_aktif,
                    created: nows
                }
                /// query sql define here!
                var sqlquery = "UPDATE tugas SET ? WHERE idtugas = ?"
                /// execute sql query
                connect.query(sqlquery, [updateData, idtugas], (error, result) => {
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
    getTugas,
    getTugasByPenggua,
    addTugas,
    updateTugas
}
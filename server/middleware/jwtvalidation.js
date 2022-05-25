require('dotenv').config()
const jwt = require('jsonwebtoken')
var pool = require('../utils/connection')

async function jwtVerify(req, res, next) {
    const token = req.headers.authorization
    console.log(token)
    if (!token) {
        return res.status(401).send({
            message: 'Sorry 😞, We need token to authorization.',
            error: null,
            data: null
        })
    }
    try {
        const decode = jwt.verify(token.split(' ')[1], process.env.ACCESS_SECRET)
        req.decode = decode
        /// checking api version and app version
        if (decode.appversion < process.env.API_VERSION) {
            return res.status(401).send({
                message: 'Sorry 😞, your apps too old, please update your apps or report to administrator.',
                error: null,
                data: null
            })
        } else {
            /// checkin uuid in token and database active or deactive
            pool.getConnection(function (error, database) {
                if (error) {
                    console.log("Pool Refused jwt..", error)
                    return res.status(501).send({
                        message: "Connection timeout.",
                        data: error
                    })
                } else {
                    var sqlquery = "SELECT idpengguna FROM pengguna WHERE uuid=? AND idpengguna=?"
                    database.query(sqlquery, [decode.uuid, decode.idpengguna], function (error, rows) {
                        database.release()
                        if (error) {
                            console.log("error query")
                            return res.status(407).send({
                                message: "Sorry, sql query have problems",
                                data: error
                            })
                        } else {
                            /// if uuid deactive will be return code below
                            if (!rows.length) {
                                console.log("device not active")
                                return res.status(401).send({
                                    message: 'Sorry 😞, your Device id not active.',
                                    error: null,
                                    data: null
                                })
                            } else {
                                /// if uuid successed will be return code belows
                                next()
                            }
                        }
                    })
                }
            })
        }
    } catch (error) {
        console.log('Error JWT', error)
        return res.status(401).send({
            message: 'Sorry 😞, your session has been expired, please logout and login again.',
            error: error,
            data: null
        })
    }
}

module.exports = jwtVerify
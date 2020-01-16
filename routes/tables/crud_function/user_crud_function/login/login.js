const syncConnection = require('../../../../../app').syncConnection

const dbConfig = require('../../../../../database_config/database');
const mysql = require('mysql');
const connection = mysql.createConnection(dbConfig.connection);

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const token_config = require('../../../../../database_config/token_config')

const checkKey = require('../../../input_key_check/key_check')
const Response = require('../../../../response_class')

connection.query('USE ' + dbConfig.database);

const loginUser = (req, res) => {
    console.log('loginUser 호출됨')
    let paramObj = req.body
    let checkArr = checkKey(paramObj, 'login_column')
    if (checkArr[0] === 0) {
        console.log('key value error')
        let code = 400; //Bad Request
        let success = 0
        let data = []
        let message = 'check your key value of your request body again.'
        let error = null
        let response = new Response(code, success, null, data, message, error)
        res.send(response)
    } else {
        let paramId = paramObj['id']
        let paramPassword = paramObj['password']
        console.log(`요청 파라미터 id: ${paramId}`)
        loginFunction(paramId, paramPassword, function (err, result, info, status) {
            if (err) {
                console.log('login 도중 error 발생')
                let code = status //Internal Server Error
                let success = 0
                let data = []
                let message = info
                let error = err
                let response = new Response(code, success, null, data, message, error)
                res.send(response)
            } else if (result) {
                console.log(`login success`)
                let code = status //Created
                let success = 1
                let data = [result]
                let message = info
                let error = err
                let response = new Response(code, success, null, data, message, error)
                res.send(response)
            } else {
                let code = status; //Internal Server Error
                let success = 0
                let data = []
                let message = info
                let error = null
                let response = new Response(code, success, null, data, message, error)
                res.send(response)
            }
        })
    }
}


const loginFunction = (id, password, done) => {
    console.log(`loginFunction 호출됨`)
    let info = ''
    let status = 500
    connection.query("SELECT * FROM login WHERE id = ?", [id], function(err, rows){
        if (err) {
            console.log(err)
            info = 'login select query 문에서 error 발생'
            status = 500
            done(err, null, info, status)
        } else {
            if(rows.length) {
                bcrypt.compare(password, rows[0].password, async function (err, isMatch) {
                    if (err) {
                        console.log(err)
                        status = 500
                        info = 'login 도중 bcrypt compare callback 함수에서 error 발생'
                        done(err, null, info, status)
                    } else if (isMatch) {
                        let payload = {user: rows[0].user}
                        let secret = token_config.secret
                        let expiresIn = {expiresIn: token_config.expiresIn}
                        let token = jwt.sign(payload, secret, expiresIn)
                        let tokenObj = {token: token}
                        status = 200
                        let userInfo = syncConnection.query('SELECT user_Index, user_name, user_gender, user_email, user_birth, user_created_at, user_updated_at FROM user where login_id = ?', [id])
                        let userInfo1;
                        if (userInfo.length > 0) {
                            info = 'login success'
                            userInfo1 = Object.assign(tokenObj, userInfo[0])
                        } else {
                            info = 'login success but there is no user information.'
                            userInfo1 = Object.assign(tokenObj, userInfo[0])
                        }
                        done(null, userInfo1, info, status)
                    } else {
                        console.log('Authentication error')
                        info = `Authentication error`
                        status = 401
                        done(null, null, info, status)
                    }
                })
            } else {
                status = 400 // Bad Request
                info = 'There is no registered Id. Please sign up.'
                done(null, null, info, status)
            }
        }
    })
}


module.exports.loginUser = loginUser
const dbConfig = require('../../../../../database_config/database');
const mysql = require('mysql');
const connection = mysql.createConnection(dbConfig.connection);

const bcrypt = require('bcrypt');
const token_config = require('../../../../../database_config/token_config')

const checkKey = require('../../../input_key_check/key_check')
const Response = require('../../../../response_class')

connection.query('USE ' + dbConfig.database);

const registerUser = (req, res) => {
    console.log('register User 호출됨')
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
        let paramUserName = paramObj['user_name']
        console.log(`요청 파라미터 id: ${paramId}`)
        let array = []
        registerFunction(paramId, paramPassword, paramUserName,function (err, user, info) {
            if (err) {
                console.log(`register 도중 error 발생`)
                let code = 500 //Internal Server Error
                let success = 0
                let data = array
                let message = info
                let error = err
                let response = new Response(code, success, null, data, message, error)
                res.send(response)
            } else if (user) {
                let code = 201 //Created
                let success = 1
                let data = user
                let message = info
                let error = err
                let response = new Response(code, success, null, data, message, error)
                res.send(response)
            } else {
                let code = 500; //Internal Server Error
                let success = 0
                let data = array
                let message = info
                let error = null
                let response = new Response(code, success, null, data, message, error)
                res.send(response)
            }
        })
    }
}

const registerFunction = (id, password, username, done) => {
    console.log(`registerFunction 호출됨.`)
    let info = ''
    connection.query("SELECT * FROM login WHERE id = ?",[id], function(err, rows) {
        if (err) {
            console.log(`mysql register select query 문에서 error 발생`)
            info = 'mysql register select query 문에서 error 발생'
            done(err, null, info)
        } else if (rows.length === 0) {
            let newId = id
            bcrypt.hash(password, token_config.salt, function (err, hash) {
                if (err) {
                    console.log(`password hash 하다 error 발생`)
                    info = 'password hash 하다 error 발생'
                    done(err, null, info)
                } else {
                    console.log('hash 성공')
                    let newPassword = hash
                    let insertQuery = "INSERT INTO login ( id, password ) values (?,?)";
                    connection.query(insertQuery,[newId, newPassword],function(err, rows) {
                        if (err) {
                            console.log(err)
                            info = 'mysql register insert query 문에서 error 발생'
                            done(err, null, info)
                        } else if (rows) {
                            connection.query('select registerUser(?,?) as user_index', [username, newId], function (err, result) {
                                if (err) {
                                    console.log(err)
                                    info = 'login id password 저장 후 user table 에 username 따로 저장 중 error 발생'
                                    done(err, null, info)
                                } else if (result) {
                                    console.log(`register 성공`)
                                    info = 'register 성공'
                                    done(null, result, info);
                                } else {
                                    console.log(`register 중 username insert 실패`)
                                    info = 'register 중 username insert 실패'
                                    done(null, null, info);
                                }
                            })
                        } else {
                            console.log('register 중 id password insert 실패')
                            info = 'register 중 id password insert 실패'
                            done(null, null, info)
                        }
                    });
                }
            })
        } else {
            console.log('이미 등록된 id 입니다.')
            info = '이미 등록된 id 입니다.'
            done(err, null, info)
        }
    });
}



module.exports.registerUser = registerUser
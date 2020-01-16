const pool = require('../../../../app').pool
const checkKey = require('../../input_key_check/key_check')
const Response = require('../../../response_class')

const updateUserById = (req, res) => {
    console.log(`updateUserById 호출됨.`)
    if (req.authenticated === true) {
        console.log(`token 있음`)
        let paramId = req.params.id
        let paramNewObj = req.body

        let checkArr2 = checkKey(paramNewObj, 'user_column')
        if (checkArr2[0] === 0) {
            let code = 400 //Bad Request
            let success = 0
            let data = []
            let message = 'key value error'
            let error = 'newObj => ' + checkArr2[1]
            let response = new Response(code, success, null, data, message, error)
            res.send(response)
        } else {
            console.log(`요청 파라미터 : ${paramId} , ${paramNewObj}`)
            let array = []

            if (pool) {
                if (paramId !== undefined) {
                    updateById(paramId, paramNewObj, function (err, result, info) {
                        if (err) {
                            console.log(`login id 값으로 user 업데이트 도중 에러 발생함.`)
                            let code = 500; //Internal Server Error
                            let success = 0
                            let data = []
                            let message = info
                            let error = err
                            let response = new Response(code, success, null, data, message, error)
                            res.send(response)
                        } else if (result) {
                            console.dir(result)
                            array.push(result)
                            let code = 200 //OK
                            let success = 1
                            let data = array
                            let message = info
                            let error = err
                            let response = new Response(code, success, null, data, message, error)
                            res.send(response)
                        } else {
                            console.log(`result 없음`)
                            array.push(result)
                            let code = 500 //Internal Server Error
                            let success = 0
                            let data = []
                            let message = info
                            let error = null
                            let response = new Response(code, success, null, data, message, error)
                            res.send(response)
                        }
                    })
                } else {
                    let code = 400; //Bad Request
                    let success = 0
                    let data = []
                    let message = 'Please input id data on url'
                    let error = null
                    let response = new Response(code, success, null, data, message, error)
                    res.send(response)
                }
            } else {
                console.log(`데이터베이스 연결 안됨.`)
                let code = 500; //Internal Server Error
                let success = 0
                let data = []
                let message = '데이터베이스 연결 안됨.'
                let error = null
                let response = new Response(code, success, null, data, message, error)
                res.send(response)
            }
        }
    } else {
        console.log('token 없음 ')
        let code = 401; // Unauthorized
        let success = 0
        let data = []
        let message = 'request Header에 token 없음'
        let error = null
        let response = new Response(code, success, null, data, message, error)
        res.send(response)
    }
}

const updateById = (id, newObj, callback) => {
    console.log(`updateById 호출됨.`)
    pool.getConnection(function (err, conn) {
        let info = ''
        if (err) {
            if (conn) {
                conn.release()
            }
            info = 'pool connection 도중 error 발생'
            callback(err, null, info)
            return
        }
        console.log('데이터베이스 연결 스레드 아이디 : ' + conn.threadId)
        conn.query('select * from user where login_id = ?', [id], function (err, result) {
            if (err) {
                conn.release()
                console.log('login_id select query 중 error 발생')
                info = 'login_id select query 중 error 발생'
                callback(err, null, info)
            } else if (result.length > 0) {
                console.log('해당 login_id 존재')
                let exec = conn.query('update user set ? where login_id = ?', [newObj, [id]], function (err, results) {
                    conn.release()
                    console.log('실행 대상 SQL : ' + exec.sql)

                    if (err) {
                        console.log(`SQL 실행 시 오류 발생함`)
                        console.dir(err)
                        info = 'update query 문 중 error 발생'
                        callback(err, null, info)
                        return
                    }
                    if (results) {
                        console.log('update success')
                        info = 'update success'
                        callback(null, results, info)
                    } else {
                        console.log('update failure')
                        info = 'update failure'
                        callback(null, null, info)
                    }
                })
            } else {
                console.log('해당 id 존재 안함')
                info = '해당 id 존재 안함'
                callback(null, null, info)
            }
        })

    })
}


module.exports.updateUserById = updateUserById

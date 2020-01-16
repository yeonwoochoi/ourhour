const pool = require('../../../../app').pool
const checkKey = require('../../input_key_check/key_check')
const Response = require('../../../response_class')

const updateUser = (req, res) => {
    console.log(`updateUser 호출됨.`)
    if (req.authenticated === true) {
        console.log(`token 있음`)
        let paramLoginId = req.body["login_id"]
        let paramNewObj = req.body["newObj"]
        if (paramNewObj !== undefined || paramLoginId !== undefined) {
        let checkArr = checkKey(paramNewObj, 'user_column')
        if (checkArr[0] === 0) {
            let code = 400 //Bad Request
            let success = 0
            let data = []
            let message = 'key value error'
            let error =  'newObj => ' + checkArr[1]
            let response = new Response(code, success, null, data, message, error)
            res.send(response)
        }  else {
            console.log(`요청 파라미터 : ${paramLoginId} , ${paramNewObj}`)

            let array = []
            if (pool) {
                updateUserList(paramLoginId, paramNewObj, function (err, result) {
                    if (err) {
                        console.log(`user 업데이트 도중 에러 발생함.`)
                        let code = 500; //Internal Server Error
                        let success = 0
                        let data = array
                        let message = 'user 업데이트 도중 에러 발생함.'
                        let error = err
                        let response = new Response(code, success, null, data, message, error)
                        res.send(response)
                    }
                    if (result) {
                        console.dir(result)
                        array.push(result)
                        let code = 200 //OK
                        let success = 1
                        let data = array
                        let message = 'user 업데이트 성공.'
                        let error = err
                        let response = new Response(code, success, null, data, message, error)
                        res.send(response)
                    } else {
                        console.log(`result 없음`)
                        array.push(result)
                        let code = 500 //Internal Server Error
                        let success = 0
                        let data = array
                        let message = 'user 업데이트 안됨.'
                        let error = null
                        let response = new Response(code, success, null, data, message, error)
                        res.send(response)
                    }
                })
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
        } else if (paramLoginId === undefined) {
            console.log('login_id is undefined')
            let code = 400 //Bad Request
            let success = 0
            let data = []
            let message = 'login_id is undefined'
            let error = null
            let response = new Response(code, success, null, data, message, error)
            res.send(response)
        } else {
            console.log('newObj is undefined or there are some problems at request form')
            let code = 400 //Bad Request
            let success = 0
            let data = []
            let message = 'newObj is undefined or there are some problems at request form'
            let error = null
            let response = new Response(code, success, null, data, message, error)
            res.send(response)
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

const updateUserList = (login_id, newObj, callback) => {
    console.log(`updateUserList 호출됨.`)
    pool.getConnection(function (err, conn) {
        if (err) {
            if (conn) {
                conn.release()
            }
            callback(err, null)
            return
        }
        console.log('데이터베이스 연결 스레드 아이디 : ' + conn.threadId)

        let exec = conn.query('update user set ? where login_id = ? ', [newObj, login_id], function (err, results) {
            conn.release()
            console.log('실행 대상 SQL : ' + exec.sql)

            if (err) {
                console.log(`SQL 실행 시 오류 발생함`)
                console.dir(err)
                callback(err, null)
                return
            }
            callback(null, results)
        })
    })
}


module.exports.updateUser = updateUser

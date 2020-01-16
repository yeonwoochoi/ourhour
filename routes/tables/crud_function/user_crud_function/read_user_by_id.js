const pool = require('../../../../app').pool
const Response = require('../../../response_class')

const readUserById = (req, res) => {
    console.log(`readUserById 호출됨`)
    let array = []

    if (req.authenticated === true) {
        console.log(`token 있음`)
        if (pool) {
            let id = req.params.id
            if (id !== undefined) {
                findUserById(id, function (err, result, info) {
                    if (err) {
                        console.log('id 값으로 user 검색 중 error 발생.')
                        let code = 500 //Internal Server Error
                        let success = 0
                        let data = array
                        let message = 'id 값으로 user 검색 중 error 발생. => ' + info
                        let error = err
                        let response = new Response(code, success, null, data, message, error)
                        res.send(response)
                    }
                    if (result) {
                        console.dir(result)
                        let code = 200 //OK
                        let success = 1
                        let data = result
                        let message = info
                        let error = err
                        let response = new Response(code, success, null, data, message, error)
                        res.send(response)
                    } else {
                        console.log(`result 값 없음`)
                        array.push(result)
                        let code = 500; //Internal Server Error
                        let success = 0
                        let data = array
                        let message = info
                        let error = null
                        let response = new Response(code, success, null, data, message, error)
                        res.send(response)
                    }
                })
            } else {
                console.log(`There is no id param`)
                let code = 400 //Bad Request
                let success = 0
                let data = []
                let message = 'There is no id param.'
                let error = null
                let response = new Response(code, success, null, data, message, error)
                res.send(response)
            }
        } else {
            console.log(`데이터베이스 연결 안됨.`)
            let code = 500 //Internal Server Error
            let success = 0
            let data = []
            let message = '데이터베이스 연결 안됨.'
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

const findUserById = (id, callback) => {
    console.log(`findUserById 호출됨`)
    pool.getConnection(function(err, conn) {
        if (err) {
            if (conn) {
                conn.release()
            }
            callback(err, null, 'pool connection 도중 오류 발생')
            return
        }
        console.log('데이터베이스 연결 스레드 아이디 : '+ conn.threadId)
        let exec = conn.query('select * from user where login_id = ?', [id], function (err, result) {
            conn.release()
            console.log(`실행 대상 SQL : ${exec.sql}`)

            if (err) {
                console.log(`SQL 실행 시 error 발생함`)
                console.dir(err)
                callback(err, null, 'login_id로 select query 중 error 발생')
            } else if (result.length > 0) {
                console.log('id 값 존재')
                callback(null, result, 'read user success')
            } else {
                callback(null, null, 'id에 해당하는 user 정보 없음.')
            }
        })
    })
}

module.exports.readUserById = readUserById
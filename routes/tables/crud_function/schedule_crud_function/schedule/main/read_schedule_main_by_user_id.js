const pool = require('../../../../../../app').pool
const Response = require('../../../../../response_class')

const readScheduleMainByUserId = (req, res) => {
    console.log(`readScheduleMainByUserId 호출됨`)
    let array = []

    if (req.authenticated === true) {
        console.log(`token 있음`)
        if (pool) {
            let userIndex = req.params.id
            if (userIndex !== undefined) {
                findScheduleMainByUserId(userIndex, function (err, result) {
                    if (err) {
                        console.log(`userIndex 값으로 schedule main 검색 중 error 발생`)
                        let code = 500 //Internal Server Error
                        let success = 0
                        let data = array
                        let message = 'userIndex 값으로 schedule main 검색 중 error 발생'
                        let error = err
                        let response = new Response(code, success, null, data, message, error)
                        res.send(response)
                    }
                    if (result) {
                        console.dir(result)
                        let code = 200 //OK
                        let success = 1
                        let data = result
                        let message = 'userIndex 값으로 schedule main 검색 성공.'
                        let error = err
                        let response = new Response(code, success, null, data, message, error)
                        res.send(response)
                    } else {
                        array.push(result)
                        let code = 500; //Internal Server Error
                        let success = 0
                        let data = array
                        let message = 'userIndex 값을 schedule main 검색 실패.'
                        let error = null
                        let response = new Response(code, success, null, data, message, error)
                        res.send(response)
                    }
                })
            } else {
                console.log(`There is no userIndex param`)
                let code = 500 //Internal Server Error
                let success = 0
                let data = []
                let message = `There is no userIndex param`
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


const findScheduleMainByUserId = (user_index, callback) => {
    console.log(`findScheduleMainByUserId 호출됨`)
    pool.getConnection(function(err, conn) {
        if (err) {
            if (conn) {
                conn.release()
            }
            callback(err, null)
            return
        }
        console.log('데이터베이스 연결 스레드 아이디 : '+ conn.threadId)
        let exec = conn.query('select * from routine1view where user_index = ?', [user_index], function (err, result) {
            conn.release()
            console.log(`실행 대상 SQL : ${exec.sql}`)

            if (err) {
                console.log(`SQL 실행 시 error 발생함`)
                console.dir(err)
                callback(err, null)
                return
            }
            callback(null, result)
        })
    })
}

module.exports.readScheduleMainByUserId = readScheduleMainByUserId
const pool = require('../../../../../../app').pool
const Response = require('../../../../../response_class')

const readAllScheduleMain = (req, res) => {
    console.log(`readAllScheduleMain 호출됨.`)

    let array = []
    if (req.authenticated === true) {
        console.log(`token 있음`)
        if (pool) {
            findAllScheduleMain (function (err, result) {
                if (err) {
                    console.log('schedule main data 읽는 중 에러 발생함')
                    let code = 500 //Internal Server Error
                    let success = 0
                    let data = array
                    let message = 'schedule main data 모두 읽는 중 error 발생함.'
                    let error = err
                    let response = new Response(code, success, null, data, message, error)
                    res.send(response)
                    return
                }
                if (result.length > 0) {
                    console.dir(result)
                    let code = 200 //OK
                    let success = 1
                    let data = result
                    let message = 'schedule main data 모두 검색 성공.'
                    let error = err
                    let response = new Response(code, success, null, data, message, error)
                    res.send(response)
                } else {
                    console.log('모든 schedule data 검색 실패')
                    let code = 500; //Internal Server Error
                    let success = 0
                    let data = []
                    let message = '모든 schedule main data 검색 실패'
                    let error = null
                    let response = new Response(code, success, null, data, message, error)
                    res.send(response)
                }
            })
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
        console.log('token 없음')
        let code = 401; // Unauthorized
        let success = 0
        let data = []
        let message = 'request Header에 token 없음'
        let error = null
        let response = new Response(code, success, null, data, message, error)
        res.send(response)
    }
}

const findAllScheduleMain = (callback) => {
    console.log(`findAllScheduleMain 호출됨`)

    pool.getConnection(function (err, conn) {
        if(err) {
            if(conn) {
                conn.release()
            }
            callback(err, null);
            return
        }
        console.log('데이터베이스 연결 스레드 아이디 : ' + conn.threadId)
        let exec = conn.query('select * from schedule_main', function (err, result) {
            conn.release()
            console.log('실행 대상 SQL : ' + exec.sql)

            if (err){
                console.log('SQL 실행 시 오류 발생함.')
                console.dir(err)
                callback(err, null);
                return
            }
            if (result) {

                callback(null, result)
            } else {
                callback(null, null)
            }
        })
    })
}


module.exports.readAllScheduleMain = readAllScheduleMain


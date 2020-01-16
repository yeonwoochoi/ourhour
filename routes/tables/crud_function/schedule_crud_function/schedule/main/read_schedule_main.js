const pool = require('../../../../../../app').pool
const checkKey = require('../../../../input_key_check/key_check')
const Response = require('../../../../../response_class')
const typeChange = require('../../../../../../utils/typeChange')

const readScheduleMain = (req, res) => {
    console.log(`readScheduleMain 호출됨.`)
    if (req.authenticated === true) {
        console.log(`token 있음`)
        let paramObj = req.body
        let checkArr = checkKey(paramObj, 'schedule_main_column')
        if (checkArr[0] === 0) {
            console.log('key value error')
            let code = 400; //Bad Request
            let success = 0
            let data = []
            let message = 'check your key value of your request body again.'
            let error = checkArr[1]
            let response = new Response(code, success, null, data, message, error)
            res.send(response)
        } else {
            let paramUserIndex = paramObj['user_index']
            console.log(`요청 파라미터 : ${paramUserIndex}`)
            if (pool) {
                findScheduleMain (paramUserIndex, function(err, result) {
                    if (err) {
                        console.log('schedule main 검색 중 에러 발생.')
                        let code = 500 //Internal Server Error
                        let success = 0
                        let data = array
                        let message = 'schedule main 검색 중 error 발생함.'
                        let error = err
                        let response = new Response(code, success, null, data, message, error)
                        res.send(response)
                    } else if (result) {
                        console.dir(result)
                        let code = 200 //OK
                        let success = 1
                        let data = result
                        let message = 'schedule main 검색 성공.'
                        let error = err
                        let response = new Response(code, success, null, data, message, error)
                        res.send(response)
                    } else {
                        array.push(result)
                        let code = 500; //Internal Server Error
                        let success = 0
                        let data = array
                        let message = 'schedule main 검색 실패.'
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

const findScheduleMain = (userIndex, callback) => {
    console.log(`findScheduleMain 호출됨.`)

    pool.getConnection(function (err, conn) {
        if (err) {
            if (conn) {
                conn.release()
            }
            callback(err, null)
            return
        }
        console.log('데이터베이스 연결 스레드 아이디 : ' + conn.threadId)
        if (userIndex) {
            let exec = conn.query('select * from routine1view where user_index = ? union select * from routine2view where user_index = ?;', [userIndex, userIndex], function (err, result) {
                conn.release()
                console.log('실행 대상 SQL : ' + exec.sql)

                if (err) {
                    console.log('SQL 실행 도중 오류 발생.')
                    console.dir(err)
                    callback(err, null)
                    return
                }
                if (result) {
                    for (let i = 0; i < result.length; i++) {
                        let oldData1 = result[i]['schedule_start']
                        let oldData2 = result[i]['schedule_end']
                        let newData1 = typeChange.changeDateType(oldData1)
                        let newData2 = typeChange.changeDateType(oldData2)
                        result[i]['schedule_start'] = newData1
                        result[i]['schedule_end'] = newData2
                    }
                    callback(null, result)
                } else {
                    callback(null, null)
                }
            })
        } else {
            callback(null, null)
        }
    })
}

module.exports.readScheduleMain = readScheduleMain

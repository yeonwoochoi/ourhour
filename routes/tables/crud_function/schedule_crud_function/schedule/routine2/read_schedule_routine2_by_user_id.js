const pool = require('../../../../../../app').pool
const checkKey = require('../../../../input_key_check/key_check');
const Response = require('../../../../../response_class')
const typeChange = require('../../../../../../utils/typeChange')

const readScheduleRoutine2ByUserId = (req, res) => {
    console.log(`readScheduleRoutine2ByUserId 호출됨`)
    let array = []

    if (req.authenticated === true) {
        console.log(`token 있음`)
        let paramObj = req.body
        let checkArr = checkKey(paramObj, 'schedule_routine_column')
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
            let userIndex = paramObj['user_index']
            console.log(`요청 파라미터 : ${userIndex}`)
            if (pool) {
                if (userIndex !== undefined && userIndex !== null) {
                    findScheduleRoutine2ByUserId(userIndex, function (err, result) {
                        if (err) {
                            console.log(`userIndex 값으로 schedule routine2 검색 중 error 발생`)
                            let code = 500 //Internal Server Error
                            let success = 0
                            let data = array
                            let message = 'userIndex 값으로 schedule routine2 검색 중 error 발생'
                            let error = err
                            let response = new Response(code, success, null, data, message, error)
                            res.send(response)
                        }
                        if (result.length > 0) {
                            console.dir(result)
                            let code = 200 //OK
                            let success = 1
                            let data = result
                            let message = 'userIndex 값으로 schedule routine2 검색 성공.'
                            let error = err
                            let response = new Response(code, success, null, data, message, error)
                            res.send(response)
                        } else if (result.length === 0) {
                            let code = 404 // Not Found
                            let success = 0
                            let data = []
                            let message = 'data 가 존재하지 않습니다.'
                            let error = null
                            let response = new Response(code, success, null, data, message, error)
                            res.send(response)
                        } else {
                            let code = 500; //Internal Server Error
                            let success = 0
                            let data = result
                            let message = 'userIndex 값을 schedule routine2 검색 실패.'
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


const findScheduleRoutine2ByUserId = (user_index, callback) => {
    console.log(`findScheduleRoutine2ByUserId 호출됨`)
    pool.getConnection(function(err, conn) {
        if (err) {
            if (conn) {
                conn.release()
            }
            callback(err, null)
            return
        }
        console.log('데이터베이스 연결 스레드 아이디 : '+ conn.threadId)
        let exec = conn.query('select * from routine2view where user_index = ?', [user_index], function (err, result) {
            conn.release()
            console.log(`실행 대상 SQL : ${exec.sql}`)

            if (err) {
                console.log(`SQL 실행 시 error 발생함`)
                console.dir(err)
                callback(err, null)
                return
            }
            if (result) {
                for (let i = 0; i < result.length; i++) {
                    let oldData1 = result[i]['schedule_start']
                    let oldData2 = result[i]['schedule_end']
                    console.log(oldData1)
                    console.log(oldData2)
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
    })
}

module.exports.readScheduleRoutine2ByUserId = readScheduleRoutine2ByUserId
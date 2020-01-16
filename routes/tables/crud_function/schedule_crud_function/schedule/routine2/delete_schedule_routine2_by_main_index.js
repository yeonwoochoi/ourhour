const pool = require('../../../../../../app').pool
const Response = require('../../../../../response_class')
const checkKey = require('../../../../input_key_check/key_check');


const deleteScheduleRoutine2ByMainIndex = (req, res) => {
    console.log(`deleteScheduleRoutine2ByMainIndex 호출됨.`)
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
            let array = []
            if (pool) {
                let paramMainIndex = paramObj['schedule_index']
                if (paramMainIndex !== undefined && paramMainIndex !== null) {
                    console.log(`요청 파라미터 : ${paramMainIndex}`)
                    deleteScheduleRoutine2List(paramMainIndex, function (err, result) {
                        if (err) {
                            console.log('main index 로 schedule routine2 삭제 중 에러 발생함.')
                            let code = 500; //Internal Server Error
                            let success = 0
                            let data = array
                            let message = 'main index 로 schedule routine2 삭제 중 error 발생함.'
                            let error = err
                            let response = new Response(code, success, null, data, message, error)
                            res.send(response)
                        } else if (result.affectedRows > 0) {
                            console.dir(result)
                            let code = 200 //OK
                            let success = 1
                            let data = array
                            let message = 'main index 로 schedule routine2 삭제 성공.'
                            let error = err
                            let response = new Response(code, success, null, data, message, error)
                            res.send(response)
                        } else if (result.affectedRows === 0) {
                            let code = 404 // Not Found
                            let success = 0
                            let data = []
                            let message = '삭제할 data 가 존재하지 않습니다.'
                            let error = null
                            let response = new Response(code, success, null, data, message, error)
                            res.send(response)
                        } else {
                            array.push(result)
                            let code = 500 //Internal Server Error
                            let success = 0
                            let data = array
                            let message = 'main index 로 schedule routine2 삭제 실패.'
                            let error = null
                            let response = new Response(code, success, null, data, message, error)
                            res.send(response)
                        }
                    })
                }  else {
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

const deleteScheduleRoutine2List = (index, callback) => {
    console.log(`deleteScheduleRoutine2List 호출됨.`)
    pool.getConnection(function (err, conn) {
        if (err) {
            if (conn) {
                conn.release()
            }
            callback(err, null)
            return
        }
        console.log('데이터베이스 연결 스레드 아이디: ' + conn.threadId)

        let exec = conn.query('call deleteRoutine2(?)', [index], function (err, results) {
            conn.release()
            console.log('실행 대상 SQL : ' + exec.sql)
            if (err) {
                console.log('SQL 실행 도중 오류 발생.')
                console.dir(err)
                callback(err, null)
                return
            }

            callback(null, results)
        })
    })
}


module.exports.deleteScheduleRoutine2ByMainIndex = deleteScheduleRoutine2ByMainIndex

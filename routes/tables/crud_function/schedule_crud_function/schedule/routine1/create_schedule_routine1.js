const pool = require('../../../../../../app').pool
const checkKey = require('../../../../input_key_check/key_check');
const Response = require('../../../../../response_class');


const createScheduleType1 = (req, res) => {
    console.log(`createScheduleType1 호출됨.`)
    if (req.authenticated === true) {
        console.log(`token 있음`)
        let time_array = req.body.data;
        for (let i = 0; i < time_array.length; i++) {
            let paramObj = time_array[i]
            let checkArr = checkKey(paramObj, 'schedule_type1_column')
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
                let paramScheduleIndex = paramObj['schedule_index']
                let paramScheduleStart = paramObj['sch_time1_start']
                let paramScheduleEnd = paramObj['sch_time1_end']
                let paramScheduleEndDate = paramObj['sch_time1_end_date']
                let paramScheduleRoutine = paramObj['sch_routine_type']
                console.log(`요청 파라미터 : ${paramScheduleIndex}, ${paramScheduleStart}, ${paramScheduleEnd}, ${paramScheduleEndDate}, ${paramScheduleRoutine}`)
                let array = []
                if (pool) {
                    if (paramScheduleRoutine !== 0 && paramScheduleRoutine !== 1 && paramScheduleRoutine !== 3 && paramScheduleRoutine !== 4 ){
                        console.log('incorrect routine type')
                        let code = 400
                        let success = 0
                        let data = []
                        let message = 'routine type 은 0, 1, 3, 4 중 하나만 된다.'
                        let error = null
                        let response = new Response(code, success, null, data, message, error)
                        res.send(response)
                    } else {
                        addScheduleType1(paramScheduleIndex, paramScheduleStart, paramScheduleEnd, paramScheduleEndDate, paramScheduleRoutine , function (err, result) {
                            if (err) {
                                console.log('schedule type1 추가 중 에러 발생함')
                                let code = 500 //Internal Server Error
                                let success = 0
                                let data = array
                                let message = 'schedule type1 data 추가 중 error 발생함.'
                                let error = err
                                let response = new Response(code, success, null, data, message, error)
                                res.send(response)
                            } else if (result.affectedRows > 0) {
                                console.dir(result)
                                let code = 201 //Created
                                let success = 1
                                let data = result
                                let message = 'schedule type 1 data 추가 성공.'
                                let error = err
                                let response = new Response(code, success, null, data, message, error)
                                res.send(response)
                            } else {
                                array.push(result)
                                let code = 500; //Internal Server Error
                                let success = 0
                                let data = []
                                let message = 'schedule type1 data 추가 실패 || check whether you register your main schedule or not.'
                                let error = null
                                let response = new Response(code, success, null, data, message, error)
                                res.send(response)
                            }
                        })
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



const addScheduleType1 = (index, start, end, end_date, routine, callback) => {
    console.log(`addScheduleType1 호출됨.`)
    pool.getConnection(function (err, conn) {
        if(err) {
            if (conn) {
                conn.release()
            }
            callback(err, null)
            return
        }
        console.log('데이터베이스 연결 스레드 아이디 : ' + conn.threadId)
        // let nowdate = new Date().toISOString().replace(/T..+/, '')
        let exec = conn.query('call addRoutine1 (?, ?, ?, ?, ?)', [index, start, end, end_date, routine], function(err, result) {
            conn.release()
            console.log('실행 대상 SQL : ' + exec.sql)

            if (err) {
                console.log('SQL 실행 시 오류 발생함.')
                console.dir(err)
                callback(err, null)
                return
            }
            callback(null, result)
        })
    })
}

module.exports.createScheduleType1 = createScheduleType1
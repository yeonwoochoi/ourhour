const pool = require('../../../../../../app').pool
const checkKey = require('../../../../input_key_check/key_check');
const Response = require('../../../../../response_class');


const createScheduleType2 = (req, res) => {
    console.log(`createScheduleType2 호출됨.`)
    if (req.authenticated === true) {
        console.log(`token 있음`)
        let time_array = req.body.data;
        for (let i = 0; i < time_array.length; i++) {
            let paramObj = time_array[i]
            let checkArr = checkKey(paramObj, 'schedule_type2_column')
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
                let paramRoutineType = paramObj['sch_routine_type']
                let paramTime2Start = paramObj['sch_time2_start']
                let paramTime2End = paramObj['sch_time2_end']
                let paramTime2RoutineDay = paramObj['sch_time2_day']
                let paramTime2StartTime = paramObj['sch_time2_start_time']
                let paramTime2EndTime = paramObj['sch_time2_end_time']
                console.log(`요청 파라미터 : ${paramScheduleIndex}, ${paramRoutineType}, ${paramTime2Start}, ${paramTime2End}, ${paramTime2RoutineDay}, ${paramTime2StartTime}, ${paramTime2EndTime}`)
                let array = []
                if (pool) {
                    if (paramRoutineType !== 2){
                        console.log('incorrect routine type')
                        let code = 400
                        let success = 0
                        let data = []
                        let message = 'routine type 은 2만 된다.'
                        let error = err
                        let response = new Response(code, success, null, data, message, error)
                        res.send(response)
                    } else {
                        addScheduleType2(paramScheduleIndex, paramRoutineType, paramTime2Start, paramTime2End, paramTime2RoutineDay, paramTime2StartTime, paramTime2EndTime, function (err, result) {
                            if (err) {
                                console.log('schedule type2 추가 중 에러 발생함')
                                let code = 500 //Internal Server Error
                                let success = 0
                                let data = array
                                let message = 'schedule type2 data 추가 중 error 발생함.'
                                let error = err
                                let response = new Response(code, success, null, data, message, error)
                                res.send(response)
                            } else if (result.affectedRows > 0) {
                                console.dir(result)
                                let code = 201 //Created
                                let success = 1
                                let data = result
                                let message = 'schedule type 2 data 추가 성공.'
                                let error = err
                                let response = new Response(code, success, null, data, message, error)
                                res.send(response)
                            } else {
                                array.push(result)
                                let code = 500; //Internal Server Error
                                let success = 0
                                let data = []
                                let message = 'schedule type2 data 추가 실패 || check whether you register your main schedule or not.'
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



const addScheduleType2 = (index, routine, start_date, end_date, day, start_time, end_time, callback) => {
    console.log(`addScheduleType2 호출됨.`)
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
        let exec = conn.query('call addRoutine2 (?, ?, ?, ?, ?, ?, ?)', [index, start_date, end_date, day, start_time, end_time, routine], function(err, result) {
            conn.release()
            console.log('실행 대상 SQL : ' + exec.sql)

            if (err) {
                console.log('SQL 실행 시 오류 발생함.');
                console.dir(err)
                callback(err, null)
                return
            }
            callback(null, result)
        })
    })
}

module.exports.createScheduleType2 = createScheduleType2
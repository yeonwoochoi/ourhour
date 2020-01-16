const pool = require('../../../../../../app').pool
const checkKey = require('../../../../input_key_check/key_check');
const Response = require('../../../../../response_class');


const createScheduleMain = (req, res) => {
    console.log(`createScheduleMain 호출됨.`)
    if (req.authenticated === true) {
        console.log(`token 있음`)
        let timeArray = req.body.data;
        for (let i = 0; i < timeArray.length; i++) {
            let paramObj = timeArray[i]
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
                let paramScheduleTitle = paramObj['schedule_title']
                let paramScheduleContent = paramObj['schedule_content']
                let paramScheduleImportance = paramObj['schedule_importance']
                let paramScheduleDone = paramObj['schedule_done']
                let paramScheduleAccess = paramObj['schedule_access']
                let paramUserIndex = paramObj['user_index']
                console.log(`요청 파라미터 : ${paramScheduleTitle}, ${paramScheduleContent}, ${paramScheduleImportance}, ${paramScheduleDone}, ${paramScheduleAccess}, ${paramUserIndex}`)
                let array = []
                if (pool) {
                    addScheduleMain(paramScheduleTitle, paramScheduleContent, paramScheduleImportance, paramScheduleDone, paramScheduleAccess, paramUserIndex, function (err, result) {
                        if (err) {
                            console.log('schedule 추가 중 에러 발생함')
                            let code = 500 //Internal Server Error
                            let success = 0
                            let data = array
                            let message = 'schedule main 추가 중 error 발생함.'
                            let error = err
                            let response = new Response(code, success, null, data, message, error)
                            res.send(response)
                        } else if (result) {
                            console.dir(result)
                            let code = 201 //Created
                            let success = 1
                            let data = result
                            let message = 'schedule main 정보 추가 성공.'
                            let error = err
                            let response = new Response(code, success, null, data, message, error)
                            res.send(response)
                        } else {
                            array.push(result)
                            let code = 500; //Internal Server Error
                            let success = 0
                            let data = []
                            let message = 'schedule main 정보 추가 실패 || check whether you register your id or not.'
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



const addScheduleMain = (title, content, importance, done, access, userIndex, callback) => {
    console.log(`addScheduleMain 호출됨.`)
    pool.getConnection(function (err, conn) {
        if(err) {
            if (conn) {
                conn.release()
            }
            callback(err, null)
            return
        }
        console.log('데이터베이스 연결 스레드 아이디 : ' + conn.threadId)
        let exec = conn.query('select addScheduleMain(?,?,?,?,?,?) as schedule_index', [title, content, importance, access, done, userIndex], function(err, result) {
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

module.exports.createScheduleMain = createScheduleMain
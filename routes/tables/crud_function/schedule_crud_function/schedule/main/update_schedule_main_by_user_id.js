const pool = require('../../../../../../app').pool
const checkKey = require('../../../../input_key_check/key_check')
const Response = require('../../../../../response_class')

const updateScheduleMainById = (req, res) => {
    console.log(`updateScheduleMainById 호출됨.`)
    if (req.authenticated === true) {
        console.log(`token 있음`)
        let paramObj= req.body
        let paramScheduleIndex = paramObj["schedule_index"]
        let paramNewObj = paramObj["newObj"]
        //let date = new Date().toISOString().replace(/T..+/,'')
        //paramNewObj['schedule_updated_at'] = date
        if (paramNewObj !== undefined && paramScheduleIndex !== undefined) {

            let checkArr2 = checkKey(paramNewObj, 'schedule_main_column')
            if (checkArr2[0] === 0) {
                let code = 400 //Bad Request
                let success = 0
                let data = []
                let message = 'key value error'
                let error =  'newObj => ' + checkArr2[1]
                let response = new Response(code, success, null, data, message, error)
                res.send(response)
            } else {
                console.log(`요청 파라미터 : ${paramScheduleIndex} , ${paramNewObj}`)

                let array = []

                if (pool) {
                    updateByUserIndex(paramScheduleIndex, paramNewObj, function (err, result) {
                        if (err) {
                            console.log(`user_index 값으로 schedule main 업데이트 도중 에러 발생함.`)
                            let code = 500; //Internal Server Error
                            let success = 0
                            let data = array
                            let message = 'user_index 값으로 schedule main 업데이트 도중 에러 발생함.'
                            let error = err
                            let response = new Response(code, success, null, data, message, error)
                            res.send(response)
                        } else if (result.affectedRows > 0) {
                            console.dir(result)
                            array.push(result)
                            let code = 200 //OK
                            let success = 1
                            let data = array
                            let message = 'user_index 값으로 schedule main 업데이트 성공.'
                            let error = err
                            let response = new Response(code, success, null, data, message, error)
                            res.send(response)
                        } else {
                            console.log(`result 없음`)
                            array.push(result)
                            let code = 500 //Internal Server Error
                            let success = 0
                            let data = array
                            let message = 'user_index 값으로 schedule main 업데이트 실패.'
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
        } else if (paramScheduleIndex === undefined) {
            console.log(`There is no schedule_index data in body`)
            let code = 500; //Internal Server Error
            let success = 0
            let data = []
            let message = `There is no schedule_index param`
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

const updateByUserIndex = (schedule_index, newObj, callback) => {
    console.log(`updateByUserIndex 호출됨.`)
    pool.getConnection(function (err, conn) {
        if (err) {
            if (conn) {
                conn.release()
            }
            callback(err, null)
            return
        }
        console.log('데이터베이스 연결 스레드 아이디 : ' + conn.threadId)


        let exec = conn.query('update schedule_main set ? where schedule_index = ?', [newObj, [schedule_index]], function (err, results) {
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


module.exports.updateScheduleMainById = updateScheduleMainById

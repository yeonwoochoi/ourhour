const pool = require('../../../../../app')
const checkKey = require('../../../input_key_check/key_check')
const Response = require('../../../../response_class')


const readRoutine = (req, res) => {
    console.log(`readRoutine 호출됨.`)
    if (req.authenticated === true) {
        console.log(`token 있음`)
        let paramObj = req.body.data
        let checkArr = checkKey(paramObj, 'routine_column')
        if (checkArr[0] === 0) {
            let response = new Response('key value error', [], checkArr[1])
            res.send(response)
        } else {
            let paramScheduleCode = paramObj['schedule_code']
            let paramRoutineType = paramObj['routine_type']


            console.log(`요청 파라미터 : ${paramScheduleCode}, ${paramRoutineType}`)
            let array = []
            if (pool) {
                findRoutine (paramScheduleCode, paramRoutineType, function(err, result) {
                    if (err) {
                        console.log('routine 검색 중 에러 발생.')
                        let response = new Response('routine 검색 중 에러 발생', array, err)
                        res.send(response)
                    }
                    if (result) {
                        console.dir(result)
                        array.push(result)
                        let response = new Response('routine 검색 성공', array, null)
                        res.send(response)
                    } else {
                        array.push(result)
                        let response = new Response('routine 검색 실패', array, null)
                        res.send(response)
                    }
                })
            } else {
                console.log('데이터베이스 연결 안됨.')
                let response = new Response('데이터베이스 연결 안됨.', array, null)
                res.send(response)
            }
        }
    } else {
        console.log('token 없음')
        let response = new Response('There is no token', [], null)
        res.send(response)
    }
}

const findRoutine = (code, type, callback) => {
    console.log(`findRoutine 호출됨.`)
    let checkObj = {
        "schedule_code" : code,
        "routine_type" : type
    }
    let checkObj1 = checkObj
    let checkKeyArray = Object.keys(checkObj)
    let checkValueArray = Object.values(checkObj)
    for (let i = 0; i < checkKeyArray.length; i++) {
        if (checkValueArray[i] === undefined) {
            delete checkObj1[checkKeyArray[i]]
        }
    }
    let newKeyArray = Object.keys(checkObj1)
    let newValueArray = Object.values(checkObj1)
    let string = '';

    if (newKeyArray.length === 1) {
        string += (newKeyArray[0] + ' = ' + "'" + newValueArray[0] + "'")
    } else {
        for (let i = 0; i < newKeyArray.length - 1; i++) {
            string += (newKeyArray[i] + ' = ' + "'" + newValueArray[i] + "'" + " and ")
        }
        string += (newKeyArray[newKeyArray.length - 1] + ' = ' + "'" + newValueArray[newValueArray.length - 1] + "'")
    }

    pool.getConnection(function (err, conn) {
        if (err) {
            if (conn) {
                conn.release()
            }
            callback(err, null)
            return
        }
        console.log('데이터베이스 연결 스레드 아이디 : ' + conn.threadId)
        if (newKeyArray.length > 0) {
            let exec = conn.query('select * from routine where ' + string, function (err, result) {
                conn.release()
                console.log('실행 대상 SQL : ' + exec.sql)

                if (err) {
                    console.log('SQL 실행 도중 오류 발생.')
                    console.dir(err)
                    callback(err, null)
                    return
                }
                callback(null, result)
            })
        } else {
            callback(null, null)
        }
    })
}

module.exports.readRoutine = readRoutine


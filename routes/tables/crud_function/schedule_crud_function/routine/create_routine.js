const pool = require('../../../../../app')
const checkKey = require('../../../input_key_check/key_check')
const Response = require('../../../../response_class')


const createRoutine = (req, res) => {
    console.log(`createRoutine 호출됨.`)
    if (req.authenticated === true) {
        console.log(`token 있음`)
        let paramObj = req.body.data
        let checkArr = checkKey(paramObj, 'routine_column')
        if (checkArr[0] === 0) {
            let response = new Response('key value error', [], checkArr[1])
            res.send(response)
        } else {
            let paramRoutineType = paramObj['routine_type']


            console.log(`요청 파라미터 : ${paramRoutineType}`)
            let array = []
            if (pool) {
                addRoutine(paramRoutineType, function (err, result) {
                    if (err) {
                        console.log('routine 추가 중 에러 발생함')
                        let response = new Response('routine 추가 중 error 발생', array, err)
                        res.send(response)
                    }
                    if (result) {
                        console.dir(result)
                        array.push(result)
                        let response = new Response('routine 추가됨.', array, null)
                        res.send(response)
                    } else {
                        array.push(result)
                        let response = new Response('routine 추가 안됨', array, null)
                        res.send(response)
                    }
                })
            } else {
                console.log(`데이터베이스 연결 안됨.`)
                let response = new Response('데이터베이스 연결 안됨', array, null)
                res.send(response)
            }
        }
    } else {
        console.log('token 없음')
        let response = new Response('There is no token', [], null)
        res.send(response)
    }
}



const addRoutine = (type, callback) => {
    console.log(`addRoutine 호출됨.`)
    pool.getConnection(function (err, conn) {
        if(err) {
            if (conn) {
                conn.release()
            }
            callback(err, null)
            return
        }
        console.log('데이터베이스 연결 스레드 아이디 : ' + conn.threadId)
        let data = {routine_type: type}
        let exec = conn.query('insert into routine set ?', data, function(err, result) {
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

module.exports.createRoutine = createRoutine


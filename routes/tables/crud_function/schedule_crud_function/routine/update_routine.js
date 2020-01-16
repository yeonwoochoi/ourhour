const pool = require('../../../../../app')
const checkKey = require('../../../input_key_check/key_check')
const Response = require('../../../../response_class')

const updateRoutine = (req, res) => {
    console.log(`updateRoutine 호출됨.`)
    if (req.authenticated === true) {
        console.log(`token 있음`)
        let paramSearchObj = req.body['searchObj']
        let paramNewObj = req.body['newObj']

        let checkArr1 = checkKey(paramSearchObj, 'routine_column')
        let checkArr2 = checkKey(paramNewObj, 'routine_column')
        if (checkArr1[0] === 0 || checkArr2[0] === 0) {
            if (checkArr1[0] === 0 && checkArr2[0] === 0) {
                let response = new Response('key value error', [], 'searchObj => ' +  checkArr1[1] + ' and ' + 'newObj => ' + checkArr2[1])
                res.send(response)
            }
            if (checkArr1[0] === 0 && checkArr2[0] !== 0) {
                let response = new Response('key value error', [], 'searchObj => ' +  checkArr1[1])
                res.send(response)
            }
            if (checkArr1[0] !== 0 && checkArr2[0] === 0) {
                let response = new Response('key value error', [], 'newObj => ' + checkArr2[1])
                res.send(response)
            }
        } else {
            console.log(`요청 파라미터 : ${paramSearchObj} , ${paramNewObj}`)

            let array = []
            if (pool) {
                updateRoutineList(paramSearchObj, paramNewObj, function (err, result) {
                    if (err) {
                        console.log(`routine 업데이트 도중 에러 발생함.`)
                        let response = new Response('routine 업데이트 도중 에러 발생함.', array, err)
                        res.send(response)
                    }
                    if (result) {
                        console.dir(result)
                        array.push(result)
                        let response = new Response('routine 업데이트 함', array, null)
                        res.send(response)
                    } else {
                        array.push(result)
                        let response = new Response('routine 업데이트 안됨.', array, null)
                        res.send(response)
                    }
                })
            } else {
                console.log(`데이터베이스 연결 안됨.`)
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

const updateRoutineList = (searchObj, newObj, callback) => {
    console.log(`updateRoutineList 호출됨.`)
    pool.getConnection(function (err, conn) {
        if (err) {
            if (conn) {
                conn.release()
            }
            callback(err, null)
            return
        }
        console.log('데이터베이스 연결 스레드 아이디 : ' + conn.threadId)

        let checkKeyArray = Object.keys(searchObj)
        let checkValueArray = Object.values(searchObj)
        for (let i = 0; i < checkKeyArray.length; i++) {
            if (checkValueArray[i] === undefined) {
                delete searchObj[checkKeyArray[i]]
            }
        }
        let newKeyArray = Object.keys(searchObj)
        let newValueArray = Object.values(searchObj)
        let string = ''
        if (newKeyArray.length === 1) {
            string += (newKeyArray[0] + ' = ' + "'" + newValueArray[0] + "'")
        } else {
            for (let i = 0; i < newKeyArray.length - 1; i++) {
                string += (newKeyArray[i] + ' = ' + "'" + newValueArray[i] + "'" + " and ")
            }
            string += (newKeyArray[newKeyArray.length - 1] + ' = ' + "'" + newValueArray[newValueArray.length - 1] + "'")
        }

        let exec = conn.query('update routine set ? where ' + string, newObj, function (err, results) {
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


module.exports.updateRoutine = updateRoutine

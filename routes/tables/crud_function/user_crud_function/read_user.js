const pool = require('../../../../app').pool
const checkKey = require('../../input_key_check/key_check')
const Response = require('../../../response_class')

const readUser = (req, res) => {
    console.log(`readUser 호출됨.`)
    if (req.authenticated === true) {
        console.log(`token 있음`)
        console.log(req.body)
        let paramObj = req.body
        let checkArr = checkKey(paramObj, 'user_column')
        if (checkArr[0] === 0) {
            console.log('key value error')
            let code = 400; //Bad Request
            let success = 0
            let data = []
            let message = 'check your key value of your request body again.'
            let error = null
            let response = new Response(code, success, null, data, message, error)
            res.send(response)
        } else {
            let paramUserIndex = paramObj['user_index']
            let paramUserName = paramObj['user_name']
            let paramUserGender = paramObj['user_gender']
            let paramUserEmail = paramObj['user_email']
            let paramUserBirth = paramObj['user_birth']
            let paramLoginId = paramObj['login_id']

            console.log(`요청 파라미터 : ${paramUserIndex}, ${paramUserName}, ${paramUserGender}, ${paramUserEmail}, ${paramUserBirth}, ${paramLoginId}`)
            let array = []
            if (pool) {
                findUser (paramUserIndex, paramUserName, paramUserGender, paramUserEmail, paramUserBirth, paramLoginId, function(err, result) {
                    if (err) {
                        console.log('user 검색 중 에러 발생.')
                        let code = 500 //Internal Server Error
                        let success = 0
                        let data = array
                        let message = 'user 검색 중 error 발생함.'
                        let error = err
                        let response = new Response(code, success, null, data, message, error)
                        res.send(response)
                    }
                    if (result) {
                        console.dir(result)
                        let code = 200 //OK
                        let success = 1
                        let data = result
                        let message = 'user 검색 성공.'
                        let error = err
                        let response = new Response(code, success, null, data, message, error)
                        res.send(response)
                    } else {
                        array.push(result)
                        let code = 500; //Internal Server Error
                        let success = 0
                        let data = array
                        let message = 'user 검색 실패.'
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

const findUser = (index, name, gender, email, birth, login_id, callback) => {
    console.log(`findUser 호출됨.`)
    let checkObj = {user_index: index, user_name: name, user_gender: gender, user_email: email, user_birth: birth, login_id: login_id}
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
            let exec = conn.query('select * from user where ' + string, function (err, result) {
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

module.exports.readUser = readUser

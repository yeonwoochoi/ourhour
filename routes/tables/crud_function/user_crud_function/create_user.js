const pool = require('../../../../app').pool
const checkKey = require('../../input_key_check/key_check')
const Response = require('../../../response_class')


const createUser = (req, res) => {
    console.log(`createUser 호출됨.`)
    if (req.authenticated === true) {
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
            let paramUserName = paramObj['user_name']
            let paramUserGender = paramObj['user_gender']
            let paramUserEmail = paramObj['user_email']
            let paramUserBirth = paramObj['user_birth']
            let paramLoginId = paramObj['login_id']
            console.log(`요청 파라미터 : ${paramUserName}, ${paramUserGender}, ${paramUserEmail}, ${paramUserBirth}, ${paramLoginId}`)
            let array = []
            if (pool) {
                addUser(paramUserName, paramUserGender, paramUserEmail, paramUserBirth, paramLoginId, function (err, result) {
                    if (err) {
                        console.log('user 추가 중 에러 발생함')
                        let code = 500 //Internal Server Error
                        let success = 0
                        let data = array
                        let message = 'user 추가 중 error 발생함.'
                        let error = err
                        let response = new Response(code, success, null, data, message, error)
                        res.send(response)
                    } else if (result) {
                        console.dir(result)
                        array.push(result)
                        let code = 201 //Created
                        let success = 1
                        let data = array
                        let message = 'user 정보 추가 성공.'
                        let error = err
                        let response = new Response(code, success, null, data, message, error)
                        res.send(response)
                    } else {
                        array.push(result)
                        let code = 500; //Internal Server Error
                        let success = 0
                        let data = []
                        let message = 'user 정보 추가 실패 || check whether you register your id or not.'
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



const addUser = (name, gender, email, birth, id, callback) => {
    console.log(`addUser 호출됨.`)
    pool.getConnection(function (err, conn) {
        if(err) {
            if (conn) {
                conn.release()
            }
            callback(err, null)
            return
        }
        console.log('데이터베이스 연결 스레드 아이디 : ' + conn.threadId)
        let exec = conn.query("update user set user_gender = ?, user_email = ?, user_birth = ? where login_id = ? and user_name = ? ",[gender, email, birth, id, name] ,function (err, results) {
            conn.release()
            console.log('실행 대상 SQL : ' + exec.sql)
            if (err) {
                console.log('SQL 실행 시 오류 발생함.')
                console.dir(err)
                callback(err, null)
                return;
            }
            if (results.affectedRows !== 0) {
                callback(null, results)
            } else {
                callback(null, null)
            }


        })
    })
}

module.exports.createUser = createUser
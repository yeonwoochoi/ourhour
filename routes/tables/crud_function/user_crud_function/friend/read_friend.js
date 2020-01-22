const pool = require('../../../../../app').pool
const checkKey = require('../../../input_key_check/key_check')
const Response = require('../../../../response_class')


const readFriend = (req, res) => {
    console.log(`readFriend 호출됨.`)
    if (req.authenticated === true) {
        console.log(`token 있음`)
        let paramObj = req.body
        let checkArr = checkKey(paramObj, 'friend_column')
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
            console.log(`요청 파라미터 : ${paramUserIndex}`);
            if (pool) {
                findFriend (paramUserIndex, function(err, result) {
                    if (err) {
                        console.log('friend 검색 중 에러 발생.')
                        let code = 500 //Internal Server Error
                        let success = 0
                        let data = []
                        let message = 'friend 검색 중 에러 발생.'
                        let error = err
                        let response = new Response(code, success, null, data, message, error)
                        res.send(response)
                    } else if (result) {
                        console.dir(result)
                        let code = 200 //OK
                        let success = 1
                        let data = result
                        let message = 'friend 검색 성공.'
                        let error = err
                        let response = new Response(code, success, null, data, message, error)
                        res.send(response)
                    } else {
                        array.push(result)
                        let code = 204; // No Content
                        let success = 0
                        let data = []
                        let message = 'friend 검색 실패.'
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

const findFriend = (user, callback) => {
    console.log(`findFriend 호출됨.`)
    pool.getConnection(function (err, conn) {
        if (err) {
            if (conn) {
                conn.release()
            }
            callback(err, null)
            return
        }
        console.log('데이터베이스 연결 스레드 아이디 : ' + conn.threadId)
        let exec = conn.query('select user_index as friend_index, friend_name from friendview1 where friend_index = ? union\n' +
            'select friend_index, friend_name from friendview2 where user_index = ?', [user, user] , function (err, result) {
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
    })
}

module.exports.readFriend = readFriend

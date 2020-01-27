const pool = require('../../../../../app').pool
const checkKey = require('../../../input_key_check/key_check')
const Response = require('../../../../response_class')


const deleteAuthFriend = (req, res) => {
    console.log(`deleteAuthFriend 호출됨.`)
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
            let paramFriendIndex = paramObj['friend_index']
            console.log(`요청 파라미터 : ${paramUserIndex}, ${paramFriendIndex}`);
            let arr = []
            if (pool) {
                deleteAuthFriendList (paramUserIndex, paramFriendIndex, function(err, result) {
                    if (err) {
                        console.log('friend 인증 목록 삭제 중 에러 발생.')
                        let code = 500 //Internal Server Error
                        let success = 0
                        let data = []
                        let message = 'friend 인증 목록 삭제 중 에러 발생.'
                        let error = err
                        let response = new Response(code, success, null, data, message, error)
                        res.send(response)
                    } else if (result.affectedRows > 0) {
                        console.dir(result)
                        arr.push(result)
                        let code = 200 //OK
                        let success = 1
                        let data = arr
                        let message = 'friend 요청 인증 목록 삭제 성공.'
                        let error = err
                        let response = new Response(code, success, null, data, message, error)
                        res.send(response)
                    } else {
                        let code = 204; // No Content
                        let success = 0
                        let data = []
                        let message = 'friend 요청 인증 목록 삭제 실패.'
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

const deleteAuthFriendList = (userIndex, friendIndex, callback) => {
    console.log(`deleteAuthFriendList 호출됨.`)
    pool.getConnection(function (err, conn) {
        if (err) {
            if (conn) {
                conn.release()
            }
            callback(err, null)
            return
        }
        console.log('데이터베이스 연결 스레드 아이디 : ' + conn.threadId)
        let exec = conn.query('delete from auth_friend where user_index = ? and friend_index = ?', [userIndex, friendIndex] , function (err, result) {
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

module.exports.deleteAuthFriend = deleteAuthFriend

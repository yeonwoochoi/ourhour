const pool = require('../../../../../app').pool
const checkKey = require('../../../input_key_check/key_check')
const Response = require('../../../../response_class')


const deleteAuthMember = (req, res) => {
    console.log(`deleteAuthMember 호출됨.`)
    if (req.authenticated === true) {
        console.log(`token 있음`)
        let paramObj = req.body
        let checkArr = checkKey(paramObj, 'member_column')
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
            let paramGbIndex = paramObj['gb_index']
            console.log(`요청 파라미터 : ${paramUserIndex}, ${paramGbIndex}`);
            if (pool) {
                deleteAuthMemberList (paramUserIndex, paramGbIndex, function(err, result) {
                    if (err) {
                        console.log('member 인증 목록 삭제 중 에러 발생.')
                        let code = 500 //Internal Server Error
                        let success = 0
                        let data = []
                        let message = 'member 인증 목록 삭제 중 에러 발생.'
                        let error = err
                        let response = new Response(code, success, null, data, message, error)
                        res.send(response)
                    } else if (result) {
                        console.dir(result)
                        let code = 200 //OK
                        let success = 1
                        let data = result
                        let message = 'member 요청 인증 목록 삭제 성공.'
                        let error = err
                        let response = new Response(code, success, null, data, message, error)
                        res.send(response)
                    } else {
                        let code = 204; // No Content
                        let success = 0
                        let data = []
                        let message = 'member 요청 인증 목록 삭제 실패.'
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

const deleteAuthMemberList = (userIndex, gbIndex, callback) => {
    console.log(`deleteAuthMemberList 호출됨.`)
    pool.getConnection(function (err, conn) {
        if (err) {
            if (conn) {
                conn.release()
            }
            callback(err, null)
            return
        }
        console.log('데이터베이스 연결 스레드 아이디 : ' + conn.threadId)
        let exec = conn.query('delete from auth_member where member_index = ? and gb_index = ?', [userIndex, gbIndex] , function (err, result) {
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

module.exports.deleteAuthMember = deleteAuthMember

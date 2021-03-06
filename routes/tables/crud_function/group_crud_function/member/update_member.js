const pool = require('../../../../../app').pool
const checkKey = require('../../../input_key_check/key_check')
const Response = require('../../../../response_class')


const updateMember = (req, res) => {
    console.log(`updateMember 호출됨.`)
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
            let error = checkArr[1]
            let response = new Response(code, success, null, data, message, error)
            res.send(response)
        }  else {
            let paramMemberIndex = paramObj['member_index']
            let paramUserIndex = paramObj['user_index']
            let paramGroupIndex = paramObj['gb_index']

            console.log(`요청 파라미터 : ${paramMemberIndex}, ${paramUserIndex}, ${paramGroupIndex}`)

            let array = []
            if (pool) {
                if (paramMemberIndex !== undefined && paramUserIndex !== undefined && paramGroupIndex !== undefined) {
                    updateMemberList(paramMemberIndex, paramUserIndex, paramGroupIndex, function (err, result) {
                        if (err) {
                            console.log(`member 업데이트 도중 에러 발생함.`)
                            let code = 500 //Internal Server Error
                            let success = 0
                            let data = array
                            let message = 'member update 중 error 발생함.'
                            let error = err
                            let response = new Response(code, success, null, data, message, error)
                            res.send(response)
                        } else if (result.length > 0) {
                            if (result[0]['run'] === 0) {
                                console.dir(result)
                                let code = 204 // No Content
                                let success = 0
                                let data = []
                                let message = '등록되지 않은 group 입니다'
                                let error = err
                                let response = new Response(code, success, null, data, message, error)
                                res.send(response)
                            } else if (result[0]['run'] === 1) {
                                console.dir(result)
                                let code = 204 // No Content
                                let success = 0
                                let data = []
                                let message = 'member_index 는 등록되지 않은 member_index 입니다'
                                let error = err
                                let response = new Response(code, success, null, data, message, error)
                                res.send(response)
                            } else if (result[0]['run'] === 2) {
                                console.dir(result)
                                let code = 204 // No Content
                                let success = 0
                                let data = []
                                let message = 'user_index 는 등록되지 않은 user_index 입니다'
                                let error = err
                                let response = new Response(code, success, null, data, message, error)
                                res.send(response)
                            } else if (result[0]['run'] === 3) {
                                console.dir(result)
                                let code = 204 // No Content
                                let success = 0
                                let data = []
                                let message = 'member_index 는 group 의 member_index 가 아닙니다'
                                let error = err
                                let response = new Response(code, success, null, data, message, error)
                                res.send(response)
                            } else if (result[0]['run'] === 4) {
                                console.dir(result)
                                let code = 204 // No Content
                                let success = 0
                                let data = []
                                let message = 'user_index 는 group 의 member_index 가 아닙니다'
                                let error = err
                                let response = new Response(code, success, null, data, message, error)
                                res.send(response)
                            } else if (result[0]['run'] === 5) {
                                let code = 204 // No Content
                                let success = 0
                                let data = []
                                let message = 'member_index 는 member 를 update 할 권한이 없습니다'
                                let error = err
                                let response = new Response(code, success, null, data, message, error)
                                res.send(response)
                            } else if (result[0]['run'] === 6) {
                                console.dir(result)
                                let code = 204 // No Content
                                let success = 0
                                let data = []
                                let message = 'owner 의 권한은 변경할 수 없습니다'
                                let error = err
                                let response = new Response(code, success, null, data, message, error)
                                res.send(response)
                            } else if (result[0]['run'] === 7) {
                                console.dir(result)
                                let code = 200 //OK
                                let success = 1
                                let data = []
                                let message = 'member update 성공.'
                                let error = err
                                let response = new Response(code, success, null, data, message, error)
                                res.send(response)
                            } else {
                                console.dir(result)
                                let code = 204 // No Content
                                let success = 0
                                let data = result
                                let message = 'No response data'
                                let error = err
                                let response = new Response(code, success, null, data, message, error)
                                res.send(response)
                            }
                        } else {
                            let code = 204 // No Content
                            let success = 0
                            let data = []
                            let message = 'member 추가 실패'
                            let error = null
                            let response = new Response(code, success, null, data, message, error)
                            res.send(response)
                        }
                    })
                } else {
                    console.log('gb_index, user_index, member_index 중 입력되지 않은 값이 있습니다')
                    let code = 500 //Internal Server Error
                    let success = 0
                    let data = array
                    let message = 'gb_index, user_index, member_index 중 입력되지 않은 값이 있습니다'
                    let error = err
                    let response = new Response(code, success, null, data, message, error)
                    res.send(response)
                }
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

const updateMemberList = (memberIndex, userIndex, groupIndex, callback) => {
    console.log(`updateMemberList 호출됨.`)
    pool.getConnection(function (err, conn) {
        if (err) {
            if (conn) {
                conn.release()
            }
            callback(err, null)
            return
        }
        console.log('데이터베이스 연결 스레드 아이디 : ' + conn.threadId)
        let exec = conn.query('select updateMember(?,?,?) as run', [memberIndex, userIndex, groupIndex], function (err, results) {
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


module.exports.updateMember = updateMember

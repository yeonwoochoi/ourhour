const pool = require('../../../../../app').pool
const checkKey = require('../../../input_key_check/key_check')
const Response = require('../../../../response_class')


const deleteGroupBoard = (req, res) => {
    console.log(`deleteGroupBoard 호출됨.`)
    if (req.authenticated === true) {
        console.log('token 있음')
        let paramObj = req.body
        let checkArr = checkKey(paramObj, 'group_board_column')
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
            let paramGroupIndex = paramObj['gb_board_index']


            console.log(`요청 파라미터 : ${paramGroupIndex}, ${paramUserIndex}`)
            let array = []
            if (pool) {
                deleteGroupBoardList(paramUserIndex, paramGroupIndex, function (err, result) {
                    if (err) {
                        console.log('group 삭제 중 에러 발생함.')
                        let code = 500; //Internal Server Error
                        let success = 0
                        let data = array
                        let message = 'group 삭제 중 error 발생함.'
                        let error = err
                        let response = new Response(code, success, null, data, message, error)
                        res.send(response)
                    }
                    if (result) {
                        if (result[0]['run'] === 0) {
                            console.dir(result)
                            let code = 204 // No Content
                            let success = 0
                            let data = []
                            let message = '등록되지 않은 user 입니다'
                            let error = err
                            let response = new Response(code, success, null, data, message, error)
                            res.send(response)
                        } else if (result[0]['run'] === 1) {
                            console.dir(result)
                            let code = 204 // No Content
                            let success = 0
                            let data = []
                            let message = '등록되지 않은 group board 입니다'
                            let error = err
                            let response = new Response(code, success, null, data, message, error)
                            res.send(response)
                        } else if (result[0]['run'] === 2) {
                            console.dir(result)
                            let code = 204 // No Content
                            let success = 0
                            let data = []
                            let message = '해당 group 에 소속된 user 가 아닙니다'
                            let error = err
                            let response = new Response(code, success, null, data, message, error)
                            res.send(response)
                        } else if (result[0]['run'] === 3) {
                            console.dir(result)
                            let code = 204 // No Content
                            let success = 0
                            let data = []
                            let message = '본인 혹은 해당 group 소속의 권한이 있는 user 만 group board 를 삭제할 권한이 있습니다'
                            let error = err
                            let response = new Response(code, success, null, data, message, error)
                            res.send(response)
                        } else if (result[0]['run'] === 4) {
                            console.dir(result)
                            let code = 200 //OK
                            let success = 1
                            let data = []
                            let message = 'group board 삭제 성공.'
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
                        console.dir(result)
                        let code = 204 // No Content
                        let success = 0
                        let data = result
                        let message = 'No response data'
                        let error = err
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

const deleteGroupBoardList = (userIndex, gbBoardIndex, callback) => {
    console.log(`deleteGroupBoardList 호출됨.`)
    pool.getConnection(function (err, conn) {
        if (err) {
            if (conn) {
                conn.release()
            }
            callback(err, null)
            return
        }
        console.log('데이터베이스 연결 스레드 아이디: ' + conn.threadId)

        let exec = conn.query('select deleteGroupBoard (?, ?) as run', [userIndex, gbBoardIndex], function (err, results) {
            conn.release()
            console.log('실행 대상 SQL : ' + exec.sql)
            if (err) {
                console.log('SQL 실행 도중 오류 발생.')
                console.dir(err)
                callback(err, null)
                return
            }
            callback(null, results)
        })
    })
}


module.exports.deleteGroupBoard = deleteGroupBoard


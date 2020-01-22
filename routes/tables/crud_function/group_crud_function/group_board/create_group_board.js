const pool = require('../../../../../app').pool
const checkKey = require('../../../input_key_check/key_check')
const Response = require('../../../../response_class')

const createGroupBoard = (req, res) => {
    console.log(`createGroupBoard 호출됨.`)

    if (req.authenticated === true) {
        let paramObj = req.body
        let checkArr = checkKey(paramObj, 'group_board_column')
        if (checkArr[0] === 0) {
            console.log('key value error')
            let code = 400; //Bad Request
            let success = 0
            let data = []
            let message = 'check your key value of your request body again.'
            let error = checkArr[1]
            let response = new Response(code, success, null, data, message, error)
            res.send(response)
        } else {
            let paramGrpBoardTitle = paramObj['gb_board_title']
            let paramGrpBoardContent = paramObj['gb_board_content']
            let paramGrpBoardImportance = paramObj['gb_board_importance']
            let paramGrpBoardAuthor = paramObj['gb_board_author']
            let paramGbIndex = paramObj['gb_index']
            if (paramGrpBoardImportance === undefined) {
                paramGrpBoardImportance = 0
            }

            console.log(`요청 파라미터 : ${paramGrpBoardTitle}, ${paramGrpBoardContent}, ${paramGrpBoardImportance}, ${paramGrpBoardAuthor}, ${paramGbIndex}`)
            let array = []
            if (pool) {
                addGroupBoard(paramGrpBoardTitle, paramGrpBoardContent, paramGrpBoardImportance, paramGrpBoardAuthor, paramGbIndex, function (err, result) {
                    if (err) {
                        console.log('group board 추가 중 에러 발생함')
                        let code = 500 //Internal Server Error
                        let success = 0
                        let data = array
                        let message = 'group board 추가 중 error 발생함.'
                        let error = err
                        let response = new Response(code, success, null, data, message, error)
                        res.send(response)
                    } else if (result.length > 0) {
                        if (result[0]['run'] === 1) {
                            console.dir(result)
                            let code = 204 // No Content
                            let success = 0
                            let data = []
                            let message = '등록되지 않은 user 입니다'
                            let error = err
                            let response = new Response(code, success, null, data, message, error)
                            res.send(response)
                        } else if (result[0]['run'] === 2) {
                            console.dir(result)
                            let code = 204 // No Content
                            let success = 0
                            let data = []
                            let message = '등록되지 않은 group 입니다'
                            let error = err
                            let response = new Response(code, success, null, data, message, error)
                            res.send(response)
                        } else if (result[0]['run'] === 3) {
                            console.dir(result)
                            let code = 204 // No Content
                            let success = 0
                            let data = []
                            let message = '해당 group 에 등록된 user 가 아닙니다'
                            let error = err
                            let response = new Response(code, success, null, data, message, error)
                            res.send(response)
                        } else if (result[0]['run'] === 4) {
                            console.dir(result)
                            let code = 204 // No Content
                            let success = 0
                            let data = []
                            let message = '완전히 동일한 group board 가 존재합니다'
                            let error = err
                            let response = new Response(code, success, null, data, message, error)
                            res.send(response)
                        } else if (result[0]['run'] > 5) {
                            console.dir(result)
                            let gbBoardIndex = result[0]['run'] - 5
                            let results = [{gb_board_index: gbBoardIndex}]
                            let code = 201 //Created
                            let success = 1
                            let data = results
                            let message = 'group board 추가 성공.'
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
                        array.push(result)
                        let code = 500; //Internal Server Error
                        let success = 0
                        let data = []
                        let message = 'group board 추가 실패'
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



const addGroupBoard = (title, content, importance, author, gbIndex, callback) => {
    console.log(`addGroupBoard 호출됨.`)
    pool.getConnection(function (err, conn) {
        if(err) {
            if (conn) {
                conn.release()
            }
            callback(err, null)
            return
        }
        console.log('데이터베이스 연결 스레드 아이디 : ' + conn.threadId)
        //let nowdate = new Date().toISOString().replace(/T..+/, '')
        let exec = conn.query('select createGroupBoard (?, ?, ?, ?, ?) as run', [title, content, importance, author, gbIndex],function(err, result) {
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

module.exports.createGroupBoard = createGroupBoard

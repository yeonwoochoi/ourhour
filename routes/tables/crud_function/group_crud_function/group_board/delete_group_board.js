const pool = require('../../../../../app')
const checkKey = require('../../../input_key_check/key_check')
const Response = require('../../../../response_class')


const deleteGroupBoard = (req, res) => {
    console.log(`deleteGroupBoard 호출됨.`)
    if (req.authenticated === true) {
        console.log(`token 있음`)
        let paramObj = req.body.data
        let checkArr = checkKey(paramObj, 'group_board_column')
        if (checkArr[0] === 0) {
            let response = new Response('key value error', [], checkArr[1])
            res.send(response)
        } else {
            let paramGbTitle = paramObj['gb_title']
            let paramGbContent = paramObj['gb_content']
            let paramGbImportance = paramObj['gb_importance']
            let paramGbCreatedAt = paramObj['gb_created_at']
            let paramGbUpdatedAt = paramObj['gb_updated_at']
            let paramGbAuthor = paramObj['gb_author']
            let paramGbCode = paramObj['gb_code']
            let paramGroupCode = paramObj['group_code']

            let newObj = {
                "gb_title": paramGbTitle,
                "gb_content": paramGbContent,
                "gb_importance": paramGbImportance,
                "gb_created_at": paramGbCreatedAt,
                "gb_updated_at": paramGbUpdatedAt,
                "gb_author": paramGbAuthor,
                "gb_code" : paramGbCode,
                "group_code" : paramGroupCode
            }

            console.log(`요청 파라미터 : ${paramGbTitle}, ${paramGbContent}, ${paramGbImportance}, ${paramGbCreatedAt}, ${paramGbUpdatedAt}, ${paramGbAuthor}, ${paramGbCode}, ${paramGroupCode}`)
            let array = []
            if (pool) {
                deleteGroupBoardList(newObj, function (err, result) {
                    if (err) {
                        console.log('group board 삭제 중 에러 발생함.')
                        let response = new Response('group board 삭제 중 에러 발생함.', array, err)
                        res.send(response)
                        return
                    }
                    if (result) {
                        console.dir(result)
                        array.push(result)
                        let response = new Response('group board 삭제 성공', array, null)
                        res.send(response)
                    } else {
                        array.push(result)
                        let response = new Response('group board 삭제 실패', array, null)
                        res.send(response)
                    }
                })
            } else {
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

const deleteGroupBoardList = (obj, callback) => {
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
        let checkKeyArray = Object.keys(obj)
        let checkValueArray = Object.values(obj)
        for (let i = 0; i < checkKeyArray.length; i++) {
            if (checkValueArray[i] === undefined) {
                delete obj[checkKeyArray[i]]
            }
        }
        let newKeyArray = Object.keys(obj)
        let newValueArray = Object.values(obj)
        let string = ''
        if (newKeyArray.length === 1) {
            string += (newKeyArray[0] + ' = ' + "'" + newValueArray[0] + "'")
        } else {
            for (let i = 0; i < newKeyArray.length - 1; i++) {
                string += (newKeyArray[i] + ' = ' + "'" + newValueArray[i] + "'" + " and ")
            }
            string += (newKeyArray[newKeyArray.length - 1] + ' = ' + "'" + newValueArray[newValueArray.length - 1] + "'")
        }

        let exec = conn.query('delete from group_board where ' + string, function (err, results) {
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


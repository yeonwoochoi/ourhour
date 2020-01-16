const pool = require('../../../../../app')
const Response = require('../../../../response_class')


const deleteAllGroupBoard = (req, res) => {
    console.log(`deleteAllGroupBoard 호출됨.`)

    let array = []
    if (req.authenticated === true) {
        console.log(`token 있음`)
        if (pool) {
            deleteAllGroupBoardList(function (err, result) {
                if (err) {
                    console.log('group board 모두 제거 중 오류 발생함.')
                    let response = new Response('group board 모두 제거 중 오류 발생함.', array, err)
                    res.send(response)
                    return
                }

                if (result) {
                    console.log('group board 모두 제거 성공.')
                    array.push(result)
                    let response = new Response('group board 모두 제거 성공.', array, null)
                    res.send(response)
                } else {
                    console.log(`group board 모두 제거 실패.`)
                    array.push(result)
                    let response = new Response('group board 모두 제거 실패', array, null)
                    res.send(response)
                }
            })
        } else {
            console.log('데이터베이스 연결 실패.')
            let response = new Response('데이터베이스 연결 실패', array, null)
            res.send(response)
        }
    } else {
        console.log('token 없음')
        let response = new Response('There is no token', [], null)
        res.send(response)
    }
}

const deleteAllGroupBoardList = (callback) => {
    console.log('deleteAllGroupBoardList 호출됨.')
    pool.getConnection(function (err, conn) {
        if (err) {
            if (conn) {
                conn.release()
            }
            callback(err, null);
            return
        }
        console.log('데이터베이스 연결 스레드 아이디: ' + conn.threadId)

        let exec = conn.query('delete from group_board', function (err, result) {
            conn.release()
            console.log('실행 대상 SQL : '+ exec.sql)
            if (err) {
                console.log('SQL 실행 도중 오류 발생함.')
                console.dir(err)
                callback(err, null)
                return
            }
            callback(null, result)
        })
    })
}

module.exports.deleteAllGroupBoard = deleteAllGroupBoard

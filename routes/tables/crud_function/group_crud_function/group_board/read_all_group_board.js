const pool = require('../../../../../app')
const Response = require('../../../../response_class')

const readAllGroupBoard = (req, res) => {
    console.log(`readAllGroupBoard 호출됨.`)

    let array = []
    if (req.authenticated === true) {
        console.log(`token 있음`)
        if (pool) {
            findAllGroupBoard (function (err, result) {
                if (err) {
                    console.log('모든 group board 검색 중 에러 발생함.')
                    let response = new Response('모든 group board 검색 중 에러 발생', array, err)
                    res.send(response)
                    return
                }
                if (result) {
                    console.log(result)
                    let response = new Response('모든 group board 검색 성공', result, null)
                    res.send(response)
                } else {
                    console.log('모든 group board 검색 실패')
                    let response = new Response('모든 group board 검색 실패', result, null)
                    res.send(response)
                }

            })
        } else {
            console.log('데이터베이스 연결 실패')
            let response = new Response('데이터베이스 연결 실패', array, null)
            res.send(response)
        }
    } else {
        console.log('token 없음')
        let response = new Response('There is no token', [], null)
        res.send(response)
    }
}

const findAllGroupBoard = (callback) => {
    console.log(`findAllGroupBoard 호출됨`)

    pool.getConnection(function (err, conn) {
        if(err) {
            if(conn) {
                conn.release()
            }
            callback(err, null);
            return
        }
        console.log('데이터베이스 연결 스레드 아이디 : ' + conn.threadId)
        let exec = conn.query('select * from group_board', function (err, result) {
            conn.release()
            console.log('실행 대상 SQL : ' + exec.sql)

            if (err){
                console.log('SQL 실행 시 오류 발생함.')
                console.dir(err)
                callback(err, null);
                return
            }
            callback(null, result);
        })
    })
}


module.exports.readAllGroupBoard = readAllGroupBoard

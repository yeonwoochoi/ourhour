const pool = require('../../../../../app')
const Response = require('../../../../response_class')

const readGroupBoardById = (req, res) => {
    console.log(`readGroupBoardByAuthorId 호출됨`)
    let array = []

    if (req.authenticated === true) {
        console.log(`token 있음`)
        if (pool) {
            let author_id = req.params.id
            if (author_id !== undefined) {
                findGroupBoardById(author_id, function (err, result) {
                    if (err) {
                        console.log(`author_id 값으로 group_board 검색 중 error 발생`)
                        let response = new Response(`author_id 값으로 group_board 검색 중 error 발생`, [], err)
                        res.send(response)
                    }
                    if (result) {
                        console.dir(result)
                        let response = new Response('author_id 값으로 group_board 검색 성공', result, null)
                        res.send(response)
                    } else {
                        console.log(`result 값 없음`)
                        let response = new Response(`author_id 값으로 group_board 검색 실패`, array, null)
                        res.send(response)
                    }
                })
            } else {
                console.log(`There is no id param`)
                let response = new Response('There is no id data', [], null)
                res.send(response)
            }
        } else {
            console.log('데이터베이스 연결 안됨.')
            let response = new Response('데이터베이스 연결 안됨.', array, null)
            res.send(response)
        }
    } else {
        console.log(`token 없음`)
        let response = new Response('There is no token', [], null)
        res.send(response)
    }
}


const findGroupBoardById = (author_id, callback) => {
    console.log(`findGroupBoardById 호출됨`)
    pool.getConnection(function(err, conn) {
        if (err) {
            if (conn) {
                conn.release()
            }
            callback(err, null)
            return
        }
        console.log('데이터베이스 연결 스레드 아이디 : '+ conn.threadId)
        let exec = conn.query('select * from group_board where gb_author = ?', [author_id], function (err, result) {
            conn.release()
            console.log(`실행 대상 SQL : ${exec.sql}`)

            if (err) {
                console.log(`SQL 실행 시 error 발생함`)
                console.dir(err)
                callback(err, null)
                return
            }
            callback(null, result)
        })
    })
}

module.exports.readGroupBoardById = readGroupBoardById
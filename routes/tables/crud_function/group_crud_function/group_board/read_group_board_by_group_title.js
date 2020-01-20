const pool = require('../../../../../app').pool
const Response = require('../../../../response_class')

const readGroupBoardByTitle = (req, res) => {
    console.log(`readGroupBoardByTitle 호출됨`)
    let array = []

    if (req.authenticated === true) {
        console.log(`token 있음`)
        if (pool) {
            let title = req.params.title
            if (title !== undefined) {
                findGroupBoardByTitle(title, function (err, result) {
                    if (err) {
                        console.log(`group_title 값으로 group_board 검색 중 error 발생`)
                        let response = new Response(`group_title 값으로 group_board 검색 중 error 발생`, [], err)
                        res.send(response)
                    }
                    if (result) {
                        console.dir(result)
                        let response = new Response('group_title 값으로 group_board 검색 성공', result, null)
                        res.send(response)
                    } else {
                        console.log(`result 값 없음`)
                        let response = new Response(`group_title 값으로 group_board 검색 실패`, array, null)
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


const findGroupBoardByTitle = (title, callback) => {
    console.log(`findGroupBoardByTitle 호출됨`)
    pool.getConnection(function(err, conn) {
        if (err) {
            if (conn) {
                conn.release()
            }
            callback(err, null)
            return
        }
        console.log('데이터베이스 연결 스레드 아이디 : '+ conn.threadId)
        let exec = conn.query('select * from group_board where gb_title = ?', [title], function (err, result) {
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

module.exports.readGroupBoardByTitle = readGroupBoardByTitle

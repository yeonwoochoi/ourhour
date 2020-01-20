const pool = require('../../../../../app').pool
const checkKey = require('../../../input_key_check/key_check')
const Response = require('../../../../response_class')
let syncMysql = require('sync-mysql')

let syncConnection = new syncMysql({
    'host': 'localhost',
    'user': 'root',
    'password': 'qhans4rydlsrms',
    'port' : 3306,
    'database': 'mydb'
})

const createGroupBoard = (req, res) => {
    console.log(`createGroupBoard 호출됨.`)
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
            let paramGbAuthor = paramObj['gb_author']
            let paramGroupCode = paramObj['group_code']

            console.log(`요청 파라미터 : ${paramGbTitle}, ${paramGbContent}, ${paramGbImportance}, ${paramGbAuthor}, ${paramGroupCode}`)
            let array = []
            if (pool) {
                let group_member = syncConnection.query('SELECT member_id FROM member_table WHERE group_index= ?', [paramGroupCode])
                let arr = []
                let checkArray = []
                if (group_member.length) {
                    for (let i = 0; i < group_member.length; i++) {
                        arr.push(group_member[i]['member_id'])
                    }
                    for (let j = 0; j < arr.length; j++) {
                        if (arr[j] === paramGbAuthor) {
                            checkArray.push(arr[j])
                        }
                    }
                }
                let user_id;
                if (checkArray.length) {
                    let id = syncConnection.query('SELECT user_id FROM user WHERE user_code = ?', [checkArray[0]])
                    user_id = id[0]['user_id']
                }

                if (user_id) {
                    addGroupBoard(paramGbTitle, paramGbContent, paramGbImportance, user_id, paramGroupCode, function (err, result) {
                        if (err) {
                            console.log('group board 추가 중 에러 발생함')
                            let response = new Response('group board 추가 중 error 발생', array, err)
                            res.send(response)
                        }
                        if (result) {
                            console.dir(result)
                            array.push(result)
                            let response = new Response('group board 추가됨.', array, null)
                            res.send(response)
                        } else {
                            array.push(result)
                            let response = new Response('group board 추가 안됨', array, null)
                            res.send(response)
                        }
                    })
                } else {
                    console.log('You can only post to the group board of the group you belong to.')
                    let response = new Response('You can only post to the group board of the group you belong to.', [], null)
                    res.send(response)
                }
            } else {
                console.log(`데이터베이스 연결 안됨.`)
                let response = new Response('데이터베이스 연결 안됨', array, null)
                res.send(response)
            }
        }
    } else {
        console.log('token 없음')
        let response = new Response('There is no token', [], null)
        res.send(response)
    }
}



const addGroupBoard = (title, content, importance, author, group_code, callback) => {
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
        let nowdate = new Date().toISOString().replace(/T..+/, '')
        let data = {gb_title: title, gb_content: content, gb_importance: importance, gb_author: author, gb_created_at: nowdate, group_code: group_code}
        let exec = conn.query('insert into group_board set ?', data, function(err, result) {
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

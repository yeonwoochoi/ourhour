const pool = require('../../../../../app').pool
const Response = require('../../../../response_class')

const deleteAllRoutine = (req, res) => {
    console.log(`deleteAllRoutine 호출됨.`)

    let array = []
    if (req.authenticated === true) {
        console.log(`token 있음`)
        if (pool) {
            deleteAllRoutineList(function (err, result) {
                if (err) {
                    console.log('routine 모두 제거 중 오류 발생함.')
                    let response = new Response('routine 모두 제거 중 오류 발생함.', array, err)
                    res.send(response)
                    return
                }

                if (result) {
                    console.log('routine 모두 제거 성공.')
                    array.push(result)
                    let response = new Response('routine 모두 제거 성공.', array, null)
                    res.send(response)
                } else {
                    console.log(`routine 모두 제거 실패.`)
                    array.push(result)
                    let response = new Response('routine 모두 제거 실패', array, null)
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

const deleteAllRoutineList = (callback) => {
    console.log('deleteAllRoutineList 호출됨.')
    pool.getConnection(function (err, conn) {
        if (err) {
            if (conn) {
                conn.release()
            }
            callback(err, null);
            return
        }
        console.log('데이터베이스 연결 스레드 아이디: ' + conn.threadId)

        let exec = conn.query('delete from routine', function (err, result) {
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

module.exports.deleteAllRoutine = deleteAllRoutine


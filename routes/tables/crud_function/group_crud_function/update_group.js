const pool = require('../../../../app').pool
const checkKey = require('../../input_key_check/key_check')
const Response = require('../../../response_class')

const updateGroup = (req, res) => {
    console.log(`updateGroup 호출됨.`)
    if (req.authenticated === true) {
        console.log('token 있음')
        let paramSearchObj = req.body['searchObj']
        let paramNewObj = req.body['newObj']
        if (paramNewObj !== undefined && paramSearchObj !== undefined) {
            let checkArr1 = checkKey(paramSearchObj, 'group_column1')
            let checkArr2 = checkKey(paramNewObj, 'group_column2')
            if (checkArr1[0] === 0 || checkArr2[0] === 0) {
                if (checkArr1[0] === 0 && checkArr2[0] === 0) {
                    let code = 400 //Bad Request
                    let success = 0
                    let data = []
                    let message = 'key value error'
                    let error = 'searchObj => ' +  checkArr1[1] + ' and ' + 'newObj => ' + checkArr2[1]
                    let response = new Response(code, success, null, data, message, error)
                    res.send(response)
                }
                if (checkArr1[0] === 0 && checkArr2[0] !== 0) {
                    let code = 400 //Bad Request
                    let success = 0
                    let data = []
                    let message = 'key value error'
                    let error = 'searchObj => ' +  checkArr1[1]
                    let response = new Response(code, success, null, data, message, error)
                    res.send(response)
                }
                if (checkArr1[0] !== 0 && checkArr2[0] === 0) {
                    let code = 400 //Bad Request
                    let success = 0
                    let data = []
                    let message = 'key value error'
                    let error =  'newObj => ' + checkArr2[1]
                    let response = new Response(code, success, null, data, message, error)
                    res.send(response)
                }
            } else {
                console.log(`요청 파라미터 : ${paramSearchObj} , ${paramNewObj}`)

                let paramGroupIndex = paramSearchObj['gb_index']
                let paramUserIndex = paramSearchObj['user_index']
                let paramGroupName = paramNewObj['gb_name']
                let array = []
                if (pool) {
                    updateGroupList(paramGroupIndex, paramGroupName, paramUserIndex, function (err, result) {
                        if (err) {
                            console.log(`group update 중 에러 발생함.`)
                            let code = 500; //Internal Server Error
                            let success = 0
                            let data = array
                            let message = 'group update 중 에러 발생함.'
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
                                let message = '등록되지 않은 user 입니다'
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
                                let message = '해당 user 에겐 group 정보를 변경할 권한이 없습니다.'
                                let error = err
                                let response = new Response(code, success, null, data, message, error)
                                res.send(response)
                            } else if (result[0]['run'] === 4) {
                                console.dir(result)
                                let code = 204 // No Content
                                let success = 0
                                let data = []
                                let message = '중복된 group name 이 있습니다'
                                let error = err
                                let response = new Response(code, success, null, data, message, error)
                                res.send(response)
                            } else if (result[0]['run'] === 5) {
                                updateGroupList2(paramGroupIndex, paramNewObj, function (err2, result1) {
                                    if (err2) {
                                        console.log(`group update 중 에러 발생함.`)
                                        let code = 500; //Internal Server Error
                                        let success = 0
                                        let data = array
                                        let message = 'group update 중 에러 발생함.'
                                        let error = err2
                                        let response = new Response(code, success, null, data, message, error)
                                        res.send(response)
                                    } else if (result1) {
                                        console.dir(result1)
                                        let code = 200 //OK
                                        let success = 1
                                        let data = result1
                                        let message = 'group update 성공.'
                                        let error = err2
                                        let response = new Response(code, success, null, data, message, error)
                                        res.send(response)
                                    } else {
                                        console.log(`최종 result 없음`)
                                        let code = 500 //Internal Server Error
                                        let success = 0
                                        let data = []
                                        let message = 'group 업데이트 실패.'
                                        let error = null
                                        let response = new Response(code, success, null, data, message, error)
                                        res.send(response)
                                    }
                                })
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
                            console.log(`result 없음`)
                            let code = 500 //Internal Server Error
                            let success = 0
                            let data = []
                            let message = 'group 업데이트 안됨.'
                            let error = null
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
        } else if (paramSearchObj === undefined) {
            console.log('searchObj is undefined')
            let code = 400 //Bad Request
            let success = 0
            let data = []
            let message = 'searchObj is undefined'
            let error = null
            let response = new Response(code, success, null, data, message, error)
            res.send(response)
        } else {
            console.log('newObj is undefined or there are some problems at request form')
            let code = 400 //Bad Request
            let success = 0
            let data = []
            let message = 'newObj is undefined or there are some problems at request form'
            let error = null
            let response = new Response(code, success, null, data, message, error)
            res.send(response)
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

const updateGroupList = (groupIndex, groupName, userIndex, callback) => {
    console.log(`updateGroupList 호출됨.`)
    pool.getConnection(function (err, conn) {
        if (err) {
            if (conn) {
                conn.release()
            }
            callback(err, null)
            return
        }
        console.log('데이터베이스 연결 스레드 아이디 : ' + conn.threadId)

        let exec = conn.query('select checkGroupAccess (?,?,?) as run;', [groupIndex, groupName, userIndex], function (err, results) {
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

const updateGroupList2 = (groupIndex, newObj, callback) => {
    console.log(`updateGroupList2 호출됨.`)
    pool.getConnection(function (err, conn) {
        if (err) {
            if (conn) {
                conn.release()
            }
            callback(err, null)
            return
        }
        console.log('데이터베이스 연결 스레드 아이디 : ' + conn.threadId)


        let exec = conn.query('update group_table set ? where gb_index = ?', [newObj, [groupIndex]], function (err, results) {
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


module.exports.updateGroup = updateGroup


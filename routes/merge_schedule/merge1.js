const pool = require('../../app').pool
const checkKey = require('../../routes/tables/input_key_check/key_check')
const Response = require('../../routes/response_class')
const mergeUtils = require('./merge_utils').mergeUtils


const merge1 = (req, res) => {
    console.log(`merge1 호출됨`);
    if (req.authenticated === true) {
        console.log(`token 있음`);
        let checkArr = checkKey(req.body, 'merge')
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
            // let groupName = req.body.group_name;
            let dateTime = req.body['date']
            let gbIndex = req.body['gb_index'];
            console.log(`요청 파라미터 : ${dateTime}, ${gbIndex}`)
            if (pool) {
                mergeSchedule1(dateTime, gbIndex, function (err, result) {
                    console.log(`mergeSchedule 실행됨`);
                    if (err) {
                        console.log('merge 중 에러 발생함')
                        let code = 500 //Internal Server Error
                        let success = 0
                        let data = array
                        let message = 'merge 중 error 발생함.'
                        let error = err
                        let response = new Response(code, success, null, data, message, error)
                        res.send(response)
                    } else if (result.length > 0) {
                        console.dir(result)
                        let code = 201 //Created
                        let success = 1
                        let data = result
                        let message = 'merge 성공.'
                        let error = err
                        let response = new Response(code, success, null, data, message, error)
                        res.send(response)
                    } else {
                        array.push(result)
                        let code = 500; //Internal Server Error
                        let success = 0
                        let data = []
                        let message = 'merge 실패 || check whether you register user_id or not.'
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


const mergeSchedule1 = (date, userIndex, callback) => {
    console.log(`mergeSchedule1 호출됨.`);
    if (typeof date === 'string') {
        date = mergeUtils.stringToDate(date)
    }
    let dateArr = mergeUtils.rangeSetting(date)
    let start = dateArr[0]
    let end = dateArr[1]
    let scheduleArr
    let scheduleArr2
    mergeUtils.makeScheduleArr(userIndex, function (err, result) {
        if (err) {
            callback(err, null)
        } else {
            scheduleArr = result
            scheduleArr2 = mergeUtils.compare(start, end, scheduleArr)
            let totalArr = [[],[],[],[],[],[],[]]

            let standardArr = mergeUtils.timetableStandard(start, true)
            let day = 0
            let index = 0
            while (day < 7) {
                switch (day) {
                    case 0 :
                        let outputArr0 = mergeUtils.compare(standardArr[index], standardArr[index+1], scheduleArr2)
                        if (outputArr0.length > 0) {
                            for (let i = 0; i < outputArr0.length; i++) {
                                outputArr0[i]['schedule_start'] = mergeUtils.changeDateType(outputArr0[i]['schedule_start'])
                                outputArr0[i]['schedule_end'] = mergeUtils.changeDateType(outputArr0[i]['schedule_end'])
                            }
                            totalArr[0].push(outputArr0)
                        } else {
                            totalArr[0].push(outputArr0)
                        }
                        break
                    case 1 :
                        let outputArr1 = mergeUtils.compare(standardArr[index], standardArr[index+1], scheduleArr2)
                        if (outputArr1.length > 0) {
                            for (let i = 0; i < outputArr1.length; i++) {
                                outputArr1[i]['schedule_start'] = mergeUtils.changeDateType(outputArr1[i]['schedule_start'])
                                outputArr1[i]['schedule_end'] = mergeUtils.changeDateType(outputArr1[i]['schedule_end'])
                            }
                            totalArr[1].push(outputArr1)
                        } else {
                            totalArr[1].push(outputArr1)
                        }
                        break
                    case 2 :
                        let outputArr2 = mergeUtils.compare(standardArr[index], standardArr[index+1], scheduleArr2)
                        if (outputArr2.length > 0) {
                            for (let i = 0; i < outputArr2.length; i++) {
                                outputArr2[i]['schedule_start'] = mergeUtils.changeDateType(outputArr2[i]['schedule_start'])
                                outputArr2[i]['schedule_end'] = mergeUtils.changeDateType(outputArr2[i]['schedule_end'])
                            }
                            totalArr[2].push(outputArr2)
                        } else {
                            totalArr[2].push(outputArr2)
                        }
                        break
                    case 3 :
                        let outputArr3 = mergeUtils.compare(standardArr[index], standardArr[index+1], scheduleArr2)
                        if (outputArr3.length > 0) {
                            for (let i = 0; i < outputArr3.length; i++) {
                                outputArr3[i]['schedule_start'] = mergeUtils.changeDateType(outputArr3[i]['schedule_start'])
                                outputArr3[i]['schedule_end'] = mergeUtils.changeDateType(outputArr3[i]['schedule_end'])
                            }
                            totalArr[3].push(outputArr3)
                        } else {
                            totalArr[3].push(outputArr3)
                        }
                        break
                    case 4 :
                        let outputArr4 = mergeUtils.compare(standardArr[index], standardArr[index+1], scheduleArr2)
                        if (outputArr4.length > 0) {
                            for (let i = 0; i < outputArr4.length; i++) {
                                outputArr4[i]['schedule_start'] = mergeUtils.changeDateType(outputArr4[i]['schedule_start'])
                                outputArr4[i]['schedule_end'] = mergeUtils.changeDateType(outputArr4[i]['schedule_end'])
                            }
                            totalArr[4].push(outputArr4)
                        } else {
                            totalArr[4].push(outputArr4)
                        }
                        break
                    case 5 :
                        let outputArr5 = mergeUtils.compare(standardArr[index], standardArr[index+1], scheduleArr2)
                        if (outputArr5.length > 0) {
                            for (let i = 0; i < outputArr5.length; i++) {
                                outputArr5[i]['schedule_start'] = mergeUtils.changeDateType(outputArr5[i]['schedule_start'])
                                outputArr5[i]['schedule_end'] = mergeUtils.changeDateType(outputArr5[i]['schedule_end'])
                            }
                            totalArr[5].push(outputArr5)
                        } else {
                            totalArr[5].push(outputArr5)
                        }
                        break
                    case 6 :
                        let outputArr6 = mergeUtils.compare(standardArr[index], standardArr[index+1], scheduleArr2)
                        if (outputArr6.length > 0) {
                            for (let i = 0; i < outputArr6.length; i++) {
                                outputArr6[i]['schedule_start'] = mergeUtils.changeDateType(outputArr6[i]['schedule_start'])
                                outputArr6[i]['schedule_end'] = mergeUtils.changeDateType(outputArr6[i]['schedule_end'])
                            }
                            totalArr[6].push(outputArr6)
                        } else {
                            totalArr[6].push(outputArr6)
                        }
                        break
                }
                index ++
                if (index === 24) {
                    day++
                    standardArr = mergeUtils.timetableStandard(mergeUtils.addDate(start, 1), false)
                    index = 0
                }
            }
            callback(null, totalArr)
        }
    })
}

module.exports.merge1 = merge1

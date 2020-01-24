const pool = require('../../app').pool
const syncConnection = require('../../app').syncConnection
const checkKey = require('../../routes/tables/input_key_check/key_check')
const Response = require('../../routes/response_class')


function mergeUtils() {}

mergeUtils.changeDateType = function (inputStr) {
    let newStr
    if (typeof inputStr === 'object'){
        inputStr = new Date(inputStr.setHours(inputStr.getHours() + 9))
    }
    if (typeof (inputStr) === 'object' ) {
        newStr = inputStr.toISOString().replace(/T/, ' ').replace(/\..+/, '')
    } else {
        newStr = inputStr.replace(/T/, ' ').replace(/\..+/, '')
    }
    return newStr
}


mergeUtils.stringToDate = function stringToDate (inputStr) {
    let arr1
    let arr3
    let arr4
    if (inputStr.indexOf('T') !== -1) {
        arr1 = inputStr.split('T')
        arr4 = arr1[1].split('.')
        arr3 = arr4[0].split(':')
    } else {
        arr1 = inputStr.split(' ')
        arr3 = arr1[1].split(':')
    }
    let newDate;
    if (arr1.length === 2) {
        let arr2 = arr1[0].split('-')
        for (let i = 0; i < arr2.length; i++) {
            arr2[i] = parseInt(arr2[i])
        }for (let i = 0; i < arr3.length; i++) {
            arr3[i] = parseInt(arr3[i])
        }
        //arr3[0] = arr3[0] + 9
        newDate = new Date(arr2[0], arr2[1]-1, arr2[2], arr3[0], arr3[1], arr3[2])
    }
    return newDate
}


mergeUtils.makeScheduleArr = function makeScheduleArr (gbIndex, callback) {
    pool.getConnection(function (err, conn) {
        if(err) {
            if (conn) {
                conn.release()
            }
            callback(err, null)
            return
        }
        console.log('데이터베이스 연결 스레드 아이디 : ' + conn.threadId)
        let exec = conn.query(
            'select * from routine1view where user_index in (select member_index as user_index from groupview where gb_index = ?) union\n' +
            'select * from routine2view where user_index in (select member_index as user_index from groupview where gb_index = ?)',[gbIndex, gbIndex], function (err, result) {
                conn.release()
                console.log('실행 대상 SQL : ' + exec.sql)

                if (err) {
                    console.log('SQL 실행 시 오류 발생함.')
                    console.dir(err)
                    callback(err, null)
                    return
                }
            /*
                if (result.length > 0) {
                    for (let i = 0; i < result.length; i++) {
                        let startTime;
                        let endTime;
                        if (typeof result[i]['schedule_start'] === "string") {
                            startTime = mergeUtils.stringToDate(result[i]['schedule_start'])
                            endTime = mergeUtils.stringToDate((result[i]['schedule_end']))
                        } else {
                            startTime = result[i]['schedule_start']
                            endTime = result[i]['schedule_end']
                        }
                        startTime.setHours(startTime.getHours())
                        endTime.setHours(endTime.getHours())
                        result[i]['schedule_start'] = startTime
                        result[i]['schedule_end'] = endTime
                    }
                }

         */
                callback(null, result)
            })
    })
}

mergeUtils.makeScheduleArr2 = function (userIndex, friendIndex, callback) {
    pool.getConnection(function (err, conn) {
        if(err) {
            if (conn) {
                conn.release()
            }
            callback(err, null)
            return
        }
        console.log('데이터베이스 연결 스레드 아이디 : ' + conn.threadId)
        let exec = conn.query(
            'select * from routine1view where user_index = ? union\n' +
            'select * from routine2view where user_index = ? union\n' +
            'select * from routine1view where user_index = ? union\n' +
            'select * from routine2view where user_index = ?',[userIndex, userIndex, friendIndex, friendIndex], function (err, result) {
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

mergeUtils.addDate = function addDate (date, number) {
    if (typeof date === 'object') {
        return new Date(date.setDate(date.getDate() + number))
    } else {
        date = mergeUtils.stringToDate(date)
        return new Date(date.setDate(date.getDate() + number))
    }
}


mergeUtils.rangeSetting = function rangeSetting (date) {
    if (typeof date === "string") {
        date = mergeUtils.stringToDate(date)
    }
    let day = date.getDay()
    let start = mergeUtils.addDate(date, day * (-1))
    let end = mergeUtils.addDate(date, (6))

    let startArr = [start.getFullYear(), start.getMonth(), start.getDate(), 0, 0, 0]
    let endArr = [end.getFullYear(), end.getMonth(), end.getDate(), 23, 59, 59]

    let newStart = new Date(startArr[0], startArr[1], startArr[2], startArr[3], startArr[4], startArr[5])
    let newEnd = new Date(endArr[0], endArr[1], endArr[2], endArr[3], endArr[4], endArr[5])

    newStart.setHours(newStart.getHours() + 9)//
    newEnd.setHours(newEnd.getHours() + 9)//

    return [newStart, newEnd]
}

mergeUtils.compare = function(startTime, endTime, scheduleArr) {
    let outputArr = []

    if (scheduleArr.length > 0) {
        for (let i = 0; i < scheduleArr.length; i++) {
            let unitStart = scheduleArr[i]['schedule_start']
            let unitEnd = scheduleArr[i]['schedule_end']
            if (typeof unitStart === 'string') {
                unitStart = mergeUtils.stringToDate(unitStart)
            }
            if (typeof unitEnd === 'string') {
                unitEnd = mergeUtils.stringToDate(unitEnd)
            }
            let result = scheduleArr[i]
            let run;
            if ((startTime <= unitStart && endTime > unitStart) || (startTime < unitEnd && endTime >= unitEnd)) {
                run = true
            } else if ((startTime > unitStart) && (endTime < unitEnd)) {
                run = true
            } else {
                run = false
            }
            if (run) {
                outputArr.push(result)
            }
        }
    }
    return outputArr
}


mergeUtils.timetableStandard = function timetableStandard (startTime, run) {
    let standard;
    if (run === true) {
        //standard = new Date(startTime.setHours(startTime.getHours() + 9))
        standard = new Date(startTime)
        standard = new Date(standard.setMinutes(standard.getMinutes() - 30))
    } else {
        standard = new Date(startTime.setMinutes(startTime.getMinutes() - 30))
    }
    let outputArr = []
    for (let i = 0; i < 25; i++) {
        outputArr.push(standard)
        standard =  new Date(standard.setMinutes(standard.getMinutes() + 30))
    }
    return outputArr
}





module.exports.mergeUtils = mergeUtils

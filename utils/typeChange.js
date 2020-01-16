const changeDateType = (inputStr) => {
    let newStr
    inputStr = new Date(inputStr.setHours(inputStr.getHours() + 9))
    if (typeof (inputStr) === 'object' ) {
        newStr = inputStr.toISOString().replace(/T/, ' ').replace(/\..+/, '')
    } else {
        newStr = inputStr.replace(/T/, ' ').replace(/\..+/, '')
    }
    return newStr
}

const stringToDate = (inputStr) => {
    let arr1 = inputStr.split('T')
    let newDate;
    if (arr1.length === 2) {
        let arr2 = arr1[0].split('-')
        let arr4 = arr1[1].split('.')
        let arr3 = arr4[0].split(':')
        for (let i = 0; i < arr2.length; i++) {
            arr2[i] = parseInt(arr2[i])
        }for (let i = 0; i < arr3.length; i++) {
            arr3[i] = parseInt(arr3[i])
        }
        arr3[0] = arr3[0] + 9
        newDate = new Date(arr2[0], arr2[1]-1, arr2[2], arr3[0], arr3[1], arr3[2])
    }
    return newDate
}

module.exports.changeDateType = changeDateType
module.exports.stringToDate = stringToDate

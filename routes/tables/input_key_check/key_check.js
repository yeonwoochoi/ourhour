const checkKey = (inputObj, tableName) => {
    const keys = require('./config_key')
    let sameKey = []
    let keyarr = Object.keys(inputObj)
    let key_column = keys[tableName]
    for (let i = 0; i < keyarr.length; i++) {
        for (let j = 0; j < key_column.length; j++) {
            if (keyarr[i] === key_column[j]) {
                sameKey.push(keyarr[i])
            }
        }
    }

    let differentKey = Object.keys(inputObj)
    for (let i = differentKey.length-1; i > -1; i--) {
        let string = differentKey[i]
        for (let j = 0; j < sameKey.length; j++) {
            if (sameKey[j] === string) {
                differentKey.splice(i, 1)
            }
        }
    }

    if (sameKey.length === keyarr.length) {
        console.log('All input keys are correct')
        return [1]
    } else {
        console.log('Check key again.')
        return [0, `invalid Key : ${differentKey}`]
    }
}



module.exports = checkKey
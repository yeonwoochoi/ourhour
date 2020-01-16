class Response {
    constructor(code, success, timestamp, data, message, error) {
        this.code = code
        this.success = success
        this.timestamp = new Date().toLocaleString()
        this.data = data
        this.message = message
        this.error = error
    }
}

module.exports = Response
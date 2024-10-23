class ApiErrorRes extends Error {
    constructor(status, message= 'Something went wrong', success= false) {
        super();
        this.status = status;
        this.message = message;
        this.success = success;
    }
}

export default ApiErrorRes
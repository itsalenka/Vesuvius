class ApiError extends Error{
    constructor (status, message, errors){
        super(message)
        this.status = status
        this.errors = errors
    }

    static BadRequest(message, errors = []){
        return new ApiError(400, message, errors)
    }

    static Forbidden(){
        return new ApiError(403, 'The user does not have access rights')
    }

    static UnauthorizedError(){
        return new ApiError(401, 'Unauthorized user')
    }

    static NotFound(){
        return new ApiError(404, 'Not found')
    }
}

module.exports = ApiError
export const checkUserDuplication = (error) => {
    let errorMessage;
    if(error.name === 'MongoServerError' && error.code === 11000 && error.keyValue.username){
        errorMessage = 'User with this username already exists';
    } else if(error.name === 'MongoServerError' && error.code === 11000 && error.keyValue.email){
        errorMessage = 'User with this email already exists';
    } else if(error.name === 'CastError' && error.kind === 'ObjectId'){
        errorMessage = 'Invalid user ID';
    } else {
        errorMessage = error.message;
    }
    return errorMessage;
}
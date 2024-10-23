export const validateUserCreation = (body) => {
    let result = {
        isValid: true,
        message: ''
    };
    
    const { username, name, email, password } = body;
    // All fields check 
    if(!username || !name || !email || !password){ 
        result = {
        isValid: false,
        message: 'All fields are required'
       };
       return result;
    }

    // Username check
    if(!isValidUsername(username)){
         result = {isValid: false, message: 'Username must start with a letter, contain only letters, numbers, underscores and hyphens, and be between 3 and 32 characters long'};
         return result;
    }

    // Name check
    if(name.length < 3 || name.length > 32) {
        result = {isValid: false, message: 'Name must be between 3 and 32 characters long'};
        return result;
    }

    // Email check
    if(!isValidEmail(email)) {
         result = {isValid: false, message: 'Email is not valid'};
         return result;
    }

    // Password check
    if(password.length < 8 || !isValidPassword(password)){ 
        result = {isValid: false, message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.'};
        return result;
    }
    
    return result = {isValid: true, message: 'PASSED'};
}

export const validateLoginData = function (data){

    const validationResult = {
        status: false,
        credentials: {
            email: '',
            username: '',
            password: ''
        },
        message: 'Invalid credential'
    }

    function failValidation(msg){
        validationResult.credentials = {};
        validationResult.status = false;
        validationResult.message = msg;
        return validationResult;
    }

    // check body
    if(!data) return failValidation('Enter valid credentials');

    // check username
    if(data.email && isValidEmail(data.email)){
        validationResult.credentials.email = data.email;
    }else if((data.username && data.username?.trim().length > 0) && isValidUsername(data.username)){ 
        validationResult.credentials.username = data.username;
    }else{
        return failValidation('Enter valid username or email');
    }

    // check password
    if( data.password?.trim()?.length > 0 && isValidPassword(data.password)) {
        validationResult.status = true;
        validationResult.message = 'PASSED';   
        validationResult.credentials.password = data.password;
    }else{
        return failValidation('Enter valid password');
    }

    //Return user data;
    return validationResult;
}

function isValidUsername(username){
    if(!username) return false;
    const usernameRegex = /^(?!.*\.\.)(?!^\.)[a-zA-Z0-9]+(\.[a-zA-Z0-9]+)*$/;
    return usernameRegex.test(username);
}

function isValidEmail(email){
    if(!email) return false;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
}

function isValidPassword(password){
    if(!password) return false;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+={}\[\]:;"'<>,.?~`-])[A-Za-z\d!@#$%^&*()_+={}\[\]:;"'<>,.?~`-]{8,}$/;
    return passwordRegex.test(password);
}
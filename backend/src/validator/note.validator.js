import mongoose from "mongoose";

export function validateNoteCreation(body) {
    let result = {isValid: false, msg: 'Something went wrong'};

    const { title, content} = body;
    if(!title || !content ) {
        result.isValid = false;
        result.msg= 'All fields are required';
        return result;
    }

    if(title?.trim()?.length < 3 || title?.trim()?.length > 32) {
        result.isValid = false;
        result.msg = 'Title must be between 3 and 32 characters long';
        return result;
    }

    if(content?.trim()?.length < 3) {
        result.isValid = false;
        result.msg = 'Content must be at least 3 characters long';
        return result;
    }

    result.isValid = true;
    result.msg = 'PASSED';
    return result;
}

export function validateNoteUpdate(body) {
    let result = {isValid: false, msg: 'Something went wrong', data: {}};

    function failValidation(message){
        result.isValid = false;
        result.msg = message;
        return result;
    }

    function putValu(key, value){
        result.isValid = true;
        result.data[key] =value
    }

    const { title, content} = body;
    if(!title && !content) {
        result.isValid = false;
        result.msg= 'At least one field is required';
        return result;

    }
    
    if(title?.trim()?.length < 3 || title?.trim()?.length > 32) {
        failValidation('The title must be between 3 and 32 characters long');
    }else{
        putValu('title', title);
    }

    if( content?.trim()?.length === 0) {
        if(result.isValid) return result;
        failValidation('there should be some content');
    }else{
        putValu('content', content);
    }

    result.isValid = true;
    result.msg = 'PASSED';
    return result;

}
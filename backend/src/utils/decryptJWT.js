import jwt from 'jsonwebtoken';

export const decryptJWT = async (token) => {
    if(!token) return null;
    try{
        const data = jwt.verify(token, process.env.JWT_SECRET);
        return data;
    }catch(err){
        console.error('Error decrypting JWT:', err);
        return null;
    }
}
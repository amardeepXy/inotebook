import {decryptJWT} from '../utils/decryptJWT.js';
import ApiErrorRes from '../utils/ApiErrorRes.js';

export default async function authMiddleware(req, res, next){
    if(!req.cookies || !req.cookies.auth) return res.status(401).json(new ApiErrorRes(401, 'User is not logged in'));
    const token = req.cookies.auth;
    if(!token) return res.status(401).json(new ApiErrorRes(401, 'User is not logged in'));
    const jwtData = await decryptJWT(token);
    if(!jwtData) return res.status(401).json(new ApiErrorRes(401, 'User is not logged in'));
    req.user = jwtData;
    next();
}
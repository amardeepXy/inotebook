import { Router } from "express";
import { createUser, getLoggedInUser, getUserById, loginUser } from "../controller/user.controller.js";
import notFoundController from "../controller/notFound.controller.js";

const router = Router();

router.post('/create', createUser);

router.get('/login', loginUser);
router.get('/getUser', getLoggedInUser)
router.get('/get/:userId', getUserById);


router.get('*', notFoundController);


export default router
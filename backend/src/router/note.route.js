import {Router} from 'express';
import {createNote, getAllNotesOfLoggedInUser, getNoteById, toggleNoteComplete, updateNoteById, deleteNoteById} from '../controller/note.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = Router();

router.get('/getNotes', authMiddleware, getAllNotesOfLoggedInUser);
router.get('/get/:noteId', authMiddleware, getNoteById);
router.post('/create', authMiddleware, createNote);
router.patch('/update/:noteId', authMiddleware, updateNoteById);
router.patch('/toggleComplete/:noteId', authMiddleware, toggleNoteComplete);
router.delete('/delete/:noteId', authMiddleware, deleteNoteById);

export default router;
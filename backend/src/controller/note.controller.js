import mongoose from "mongoose";
import { Note } from "../model/note.model.js";
import {validateNoteCreation, validateNoteUpdate} from "../validator/index.js";
import ApiErrorRes from '../utils/ApiErrorRes.js';
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const createNote = asyncHandler(async function (req, res) {
    if(!req.body) throw new Error('Note data is required');
    const noteData = {title: req.body?.title, content: req.body?.content, date: req.body?.date};

    const testResult = validateNoteCreation(noteData);
    if(!testResult.isValid) return res.status(400).json(new ApiErrorRes(400, testResult.msg));


    try {
        const newNote = await Note.create({...noteData, owner: req.user.id});
        if(!newNote) throw new Error('Note not created');
        return res.status(201).json(new ApiResponse(201, 'Note created successfully', newNote));
    } catch (error) {
        console.log(error);
        return res.status(400).json(new ApiErrorRes(400, 'An error occurred while creating the note'));
    }
});

const getNoteById = asyncHandler(async function (req, res){

    // Check user authorization
    if(!req.user) return res.status(401).json(new ApiErrorRes(401, 'User is not authorized to acces this resource'));


    if(!req.params.noteId) return res.status(400).json(new ApiErrorRes(400, 'Note ID is required'));
    const noteId = req.params.noteId;

    if(!mongoose.isValidObjectId(noteId))
        return res.status(400).json(new ApiErrorRes(400, 'Invalid note ID'));
    try {
        const note = await Note.findById(noteId).populate('owner', 'username email name _id');
        if(!note) return res.status(404).json(new ApiErrorRes(404, 'Note not found'));
        return res.status(200).json(new ApiResponse(200, 'Note found successfully', note));
    } catch (error) {
        console.log(error);
        return res.status(500).json(new ApiErrorRes(500, 'An error occurred while fetching the note'));
    }
});

const getAllNotesOfLoggedInUser = asyncHandler(async function (req, res){
    if(!req.user) return res.status(401).json(new ApiErrorRes(401, 'User is not unauthorized'));

    try {
        const notes = await Note.find({owner: req.user.id}).sort({createdAt: -1});
        if(!notes) return res.status(404).json(new ApiErrorRes(404, 'Notes not found'));
        
        return res.status(200).json(new ApiResponse(200, 'Notes found successfully', notes));
    } catch (error) {
        return res.status(500).json(new ApiErrorRes(500, error.message));
    }
});

const updateNoteById = asyncHandler(async function (req, res){

    // Check user authorization
    if(!req.user) return res.status(401).json(new ApiErrorRes(401, 'User is not authorized to acces this resource'));

    // Check noteId in param
    if(!req.params.noteId) return res.status(400).json(new ApiErrorRes(400, 'Note ID is required'));
    const noteId = req.params.noteId;

    // Check if noteId is valid
    if(!mongoose.isValidObjectId(noteId))
        return res.status(400).json(new ApiErrorRes(400, 'Invalid note ID'));

    // Check note data
    if(!req.body) return res.status(400).json(new ApiErrorRes(400, 'Note data is required'));

    // Return if its note completetion is requested
    if(req.body?.isCompleted?.trim()) return res.status(400).json(new ApiErrorRes(400, 'Use completeTodo route instead'));

    // Get notedata from request body
    const noteData = {title: req.body?.title, content: req.body?.content};

    // Validate note data
    if(!noteData.title && !noteData.content) return res.status(400).json(new ApiErrorRes(400, 'At least one field is required'));
    const testResult = validateNoteUpdate(noteData);
    if(!testResult.isValid) return res.status(400).json(new ApiErrorRes(400, testResult.msg));

    try {
        // Update note
        const updatedNote = await Note.findByIdAndUpdate(noteId, testResult.data, {new: true});
        // Check if note exists
        if(!updatedNote) return res.status(404).json(new ApiErrorRes(404, 'Note not found'));
        // Return success response
        return res.status(200).json(new ApiResponse(200, 'Note updated successfully', updatedNote));
    } catch (error) {
        console.log(error);
        // Return error response
        return res.status(500).json(new ApiErrorRes(500, 'An error occurred while updating the note'));
    }

});

const toggleNoteComplete = asyncHandler(async function (req, res){

    // Check if the user is authorized or not
    if(!req.user) return res.status(401).json(new ApiErrorRes(401, 'User is not authorized to perform the requested action'));

    // Check if noteId is provided in param
    if(!req.params.noteId) return res.status(400).json(new ApiErrorRes(400, 'Note id is required to update note completetion'));

    // Check provided note'id is a valid id or not
    if(!mongoose.isValidObjectId(req.params.noteId)) return res.stats(400).json(new ApiErrorRes(400, 'Invalid note id'));

    try{
    const updatedNote = await Note.findByIdAndUpdate( req.params.noteId , [{
        $set: {
            isCompleted: {
                $cond: {
                    if: {
                        $eq: ['$isCompleted', 'true']
                    },
                    then: 'false',
                    else: 'true'
                }
            }
        }
    }], {new: true});

    // If there is not updated note return not found error
    if(!updatedNote) return res.status(404).json(new ApiErrorRes(404, 'No note found for the given note\'s id'));
    // Return updated note
    return res.status(201).json(new ApiResponse(201, "toggled sucessfully", updatedNote));
    }catch(err){
        console.log(err);
        return res.status(500).json(new ApiErrorRes(500, 'An error occurred while toggling the note completion status'));
    }
});

const deleteNoteById = asyncHandler(async function (req, res){
    // Check user authorization
    if(!req.user) return res.status(401).json(new ApiErrorRes(401, 'User is not authorized to perform the requested action'));


    // Check noteId in param
    if(!req.params.noteId) return res.status(400).json(new ApiErrorRes(400, 'Note ID is required'));
    const noteId = req.params.noteId;

    // Check if noteId is valid
    if(!mongoose.isValidObjectId(noteId))
        return res.status(400).json(new ApiErrorRes(400, 'Invalid note ID'));

    try {
        // Delete note
        const deletedNote = await Note.findByIdAndDelete(noteId, {new: true});
        // Check if note exists
        if(!deletedNote) return res.status(404).json(new ApiErrorRes(404, 'Note not found'));
        // Return success response
        return res.status(200).json(new ApiResponse(200, 'Note deleted successfully', {}));
    } catch (error) {
        console.log(error);
        // Return error response
        return res.status(500).json(new ApiErrorRes(500, 'An error occurred while deleting the note'));
    }
});

export {createNote, getAllNotesOfLoggedInUser, getNoteById, toggleNoteComplete, updateNoteById, deleteNoteById};
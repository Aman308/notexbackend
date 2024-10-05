const express = require("express");
const router = express.Router();
var fetchuser = require("../middleware/fetchuser");
const Note = require("../models/Note");
const { body, validationResult } = require("express-validator");
// const User = require ('../models/User');

// ROUTE:1 Get all the notes using: GET "/api/note/createuser".   login reuired

router.get("/fetchallnotes", fetchuser, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id});
        res.json(notes);
    } catch (error) {
        console.error(error.message);  
        res.status(500).send("Internal server Error")
    }

});

// ROUTE:2 Add a new notes using: POST "/api/note/addnote".   login reuired

router.post(
  "/addnote",
  fetchuser,
  [
    body("title", "Enter a valid titile").isLength({ min: 3 }),
    body("description", "description must be atleast 5 character").isLength({
      min: 5,}),],
  async (req, res) => {
    try {
        
    
    const {title,description,tag  } = req.body;
    // if there are errors, return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const note = new Note({
        title, description, tag, user: req.user.id
    })
    const savedNote = await note.save()
    res.json(savedNote);
  }
catch (error) {
    console.error(error.message);  
    res.status(500).send("Internal server Error")
}});


// ROUTE:3 update an exsisting Not using: PUT "/api/note/updatenote".   login reuired
router.put(
    "/updatenote/:id", fetchuser, async (req, res) => {
        const{title,description,tag} = req.body;
        // Creaate a newNote object
        try {
        const newNote = {};
        if(title){newNote.title = title};
        if(description){newNote.description = description};
        if(tag){newNote.tag = tag};

        // Find a note to be updated

        let note = await Note.findById(req.params.id)
        if(!note){return res.status(404).send("Not Found")}

        if(note.user && note.user.toString() !== req.user.id){
            return res.status(401).send("Not Allowed")  
        }

        note = await Note.findByIdAndUpdate(req.params.id, {$set: newNote}, {new:true})
        res.json({note});
    } catch (error) {
        console.error(error.message);  
        res.status(500).send("Internal server Error")
    }

    })


// ROUTE:4 Delete an exsisting Not using: DELETE "/api/note/deletenote".   login reuired
router.delete(
    "/deletenote/:id", fetchuser, async (req, res) => {
        // Find a note to be Deleted
        try {
        const newNote = {};
        let note = await Note.findById(req.params.id)
        if(!note){return res.status(404).send("Not Found")}

        // Allow deletion only if user owns this note

        if(note.user && note.user.toString() !== req.user.id){
            return res.status(401).send("Not Allowed")  
        }

        note = await Note.findByIdAndDelete(req.params.id, {$set: newNote}, {new:true})
        res.json({"Sucess" : "Note has been deleted !",note:note});
    } catch (error) {
        console.error(error.message);  
        res.status(500).send("Internal server Error")  
    }
    })

module.exports = router;

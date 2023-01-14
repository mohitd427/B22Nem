const express = require("express");
const noteRouter = express.Router();
const { NoteModel } = require("../models/Note.model");

noteRouter.get("/", async (req, res) => {
  const query = req.query;
  try {
    const notes = await NoteModel.find(query);
    res.send(notes);
  } catch (err) {
    console.log(err);
    res.send({ err: "Oop's Something went wrong" });
  }
});

noteRouter.post("/create", async (req, res) => {
  const payload = req.body;
  try {
    const note = new NoteModel(payload);
    await note.save();
    res.send("Created the Notes");
  } catch (err) {
    console.log(err);
    res.send({ error: "Something went wrong" });
  }
});

noteRouter.patch("/update/:id", async (req, res) => {
  const Id = req.params.id;
  const payload = req.body;
  const note = await NoteModel.findOne({ _id: Id });
  const userID_in_note = note.userID;
  const userID_making_req = req.body.userID;
  try {
    if (userID_making_req !== userID_in_note) {
      res.send({ msg: "You are not Authorised" });
    } else {
      await NoteModel.findByIdAndUpdate({ _id: Id }, payload);
      res.send(`The document with id:${Id} has been updated.`);
    }
    // console.log(book)
  } catch (err) {
    console.log(err);
    res.send({ err: "Oop's Something went wrong" });
  }
});

noteRouter.delete("/delete/:id", async (req, res) => {
  const Id = req.params.id;
  const note = await NoteModel.findOne({ _id: Id });
  const userID_in_note = note.userID;
  const userID_making_req = req.body.userID;
  try {
    if (userID_making_req !== userID_in_note) {
      res.send({ msg: "You are not Authorised" });
    } else {
      await NoteModel.findByIdAndDelete({ _id: Id });
      res.send(`The document with id:${Id} has been updated.`);
    }
    // console.log(book)
  } catch (err) {
    console.log(err);
    res.send({ err: "Oop's Something went wrong" });
  }
});

module.exports = {
  noteRouter,
};

// "title":"FE" ,
//  "note":"Today is the second day at crud app",
//  "category":"Live Session",
//  "author":"Sharukh"

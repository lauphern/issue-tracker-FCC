/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";

const expect = require("chai").expect;
const MongoClient = require("mongodb");
const ObjectId = require("mongodb").ObjectID;

const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});

module.exports = function (app) {
  // MongoClient.connect(CONNECTION_STRING, (err, db) => {
  //   db.collection("projects").insertOne({name: "prueba2"})
  //   .then(doc => console.dir(doc))
  //   .catch(err => console.dir(err))
  // })
  app
    .route("/api/issues/:project")

    .get(function (req, res) {
      const project = req.params.project;
    })

    .post(function (req, res) {
      const project = req.params.project;
      if (!req.body.issue_title || !req.body.issue_text || !req.body.created_by) {
        res.status(500).send("Fill in all the required inputs please");
        throw new Error("Fill in the required inputs");
      }
      const { issue_title, issue_text, created_by, assigned_to, status_text } = req.body;
      const newIssue = {
        issue_title,
        issue_text,
        created_by,
        assigned_to,
        status_text,
        open: true,
        created_on: new Date(),
        updated: new Date(),
      };
      MongoClient.connect(CONNECTION_STRING, (err, db) => {
        if (err) throw new Error("Couldn't connect to the database");
        else {
          db.collection(project)
            .insertOne(newIssue)
            .then(doc => {
              return db
                .collection(project)
                .findOne({ _id: doc.insertedId })
                .then(doc => {
                  res.json(doc);
                });
            })
            .catch(err => {
              res.status(500).send("Something went wrong! The issue couldn't be created");
              throw new Error("Couldn't create the issue");
            });
        }
      });
    })

    .put(function (req, res) {
      const project = req.params.project;
      if (!req.body._id || !ObjectId.isValid(req.body._id)) {
        res.status(500).send("Fill in all the required inputs and provide a valid _id please");
        throw new Error("Fill in the required inputs and provide a valid _id");
      }
      let { _id, issue_title, issue_text, created_by, assigned_to, status_text, open } = req.body;
      if(open === "false") open = false;
      const updateObj = {
        issue_title,
        issue_text,
        created_by,
        assigned_to,
        status_text,
        open,
        updated: new Date(),
      };
      for(let key in updateObj) {
        if(updateObj[key] === "" || updateObj[key] === undefined) delete updateObj[key]
      }
      if(Object.keys(updateObj).length <= 1) {
        res.status(500).send("Please provide a field to update");
        throw new Error("No updated field sent");
      }
      MongoClient.connect(CONNECTION_STRING, (err, db) => {
        if (err) throw new Error("Couldn't connect to the database");
        else {
          db.collection(project)
            .findOneAndUpdate({_id: new ObjectId(_id)}, { $set: updateObj })
            .then(result => {
              if (!result.lastErrorObject.updatedExisting) throw new Error();
              else res.json("succesfully updated");
            })
            .catch(err => {
              res.status(500).send("Something went wrong! The issue couldn't be updated");
              throw new Error(`Could not update ${_id}`);
            });
        }
      });
    })

    .delete(function (req, res) {
      const project = req.params.project;
      if (!req.body._id || !ObjectId.isValid(req.body._id)) {
        res.status(500).send("Please provide a valid issue's _id.");
        throw new Error("_id error");
      }
      MongoClient.connect(CONNECTION_STRING, (err, db) => {
        if (err) throw new Error("Couldn't connect to the database");
        else {
          db.collection(project)
            .findOneAndDelete({ _id: new ObjectId(req.body._id) })
            .then(result => {
              if (!result.value) throw new Error();
              else res.json(`deleted ${result.value._id}`);
            })
            .catch(err => {
              res.status(500).send("Something went wrong! The issue couldn't be deleted");
              throw new Error(`Could not delete ${req.body._id}`);
            });
        }
      });
    });
};

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
      if (!req.body.issue_title || !req.body.issue_text || !req.body.created_by) {
        res.status(500).send("Fill in all the required inputs please");
        throw new Error("Fill in the required inputs");
      }
      MongoClient.connect(CONNECTION_STRING, (err, db) => {
        if (err) throw new Error("Couldn't connect to the database");
        else {
          db.collection(project)
            .insertOne(newIssue)
            .then(doc => {
              return db.collection(project).findOne({_id: doc.insertedId})
              .then(doc => {
                res.json(doc)
              })
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
    })

    .delete(function (req, res) {
      const project = req.params.project;
    });
};

/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  
  let testId;

    suite('POST /api/issues/{project} => object with issue data', function() {
      
      test('Every field filled in', function(done) {
       chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in',
          assigned_to: 'Chai and Mocha',
          status_text: 'In QA'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.include(res.body, {issue_title: "Title"});
          assert.include(res.body, {issue_text: "text"});
          assert.include(res.body, {created_by: "Functional Test - Every field filled in"});
          assert.include(res.body, {assigned_to: "Chai and Mocha"});
          assert.include(res.body, {status_text: "In QA"});
          assert.include(res.body, {open: true});
          assert.property(res.body, "created_on");
          assert.property(res.body, "updated_on");
          assert.property(res.body, "_id");
          testId = res.body._id;
          done();
        });
      });
      
      test('Required fields filled in', function(done) {
        chai.request(server)
        .post("/api/issues/test")
        .send({
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Required fields filled in',
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.include(res.body, {issue_title: "Title"});
          assert.include(res.body, {issue_text: "text"});
          assert.include(res.body, {created_by: "Functional Test - Required fields filled in"});
          assert.include(res.body, {open: true});
          assert.property(res.body, "created_on");
          assert.property(res.body, "updated_on");
          assert.property(res.body, "_id");
          done();
        })
      });
      
      test('Missing required fields', function(done) {
        chai.request(server)
        .post("/api/issues/test")
        .send({
          issue_text: 'text',
          created_by: 'Functional Test - Required fields filled in',
        })
        .end(function(err, res) {
          assert.equal(res.status, 500);
          assert.equal(res.text, "Fill in all the required inputs please");
          done();
        })
      });
      
    });
    
    suite('PUT /api/issues/{project} => text', function() {
      
      test('No body', function(done) {
        chai.request(server)
        .put("/api/issues/test")
        .send({})
        .end(function(err, res) {
          assert.equal(res.status, 500);
          assert.equal(res.text, "Fill in all the required inputs and provide a valid _id please");
          done();
        })
      });
      
      test('One field to update', function(done) {
        chai.request(server)
        .put("/api/issues/test")
        .send({
          _id: testId,
          created_by: 'Functional Test - One field to update'
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, "succesfully updated");
          done();
        })
      });
      
      test('Multiple fields to update', function(done) {
        chai.request(server)
        .put("/api/issues/test")
        .send({
          _id: testId,
          created_by: 'Functional Test - Multiple fields to update',
          open: "false"
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, "succesfully updated");
          done();
        })
      });
      
    });
    
    suite('GET /api/issues/{project} => Array of objects with issue data', function() {
      
      test('No filter', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          done();
        });
      });
      
      test('One filter', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({
          open: true
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.include(res.body[0], {open: true});
          done()
        }) 
      });
      
      test('Multiple filters (test for multiple fields you know will be in the db for a return)', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({
          open: false,
          created_by: 'Functional Test - Multiple fields to update'
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.include(res.body[0], {open: false, created_by: 'Functional Test - Multiple fields to update'});
          done()
        }) 
      });
      
    });
    
    suite('DELETE /api/issues/{project} => text', function() {
      
      test('No _id', function(done) {
        chai.request(server)
        .delete("/api/issues/test")
        .send({})
        .end(function(err, res) {
          assert.equal(res.status, 500);
          assert.equal(res.text, "Please provide a valid issue's _id.");
          done();
        })
      });
      
      test('Valid _id', function(done) {
        chai.request(server)
        .delete("/api/issues/test")
        .send({
          _id: testId
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, `deleted ${testId}`);
          done();
        })
      });
      
    });

});

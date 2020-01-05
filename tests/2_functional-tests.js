/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', function(done){
    chai.request(server)
     .get('/api/books')
     .end(function(err, res){
       assert.equal(res.status, 200);
       assert.isArray(res.body, 'response should be an array');
       if (res.body.length > 0) {
         res.body.forEach((ele, i) => {
           assert.property(ele,     '_id',          'Books['+i+'] should contain _id');
           assert.property(ele,     'title',        'Books['+i+'] should contain title');
           assert.property(ele,     'comments',     'Books['+i+'] should contain comments');
           assert.property(ele,     'commentcount', 'Books['+i+'] should contain commentcount');

           assert.isArray(ele.comments,             'Books['+i+'] comments shoud be an array');
         });
       }
       done();
     });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {
    let id;
    let cnt = 1;

    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        chai.request(server)
          .post('/api/books')
          .send({ title: 'titel '+new Date().valueOf()})
          .end(function(err, res){
            assert.equal(res.status, 200,         'response should have status 200');
            assert.isObject(res.body,             'response should be an object');
            assert.property(res.body, '_id',      'response should contain _id');
            assert.property(res.body, 'title',    'response should contain title');
            assert.isString(res.body.title,       'title should be a string');
            assert.property(res.body, 'comments', 'response should contain comments');
            assert.isArray(res.body.comments,     'comments should be an array');
            id = res.body._id;
            done();
          }); 
      });      
      
      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
          .post('/api/books')
          .end(function(err, res){
            assert.equal(res.status, 200,           'response should have status 200');
            assert.equal(res.text, 'missing title', 'response should be the string "missing title"');
            done();
         });
      });      
    });


    suite('GET /api/books => array of books', function() {
      
      test('Test GET /api/books', function(done){
        chai.request(server)
          .get('/api/books')
          .end(function(err, res){
            assert.equal(res.status, 200,               'response should have status 200');
            assert.isArray(res.body,                    'response should be an array');
            assert.property(res.body[0], '_id',               'response[0] should contain _id');
            assert.property(res.body[0], 'title',             'response[0] should contain title');
            assert.property(res.body[0], 'comments',          'response[0] should contain comments');
            assert.property(res.body[0], 'commentcount',      'response[0] should contain commentcount');
            res.body.forEach( (ele, i) => {
              assert.property(ele, '_id',               'response['+i+'] should contain _id');
              assert.property(ele, 'title',             'response['+i+'] should contain title');
              assert.property(ele, 'comments',          'response['+i+'] should contain comments');
              assert.property(ele, 'commentcount',      'response['+i+'] should contain commentcount');
            });
            done();
          });
      });      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai.request(server)
          .get('/api/books/99999')
          .end(function(err, res){
            assert.equal(res.status, 200,            'response should have status 200');
            assert.isString(res.text,                'response should be an string');
            assert.equal(res.text, 'no book exists', 'string should equal "no book exists"');
            done();
          });
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai.request(server)
          .get('/api/books/'+id) // This is the latest created entry !!
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.isObject(res.body,                   'response should be an object');
            assert.property(res.body, '_id',            'response should contain _id');
            assert.property(res.body, 'title',          'response should contain title');
            assert.property(res.body, 'comments',       'response should contain comments');
            assert.equal(res.body._id, id,              '_id should equal "'+id+'"')
            assert.isArray(res.body.comments,           'comments should be an array');
            res.body.comments.forEach( (comment, i) => {
              assert.isString(comment,             'comment['+i+'] should be a string');
              assert.isAbove(comment.length, 0,    'comment['+i+'] should not be empty');
              assert.notEqual(comment, 'null',     'comment['+i+'] should no be "null"');
            })
            done();
          });
      });
    });

    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        chai.request(server)
          .post('/api/books/'+id) // This is the latest created entry !!
          .send({ comment: 'Comment '+(cnt++)})
          .end(function(err, res) {
            assert.equal(res.status, 200);

            assert.isObject(res.body,                   'response should be an object');
            assert.property(res.body, '_id',            'response should contain _id');
            assert.property(res.body, 'title',          'response should contain title');
            assert.property(res.body, 'comments',       'response should contain comments');
            assert.isArray(res.body.comments,           'comments should be an array');
            res.body.comments.forEach( (comment, i) => {
              assert.isString(comment,             'comment['+i+'] should be a string');
              assert.isAbove(comment.length, 0,    'comment['+i+'] should be a string');
              assert.notEqual(comment, 'null',     'comment['+i+'] should no be "null"');
            })
            done();
          });
      });
    });
  });
});

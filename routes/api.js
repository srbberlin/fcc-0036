/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

const expect = require('chai').expect;
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;

const { getAllBooks, addNewBook, deleteAllBooks, getOneBook, addBookComment, deleteOneBook } = require('../logic/library')

module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      //console.log('GET')
      getAllBooks(data => {
        //console.log('getAllBooks', data);
        res.send(data)
      })
    })
    
    .post(function (req, res){
      var title = req.body.title;
      //response will contain new book object including atleast _id and title
      //console.log('POST ', title)
      addNewBook(title, data => {
        //console.log('addNewBook', data);
        res.send(data)
      })
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
      //console.log('DELETE')
      deleteAllBooks(data => {
        //console.log('deleteAllBooks', data);
        res.send(data)
      })
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      var id = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      //console.log('GET ' + id)
      getOneBook(id, data => {
        //console.log('getOneBook', id, data);
        res.send(data)
      })
    })
    
    .post(function(req, res){
      var id = req.params.id;
      var comment = req.body.comment;
      //json res format same as .get
      //console.log('POST ', id, comment)
      addBookComment(id, comment, data => {
        //console.log('addBookComment', id, data);
        res.send(data)
      })
    })
    
    .delete(function(req, res){
      var id = req.params.id;
      //if successful response will be 'delete successful'
      //console.log('DELETE ', id)
      deleteOneBook(id, data => {
        //console.log('deleteOneBook', id, data);
        res.send(data)
      })
    });
  
}

const { restart, getObjectID, create, get, addComment, remove } = require('../db/db')

const name = 'books';

exports.addNewBook = function (title, f) {
  if (title) {
    create(
      name,
      {
        _id: getObjectID().hex,
        title: title,
        comments: [],
        commentcount: 0
      },
      data => {
        f(data)
      });
  }
  else {
    f('missing title');
  }
}

exports.addBookComment = function (id, comment, f) {
  addComment (name, id, comment, data => {
    f(data);
  })
}

exports.getOneBook = function (id, f) { 
  get(name, id, data => {
    f(data)
  });
}

exports.getAllBooks = function (f) {
  get(name, null, data => {
    f(data);
  });
}

exports.deleteOneBook = function (id, f) {
  remove(name, id, data => {
    f(data)
  });
}

exports.deleteAllBooks = function (f) {
  remove(name, null, data => {
    f(data)
  });
}


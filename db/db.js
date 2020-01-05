const MongoClient = require('mongodb');
const ObjectId    = require('mongodb').ObjectID;
let   db;

const events      = require('events');
const event       = new events.EventEmitter();
let   retries     = 0;
const delay       = 300;

function connect () {
  MongoClient.connect(
    process.env.URL,
    { 
      useUnifiedTopology: true, 
      useNewUrlParser: true 
    },
    function (e, d) {
      if(!e){
        db = d.db(process.env.DB);
        console.log("Database connection established. ");
        event.emit('conn');
      } else {
        if(retries < 4){
          console.log('Retrying to connect db ', retries++, e);
          setTimeout(connect, delay);
        } else {
          console.log('Unable to connect db');
        }
      }
  });
}

connect();

function act (name, fn) { 
  if(db !== null) {
    fn(db.collection(name));
  } else {
    event.on('conn', function () {
      fn(db.collection(name));
    });
  }
};

exports.restart = function () {
  retries = 0;
  connect();
}

exports.getObjectID = function () { 
  const res = new ObjectId();
  return { hex: res.toHexString(), int: res.getTimestamp() };
}

exports.create = function (name, o, f) {
  //console.log('create: ', name, o);
  act (name, function (collection) {
    collection.insertOne(o, function (err, res) {
      if (err) {
        f('no object created');
        throw err;
      }
      //console.log(res.ops[0]);
      f(res.ops[0]);
    });
  });
}

exports.get = function (name, id, f) {
  //console.log('getAll: '+ name, o);
  act (name, function (collection) {
    let filter = id ? { _id: id } : {};
    //console.log("get: "+id)
    collection.find(filter).toArray(function (err, res) {
      //console.log("collection.find: ",err,res)
      if (err) {
        f('error getting objects(s)');
        throw err;
      }
      //console.log(res);
      //f(res.length === 1 && id ? res[0] : res)
      f(id ? (res.length !== 0 ? res[0] : 'no book exists') : res)
    });
  })
}

exports.addComment= function (name, id, comment, f) {
  //console.log('update: '+ name, id, o);
  act (name, function (collection) {
    collection.findOneAndUpdate(
      { _id: id },
      { 
        $push: { comments: comment },
        $inc: { commentcount: 1 }
      },
      { returnOriginal: false },
      function (err, res) {
        if (err) {
          f('error updating object');
          throw err;
        }
        //console.log('addComment: ', res.value);
        f(res.ok === 1 ? res.value : []);
      });
  })
}

exports.remove = function (name, id, f) {
  //console.log('deleteOne: '+ name, filter);
  act (name, function (collection) {
    collection.deleteMany(id ? { _id: id } : {}, function (err, res) {
      if (err) {
        f('error removing object(s)');
        throw err;
      }
      //console.log('remove: ', name, id);
      f(id ? 'delete successful' : 'complete delete successful');
    });
  })
}

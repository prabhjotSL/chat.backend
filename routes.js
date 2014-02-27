var _ = require('underscore');
// XML capability
var builder = require('xmlbuilder');

// Division of labour inspired by this article
// https://stackoverflow.com/questions/13334051/divide-node-app-in-different-files
var db = require('./db');
// var regex = /\/.*?\//;
var regex = /\/([^\/]*)\//;
var regexXml = /\/([^\/]*)\./;

// ====================== ROUTING ==========================================
module.exports = function (app) {
  // Default route
  app.get('/', function(req, res) {
    res.type('text/plain');
    res.send('This will be the API used by the CHAT Android app for data syncing.\n Add /workers to retrieve all worker records. More to come');
  });


  app.get('/clients', function(req, res) {
    handleGetAll(req, res, req.param('enc'));
  });

  app.get('/clients/:id', function(req, res) {
    handleGetByID(req, res, req.params.id, req.param('enc'));
  });

  app.post('/clients', function(req, res) {
    handlePost(req, res);
  });



  app.get('/households', function(req, res) {
    handleGetAll(req, res, req.param('enc'));
  });

  app.get('/households/:id', function(req, res) {
    handleGetByID(req, res, req.params.id, req.param('enc'));
  });

  app.post('/households', function(req, res) {
    handlePost(req, res);
  });



  app.get('/workers', function(req, res) {
    handleGetAll(req, res, req.param('enc'));
  });

  app.get('/workers/:id', function(req, res) {
    handleGetByID(req, res, req.params.id, req.param('enc'));
  });

  app.post('/workers', function(req, res) {
    handlePost(req, res);
  });



  app.get('/services', function(req, res) {
    handleGetAll(req, res, req.param('enc'));
  });

  app.get('/services/:id', function(req, res) {
    handleGetByID(req, res, req.params.id, req.param('enc'));
  });

  app.post('/services', function(req, res) {
    handlePost(req, res);
  });


  // ************************* PUSH ******************************


  app.get('/visits', function(req, res) {
    handleGetAll(req, res, req.param('enc'));
  });

  app.get('/visits/:id', function(req, res) {
    handleGetByID(req, res, req.params.id, req.param('enc'));
  });

  app.post('/visits', function(req, res) {
    handlePost(req, res);
  });


  app.get('/attendance', function(req, res) {
    handleGetAll(req, res, req.param('enc'));
  });

  app.get('/attendance/:id', function(req, res) {
    handleGetByID(req, res, req.params.id, req.param('enc'));
  });

  app.post('/attendance', function(req, res) {
    handlePost(req, res);
  });
};


// ========== Helper function that do the work ;) ===============================
var handleGetAll = function (req, res, encoding) {
  var collection = req.route.path.substring(1,req.route.path.length);
  // var collection = route

  db.retrieveAllFrom (collection)
    .onFulfill(function (data) {
      if (encoding === "xml") {
        var xmlRoot = builder.create(collection);

        _.each(data, function(d) {
          var dObj = {};
          // the following seems weird but is necessary to make dates work
          // They are stored as ISODate in Mongo and will crash the XML parser
          // Stringifying and parsing back creates a string representation of date that passes the XML parser
          var obj = JSON.parse(JSON.stringify(d.toObject()));
          dObj[collection] = obj;
          dObj[collection]['@id'] = obj._id;

          xmlRoot.ele(dObj);
        });

        res.writeHead( 200, {'Content-Type': 'text/xml'} );
        res.end( xmlRoot.end() );
      } else {
        res.json(data);
      }
    })
    .onReject(function (reason){
      res.statusCode = 404;
      return res.send('Error 404: Requested data not found. Reason: '+reason.message);
    });
};

var handleGetByID = function (req, res, id, encoding) {
  var collection = req.route.path.match(regex)[1];

  var where = {'_id': id};

  db.retrieveFromWhere (collection, where)
    .onFulfill(function (data) {
      if (encoding === "xml") {
        var xmlRoot = builder.create(collection);

        _.each(data, function(d) {
          var dObj = {};
          // the following seems weird but is necessary to make dates work
          // They are stored as ISODate in Mongo and will crash the XML parser
          // Stringifying and parsing back creates a string representation of date that passes the XML parser
          var obj = JSON.parse(JSON.stringify(d.toObject()));
          dObj[collection] = obj;
          dObj[collection]['@id'] = obj._id;

          xmlRoot.ele(dObj);
        });

        res.writeHead( 200, {'Content-Type': 'text/xml'} );
        res.end( xmlRoot.end() );
      } else {
        res.json(data);
      }
    })
    .onReject(function (reason){
      res.statusCode = 404;
      return res.send('Error 404: Requested data not found. Reason: '+reason.message);
    });
};


var handlePost = function (req, res) {
  var doc = req.body,
      collection = req.route.path.substring(1,req.route.path.length);

  db.storeObjIn(doc, collection)
    .onFulfill(function (document) {
      return res.json(true);
    })
    .onReject(function(reason) {
      res.statusCode = 404;
      return res.send(reason.message);
    });
};
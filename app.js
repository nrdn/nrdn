var fs = require('fs');
var async = require('async');
var express = require('express');
    var app = express();
var gm = require('gm').subClass({ imageMagick: true });

var mongoose = require('mongoose');
  var Schema = mongoose.Schema;
  var ObjectId = mongoose.Types.ObjectId()

mongoose.connect('localhost', 'main');
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.locals.pretty = true;
// app.use(express.favicon(__dirname + '/public/img/favicon.ico'));
app.use(express.bodyParser({ keepExtensions: true, uploadDir:__dirname + '/uploads' }));
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.session({ secret: 'keyboard cat' }));
app.use(express.static(__dirname + '/public'));
app.use(function(req, res, next) {
  res.locals.session = req.session;
  next();
});
app.use(app.router);


// -------------------
// *** Model Block ***
// -------------------


var userSchema = new Schema({
   login: String,
    password: String,
    name: String,
   email: String,
  status: {type: String, default: 'User'},
    date: {type: Date, default: Date.now},
});

var workSchema = new Schema({
  tag: String,
  logo: String,
  w_id: String,
  ru: {
    title: String,
    description: String
  },
  en: {
    title: String,
    description: String
  },
  images: [{
      path: String,
      description: String
    }],
  date: {type: Date, default: Date.now}
});

var postSchema = new Schema({
    ru: {
      title: String,
      body: String
    },
    en: {
      title: String,
      body: String
    },
    tag: String,
    date: {type: Date, default: Date.now},
    image: String
});


var User = mongoose.model('User', userSchema);
var Work = mongoose.model('Work', workSchema);
var Post = mongoose.model('Post', postSchema);


// ------------------------
// *** Midleware Block ***
// ------------------------


function checkAuth (req, res, next) {
  if (req.session.user_id)
    next();
  else
    res.redirect('/login');
}


// ------------------------
// *** Post Params Block ***
// ------------------------

app.post('/edit', function (req, res) {
  var files = req.files;
  var name = new Date().getTime();
  var ext = files.mf_file_undefined.type.slice(6);
  var newPath = __dirname + '/public/preview/' + name;

  gm(files.mf_file_undefined.path).resize(1120, false).quality(60).noProfile().write(newPath, function() {
    var path = {'path':'/preview/' + name}
    res.send(path);
  });
});

app.post('/rm_prev', function (req, res) {
  var path = req.body.path;

  fs.unlink(__dirname + '/public' + path, function() {
    res.send('ok');
  });
});

// ------------------------
// *** Main Block ***
// ------------------------


app.get('/', function(req, res) {

  Work.find().sort('-date').exec(function(err, works) {
    res.render('index', {works: works});
  });
});


// ------------------------
// *** Works Block ***
// ------------------------


app.get('/works/tag/:tag', function(req, res) {
  var tag = req.params.tag;

  Work.find({'tag': tag}).sort('-date').exec(function(err, works) {
    res.render('works', {works: works});
  });
});

app.get('/works', function(req, res) {

  Work.find().sort('-date').exec(function(err, works) {
    res.render('works', {works: works});
  });
});

app.get('/works/:id', function(req, res) {
  var id = req.params.id;

  Work.find({'w_id':id}).exec(function(err, work) {
    Work.find({'tag':work.tag}).sort('-date').limit(6).exec(function(err, r_works) {
      res.render('works/work.jade', {work: work[0], r_works: r_works});
    });
  });
});


// ------------------------
// *** Blog Block ***
// ------------------------


app.get('/blog', function(req, res) {

  Post.find().sort('-date').exec(function(err, posts) {
    res.render('blog', {posts: posts});
  });
});

app.get('/blog/:tag', function(req, res) {
  var tag = req.params.tag;

  Post.find({'tag': tag}).exec(function(err, posts) {
    res.render('blog', {posts: posts});
  });
});

app.get('/blog/post/:id', function(req, res) {
  var id = req.params.id;

  Post.findById(id, function(err, post) {
    Post.find({'tag':post.tag}).sort('-date').limit(6).exec(function(err, r_posts) {
      res.render('blog/post.jade', {post: post, r_posts: r_posts});
    });
  });
});


// ------------------------
// *** Static Block ***
// ------------------------


app.get('/publish', function(req, res) {
  res.render('static/publish.jade');
});

app.get('/contacts', function(req, res) {
  res.render('static/contacts.jade');
});


// ------------------------
// *** Auth Block ***
// ------------------------


app.get('/auth', checkAuth, function (req, res) {
  res.render('auth');
});

app.get('/auth/add/work', checkAuth, function (req, res) {
  res.render('auth/work/add.jade');
});

app.get('/auth/edit/works', checkAuth, function (req, res) {

  Work.find().sort('-date').exec(function(err, works) {
    res.render('auth/work/list.jade', {works: works});
  });
});

app.get('/auth/edit/works/:id', checkAuth, function (req, res) {
  var id = req.params.id;

  Work.findById(id, function(err, work) {
    res.render('auth/work/edit.jade', {work: work});
  });
});

app.get('/auth/add/post', checkAuth, function (req, res) {
  res.render('auth/blog/add.jade');
});

app.get('/auth/edit/posts', checkAuth, function (req, res) {

  Post.find().sort('-date').exec(function(err, posts) {
    res.render('auth/blog/list.jade', {posts: posts});
  });
});

app.get('/auth/edit/posts/:id', checkAuth, function (req, res) {
  var id = req.params.id;

  Post.findById(id, function(err, post) {
    res.render('auth/blog/edit.jade', {post: post});
  });
});

app.post('/auth/add/work', function (req, res) {
  var post = req.body;
  var files = req.files;
  var short_id = mongoose.Types.ObjectId().toString().substr(-4);
  var work = new Work();
  var dir = __dirname + '/public/images/works/' + work._id;

  work.w_id = short_id;
  work.tag = post.tag;
  work.logo = post.logo;
  work.ru.title = post.ru.title;
  work.ru.description = post.ru.description;
  if (post.en) {
    work.en.title = post.en.title;
    work.en.description = post.en.description;
  }

  fs.mkdir(dir, function() {
    async.forEach(post.images, function(image, callback) {
      var oldPath = __dirname + '/public' + image.path;
      var newPath = dir + '/' + image.path.slice(9);
      var pubPath = '/images/works/' + work._id + '/' + image.path.slice(9);

      fs.rename(oldPath, newPath, function() {
        image.path = pubPath;
        callback();
      });
    }, function() {
      work.images = post.images;
      work.save(function(err) {
        res.redirect('back');
      });
    });
  });
});

app.post('/auth/edit/work/:id', function (req, res) {
  var post = req.body;
  var files = req.files;
  var id = req.params.id;

  Work.findById(id, function(err, work) {
    work.tag = post.tag;
    work.ru.title = post.ru.title;
    work.ru.description = post.ru.description;
    if (post.en) {
      work.en.title = post.en.title;
      work.en.description = post.en.description;
    }

    if (files.image.size != 0) {
      var newPath = __dirname + '/public/images/works/' + work._id + '.jpg';
      gm(files.image.path).resize(1600, false).quality(80).noProfile().write(newPath, function() {
        work.image = '/images/works/' + work._id + '.jpg';
        work.save(function() {
          fs.unlink(files.image.path);
          res.redirect('back');
        });
      });
    }
    else {
      work.save(function() {
        fs.unlink(files.image.path);
        res.redirect('back');
      });
    }
  });
});

app.post('/auth/add/post', function (req, res) {
  var post = req.body;
  var files = req.files;
  var b_post = new Post();

  b_post.tag = post.tag;
  b_post.ru.title = post.ru.title;
  b_post.ru.body = post.ru.body;

  if (post.en) {
    b_post.en.title = post.en.title;
    b_post.en.body = post.en.body;
  }

  if (files.image.size != 0) {
    var newPath = __dirname + '/public/images/posts/' + b_post._id + '.jpg';
    gm(files.image.path).resize(1600, false).quality(80).noProfile().write(newPath, function() {
      b_post.image = '/images/posts/' + b_post._id + '.jpg';
      b_post.save(function() {
        fs.unlink(files.image.path);
        res.redirect('back');
      });
    });
  }
  else {
    b_post.save(function() {
      fs.unlink(files.image.path);
      res.redirect('back');
    });
  }
});

app.post('/auth/edit/post/:id', function (req, res) {
  var post = req.body;
  var files = req.files;
  var id = req.params.id;

  Post.findById(id, function(err, b_post) {
    b_post.tag = post.tag;
    b_post.ru.description = post.ru.description;
    if (post.en)
      b_post.en.description = post.en.description;

    if (files.image.size != 0) {
      var newPath = __dirname + '/public/images/posts/' + b_post._id + '.jpg';
      gm(files.image.path).resize(1600, false).quality(80).noProfile().write(newPath, function() {
        b_post.image = '/images/posts/' + b_post._id + '.jpg';
        b_post.save(function() {
          fs.unlink(files.image.path);
          res.redirect('back');
        });
      });
    }
    else {
      b_post.save(function() {
        fs.unlink(files.image.path);
        res.redirect('back');
      });
    }
  });
});


// ------------------------
// *** Login Block ***
// ------------------------


app.get('/login', function (req, res) {
  res.render('login');
});

app.post('/login', function(req, res) {
  var post = req.body;

  User.findOne({ 'login': post.login, 'password': post.password }, function (err, person) {
    if (!person) return res.redirect('back');
    req.session.user_id = person._id;
    req.session.status = person.status;
    req.session.login = person.login;
    res.redirect('/auth');
  });
});


app.get('/logout', function (req, res) {
  delete req.session.user_id;
  delete req.session.login;
  delete req.session.status;
  res.redirect('back');
});


app.get('/registr', function(req, res) {
  if (!req.session.user_id)
    res.render('registr');
  else
    res.redirect('/');
});


app.post('/registr', function (req, res) {
  var post = req.body;

  var user = new User({
    login: post.login,
    password: post.password,
    email: post.email,
    name: post.name,
  });

  user.save(function(err, user) {
    if(err) {throw err;}
    console.log('New User created');
    req.session.user_id = user._id;
    req.session.login = user.login;
    req.session.status = user.status;
    res.redirect('/login');
  });
});


// ------------------------
// *** Other Block ***
// ------------------------


app.get('/error', function (req, res) {
  res.render('error');
});

app.get('*', function(req, res){
  res.render('error');
});


app.listen(3000);
console.log('http://127.0.0.1:3000')
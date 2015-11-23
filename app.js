var fs = require('fs');
var async = require('async');
var mkdirp = require('mkdirp');
var del = require('del');
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
app.use(function(req, res, next) {
  if (req.headers.host.match(/^www/) !== null ) {
    res.redirect(301, 'http://' + req.headers.host.replace(/^www\./, '') + req.url);
  } else {
    next();
  }
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
  publish: String,
  logo: String,
  w_id: String,
  meta: {
    title: String,
    description: String
  },
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
    meta: {
      title: String,
      description: String
    },
    tag: String,
    b_id: String,
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

app.use(function(req, res, next){
  res.status(404);

  // respond with html page
  if (req.accepts('html')) {
    res.render('error/404.jade', { url: req.url });
    return;
  }

  // respond with json
  if (req.accepts('json')) {
    res.send({ error: 'Not found' });
    return;
  }

  // default to plain-text
  res.type('txt').send('Not found');
});

// app.use(function(err, req, res, next){

//   res.status(err.status || 500);
//   res.render('error/500.jade', { error: err });
// });

// app.use(function(err, req, res, next){

//   res.status(404);
//   res.render('error/404.jade', { error: err });
// });


// ------------------------
// *** Post Params Block ***
// ------------------------


app.post('/preview', function (req, res) {
  var files = req.files;
  var date = new Date();
  date = date.getTime();
  var newPath = '/preview/' + date + '.' + files.image.extension;

  gm(files.image.path).resize(1600, false).quality(80).write(__dirname + '/public' + newPath, function() {
    res.send(newPath);
  });
});

app.post('/rm_prev', function (req, res) {
  var path = req.body.path;

  fs.unlink(__dirname + '/public' + path, function() {
    res.send('ok');
  });
});

app.post('/blog_load', function (req, res) {
  var offset = req.body.offset;

  Post.find().sort('-date').skip(offset).limit(4).exec(function(err, posts) {
    if (posts.length == 0)
      res.send('end')
    else
      res.send(posts);
  });
});


// ------------------------
// *** Main Block ***
// ------------------------


app.get('/', function(req, res) {

  Work.find().sort('-date').limit(12).exec(function(err, works) {
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
    Work.find({'tag':work.tag, 'publish':work.publish}).sort('-date').limit(6).exec(function(err, r_works) {
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

app.get('/blog/tag/:tag', function(req, res) {
  var tag = req.params.tag;

  Post.find({'tag': tag}).exec(function(err, posts) {
    res.render('blog', {posts: posts});
  });
});

app.get('/blog/:id', function(req, res) {
  var id = req.params.id;

  Post.find({'b_id':id}).exec(function(err, post) {
    Post.find({'tag':post.tag}).sort('-date').limit(6).exec(function(err, r_posts) {
      res.render('blog/post.jade', {post: post[0], r_posts: r_posts});
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
  var images_preview = [];
  var public_path = __dirname + '/public';
  var preview_path = '/preview/';

  Work.findById(id, function(err, work) {
    async.forEach(work.images, function(image, callback) {
      var image_path = __dirname + '/public' + image.path;
      var image_name = image.path.split('/')[4];
      fs.createReadStream(image_path).pipe(fs.createWriteStream(public_path + preview_path + image_name));
      images_preview.push(preview_path + image_name);
      callback();
    }, function() {
      res.render('auth/work/edit.jade', {work: work, images_preview: images_preview});
    });
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
  var work = new Work();
  var images = [];

  work.w_id = work._id.toString().substr(-4);
  work.tag = post.tag;
  work.publish = post.publish;
  work.logo = post.logo;
  work.ru.title = post.ru.title;
  work.ru.description = post.ru.description;
  work.meta.title = post.meta.title;
  work.meta.description = post.meta.description;

  if (post.en) {
    work.en.title = post.en.title;
    work.en.description = post.en.description;
  }


  if (!post.images) {
    return (function () {
      work.images = [];
      work.save(function() {
        res.redirect('back');
      });
    })();
  }

  var public_path = __dirname + '/public';

  var images_path = {
    original: '/images/works/' + work._id + '/',
    thumb: '/images/works/' + work._id + '/small/',
  }

  mkdirp.sync(public_path + images_path.original);
  mkdirp.sync(public_path + images_path.thumb);

  post.images.path.forEach(function(item, i) {
    images.push({
      path: post.images.path[i],
      description: post.images.description[i]
    });
  });

  async.forEachSeries(images, function(image, callback) {
    var name = new Date();
    name = name.getTime();
    var original_path = images_path.original + name + '.jpg';
    var thumb_path = images_path.thumb + name + '.jpg';

    gm(public_path + image.path).resize(300, false).write(public_path + thumb_path, function() {
      gm(public_path + image.path).write(public_path + original_path, function() {
        work.images.push({
          path: original_path,
          description: image.description
        });
        callback();
      });
    });
  }, function() {
    work.save(function() {
      res.redirect('back');
    });
  });

});

app.post('/auth/edit/works/:id', function (req, res) {
  var post = req.body;
  var files = req.files;
  var id = req.params.id;
  var images = [];

  Work.findById(id, function(err, work) {
    work.tag = post.tag;
    work.publish = post.publish;
    work.logo = post.logo;
    work.ru.title = post.ru.title;
    work.ru.description = post.ru.description;
    work.meta.title = post.meta.title;
    work.meta.description = post.meta.description;
    work.date = new Date(post.date.year, post.date.month, post.date.date);

    if (post.en) {
      work.en.title = post.en.title;
      work.en.description = post.en.description;
    }

    var public_path = __dirname + '/public';

    var images_path = {
      original: '/images/works/' + work._id + '/',
      thumb: '/images/works/' + work._id + '/small/',
    }

    del.sync([public_path + images_path.original, public_path + images_path.thumb]);

    if (!post.images) {
      return (function () {
        work.images = [];
        work.save(function() {
          res.redirect('back');
        });
      })();
    }

    mkdirp.sync(public_path + images_path.original);
    mkdirp.sync(public_path + images_path.thumb);

    work.images = [];

    post.images.path.forEach(function(item, i) {
      images.push({
        path: post.images.path[i],
        description: post.images.description[i]
      });
    });

    async.forEachSeries(images, function(image, callback) {
      var name = new Date();
      name = name.getTime();
      var original_path = images_path.original + name + '.jpg';
      var thumb_path = images_path.thumb + name + '.jpg';

      gm(public_path + image.path).resize(300, false).write(public_path + thumb_path, function() {
        gm(public_path + image.path).write(public_path + original_path, function() {
          work.images.push({
            path: original_path,
            description: image.description
          });
          callback();
        });
      });
    }, function() {
      work.save(function() {
        res.redirect('back');
      });
    });

  });
});

app.post('/auth/add/post', function (req, res) {
  var post = req.body;
  var files = req.files;
  var b_post = new Post();

  b_post.b_id = b_post._id.toString().substr(-4);
  b_post.tag = post.tag;
  b_post.ru.title = post.ru.title;
  b_post.ru.body = post.ru.body;
  b_post.meta.title = post.meta.title;
  b_post.meta.description = post.meta.description;

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

app.post('/auth/edit/posts/:id', function (req, res) {
  var post = req.body;
  var files = req.files;
  var id = req.params.id;

  Post.findById(id, function(err, b_post) {
    // b_post.tag = post.tag;
    b_post.ru.title = post.ru.title;
    b_post.ru.body = post.ru.body;
    b_post.meta.title = post.meta.title;
    b_post.meta.description = post.meta.description;

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


app.get('/blog.html', function(req, res){
  res.redirect('/blog');
});

app.get('/google9757f728e337b3c0.html', function(req, res){
  res.render('seo/gwm.jade');
});

app.get('/sitemap.xml', function(req, res){
  res.sendfile('sitemap.xml',  {root: './public'});
});

app.get('/robots.txt', function(req, res){
  res.sendfile('robots.txt',  {root: './public'});
});

// app.get('/error', function (req, res) {
//   res.render('error');
// });

// app.get('*', function(req, res){
//   res.render('error');
// });


app.listen(80);
console.log('http://127.0.0.1:3000')
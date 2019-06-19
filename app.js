const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const keys = require('./config/keys');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('passport');

// Load Models
require('./models/User');
require('./models/Story');


// Passport Config
require('./config/passport')(passport);

// Load Routes
const auth = require('./routes/auth');
const index = require('./routes/index');
const stories = require('./routes/stories');




const app = express();

// Connect to mongoose
mongoose.connect(keys.mongoURI, {
  useNewUrlParser: true
})
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

// Handlebars Helpers
const { truncate, stripTags, formatDate, select, stripHtml, editIcon } = require('./helpers/hbs');

// Handlebars Middleware
app.engine('handlebars', exphbs({
  helpers: {
    truncate,
    stripTags,
    formatDate,
    select,
    stripHtml,
    editIcon
  },
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Body parser middleware
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({
  limit: '50mb',
  extended: true,
  parameterLimit: 50000
}));
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

//Method Override Middleware
app.use(methodOverride('_method'));

// Cookie Parser Middleware
app.use(cookieParser());

// Express-session middleware
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

// Passport middleware 
app.use(passport.initialize());
app.use(passport.session());

// Set Global variables
app.use((req, res, next) => {
  // res.locals.success_msg = req.flash('success_msg');
  // res.locals.error_msg = req.flash('error_msg');
  // res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));


// Use Routes
app.use('/auth', auth);
app.use('/', index);
app.use('/stories', stories);



const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});



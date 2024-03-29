/***********************
  Load Components!

  Express      - A Node.js Framework
  Body-Parser  - A tool to help use parse the data in a post request
  Pg-Promise   - A database tool to help use connect to our PostgreSQL database
***********************/

var express = require('express'); //Ensure our express framework has been added
var app = express();
var bodyParser = require('body-parser'); //Ensure our body-parser tool has been added
app.use(bodyParser.json());              // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

//Create Database Connection
var pgp = require('pg-promise')();

//create seesion connector
var session = require('express-session')

/**********************
  Database Connection information
  host: This defines the ip address of the server hosting our database.
		We'll be using `db` as this is the name of the postgres container in our
		docker-compose.yml file. Docker will translate this into the actual ip of the
		container for us (i.e. can't be access via the Internet).
  port: This defines what port we can expect to communicate to our database.  We'll use 5432 to talk with PostgreSQL
  database: This is the name of our specific database.  
  user: This should be left as postgres, the default user account created when PostgreSQL was installed
  password: This the password for accessing the database. We set this in the
		docker-compose.yml for now, usually that'd be in a seperate file so you're not pushing your credentials to GitHub :).
**********************/

const dbConfig = {
	host: 'db',
	port: 5432,
	database: 'snacktrack_db',
	user: 'postgres',
	password: 'pwd'
};

var db = pgp(dbConfig);

// set the view engine to ejs
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/'));//This line is necessary for us to use relative paths and access our resources directory

app.get('/', function(req, res) {
	res.render('pages/login',{
		local_css:"signin.css",
		my_title:"Login Page"
	});
});

// registration page
app.get('/register', function(req, res) {
	res.render('pages/register',{
		my_title:"Registration Page"
	});
});

app.get('/register', function(req, res) {
	var query = 'select * from Customer;';
	db.any(query)
		  .then(function (rows) {
			  res.render('pages/register',{
		  my_title: "Registeration Page",
		  data: rows
		})
  
		  })
		  .catch(function (err) {
			  console.log('error', err);
			  res.render('pages/home', {
				  my_title: 'Home Page',
				  data: ''
			  })
		  })
  });

app.get('/home', function(req, res) {
  res.render('pages/home', {
    my_title: 'Home Page'
  });
});

app.get('/people', function(req, res) {
	res.render('pages/people', {
	  my_title: 'People Page'
	});
  });

app.get('/payments', function(req, res) {
  res.render('pages/payments', {
    my_title: 'Payments Page'
  });
});


app.get('/makepayments', function(req, res) {
	res.render('pages/makepayments', {
	  my_title: 'Make Payment Page'
	});
});

app.listen(3000);
console.log('3000 is the magic port');

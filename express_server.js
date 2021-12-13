////////A very special thanks to all the mentors and Ratul Hefzul Bari (22nd Nov cohort student) for helping out with the project.


const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
app.set("view engine", "ejs");
//const cookieParser = require("cookie-parser");
const bcrypt = require('bcryptjs');
const cookieSession = require("cookie-session");

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));

app.use(cookieSession({
  name: "session",
  keys: ["trying this for the first time, i hope it works", "key"]
}));

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
  
};

const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
}






//////////HOMEPAGE/////////

app.get("/urls", (req, res) => {
  const username = req.session.userID;
  if (!username) {
    res.redirect("/login");
  }
  res.redirect("/urls");
});


//////////////LOGIN////////////////////////////////

app.post("/login", (req,res) => {
  const email = req.body.email;
  const password = req.body.password;
 

  if(!email || !password) {
    return res.status(400).send("Email and Password cannot be blank");
  }
  const user = findUser(email);

  if(!user) {
    return res.status(400).send("No account has been found with this email");
  }
  if(password !== user.password) {
    return res.status(403).send("Invalid email or password");
  }

  const username = user.id;
  req.session.userID = username;
  req.session.email = email;
  res.redirect("/urls");  
  
});

app.get('/login', (req, res) => {
  const templateVars = {
    email: req.session.email,
    username: req.session.userID
  };
  res.render("login", templateVars);
});
 // console.log("register link");//to check if register function is being called on console.
 //calling the login page 




/////////////////////////REGISTER/////////////////////////////////////
app.post("/register", (req,res) => {
  const userID = generateRandomString();
  const email = req.body.email;
  const password = req.body.password;
  //const newUser = users[id];

  if(!email || !password) {
    return res.status(400).send("Email and Password cannot be blank");
  }
  const user = findUser(email);
  if(user) {
    return res.status(400).send("An account already exist with this email address");
  }


  users[userID] = {
    id: userID,
    email: email,
    password: bcrypt.hashSync(password, 10)
  }; //append new user to the existing user database.

  req.session.userID = "username";
  req.session.email = "email";
  console.log('new user: ', users[userID]);
  res.redirect("/urls");

 

  console.log(userID);//consle logs random generated ID. 
  console.log(users); //console logs the whole updated database

  
  res.redirect("/urls");
});

app.get("/register", (req, res) => {
    const templateVars = {
      email: req.session.email,
      username: req.session.userID
    };
    res.render("register", templateVars);
  });


////////////////NEW URL//////////////////////////////////////////////////////

app.post("/urls/new", (req, res) => {
  const shortURL = generateRandomString();
  const longURL = req.body.longURL;   
  console.log("testing POST URLS");
  console.log(req.body);  // Log the POST request body to the console
  //res.cookie("username", users.id)
  urlDatabase[shortURL] = longURL; //trying to append new URL to database. don't use "." notation, dot means string.
  console.log(urlDatabase);
  //res.send("Ok");         // Respond with 'Ok' (we will replace this)
  res.redirect(`/urls/${shortURL}`);//redirects to the new short URL page.
});


/////////////////URL - NEW PAGE///////////////////////
app.get("/urls/new", (req,res) => {
  const templateVars = { 
    username: req.session.userID,
    email: req.session.email,
  };
  const username = req.session.userID;
  if (!username) {
    res.redirect("/login");
  }
  res.render("urls_new", templateVars);
});


///////////////////URL//////////////////////////////

app.get("/urls", (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    email: req.session.email,
    username: req.session.userID,
    users: users,
    timeStamp: timeStamp
  };
  const username = req.session.userID;
  if (!username) {
    res.render("urls_loggedOut", templateVars);
  }
  res.render("urls_index", templateVars);
});

// app.post("/urls", (req,res) => {
//   //const username = req.body.username;
//   res.cookie("username", users.id)
//   //res.cookie("username", username);
//   res.redirect("/urls");
// })//posting username on main page with login button

///////////////////LOGOUT/////////////////////////////


app.post('/logout', (req, res) => {
  delete req.session.userID;
  delete req.session.email;
  res.redirect('/urls');
});

// app.get("/", (req, res) => {
//   res.send("Hello!");
// });


///////////////////URL DELETE///////////////////////////

app.get("/urls/:shortURL/delete", (req, res) => {
  const templateVars = {
    urlDatabase: urlDatabase,
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL].longURL,
    email: req.session.email,
    username: req.session.userID,
    timeStamp: timeStamp
  };
  const username = req.session.userID;
  if (!username) {
    res.redirect("/login");
  }
  res.render("delete_url", templateVars);
});
app.post("/urls/:shortURL/delete", (req, res) => {
  const confirmDelete = () => {
    const urlToDel = req.params.shortURL;
    delete urlDatabase[urlToDel];
    return res.redirect("/urls");
  };
  confirmDelete();
});

/////////////////////URL EDIT/////////////////////////////

  app.post("/urls/:shortURL/Edit", (req,res) => {
    const shortURL = req.params.shortURL;
    res.redirect(`/urls/${shortURL}`);
    });//edit works


 app.post("/urls/:id", (req,res) => {
    const newlongURL = req.body.longURL;  
    const shortURL = req.params.id;
    console.log(newlongURL); 
    urlDatabase[shortURL] = newlongURL; 
    
    res.redirect('/urls');
    
    //trying to append new URL to database. don't use "." notation, dot means string.
    //console.log(urlDatabase);
      //res.send("Ok");         // Respond with 'Ok' (we will replace this)
      //res.redirect(`/urls/${shortURL}`);
     
      });//submit button to edit the LONG URL

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/set", (req, res) => {
  const a = 1;
  res.send(`a = ${a}`);
 });
 
 app.get("/fetch", (req, res) => {
  res.send(`a = ${a}`);
 });

 

 //In express_server.js, add a new route handler for "/urls" and use res.render() to pass the URL data to our template.



//In the below function, the templateVars object contains the string 'Hello World' under the key greeting. We then pass the templateVars object to the template called hello_world.
app.get("/hello", (req, res) => {
  const templateVars = { greeting: 'Hello World!' };
  res.render("hello_world", templateVars);
});

//Add a GET Route to Show the Form - URL shotening part 1
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});



//Use the shortURL from the route parameter to lookup it's associated longURL from the urlDatabase
app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  res.render("urls_show", templateVars);
});

// app.get("/u/:shortURL", (req, res) => {
//   // const longURL = ...
//   res.redirect(longURL);
// });

// app.get("/u/:shortURL", (req, res) => {
//   // const longURL = ...
//   res.redirect(longURL);
// });

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

////////////////Random String Generator//////////////////////////
//stack overflow
function generateRandomString() {
  return Math.random().toString(36).substr(2, 6);
  
};

///////////////Find user function///////////////////////////////////

const findUser = (email) => {
  for (const userId in users) {
    const user = users[userId];
    if (user.email === email) {
      return user;
    }
  }
  return null;
}

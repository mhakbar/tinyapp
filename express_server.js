const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
app.set("view engine", "ejs");
const cookieParser = require("cookie-parser");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
  
};
//after installing npm install body-parser we add the bodyParser code. The body-parser library will convert the request body from a Buffer into string that we can read. It will then add the data to the req(request) object under the key body.
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

app.use(cookieParser());

app.post("/urls/new", (req, res) => {
  const shortURL = generateRandomString();
  const longURL = req.body.longURL;   
  console.log("testing POST URLS");
  console.log(req.body);  // Log the POST request body to the console
  
  urlDatabase[shortURL] = longURL; //trying to append new URL to database. don't use "." notation, dot means string.
  console.log(urlDatabase);
  //res.send("Ok");         // Respond with 'Ok' (we will replace this)
  res.redirect(`/urls/${shortURL}`);//redirects to the new short URL page.
});

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase, username: req.cookies.username};
  res.render("urls_index", templateVars);
});

app.post("/urls", (req,res) => {
  const username = req.body.username;
  res.cookie("username", username);
  res.redirect("/urls");
})//posting username on main page with login button


app.post('/logout', (req, res) => {
  res.clearCookie('username');
  res.redirect('/urls');
});

app.get("/urls/new", (req,res) => {
  const templateVars = { urls: urlDatabase, username: req.cookies.username};
  res.render("urls_new", templateVars)
});

app.get("/register", (req, res) => {
  const templateVars = {
    username: req.cookies.username
  }
  res.render("register", templateVars);
 // console.log("register link");//to check if register function is being called on console.
}); //calling the register page (52-58)

app.post("/urls/register", (req, res) => {
  res.redirect("/url");
  
});//after you click the submic to try and create a new e-mail ID.

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.post("/urls/:shortURL/delete", (req,res) => {
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  res.redirect("/urls");
  }); //delete works

  app.post("/urls/:shortURL/Edit", (req,res) => {
    const shortURL = req.params.shortURL;
    res.redirect(`/urls/${shortURL}`);
    });//edit works


  app.post("/urls/login", (req,res) => {
      const username = req.body.userName;
      res.cookie("username", username); //creating cookie for username
      console.log(`logged in as ${username}`);
      res.redirect(`/urls`);

      // app.get('/login', (req, res) => {
      //   const templateVars = {
      //     email: req.cookies.email,
      //     userID: req.cookies.userID
      //   }
        res.render("login",  templateVars);
      });
      //for login and username 

      // app.get("/urls/login", (req, res) => {
      //   const templateVars{
      //     userID: req.cookies.
      //   }
      //   res.send(`<html><body>${username} <b>World</b></body></html>\n`);
      // });

      app.get('/login', (req, res) => {
        const templateVars = {
          userID: req.cookies.userName
        }
        res.render("login",  templateVars);
      })
      
      // app.get('/login', (req, res) => {
      //   const username = req.cookies.userName;
      //   res.redirect("/urls");
      // });
      

      
        

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
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL]/* What goes here? */ };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  // const longURL = ...
  res.redirect(longURL);
});

app.get("/u/:shortURL", (req, res) => {
  // const longURL = ...
  res.redirect(longURL);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});


//stack overflow
function generateRandomString() {
  return Math.random().toString(36).substr(2, 6);
  
};

  

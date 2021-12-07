const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
  
};

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

app.post("/urls", (req, res) => {
  console.log(req.body);  // Log the POST request body to the console
  res.send("Ok");         // Respond with 'Ok' (we will replace this)
});

app.get("/", (req, res) => {
  res.send("Hello!");
});

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
 app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});


//In the below function, the templateVars object contains the string 'Hello World' under the key greeting. We then pass the templateVars object to the template called hello_world.
app.get("/hello", (req, res) => {
  const templateVars = { greeting: 'Hello World!' };
  res.render("hello_world", templateVars);
});
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

//Use the shortURL from the route parameter to lookup it's associated longURL from the urlDatabase
app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL]/* What goes here? */ };
  res.render("urls_show", templateVars);
});



app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

// function generateRandomString(longURL) {
//   //let characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
//   let result = ""
//   let charactersLength = characters.length;
  
//   for ( let i = 0; i <= 5 ; i++ ) {
//       result += characters.charAt(Math.floor(Math.random() * charactersLength));
//       return result;
//   }
// };
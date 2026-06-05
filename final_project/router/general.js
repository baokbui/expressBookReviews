const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
        users.push({"username": username, "password": password});
        return res.status(200).json({ message: "User successfully registered." });
    } else {
        return res.status(400).json({ message: "User already exists!" });
    }
  }
  return res.status(400).json({ message: "Unable to register user" });
});

// Get the book list available in the shop
/*public_users.get('/',function (req, res) {
  //Write your code here
  return res.send(JSON.stringify(books,null,4));
});*/

// Get the book list available in the shop using promises


// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  if (isbn >= 1 && isbn <= 10) {
    return res.send(books[isbn]);
  } else {
    return res.status(400).json({ message: "Invalid ISBN number " });
  }
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  for (const book of Object.values(books)) {
    let processed = book.author.toLowerCase().replace(/\s+/g, '');
    if (processed === author) {
        return res.send(book);
    }
  }
  return res.status(400).json({ message: "Unable to find author "});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  for (const book of Object.values(books)) {
    let processed = book.title.toLowerCase().replace(/\s+/g, '');
    if (processed === title) {
        return res.send(book);
    }
  }
  return res.status(400).json({message: "Unable to find title "});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  if (isbn >= 1 && isbn <= 10) {
    return res.send(books[isbn].reviews);
  } else {
    return res.status(400).json({ message: "Invalid ISBN number "});
  }
});

module.exports.general = public_users;

const express = require('express');
const axios = require('axios');
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
public_users.get('/',function (req, res) {
  //Write your code here
  return res.json(books);
});

// Get the book list available in the shop using axios with async/await
async function getAllBooks() {
    try {
        const response = await axios.get('http://localhost:5000/');
        console.log('Books:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching books:', error.message);
        throw error;
    }
}

getAllBooks()

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
  
// Get book details based on ISBN using axios with async/await
async function getBooksISBN(isbn) {
    try {
        const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
        console.log('Book details:', response.data);
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 400) {
            console.error('Invalid ISBN number');
        }
        throw error;
    }
}

getBooksISBN(1) // get the details of book with ISBN = 1

// Get book details based on author using promise callbacks
function getBooksAuthor(author) {
    return new Promise((resolve, reject) => {
        const processedReqAuthor = author.toLowerCase().replace(/\s+/g, ''); // req author
        const matchedBooks = Object.values(books).filter((book) => {
            const processedBookAuthor = book.author.toLowerCase().replace(/\s+/g, ''); // book author
            return processedBookAuthor === processedReqAuthor;
        });

        if (matchedBooks.length > 0) {
            resolve(matchedBooks);
        } else {
            reject(new Error(`Unable to find books by ${author}`));
        }
    });
}


// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  
  getBooksAuthor(author)
    .then((books) => {
        res.json(books);
    })
    .catch((error) => {
        res.status(404).json({ message: error.message });
    });
});

// Get book details based on title using promise callbacks
function getBooksTitle(title) {
    return new Promise((resolve, reject) => {
        const processedReqTitle = title.toLowerCase().replace(/\s+/g, ''); // req title
        const matchedTitles = Object.values(books).filter((book) => {
            const processedBookTitle = book.title.toLowerCase().replace(/\s+/g, ''); // book title
            return processedBookTitle === processedReqTitle;
        });

        if (matchedTitles.length > 0) {
            resolve(matchedTitles);
        } else {
            reject(new Error(`Unable to find books by the title of ${title}`));
        }
    });
}

// Get book details based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
 
  getBooksTitle(title)
    .then((books) => {
        res.json(books);
    })
    .catch((error) => {
        res.status(400).json({ message: error.message });
    })
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

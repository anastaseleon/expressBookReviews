const express = require('express');
let booksArray = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  // Check if username and password are provided
  if (req.body.username && req.body.password) {
        // Create or update user's details based on provided username
    if(users[req.body.username]) {
      res.status(400).send({message: "User already exists"});
    } else{
    users[req.body.username] = {
      "password": req.body.password
    };

    // Send a response indicating successful registration
    res.status(200).send({ message: 'User registered successfully' });
  }
 } else {
    // Send an error response if username or password is not provided
    res.status(400).send({ message: 'Username and password are required' });
 }
  });

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  res.status(200).send(JSON.stringify(booksArray));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  
  // Filter the books array to find the book with the matching ISBN
  const filtered_books = booksArray.filter((book) => book.isbn === isbn);
  
  if (filtered_books.length > 0) {
    // Send the filtered_books array as the response to the client
    res.status(200).send(filtered_books);
  } else {
    res.status(404).send({ message: 'Book not found' });
  }
});
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
const author= req.params.author
const filtered_books_author = booksArray.filter((book) => book.author === author)
if (filtered_books_author.length > 0) {
  // Send the filtered_books array as the response to the client
  res.status(200).send(filtered_books_author);
} else {
  res.status(404).send({ message: 'Book not found' });
}
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
 
    const title= req.params.title
    const filtered_books_title = booksArray.filter((book) => book.title === title)
    if (filtered_books_title.length > 0) {
      // Send the filtered_books array as the response to the client
      res.status(200).send(filtered_books_title);
    } else {
      res.status(404).send({ message: 'Book not found' });
    }
    });

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  
  // Filter the books array to find the book with the matching ISBN
  const filtered_books = booksArray.filter((book) => book.isbn === isbn);
  
  if (filtered_books.length > 0) {
    const book = filtered_books[0];
    // Check if the reviews object is empty
    if (book.reviews && Object.keys(book.reviews).length > 0) {
      // Send the reviews object as the response to the client
      res.status(200).send(book.reviews);
    } else {
      res.status(200).send({ message: 'No reviews available for this book' });
    }
  } else {
    res.status(404).send({ message: 'Book not found' });
  }
});
module.exports.general = public_users;

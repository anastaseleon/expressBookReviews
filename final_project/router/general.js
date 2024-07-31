const express = require('express');
let booksArray = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).send({ message: 'Username and password are required' });
  }

  // Check if user already exists
  if (users.some(user => user.username === username)) {
    return res.status(400).send({ message: "User already exists" });
  }

  // Register new user
  users.push({ username, password });

  // Send a response indicating successful registration
  return res.status(201).send({ message: 'User registered successfully' });
});


// Get the book list available in the shop using async/await
public_users.get('/', async (req, res) => {
  try {
    res.status(200).json(booksArray);
  } catch (err) {
    res.status(500).send({ message: 'Internal Server Error' });
  }
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn', (req, res) => {
  const isbn = req.params.isbn;

  return new Promise((resolve, reject) => {
    const filtered_books = booksArray.filter((book) => book.isbn === isbn);
    if (filtered_books.length > 0) {
      resolve(filtered_books);
    } else {
      reject({ status: 404, message: 'Book not found' });
    }
  })
  .then((filtered_books) => {
    res.status(200).send(filtered_books);
  })
  .catch((err) => {
    res.status(err.status).send({ message: err.message });
  });
});


// Get book details based on author
public_users.get('/author/:author',function (req, res) {
const author= req.params.author
return new Promise((resolve, reject) => {
  const filtered_books = booksArray.filter((book) => book.author === author);
  if (filtered_books.length > 0) {
    resolve(filtered_books);
  } else {
    reject({ status: 404, message: 'Book not found' });
  }
})
.then((filtered_books) => {
  res.status(200).send(filtered_books);
})
.catch((err) => {
  res.status(err.status).send({ message: err.message });
});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
 
    const title= req.params.title
        return new Promise((resolve, reject) => {
      const filtered_books = booksArray.filter((book) => book.title === title);
      if (filtered_books.length > 0) {
        resolve(filtered_books);
      } else {
        reject({ status: 404, message: 'Book not found' });
      }
    })
    .then((filtered_books) => {
      res.status(200).send(filtered_books);
    })
    .catch((err) => {
      res.status(err.status).send({ message: err.message });
    });
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

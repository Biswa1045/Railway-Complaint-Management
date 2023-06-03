const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const express = require('express');
const bodyParser = require('body-parser');


const loregBox = document.querySelector('.loreg-box');
const loginLink = document.querySelector('.login-link');
const registerLink = document.querySelector('.register-link');


registerLink.addEventListener('click', ()=>{
    loregBox.classList.add('active');
});

loginLink.addEventListener('click', ()=>{
    loregBox.classList.remove('active');
});



const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123',
    database: 'complaint_management',
    port: '3306' // optional, default is 3306
  });
// connfigure express
  const app = express();
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

 
  // connect to database
  connection.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL database!');
  });

  //register user
    function registerUser() {
    const prefix = 'US';
    const randomNumber = Math.floor(Math.random() * 100000);
    const formattedNumber = randomNumber.toString().padStart(5, '0');
  
    var id = prefix + formattedNumber;
    var username = document.getElementById('user_name');
    var email = document.getElementById('user_email');
    var password = document.getElementById('user_password');
    var phone = document.getElementById('user_phone');
    const query = 'INSERT INTO user_table (user_id, user_name, user_email, user_password, user_phone) VALUES (?, ?, ?, ?, ?)';
    //const values = [id.toString(), username.toString(), email.toString(), password.toString(), phone.toString()];
    const values = ["id.toString()", "username.toString()", "email.toString()", "password.toString()", "phone.toString()"];
    connection.query(query, values, (err, result) => {
      if (err){
        alert(' '+err);
      }else{
        alert('User registered successfully!');
      }
     
      // Additional logic or response can be added here
    });
    // disconnect from database
  connection.end((err) => {
    if (err) {
      console.error('Error closing connection:', err);
      return;
    }
    console.log('Databse Connection closed.');
  });
  }
    function signin() {
      app.post('/signin', (req, res) => {
        //  const { email, password } = req.body;
          var email = req.body.email_signin;
          var password = req.password.password_signin;
        
          // Retrieve user from the database
          connection.query(
            'SELECT * FROM user_table WHERE user_email = ?',
            [email],
            (error, results) => {
              if (error) {
                console.error(error);
                return res.status(500).json({ error: 'Internal server error' });
              }
        
              if (results.length === 0) {
                return res.status(401).json({ error: 'Invalid email or password' });
              }
        
              const user = results[0];
        
              // Compare passwords
              bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) {
                  console.error(err);
                  return res.status(500).json({ error: 'Internal server error' });
                }
        
                if (!isMatch) {
                  return res.status(401).json({ error: 'Invalid email or password' });
                }
        
                // User is authenticated
                return res.json({ message: 'User signed in successfully' });
              });
            }
          );
        });
    }
  

 
  


  
  
  
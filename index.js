// nodejs imports
const path = require("path");

// set environment
const { ENV } = require("./lib/env");
if (ENV().NODE_ENV !== "production")
  require("dotenv").config({ path: path.join(__dirname, ".env.local") });

// external package imports
const bcrypt = require("bcrypt");
const chalk = require("chalk");
const express = require("express");

// library imports
const AsyncSQL = require("./lib/AsyncSQL");
const multer = require("multer");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// serve static files from the public folder
app.use(express.static(path.join(process.cwd(), "public")));
const registerUserFields = [
  // "id", // id seems to be preset, uncomment to include in validation
  "username",
  "password",
  "phone",
];
app.post("/registeruser", multer().none(), async function (req, res) {
  try {
    const values = ["US0003"];

    // validate request data against required fields
    for (const k of registerUserFields) {
      if (typeof req.body[k] != "string") {
        console.log(req.body);
        return res.status(400).json({
          error: "invalid_data",
          description: `"${k}" is supposed to be 'string'. found '${typeof req
            .body[k]}' instead`,
        });
      }
      values.push(req.body[k]);
    }

    const sql = await new AsyncSQL();

    const querystring =
      "INSERT INTO user_table (user_id, user_name, user_password, user_phone) VALUES (?, ?, ?, ?)";

    await sql.query(querystring, values);
    await sql.end();
    // status code 201: created successfully
    return res.sendStatus(201);
  } catch (error) {
    console.log(chalk.redBright(error));
    // defaults to 500, you can process 'error' for more detailed error response
    return res.status(500).json({
      error: "server_error",
      description: "unknown error occured when processing the request",
    });
  }
});


app.post('/signinuser', multer().none(), async function(request, response) {
	// Capture the input fields
	let useremail = request.body["email_signin"];
	let password = request.body["password_signin"];
 // const values=["biswajitsahu1045@gmail.com","4444444444"];
	// Ensure the input fields exists and are not empty
  try {
    const sql = await new AsyncSQL();
		// Execute SQL query that'll select the account from the database based on the specified username and password
	//	const useremail = 'biswajitsahu1045@gmail.com';
   // const password = '4444444444';
    const querys = `SELECT * FROM user_table WHERE user_email = ? AND user_password = ?`;
  
    // Execute the query
    await sql.query(querys, [useremail, password], (error, results) => {
      if (error) {
        console.error('Error executing the query:', error);
        return;
      }

      // Process the results
      if (results.length === 0) {
        console.log('No user found with the provided username and password.');
      } else {
        const user = results[0];
        console.log('User data:', user);
        response.redirect("/userdashboard"); 
        
      }
      return response.sendStatus(201);
      
    });

    await sql.end();
   
	} catch(error) {
	  console.log(chalk.redBright(error));

    // defaults to 500, you can process 'error' for more detailed error response
    return response.status(500).json({
      error: "server_error",
      description: "unknown error occured when processing the request",
    });
	}
});

app.post('/signinadmin', multer().none(), async function(request, response) {
	// Capture the input fields
	let userphone = request.body["phone_admin_signin"];
	let password = request.body["password_admin_signin"];
 // const values=["biswajitsahu1045@gmail.com","4444444444"];
	// Ensure the input fields exists and are not empty
  try {
    const sql = await new AsyncSQL();
		// Execute SQL query that'll select the account from the database based on the specified username and password
	//	const useremail = 'biswajitsahu1045@gmail.com';
   // const password = '4444444444';
    const querys = `SELECT * FROM admin_table WHERE admin_id = ? AND admin_password = ?`;
  
    // Execute the query
    await sql.query(querys, [userphone, password], (error, results) => {
      if (error) {
        console.error('Error executing the query:', error);
        return;
      }

      // Process the results
      if (results.length === 0) {
        console.log('No user found with the provided username and password.');
      } else {
        const user = results[0];
        console.log('User data:', user);
        response.redirect("/admindashboard"); 
        
      }
      return response.sendStatus(201);
      
    });

    await sql.end();
   
	} catch(error) {
	  console.log(chalk.redBright(error));

    // defaults to 500, you can process 'error' for more detailed error response
    return response.status(500).json({
      error: "server_error",
      description: "unknown error occured when processing the request",
    });
	}
});
app.post('/signindealer', multer().none(), async function(request, response) {
	// Capture the input fields
	let userphone = request.body["phone_dealer_signin"];
	let password = request.body["password_dealer_signin"];
 // const values=["biswajitsahu1045@gmail.com","4444444444"];
	// Ensure the input fields exists and are not empty
  try {
    const sql = await new AsyncSQL();
		// Execute SQL query that'll select the account from the database based on the specified username and password
	//	const useremail = 'biswajitsahu1045@gmail.com';
   // const password = '4444444444';
    const querys = `SELECT * FROM admin_table WHERE dealer_id = ? AND dealer_password = ?`;
  
    // Execute the query
    await sql.query(querys, [userphone, password], (error, results) => {
      if (error) {
        console.error('Error executing the query:', error);
        return;
      }

      // Process the results
      if (results.length === 0) {
        console.log('No user found with the provided username and password.');
      } else {
        const user = results[0];
        console.log('User data:', user);
        response.redirect("/dealerdashboard"); 
        
      }
      return response.sendStatus(201);
      
    });

    await sql.end();
   
	} catch(error) {
	  console.log(chalk.redBright(error));

    // defaults to 500, you can process 'error' for more detailed error response
    return response.status(500).json({
      error: "server_error",
      description: "unknown error occured when processing the request",
    });
	}
});






const PORT = ENV().PORT || 3000;

app.listen(PORT, () => {
  console.info(chalk.blueBright.bold(`Server listening on ${PORT}!`));
  console.info(
    chalk`{white You can visit at: {blueBright {bold http://localhost:${PORT}}}}`
  );
});

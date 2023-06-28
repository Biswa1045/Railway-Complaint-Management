// nodejs imports
const path = require("path");
//const localStorage = require('localStorage');
// set environment
const { ENV } = require("./lib/env");
if (ENV().NODE_ENV !== "production")
  require("dotenv").config({ path: path.join(__dirname, ".env.local") });

// external package imports
const chalk = require("chalk");
const express = require("express");
const session = require("express-session");

const bcrypt = require('bcrypt');

// library imports
const AsyncSQL = require("./lib/AsyncSQL");
const multer = require("multer");
const { LocalStorage } = require("node-localstorage");

const app = express();
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
  secret: 'mysecret',
  resave: false,
  saveUninitialized: false
}));
// serve static files from the public folder
app.use(express.static(path.join(process.cwd(), "public")));

const registerUserFields = [
  // "id", // id seems to be preset, uncomment to include in validation
  "username",
  "password",
  "phone",
];

async function userCount() {
  const sql2 = await new AsyncSQL();
  const querycount = "SELECT COUNT(*) AS total from user_table";

  var [count] = await sql2.query(querycount);
  await sql2.end();

  return count[0].total + 1;
}

app.post("/registeruser", multer().none(), async function (req, res) {
  try {
    var usercount = await userCount();

    const id = "US" + usercount;
    const values = [id]; // userid will generated

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
      "INSERT INTO user_table (user_id, user_name, user_password, user_email) VALUES (?, ?, ?, ?)";

    await sql.query(querystring, values);
    await sql.end();
    // status code 201: created successfully
    return res.sendStatus(201);
  } catch (error) {
    console.log(chalk.redBright(error));
    // defaults to 500, you can process 'error' for more detailed error response
    return res.status(500).json({
     });
  }
});//ok

app.post('/signinuser', multer().none(), async function(request, response) {
	// Capture the input fields
	let useremail = request.body["phone_signin"];
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
    const [results] = await sql.query(querys, [useremail, password]);
    await sql.end();

    // Process the results
    if (results.length === 0) {
      return response.status(400).json({
        error: "data_invalid",
        description: "username or password invalid",
      });
    } else {
      // use express-session or something similar to persist the session
    //  request.session.user = results[0];

      return response.redirect("/user/userdashboard.html");
    }
  } catch (error) {
    console.log(chalk.redBright(error));

    // defaults to 500, you can process 'error' for more detailed error response
    return response.status(500).json({
          });
  }
});//ok

app.post("/signinadmin", multer().none(), async function (request, response) {
  // Capture the input fields
  let ejs = require("ejs");
  let people = ["geddy", "neil", "alex"];
  let html = ejs.render('<%= people.join(", "); %>', { people: people });

  let username = request.body["phone_admin_signin"];
  let password = request.body["password_admin_signin"];
  // const values=["biswajitsahu1045@gmail.com","4444444444"];
  // Ensure the input fields exists and are not empty
  try {
    const sql = await new AsyncSQL();
    // Execute SQL query that'll select the account from the database based on the specified username and password
    //	const useremail = 'biswajitsahu1045@gmail.com';
    // const password = '4444444444';
    const querys = `SELECT * FROM admin_table WHERE admin_name = ? AND admin_password = ?`;

    // Execute the query
    const [results] = await sql.query(querys, [username, password]);
    await sql.end();

    // Process the results
    if (results.length === 0) {
      return response.status(400).json({
        error: "data_invalid",
        description: "username or password invalid",
      });
    } else {
    
      const user = results[0];
      console.log("User data:", user);
   
      return response.redirect("/admin/admindashboard.html");
    }
  } catch (error) {
    console.log(chalk.redBright(error));

    // defaults to 500, you can process 'error' for more detailed error response
    return response.status(500).json({
      });
  }
});//ok

app.post("/signindealer", multer().none(), async function (request, response) {
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
    const querys = `SELECT * FROM dealer_table WHERE dealer_name = ? AND dealer_password = ?`;

    // Execute the query
    const [results] = await sql.query(querys, [userphone, password]);
    await sql.end();

    // Process the results
    if (results.length === 0) {
      return response.status(400).json({
        error: "data_invalid",
        description: "username or password invalid",
      });
    } else {
      // use express-session or something similar to persist the session

      const user = results[0];
      console.log("User data:", user);
      return response.redirect("/dealer/dealerdashboard.html");
    }
  } catch (error) {
    console.log(chalk.redBright(error));

    // defaults to 500, you can process 'error' for more detailed error response
    return response.status(500).json({
      
    });
  }
});//ok

async function complaintCount() {
  const sql3 = await new AsyncSQL();
  const querycount = "SELECT COUNT(*) AS total from complaint_table";

  var [count] = await sql3.query(querycount);
  await sql3.end();

  return count[0].total + 1;
}

app.post("/registerComplaint", multer().none(), async function (request, res) {
  try {
    // const complaint_userid = USERID;

    var comcount = await complaintCount();

    const complaint_id = "COM00" + comcount;
    let name_complaint = request.body["name_complaint"];
    let phone_complaint = request.body["phone_complaint"];
    var complaint_userid = request.body["userid"];
    let division = request.body["division"];
    let section = request.body["section"];
    let complaint_description = request.body["complaint_description"];

    var complaint_status = "pending";
    var complaint_position = "admin";
    var complaint_admin_remark = "null";
    var complaint_dealer_remark = "null";
    var complaint_remark_to_dealer = "null";
    var values_complaint = [
      complaint_id,
      division,
      section,
      complaint_description,
      complaint_status,
      complaint_position,
      complaint_userid,
      complaint_admin_remark,
      complaint_dealer_remark,
      complaint_remark_to_dealer,
      name_complaint,
      phone_complaint,
    ];
    const sql = await new AsyncSQL();

    const querystring =
      "INSERT INTO complaint_table (complaint_id, complaint_division, complaint_section, complaint_desc, complaint_status, complaint_position, complaint_userid, complaint_admin_remark, complaint_dealer_remark, complaint_remark_to_dealer, complaint_name, complaint_phone) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    if (
      name_complaint != "" &&
      phone_complaint != "" &&
      division != "" &&
      section != "" &&
      complaint_description != ""
    ) {
      await sql.query(querystring, values_complaint);
    } else {
      // alert fill all field
    }
    await sql.end();
    // status code 201: created successfully
    return res.status(200).json(complaint_id);
  } catch (error) {
    console.log(chalk.redBright(error));
    // defaults to 500, you can process 'error' for more detailed error response
    returnres.status(500).json({})
  }
});//ok

app.get("/checkstatus/:complaintID", async function (req, res) {
  try {
   
  const complaintID = req.params.complaintID;


    const sql5 = await new AsyncSQL();
    const querycom = 'SELECT * FROM complaint_table WHERE complaint_id = ?';
    var [list]=await sql5.query(querycom,[complaintID]);
    await sql5.end();
    console.log(complaintID);
    return res.status(201).json(list);
   
  } catch (error) {
    console.log(chalk.redBright(error));
    // defaults to 500, you can process 'error' for more detailed error response
    return res.status(500).json({
       });
  }
});//ok

app.get("/userid", multer().none(), async function (req, res) {
  try {
    const sql4 = await new AsyncSQL();
    const querycom = "SELECT USER_ID FROM section_waise_userid";
    var [complaint] = await sql4.query(querycom);
    await sql4.end();
    // console.log(complaint);
    //  res.render('admindashboard', { complaints: complaint });
    return res.status(201).json(complaint);
  } catch (error) {
    console.log(chalk.redBright(error));
    // defaults to 500, you can process 'error' for more detailed error response
    return res.status(500).json({
      error: "server_error",
      description: "unknown error occured when processing the request",
    });
  }
});//ok

app.post('/redirectToStatuscheck', function(req, res) {
  
res.redirect('../statuscheck.html');
});//ok

app.post('/redirectToHome', function(req, res) {
  
  res.redirect('../userLogin.html');
});//ok

app.get("/getUserComplaintList", multer().none(), async function (req, res) {
  try {
    
   
    var complaintPosition = "admin";
    var compliantStatus = "pending";
    const sql4 = await new AsyncSQL();
    const querycom =
      "SELECT complaint_id, complaint_division, complaint_section, complaint_desc FROM complaint_table WHERE complaint_position = ? AND complaint_status = ?";
    var [complaint] = await sql4.query(querycom, [
      complaintPosition,
      compliantStatus,
    ]);
    await sql4.end();
    console.log(complaint);
    //  res.render('admindashboard', { complaints: complaint });
    return res.status(201).json(complaint);
  } catch (error) {
    console.log(chalk.redBright(error));
    // defaults to 500, you can process 'error' for more detailed error response
    return res.status(500).json({
      error: "server_error",
      description: "unknown error occured when processing the request",
    });
  }
});//ok

app.get("/getDealerResolvedComplaintList",
  multer().none(),
  async function (req, res) {
    try {
      // status code 201: created successfully
      var complaintPosition = "admin";
      var compliantStatus = "resolved";
      const sql4 = await new AsyncSQL();
      const querycom =
        "SELECT complaint_id, complaint_division, complaint_section, complaint_desc FROM complaint_table WHERE complaint_position = ? AND complaint_status = ?";
      var [complaint] = await sql4.query(querycom, [
        complaintPosition,
        compliantStatus,
      ]);
      await sql4.end();
      console.log(complaint);
      //  res.render('admindashboard', { complaints: complaint });
      return res.status(201).json(complaint);
    } catch (error) {
      console.log(chalk.redBright(error));
      // defaults to 500, you can process 'error' for more detailed error response
      return res.status(500).json({
        error: "server_error",
        description: "unknown error occured when processing the request",
      });
    }
  }
);//ok

app.put("/dealerupdate", multer().none(), async function (req, res) {
  try {
    // status code 201: created successfully
    var FORWARDTODEALER = req.body["FORWARDTODEALER"];
    var COMPLAINTREMARKTODEALER = req.body["COMPLAINTREMARKTODEALER"];
    var COMPLAINTSTATUS = "processing";
    var COMPLAINTID = req.body['COMPLAINTID'];
    console.log( COMPLAINTREMARKTODEALER);
    const sql9 = await new AsyncSQL();
    const updateQuery = 'UPDATE complaint_table SET complaint_remark_to_dealer = ?, complaint_position =? ,complaint_status = ? WHERE complaint_id = ?';

    var [complaint] = await sql9.query(updateQuery, [COMPLAINTREMARKTODEALER,FORWARDTODEALER,COMPLAINTSTATUS,COMPLAINTID]);
    await sql9.end();
    
    return res.sendStatus(201);
  } catch (error) {
    console.log(chalk.redBright(error));
    // defaults to 500, you can process 'error' for more detailed error response
    return res.status(500).json({
      error: "server_error",
      description: "unknown error occured when processing the request",
    });
  }
});//ok

app.put("/dealerforward", multer().none(), async function (req, res) {
  try {
    // status code 201: created successfully
    
    var COMPLAINTDEALERREMARK = req.body["COMPLAINTREMARKTOADMIN"];
    var COMPLAINTSTATUS = "resolved";
    var COMPLAINTID = req.body['COMPLAINTID'];
 
    const sql11 = await new AsyncSQL();
    const updateQuery = 'UPDATE complaint_table SET  complaint_position =? ,complaint_status = ?, complaint_dealer_remark = ? WHERE complaint_id = ?';

    var [complaint] = await sql11.query(updateQuery, ['admin',COMPLAINTSTATUS,COMPLAINTDEALERREMARK,COMPLAINTID]);
    await sql11.end();
    
    return res.sendStatus(201);
  } catch (error) {
    console.log(chalk.redBright(error));
    // defaults to 500, you can process 'error' for more detailed error response
    return res.status(500).json({
      error: "server_error",
      description: "unknown error occured when processing the request",
    });
  }
});//ok

app.put("/userupdate", multer().none(), async function (req, res) {
  try {
    
    var COMPLAINTREMARKTOUSER = req.body["COMPLAINTREMARKTOUSER"];
    var COMPLAINTSTATUS = "closed";
    var COMPLAINTID = req.body['COMPLAINTID'];
   
    const sql10 = await new AsyncSQL();
    const updateQuery = 'UPDATE complaint_table SET complaint_admin_remark = ?, complaint_position =? ,complaint_status = ? WHERE complaint_id = ?';

    var [complaint] = await sql10.query(updateQuery, [COMPLAINTREMARKTOUSER,"user",COMPLAINTSTATUS,COMPLAINTID]);
    await sql10.end();
    
    return res.sendStatus(201);
  } catch (error) {
    console.log(chalk.redBright(error));
    // defaults to 500, you can process 'error' for more detailed error response
    return res.status(500).json({
      error: "server_error",
      description: "unknown error occured when processing the request",
    });
  }
});//ok

app.get("/getDealerComplaintList/:dealerID", multer().none(), async function (req, res) {
  try {
    // status code 201: created successfully
    var complaintPosition = req.params.dealerID;
  
    

  
    const sql4 = await new AsyncSQL();
    const querycom =
      "SELECT complaint_id, complaint_division, complaint_section, complaint_desc, complaint_remark_to_dealer FROM complaint_table WHERE complaint_position = ? ";
    var [complaint] = await sql4.query(querycom, [
      complaintPosition
    ]);
    await sql4.end();
    console.log(complaint);
    //  res.render('admindashboard', { complaints: complaint });
    return res.status(201).json(complaint);
  } catch (error) {
    console.log(chalk.redBright(error));
    // defaults to 500, you can process 'error' for more detailed error response
    return res.status(500).json({
      error: "server_error",
      description: "unknown error occured when processing the request",
    });
  }
});//ok

// app.get("/userDashboard", async function (req, res) {
//   try {
//     if (!req.session.user) {
//       return res.redirect("/userlogin.html");
//     }

//     res.send(
//       "Create userDashboard.ejs under views folder to render the page\nFollow the adminToUser route as example\nUser name: " +
//         req.session.user.name
//     );
//   } catch (error) {
//     console.log(chalk.redBright(error));
//     // defaults to 500, you can process 'error' for more detailed error response
//     return res.status(500).json({
//       error: "server_error",
//       description: "unknown error occured when processing the request",
//     });
//   }
// });

// app.get("/admin/adminToDealer", multer().none(), async function (req, res) {
//   const { complaintId } = req.query;

//   try {
//     // status code 201: created successfully
//     // const sql = await new AsyncSQL();
//     // const querystring =
//     //   "SELECT * complaint_table SET complaint_position = 'dealer' WHERE complaint_id = ?";
//     // const [results] = await sql.query(querystring, [complaintId]);
//     // await sql.end();

//     // for simplicity, we'll just render a dummy complaint object
//     const results = [
//       {
//         complaint_id: "COM001",
//         complaint_division: "division",
//         complaint_section: "section",
//         complaint_desc: "description",
//         complaint_status: "status",
//         complaint_position: "position",
//         complaint_userid: "userid",
//         complaint_admin_remark: "admin_remark",
//         complaint_dealer_remark: "dealer_remark",
//         complaint_remark_to_dealer: "remark_to_dealer",
//       },
//     ]; // dummy data craeted by copilot

//     return res.render("admin/adminToDealer", { complaint: results[0] });
//   } catch (error) {
//     console.log(chalk.redBright(error));
//     // defaults to 500, you can process 'error' for more detailed error response
//     return res.status(500).json({
//       error: "server_error",
//       description: "unknown error occured when processing the request",
//     });
//   }
// });

// app.get("/admin/adminToUser", multer().none(), async function (req, res) {
//   const { complaintId } = req.query;

//   try {
//     // status code 201: created successfully
//     // const sql = await new AsyncSQL();
//     // const querystring =
//     //   "SELECT * complaint_table SET complaint_position = 'user' WHERE complaint_id = ?";
//     // const [results] = await sql.query(querystring, [complaintId]);
//     // await sql.end();

//     // for simplicity, we'll just render a dummy complaint object
//     const results = [
//       {
//         complaint_id: "COM002",
//         complaint_division: "division",
//         complaint_section: "section",
//         complaint_desc: "description",
//         complaint_status: "status",
//         complaint_position: "position",
//         complaint_userid: "userid",
//         complaint_admin_remark: "admin_remark",
//         complaint_dealer_remark: "dealer_remark",
//         complaint_remark_to_dealer: "remark_to_dealer",
//         complaint_name: "name",
//         complaint_phone: "phone",
//       },
//     ]; // dummy complaint created by copilot

//     if (results.length === 0) {
//       return res.status(400).json({
//         error: "data_invalid",
//         description: "invalid complaint id",
//       });
//     }

//     return res.render("adminToUser", { complaint: results[0] });
//   } catch (error) {
//     console.log(chalk.redBright(error));
//     // defaults to 500, you can process 'error' for more detailed error response
//     return res.status(500).json({
//       error: "server_error",
//       description: "unknown error occured when processing the request",
//     });
//   }
// });

// app.get("/getComplaint", multer().none(), async function (req, res) {
//   try {
//     // status code 201: created successfully
//     var complaintId = "COM001";
//     const sql4 = await new AsyncSQL();
//     const querycom = "SELECT * FROM complaint_table WHERE complaint_id = ?";
//     var [complaint] = await sql4.query(querycom, [complaintId]);
//     await sql4.end();
//     console.log(complaint);
//     return res.status(201).json(complaint);
//   } catch (error) {
//     console.log(chalk.redBright(error));
//     // defaults to 500, you can process 'error' for more detailed error response
//     return res.status(500).json({
//       error: "server_error",
//       description: "unknown error occured when processing the request",
//     });
//   }
// });







const PORT = ENV().PORT || 3000;

app.listen(PORT, () => {
  console.info(chalk.blueBright.bold(`Server listening on ${PORT}!`));
  console.info(
    chalk`{white You can visit at: {blueBright {bold http://localhost:${PORT}/userLogin.html}}}`
  );
});

// Set up the necessary dependencies:
const express = require('express');
//const request = require('request');
const bodyParser = require('body-parser');
const { stringify } = require('qs');
const https = require("https");

// Set your Mailchimp API key:
const mailChimpAPIKey = "969f7e2640959b0e6af1c178efc97d2a-us121";


// Create an Express application and set up static file serving and body parsing:

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));


// Handle the root GET request and send the signup.html file:
app.get("/", function (req, res) {

    res.sendFile(__dirname + "/signup.html");

});

//Handle the POST request when the form is submitted:
app.post("/", function (req, res) {

    let firstName = req.body.fname;
    let lastName = req.body.lname;
    let email = req.body.email;
    console.log("Email:", email);
    console.log("fn..." + firstName + "...sn..." + lastName + "...email,,," + email);
    //res.send("fn..." + firstName + "...sn..." + lastName + "...email,,," + email);
    //var data = {
    //     members: [
    //         {
    //             email_address: email,
    //             status: "subscribed",
    //             merge_fields: {
    //                 FNAME: firstName,
    //                 LNAME: lastName
    //             }
    //         }
    //     ]
    // }

    // ...

    // Create the data object with members array
    var data = {
        members: [
            {
                "email_address": email,
                "status": "subscribed",
                "merge_fields": {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    // ...


    // we need the object converted into flat JSON
    const jsonData = JSON.stringify(data);
    console.log(jsonData);

    // Set the Mailchimp API URL
    const url = "https://us12.api.mailchimp.com/3.0/lists/fe46e8e116?skip_merge_validation=true'"

    // for the https request option in the https module
    // Set the options for the HTTPS request, including the method (POST) and authentication (using your Mailchimp API key):
    const options = {
        method: "POST",
        auth: "javi:" + mailChimpAPIKey
    }

    // Create an HTTPS request to the Mailchimp API endpoint, passing in the URL, options, and a callback function to handle the response:
    const request = https.request(url, options, function (response) {
        // Log the status code

        console.log("Status code:", response.statusCode);

        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }


        response.on("error", function (error) {
            console.error("Error:", error.message);
        });




        response.on("data", function (data) {
            console.log("el dato es " + data);
            console.log("el dato jspn es " + jsonData);
            console.log(JSON.parse(data));
        });
    });

    // Write the JSON data to the request body and end the request:
    request.write(jsonData);
    request.end();
});

app.post("/failure", function (req, res) {
    res.redirect("/");
})

// Set up the server to listen on port 3000:
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

/* Yes, in the provided code, we are handling a form submission and 
adding a new user (subscriber) to a specific Mailchimp list. 
By capturing the form data (first name, last name, and email) from
 the POST request, we construct a JSON object that represents 
 the new member's information.*/


/* The code then makes an HTTPS POST request to the Mailchimp API's
 /lists/{list_id}/members endpoint,
  where {list_id} is the ID of the list you want to add the member to. 
  This request includes the necessary authentication and the JSON data
   representing the new member.*/

/* Once the request is sent and successfully processed by the Mailchimp API,
 the member will be added to the specified list in your Mailchimp account. 
 This allows you to manage your subscribers and send email campaigns to them 
 using Mailchimp's features for mass mailings and marketing campaigns.*/
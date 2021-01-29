//jshint esversion:6
require('dotenv').config()
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");


mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});


userSchema.plugin(encrypt, { secret: process.env.SECRET, excludeFromEncryption: ['email'] });

const User = new mongoose.model("User", userSchema);

// ********************************************get request***********************************
app.get("/", function (req, res) {
    res.render("home");
})

app.get("/login", function (req, res) {
    res.render("login");
})

app.get("/register", function (req, res) {
    res.render("register");

})



app.post("/register", function (req, res) {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({ email: username }, function (err, foundUsers) {
        if (!err) {
            if (foundUsers) {
                console.log("this email is already register");
            } else {

                const newUser = new User({
                    email: username,
                    password: password
                });

                newUser.save();
                res.render("secrets");
            }
        }

    })
})

app.post("/login", function (req, res) {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({ email: username, password: password }, function (err, foundUsers) {
        if (!err) {
            if (foundUsers) {
                res.render("secrets");
            } else {
                console.log("check either username or password is incorrect!");
            }
        }
    })
});


app.listen("3000", function (req, res) {
    console.log("this is my world");
})


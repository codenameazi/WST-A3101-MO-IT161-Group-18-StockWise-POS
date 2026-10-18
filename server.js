const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

// Configure EJS for server-side rendering
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Allow the server to receive JSON data
app.use(express.json());

// Serve the existing StockWise POS frontend files
app.use(express.static(__dirname));

// Backend status route
app.get("/api/status", function (req, res) {
    res.json({
        message: "StockWise POS backend is running."
    });
});

// Render the Login page on the server
app.get("/login", function (req, res) {
    res.render("login", {
        pageTitle: "Log In",
        appName: "StockWise POS"
    });
});

// Render the Dashboard page on the server
app.get("/dashboard", function (req, res) {
    res.render("dashboard", {
        pageTitle: "Dashboard",
        appName: "StockWise POS",
        currentStock: 105,
        lowStock: 1
    });
});

// Open StockWise POS through the server-rendered Login page
app.get("/", function (req, res) {
    res.redirect("/login");
});

// Start the server
app.listen(PORT, function () {
    console.log(
        "StockWise POS server is running at http://localhost:" + PORT
    );
});
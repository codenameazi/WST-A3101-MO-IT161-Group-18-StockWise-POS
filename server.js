const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

// =========================================
// EJS CONFIGURATION
// =========================================

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


// =========================================
// MIDDLEWARE
// =========================================

app.use(express.json());

// Serve existing frontend files
app.use(express.static(__dirname));


// =========================================
// SAMPLE INVENTORY DATA
// =========================================

const inventoryProducts = [
    {
        name: "Rice",
        stock: 25,
        status: "low",
        expiration: "09/28/2026",
        expiring: true
    },
    {
        name: "Cooking Oil",
        stock: 35,
        status: "normal",
        expiration: "10/28/2026",
        expiring: false
    },
    {
        name: "Sugar",
        stock: 45,
        status: "high",
        expiration: "11/28/2026",
        expiring: false
    }
];


// =========================================
// BACKEND STATUS
// =========================================

app.get("/api/status", function (req, res) {

    res.json({
        message: "StockWise POS backend is running."
    });

});


// =========================================
// LOGIN SSR
// =========================================

app.get("/login", function (req, res) {

    res.render("login", {
        pageTitle: "Log In",
        appName: "StockWise POS"
    });

});


// =========================================
// DASHBOARD SSR
// =========================================

app.get("/dashboard", function (req, res) {

    res.render("dashboard", {
        pageTitle: "Dashboard",
        appName: "StockWise POS",
        currentStock: 105,
        lowStock: 1
    });

});


// =========================================
// INVENTORY SSR
// =========================================

app.get("/inventory", function (req, res) {

    res.render("inventory", {
        pageTitle: "Inventory",
        appName: "StockWise POS",
        products: inventoryProducts
    });

});


// =========================================
// HOME ROUTE
// =========================================

app.get("/", function (req, res) {

    res.redirect("/login");

});


// =========================================
// START SERVER
// =========================================

app.listen(PORT, function () {

    console.log(
        "StockWise POS server is running at http://localhost:" + PORT
    );

});
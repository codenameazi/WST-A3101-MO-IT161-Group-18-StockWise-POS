const express = require("express");
const path = require("path");
const ordersRouter = require("./routes/orders");

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
app.use(express.static(__dirname));

// Register Keon's Orders and Complete Order routes
app.use(ordersRouter);


// =========================================
// SAMPLE INVENTORY DATA
// =========================================

const inventoryProducts = [
    {
        id: 1,
        name: "Rice",
        category: "Rice",
        stock: 25,
        status: "low",
        expiration: "09/28/2026",
        expirationISO: "2026-09-28",
        expiring: true
    },
    {
        id: 2,
        name: "Cooking Oil",
        category: "Cooking Oil",
        stock: 35,
        status: "normal",
        expiration: "10/28/2026",
        expirationISO: "2026-10-28",
        expiring: false
    },
    {
        id: 3,
        name: "Sugar",
        category: "Sugar",
        stock: 45,
        status: "high",
        expiration: "11/28/2026",
        expirationISO: "2026-11-28",
        expiring: false
    }
];


// =========================================
// SAMPLE REPORT DATA
// =========================================

const reportData = {
    totalSales: 25000,
    estimatedProfit: 5000,
    totalOrders: 200,

    fastProducts: [
        "Rice",
        "Cooking Oil"
    ],

    slowProducts: [
        "Margarine",
        "Peanuts"
    ]
};


// =========================================
// SAMPLE SALES BREAKDOWN DATA
// =========================================

const breakdownProducts = [
    {
        name: "Rice",
        sold: 120,
        revenue: 7200
    },
    {
        name: "Cooking Oil",
        sold: 95,
        revenue: 9025
    },
    {
        name: "Sugar",
        sold: 85,
        revenue: 6375
    },
    {
        name: "Margarine",
        sold: 40,
        revenue: 2200
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
// INVENTORY ADD SSR
// =========================================

app.get("/inventory/add", function (req, res) {

    res.render("inventory-add", {
        pageTitle: "Inventory Add",
        appName: "StockWise POS"
    });

});


// =========================================
// INVENTORY EDIT SSR
// =========================================

app.get("/inventory/edit/:id", function (req, res) {

    const productId = Number(req.params.id);

    const selectedProduct = inventoryProducts.find(
        function (product) {
            return product.id === productId;
        }
    );

    if (!selectedProduct) {

        return res.status(404).send(
            "Product not found."
        );

    }

    res.render("inventory-edit", {
        pageTitle: "Inventory Edit",
        appName: "StockWise POS",
        product: selectedProduct
    });

});


// =========================================
// REPORTS SSR
// =========================================

app.get("/reports", function (req, res) {

    res.render("reports", {
        pageTitle: "Reports",
        appName: "StockWise POS",
        report: reportData
    });

});


// =========================================
// REPORTS BREAKDOWN SSR
// =========================================

app.get("/reports/breakdown", function (req, res) {

    res.render("reports-breakdown", {
        pageTitle: "Sales Breakdown",
        appName: "StockWise POS",
        products: breakdownProducts
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
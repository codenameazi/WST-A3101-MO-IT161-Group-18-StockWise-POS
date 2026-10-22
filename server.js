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
app.use(express.urlencoded({ extended: true }));
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
// SAMPLE REWARDS CUSTOMER DATA
// =========================================

const rewardsCustomers = [
    {
        customerNumber: "CXN00001",
        name: "Keon",
        phone: "09171234567",
        email: "keon@email.com",
        purchases: 25,
        points: 250,
        credit: 25,
        since: "01/01/2026"
    },
    {
        customerNumber: "CXN00002",
        name: "Azriel",
        phone: "09181234567",
        email: "azriel@email.com",
        purchases: 35,
        points: 350,
        credit: 35,
        since: "01/05/2026"
    },
    {
        customerNumber: "CXN00003",
        name: "Haziel",
        phone: "09191234567",
        email: "haziel@email.com",
        purchases: 45,
        points: 450,
        credit: 45,
        since: "01/10/2026"
    },
    {
        customerNumber: "CXN00004",
        name: "Hannah",
        phone: "09201234567",
        email: "hannah@email.com",
        purchases: 55,
        points: 550,
        credit: 55,
        since: "01/15/2026"
    }
];


// =========================================
// SAMPLE NOTIFICATION DATA
// =========================================

const notifications = [
    {
        id: 1,
        title: "Low Stock Alert",
        message: "Item 1 has dropped below the low stock threshold (5 units remaining).",
        time: "10 minutes ago",
        unread: true
    },
    {
        id: 2,
        title: "Order Completed",
        message: "Order #1024 was completed successfully. Total: Php 350.00",
        time: "45 minutes ago",
        unread: true
    },
    {
        id: 3,
        title: "Restock Recommendation",
        message: "Sales activity suggests restocking Item 2 by an estimated 20 units.",
        time: "2 hours ago",
        unread: true
    },
    {
        id: 4,
        title: "Inventory Updated",
        message: "Item 3 stock was manually adjusted from 30 to 45 units.",
        time: "Yesterday",
        unread: false
    },
    {
        id: 5,
        title: "Expiration Reminder",
        message: "Item 4 is nearing its expiration date (09/28/2026).",
        time: "Yesterday",
        unread: false
    },
    {
        id: 6,
        title: "System Notification",
        message: "StockWise settings were updated by USER.",
        time: "2 days ago",
        unread: false
    }
];


// =========================================
// SAMPLE SETTINGS DATA
// =========================================

const settings = {
    fullName: "Juan Dela Cruz",
    email: "juan@stockwise.com",
    role: "store-staff",
    currency: "php",
    lowStockThreshold: 10,
    language: "en",

    notifications: {
        lowStock: true,
        orders: true,
        expiration: true,
        systemUpdates: false
    }
};


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
// REWARDS SSR
// =========================================

app.get("/rewards", function (req, res) {

    res.render("rewards", {
        pageTitle: "Rewards",
        appName: "StockWise POS",
        customers: rewardsCustomers
    });

});


// =========================================
// REWARDS ADD CUSTOMER SSR
// =========================================

app.get("/rewards/add", function (req, res) {

    res.render("reward-add", {
        pageTitle: "Add Customer",
        appName: "StockWise POS"
    });

});


// =========================================
// REWARDS VIEW CUSTOMER SSR
// =========================================

app.get("/rewards/view/:customerNumber", function (req, res) {

    const customerNumber = req.params.customerNumber;

    const selectedCustomer = rewardsCustomers.find(
        function (customer) {

            return customer.customerNumber === customerNumber;

        }
    );

    if (!selectedCustomer) {

        return res.status(404).send(
            "Customer not found."
        );

    }

    res.render("rewards-view", {
        pageTitle: "View Customer",
        appName: "StockWise POS",
        customer: selectedCustomer
    });

});


// =========================================
// REWARDS EDIT CUSTOMER SSR
// =========================================

app.get("/rewards/edit/:customerNumber", function (req, res) {

    const customerNumber = req.params.customerNumber;

    const selectedCustomer = rewardsCustomers.find(
        function (customer) {

            return customer.customerNumber === customerNumber;

        }
    );

    if (!selectedCustomer) {

        return res.status(404).send(
            "Customer not found."
        );

    }

    res.render("reward-edit", {
        pageTitle: "Edit Customer",
        appName: "StockWise POS",
        customer: selectedCustomer
    });

});


// =========================================
// NOTIFICATIONS SSR
// =========================================

app.get("/notifications", function (req, res) {

    res.render("notifications", {
        pageTitle: "Notifications",
        appName: "StockWise POS",
        notifications: notifications
    });

});


// =========================================
// SETTINGS SSR
// =========================================

app.get("/settings", function (req, res) {

    res.render("settings", {
        pageTitle: "Settings",
        appName: "StockWise POS",
        settings: settings
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
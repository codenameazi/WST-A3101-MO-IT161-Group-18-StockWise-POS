const express = require("express");
const path = require("path");
const fs = require("fs");
const ordersRouter = require("./routes/orders");

const app = express();
const PORT = 3000;


// =========================================
// CUSTOMER JSON STORAGE
// =========================================

const customersFilePath = path.join(
    __dirname,
    "data",
    "customers.json"
);

// Read customers from JSON file
function readCustomers() {

    const fileContent = fs.readFileSync(
        customersFilePath,
        "utf8"
    );

    return JSON.parse(fileContent);

}

// Save customers to JSON file
function saveCustomers(customers) {

    fs.writeFileSync(
        customersFilePath,
        JSON.stringify(customers, null, 4),
        "utf8"
    );

}


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

    const customers = readCustomers();

    res.render("rewards", {
        pageTitle: "Rewards",
        appName: "StockWise POS",
        customers: customers
    });

});

// =========================================
// REWARDS ADD CUSTOMER SSR
// =========================================

// Display Add Customer page
app.get("/rewards/add", function (req, res) {

    res.render("reward-add", {
        pageTitle: "Add Customer",
        appName: "StockWise POS",
        error: null
    });

});


// =========================================
// REWARDS ADD CUSTOMER BACKEND
// =========================================

app.post("/rewards/add", function (req, res) {

    // DEBUG: Check if the form reaches the backend
    console.log("ADD CUSTOMER REQUEST RECEIVED");
    console.log("FORM DATA:", req.body);

    const name = String(req.body.name || "").trim();
    const phone = String(req.body.phonenumber || "").trim();
    const email = String(req.body.email || "").trim();

    // =========================================
    // BACKEND VALIDATION
    // =========================================

    function showError(statusCode, message) {
        return res.status(statusCode).render("reward-add", {
            pageTitle: "Add Customer",
            appName: "StockWise POS",
            error: message,
            formData: {
                name: name,
                phonenumber: phone,
                email: email
            }
        });
    }

    if (!name || !phone || !email) {
        return showError(
            400,
            "Please complete all required fields."
        );
    }

    if (name.length < 2) {
        return showError(
            400,
            "Customer name must contain at least 2 characters."
        );
    }

    const phonePattern = /^[0-9+\-\s]+$/;
    const phoneDigits = phone.replace(/\D/g, "");

    if (
        !phonePattern.test(phone) ||
        phoneDigits.length < 7 ||
        phoneDigits.length > 15
    ) {
        return showError(
            400,
            "Please enter a valid phone number."
        );
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
        return showError(
            400,
            "Please enter a valid email address."
        );
    }

    // =========================================
    // READ CUSTOMER DATA
    // =========================================

    let customers;

    try {
        customers = readCustomers();

        if (!Array.isArray(customers)) {
            throw new Error("Customer data must be an array.");
        }

    } catch (error) {

        console.error("READ CUSTOMERS ERROR:", error);

        return res.status(500).send(
            "Unable to read customer records. Check data/customers.json."
        );
    }

    // =========================================
    // CHECK DUPLICATE PHONE
    // =========================================

    const duplicatePhone = customers.some(function (customer) {
        return customer.phone === phone;
    });

    if (duplicatePhone) {
        return showError(
            409,
            "This phone number is already registered."
        );
    }

    // =========================================
    // GENERATE CUSTOMER NUMBER
    // =========================================

    const highestCustomerNumber = customers.reduce(
        function (highest, customer) {

            const number = Number(
                String(customer.customerNumber || "")
                    .replace("CXN", "")
            );

            return Number.isFinite(number)
                ? Math.max(highest, number)
                : highest;

        },
        0
    );

    const nextCustomerNumber =
        "CXN" +
        String(highestCustomerNumber + 1).padStart(5, "0");

    // =========================================
    // CREATE NEW CUSTOMER
    // =========================================

    const newCustomer = {
        customerNumber: nextCustomerNumber,
        name: name,
        phone: phone,
        email: email,
        purchases: 0,
        points: 0,
        credit: 0,
        since: new Date().toLocaleDateString("en-US")
    };

    // =========================================
    // SAVE TO CUSTOMERS.JSON
    // =========================================

    customers.push(newCustomer);

    try {

        saveCustomers(customers);

        console.log(
            "CUSTOMER SAVED SUCCESSFULLY:",
            newCustomer.customerNumber,
            newCustomer.name
        );

    } catch (error) {

        console.error("SAVE CUSTOMER ERROR:", error);

        return res.status(500).send(
            "Unable to save customer. Check the server terminal."
        );
    }

    // =========================================
    // REDIRECT TO REWARDS
    // =========================================

    return res.redirect("/rewards");

});


// =========================================
// REWARDS VIEW CUSTOMER SSR
// =========================================

app.get("/rewards/view/:customerNumber", function (req, res) {

    const customerNumber = req.params.customerNumber;

    const customers = readCustomers();
    const selectedCustomer = customers.find(
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

    const customers = readCustomers();
    const selectedCustomer = customers.find(
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
        customer: selectedCustomer,
        error: null
    });

});


// =========================================
// REWARDS EDIT CUSTOMER BACKEND
// =========================================

app.post("/rewards/edit/:customerNumber", function (req, res) {

    console.log("EDIT CUSTOMER REQUEST RECEIVED");
    console.log("CUSTOMER NUMBER:", req.params.customerNumber);
    console.log("FORM DATA:", req.body);

    const customerNumber = req.params.customerNumber;

    const name = String(req.body.name || "").trim();
    const phone = String(req.body.phonenumber || "").trim();
    const email = String(req.body.email || "").trim();


    // =========================================
    // READ CUSTOMER DATA
    // =========================================

    let customers;

    try {

        customers = readCustomers();

        if (!Array.isArray(customers)) {
            throw new Error("Customer data must be an array.");
        }

    } catch (error) {

        console.error("READ CUSTOMERS ERROR:", error);

        return res.status(500).send(
            "Unable to read customer records."
        );

    }


    // =========================================
    // FIND CUSTOMER
    // =========================================

    const customerIndex = customers.findIndex(
        function (customer) {

            return customer.customerNumber === customerNumber;

        }
    );

    if (customerIndex === -1) {

        return res.status(404).send(
            "Customer not found."
        );

    }


    // =========================================
    // DISPLAY VALIDATION ERROR
    // =========================================

    function showError(statusCode, message) {

        return res.status(statusCode).render("reward-edit", {

            pageTitle: "Edit Customer",
            appName: "StockWise POS",

            customer: {
                ...customers[customerIndex],
                name: name,
                phone: phone,
                email: email
            },

            error: message

        });

    }


    // =========================================
    // VALIDATE REQUIRED FIELDS
    // =========================================

    if (!name || !phone || !email) {

        return showError(
            400,
            "Please complete all required fields."
        );

    }


    // =========================================
    // VALIDATE CUSTOMER NAME
    // =========================================

    if (name.length < 2) {

        return showError(
            400,
            "Customer name must contain at least 2 characters."
        );

    }


    // =========================================
    // VALIDATE PHONE NUMBER
    // =========================================

    const phonePattern = /^[0-9+\-\s]+$/;

    const phoneDigits = phone.replace(/\D/g, "");

    if (
        !phonePattern.test(phone) ||
        phoneDigits.length < 7 ||
        phoneDigits.length > 15
    ) {

        return showError(
            400,
            "Please enter a valid phone number."
        );

    }


    // =========================================
    // VALIDATE EMAIL
    // =========================================

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {

        return showError(
            400,
            "Please enter a valid email address."
        );

    }


    // =========================================
    // CHECK DUPLICATE PHONE NUMBER
    // =========================================

    const duplicatePhone = customers.some(
        function (customer) {

            return (
                customer.phone === phone &&
                customer.customerNumber !== customerNumber
            );

        }
    );

    if (duplicatePhone) {

        return showError(
            409,
            "This phone number is already registered."
        );

    }


    // =========================================
    // UPDATE CUSTOMER INFORMATION
    // =========================================

    customers[customerIndex].name = name;
    customers[customerIndex].phone = phone;
    customers[customerIndex].email = email;


    // =========================================
    // SAVE TO CUSTOMERS.JSON
    // =========================================

    try {

        saveCustomers(customers);

        console.log(
            "CUSTOMER UPDATED SUCCESSFULLY:",
            customerNumber,
            name
        );

    } catch (error) {

        console.error("UPDATE CUSTOMER ERROR:", error);

        return res.status(500).send(
            "Unable to update customer information."
        );

    }


    // =========================================
    // REDIRECT TO CUSTOMER DETAILS
    // =========================================

    return res.redirect(
        "/rewards/view/" + encodeURIComponent(customerNumber)
    );

});


// =========================================
// REWARDS REMOVE CUSTOMER BACKEND
// =========================================

app.post("/rewards/remove/:customerNumber", function (req, res) {

    console.log("REMOVE CUSTOMER REQUEST RECEIVED");
    console.log("CUSTOMER NUMBER:", req.params.customerNumber);

    const customerNumber = req.params.customerNumber;


    // =========================================
    // READ CUSTOMER DATA
    // =========================================

    let customers;

    try {

        customers = readCustomers();

        if (!Array.isArray(customers)) {
            throw new Error("Customer data must be an array.");
        }

    } catch (error) {

        console.error("READ CUSTOMERS ERROR:", error);

        return res.status(500).send(
            "Unable to read customer records."
        );

    }


    // =========================================
    // FIND CUSTOMER
    // =========================================

    const customerIndex = customers.findIndex(
        function (customer) {

            return customer.customerNumber === customerNumber;

        }
    );


    if (customerIndex === -1) {

        return res.status(404).send(
            "Customer not found."
        );

    }


    // =========================================
    // REMOVE CUSTOMER
    // =========================================

    const removedCustomer = customers[customerIndex];

    customers.splice(customerIndex, 1);


    // =========================================
    // SAVE UPDATED CUSTOMER DATA
    // =========================================

    try {

        saveCustomers(customers);

        console.log(
            "CUSTOMER REMOVED SUCCESSFULLY:",
            removedCustomer.customerNumber,
            removedCustomer.name
        );

    } catch (error) {

        console.error("REMOVE CUSTOMER ERROR:", error);

        return res.status(500).send(
            "Unable to remove customer."
        );

    }


    // =========================================
    // REDIRECT TO REWARDS
    // =========================================

    return res.redirect("/rewards");

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
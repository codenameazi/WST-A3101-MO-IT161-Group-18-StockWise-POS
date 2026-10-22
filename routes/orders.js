const express = require("express");
const router = express.Router();

// Product catalog for the Order page.
// Previously hardcoded directly into Order.html as individual <button> tags;
// now lives here and gets looped into the template with EJS, so adding a
// new product means adding one line here instead of editing HTML.
const products = [
    { name: "Rice", price: 60 },
    { name: "Cooking Oil", price: 95 },
    { name: "Sugar", price: 75 },
    { name: "Egg", price: 10 },
    { name: "Monggo", price: 85 },
    { name: "Bihon", price: 45 },
    { name: "Margarine", price: 55 },
    { name: "Peanuts", price: 40 },
    { name: "Flour", price: 65 }
];

// GET /order
// Renders the Order page: product grid + customer order list.
// The actual cart logic (adding/removing items, totals, search filter)
// stays entirely in script.js and runs client-side, same as before.
router.get("/order", function (req, res) {

    res.render("order", {
        products: products
    });
});

// GET /complete-order
// Renders the Complete Order (checkout) page. The order summary itself is
// read from sessionStorage by script.js on page load, so nothing server-side
// needs to be passed in here. This milestone keeps cart state client-side only.
router.get("/complete-order", function (req, res) {

    res.render("complete-order");
});

module.exports = router;
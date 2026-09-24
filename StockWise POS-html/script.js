document.addEventListener("DOMContentLoaded", function () {


    // =========================================
    // ORDER PAGE
    // =========================================

    const productButtons =
        document.querySelectorAll(".product-button");

    const orderSearchInput =
        document.getElementById("search");

    const orderItemsContainer =
        document.getElementById("order-items");

    const orderTotal =
        document.getElementById("order-total");

    const removeButton =
        document.getElementById("remove-item");

    const completeButton =
        document.getElementById("complete-order");

    const emptyMessage =
        document.getElementById("empty-order");

    let order = [];
    let selectedProductName = null;


    if (
        productButtons.length > 0 &&
        orderItemsContainer &&
        orderTotal
    ) {

        productButtons.forEach(function (button) {

            button.addEventListener("click", function () {

                const productName =
                    button.dataset.name;

                const productPrice =
                    Number(button.dataset.price);

                const existingProduct =
                    order.find(function (item) {

                        return item.name ===
                            productName;
                    });


                if (existingProduct) {

                    existingProduct.quantity++;

                } else {

                    order.push({
                        name: productName,
                        price: productPrice,
                        quantity: 1
                    });
                }


                displayOrder();
            });
        });


        function displayOrder() {

            orderItemsContainer.innerHTML = "";


            if (order.length === 0) {

                if (emptyMessage) {

                    emptyMessage.style.display =
                        "block";
                }

                orderTotal.textContent =
                    "₱0.00";

                selectedProductName = null;

                return;
            }


            if (emptyMessage) {

                emptyMessage.style.display =
                    "none";
            }


            let total = 0;


            order.forEach(function (item) {

                const subtotal =
                    item.price *
                    item.quantity;

                total += subtotal;


                const orderItem =
                    document.createElement("div");

                orderItem.className =
                    "order-item";


                if (
                    item.name ===
                    selectedProductName
                ) {

                    orderItem.classList.add(
                        "selected"
                    );
                }


                orderItem.innerHTML = `
                    <span>
                        ${item.name}
                        <small>
                            x${item.quantity}
                        </small>
                    </span>

                    <span>
                        ₱${subtotal.toFixed(2)}
                    </span>
                `;


                orderItem.addEventListener(
                    "click",
                    function () {

                        selectedProductName =
                            item.name;

                        displayOrder();
                    }
                );


                orderItemsContainer.appendChild(
                    orderItem
                );
            });


            orderTotal.textContent =
                "₱" + total.toFixed(2);
        }


        if (removeButton) {

            removeButton.addEventListener(
                "click",
                function () {

                    if (order.length === 0) {

                        alert(
                            "There are no items to remove."
                        );

                        return;
                    }


                    if (
                        selectedProductName ===
                        null
                    ) {

                        alert(
                            "Select an item from the order list first."
                        );

                        return;
                    }


                    const selectedProduct =
                        order.find(
                            function (item) {

                                return (
                                    item.name ===
                                    selectedProductName
                                );
                            }
                        );


                    if (
                        selectedProduct &&
                        selectedProduct.quantity > 1
                    ) {

                        selectedProduct.quantity--;

                    } else {

                        order =
                            order.filter(
                                function (item) {

                                    return (
                                        item.name !==
                                        selectedProductName
                                    );
                                }
                            );

                        selectedProductName =
                            null;
                    }


                    displayOrder();
                }
            );
        }


        if (orderSearchInput) {

            orderSearchInput.addEventListener(
                "input",
                function () {

                    const searchValue =
                        orderSearchInput.value
                            .toLowerCase()
                            .trim();


                    productButtons.forEach(
                        function (button) {

                            const productName =
                                button.dataset.name
                                    .toLowerCase();


                            if (
                                productName.includes(
                                    searchValue
                                )
                            ) {

                                button.style.display =
                                    "";

                            } else {

                                button.style.display =
                                    "none";
                            }
                        }
                    );
                }
            );
        }


        if (completeButton) {

            completeButton.addEventListener(
                "click",
                function (event) {

                    if (order.length === 0) {

                        event.preventDefault();

                        alert(
                            "Please add at least one item before completing the order."
                        );

                        return;
                    }


                    sessionStorage.setItem(
                        "stockwiseOrder",
                        JSON.stringify(order)
                    );
                }
            );
        }


        displayOrder();
    }



    // =========================================
    // INVENTORY PAGE
    // =========================================

    const inventorySearch =
        document.getElementById("inventory-search");

    const statusFilter =
        document.getElementById("status-filter");

    const inventoryRows =
        document.querySelectorAll(".inventory-row");

    const currentStocks =
        document.getElementById("current-stocks");

    const lowStocks =
        document.getElementById("low-stocks");

    const expirationReminder =
        document.getElementById("expiration-reminder");

    const noInventoryResults =
        document.getElementById("inventory-no-results");


    if (inventoryRows.length > 0) {

        function updateInventorySummary() {

            let totalStock = 0;
            let lowStockCount = 0;
            let expirationCount = 0;


            inventoryRows.forEach(function (row) {

                totalStock +=
                    Number(row.dataset.stock);


                if (row.dataset.status === "low") {
                    lowStockCount++;
                }


                if (row.dataset.expiring === "true") {
                    expirationCount++;
                }
            });


            currentStocks.textContent =
                totalStock;

            lowStocks.textContent =
                lowStockCount;

            expirationReminder.textContent =
                expirationCount;
        }


        function filterInventory() {

            const searchValue =
                inventorySearch.value
                    .toLowerCase()
                    .trim();

            const selectedStatus =
                statusFilter.value;

            let visibleProducts = 0;


            inventoryRows.forEach(function (row) {

                const productName =
                    row.dataset.product
                        .toLowerCase();

                const productStatus =
                    row.dataset.status;

                const matchesSearch =
                    productName.includes(
                        searchValue
                    );

                const matchesStatus =
                    selectedStatus === "all" ||
                    productStatus === selectedStatus;


                if (
                    matchesSearch &&
                    matchesStatus
                ) {

                    row.style.display = "";
                    visibleProducts++;

                } else {

                    row.style.display = "none";
                }
            });


            if (visibleProducts === 0) {

                noInventoryResults.hidden = false;

            } else {

                noInventoryResults.hidden = true;
            }
        }


        inventorySearch.addEventListener(
            "input",
            filterInventory
        );


        statusFilter.addEventListener(
            "change",
            filterInventory
        );


        updateInventorySummary();
        filterInventory();
    }



    // =========================================
    // INVENTORY ADD PRODUCT PAGE
    // =========================================

    const inventoryAddForm =
        document.getElementById("inventory-add-form");

    const categoryInput =
        document.getElementById("category");

    const itemNameInput =
        document.getElementById("item-name");

    const expirationInput =
        document.getElementById("expiration-date");

    const quantityInput =
        document.getElementById("quantity");

    const inventoryFormMessage =
        document.getElementById(
            "inventory-form-message"
        );

    const scanButton =
        document.getElementById("scan");


    if (inventoryAddForm) {

        inventoryAddForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                const category =
                    categoryInput.value.trim();

                const itemName =
                    itemNameInput.value.trim();

                const quantity =
                    Number(quantityInput.value);

                const expirationDate =
                    expirationInput.value;


                if (
                    category === "" ||
                    itemName === "" ||
                    expirationDate === ""
                ) {

                    showInventoryMessage(
                        "Please complete all product information.",
                        false
                    );

                    return;
                }


                if (quantity <= 0) {

                    showInventoryMessage(
                        "Quantity must be greater than zero.",
                        false
                    );

                    return;
                }


                const selectedExpiration =
                    new Date(
                        expirationDate + "T00:00:00"
                    );

                const today =
                    new Date();

                today.setHours(0, 0, 0, 0);


                if (selectedExpiration <= today) {

                    showInventoryMessage(
                        "Expiration date must be later than today.",
                        false
                    );

                    return;
                }


                showInventoryMessage(
                    itemName +
                    " was added successfully.",
                    true
                );


                inventoryAddForm.reset();
            }
        );


        if (scanButton) {

            scanButton.addEventListener(
                "click",
                function () {

                    showInventoryMessage(
                        "Barcode scanner is ready for future integration.",
                        true
                    );
                }
            );
        }


        function showInventoryMessage(
            message,
            success
        ) {

            inventoryFormMessage.hidden = false;
            inventoryFormMessage.textContent = message;


            if (success) {

                inventoryFormMessage.style.color =
                    "#668575";

            } else {

                inventoryFormMessage.style.color =
                    "#9B4D55";
            }
        }
    }



    // =========================================
    // INVENTORY EDIT PRODUCT PAGE
    // =========================================

    const inventoryEditForm =
        document.getElementById("inventory-edit-form");

    const editCategoryInput =
        document.getElementById("edit-category");

    const editItemNameInput =
        document.getElementById("edit-item-name");

    const editExpirationInput =
        document.getElementById(
            "edit-expiration-date"
        );

    const editQuantityInput =
        document.getElementById("edit-quantity");

    const inventoryEditMessage =
        document.getElementById(
            "inventory-edit-message"
        );

    const removeInventoryItemButton =
        document.getElementById(
            "remove-inventory-item"
        );


    if (inventoryEditForm) {

        inventoryEditForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                const category =
                    editCategoryInput.value.trim();

                const itemName =
                    editItemNameInput.value.trim();

                const expirationDate =
                    editExpirationInput.value;

                const quantity =
                    Number(editQuantityInput.value);


                if (
                    category === "" ||
                    itemName === "" ||
                    expirationDate === ""
                ) {

                    showEditMessage(
                        "Please complete all product information.",
                        false
                    );

                    return;
                }


                if (quantity < 0) {

                    showEditMessage(
                        "Quantity cannot be less than zero.",
                        false
                    );

                    return;
                }


                const selectedExpiration =
                    new Date(
                        expirationDate + "T00:00:00"
                    );

                const today =
                    new Date();

                today.setHours(0, 0, 0, 0);


                if (selectedExpiration <= today) {

                    showEditMessage(
                        "Expiration date must be later than today.",
                        false
                    );

                    return;
                }


                showEditMessage(
                    itemName +
                    " was updated successfully.",
                    true
                );
            }
        );


        if (removeInventoryItemButton) {

            removeInventoryItemButton.addEventListener(
                "click",
                function () {

                    const itemName =
                        editItemNameInput.value.trim();

                    const displayName =
                        itemName === ""
                            ? "this item"
                            : itemName;


                    const confirmed =
                        confirm(
                            "Are you sure you want to remove " +
                            displayName +
                            "?"
                        );


                    if (!confirmed) {

                        showEditMessage(
                            "Item removal was cancelled.",
                            false
                        );

                        return;
                    }


                    showEditMessage(
                        displayName +
                        " was removed successfully.",
                        true
                    );


                    editCategoryInput.disabled = true;
                    editItemNameInput.disabled = true;
                    editExpirationInput.disabled = true;
                    editQuantityInput.disabled = true;

                    removeInventoryItemButton.disabled = true;


                    const saveButton =
                        document.getElementById("save");


                    if (saveButton) {
                        saveButton.disabled = true;
                    }
                }
            );
        }


        function showEditMessage(
            message,
            success
        ) {

            inventoryEditMessage.hidden = false;
            inventoryEditMessage.textContent = message;


            if (success) {

                inventoryEditMessage.style.color =
                    "#668575";

            } else {

                inventoryEditMessage.style.color =
                    "#9B4D55";
            }
        }
    }



    // =========================================
    // REWARDS PAGE
    // =========================================

    const rewardsSearch =
        document.getElementById("rewards-search");

    const rewardRows =
        document.querySelectorAll(".reward-row");

    const rewardsNoResults =
        document.getElementById(
            "rewards-no-results"
        );


    if (
        rewardsSearch &&
        rewardRows.length > 0
    ) {

        rewardsSearch.addEventListener(
            "input",
            function () {

                const searchValue =
                    rewardsSearch.value
                        .toLowerCase()
                        .trim();

                let visibleCustomers = 0;


                rewardRows.forEach(
                    function (row) {

                        const customerName =
                            row.dataset.customer
                                .toLowerCase();

                        const customerNumber =
                            row.dataset.customerNumber
                                .toLowerCase();


                        const matchesSearch =
                            customerName.includes(
                                searchValue
                            ) ||
                            customerNumber.includes(
                                searchValue
                            );


                        if (matchesSearch) {

                            row.style.display = "";
                            visibleCustomers++;

                        } else {

                            row.style.display = "none";
                        }
                    }
                );


                if (visibleCustomers === 0) {

                    rewardsNoResults.hidden = false;

                } else {

                    rewardsNoResults.hidden = true;
                }
            }
        );
    }



    // =========================================
    // REWARD ADD CUSTOMER PAGE
    // =========================================

    const rewardAddForm =
        document.getElementById("reward-add-form");

    const rewardName =
        document.getElementById("reward-name");

    const rewardPhone =
        document.getElementById("reward-phone");

    const rewardEmail =
        document.getElementById("reward-email");

    const rewardAddMessage =
        document.getElementById(
            "reward-add-message"
        );


    if (rewardAddForm) {

        rewardAddForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                const customerName =
                    rewardName.value.trim();

                const phoneNumber =
                    rewardPhone.value.trim();

                const emailAddress =
                    rewardEmail.value.trim();


                if (
                    customerName === "" ||
                    phoneNumber === "" ||
                    emailAddress === ""
                ) {

                    showRewardAddMessage(
                        "Please complete all customer information.",
                        false
                    );

                    return;
                }


                if (customerName.length < 2) {

                    showRewardAddMessage(
                        "Customer name must contain at least 2 characters.",
                        false
                    );

                    return;
                }


                const phonePattern =
                    /^[0-9+\-\s]+$/;


                if (!phonePattern.test(phoneNumber)) {

                    showRewardAddMessage(
                        "Phone number must contain numbers only.",
                        false
                    );

                    return;
                }


                const phoneDigits =
                    phoneNumber.replace(/\D/g, "");


                if (
                    phoneDigits.length < 7 ||
                    phoneDigits.length > 15
                ) {

                    showRewardAddMessage(
                        "Please enter a valid phone number.",
                        false
                    );

                    return;
                }


                const emailPattern =
                    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


                if (!emailPattern.test(emailAddress)) {

                    showRewardAddMessage(
                        "Please enter a valid email address.",
                        false
                    );

                    return;
                }


                showRewardAddMessage(
                    customerName +
                    " was added successfully.",
                    true
                );


                rewardAddForm.reset();
            }
        );


        function showRewardAddMessage(
            message,
            success
        ) {

            rewardAddMessage.hidden = false;
            rewardAddMessage.textContent = message;


            if (success) {

                rewardAddMessage.style.color =
                    "#668575";

            } else {

                rewardAddMessage.style.color =
                    "#9B4D55";
            }
        }
    }



    // =========================================
    // REWARD EDIT CUSTOMER PAGE
    // =========================================

    const rewardEditForm =
        document.getElementById("reward-edit-form");

    const rewardEditName =
        document.getElementById("reward-edit-name");

    const rewardEditPhone =
        document.getElementById("reward-edit-phone");

    const rewardEditEmail =
        document.getElementById("reward-edit-email");

    const rewardEditMessage =
        document.getElementById(
            "reward-edit-message"
        );

    const rewardRemoveButton =
        document.getElementById("reward-remove");

    const rewardSaveButton =
        document.getElementById("reward-save");


    if (rewardEditForm) {

        rewardEditForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                const customerName =
                    rewardEditName.value.trim();

                const phoneNumber =
                    rewardEditPhone.value.trim();

                const emailAddress =
                    rewardEditEmail.value.trim();


                if (
                    customerName === "" ||
                    phoneNumber === "" ||
                    emailAddress === ""
                ) {

                    showRewardEditMessage(
                        "Please complete all customer information.",
                        false
                    );

                    return;
                }


                if (customerName.length < 2) {

                    showRewardEditMessage(
                        "Customer name must contain at least 2 characters.",
                        false
                    );

                    return;
                }


                const phonePattern =
                    /^[0-9+\-\s]+$/;


                if (!phonePattern.test(phoneNumber)) {

                    showRewardEditMessage(
                        "Phone number must contain numbers only.",
                        false
                    );

                    return;
                }


                const phoneDigits =
                    phoneNumber.replace(/\D/g, "");


                if (
                    phoneDigits.length < 7 ||
                    phoneDigits.length > 15
                ) {

                    showRewardEditMessage(
                        "Please enter a valid phone number.",
                        false
                    );

                    return;
                }


                const emailPattern =
                    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


                if (!emailPattern.test(emailAddress)) {

                    showRewardEditMessage(
                        "Please enter a valid email address.",
                        false
                    );

                    return;
                }


                showRewardEditMessage(
                    customerName +
                    " was updated successfully.",
                    true
                );
            }
        );


        if (rewardRemoveButton) {

            rewardRemoveButton.addEventListener(
                "click",
                function () {

                    const customerName =
                        rewardEditName.value.trim();

                    const displayName =
                        customerName === ""
                            ? "this customer"
                            : customerName;


                    const confirmed =
                        confirm(
                            "Are you sure you want to remove " +
                            displayName +
                            "?"
                        );


                    if (!confirmed) {

                        showRewardEditMessage(
                            "Customer removal was cancelled.",
                            false
                        );

                        return;
                    }


                    showRewardEditMessage(
                        displayName +
                        " was removed successfully.",
                        true
                    );


                    rewardEditName.disabled = true;
                    rewardEditPhone.disabled = true;
                    rewardEditEmail.disabled = true;

                    rewardRemoveButton.disabled = true;
                    rewardSaveButton.disabled = true;
                }
            );
        }


        function showRewardEditMessage(
            message,
            success
        ) {

            rewardEditMessage.hidden = false;
            rewardEditMessage.textContent = message;


            if (success) {

                rewardEditMessage.style.color =
                    "#668575";

            } else {

                rewardEditMessage.style.color =
                    "#9B4D55";
            }
        }
    }

    // =========================================
    // COMPLETE ORDER PAGE
    // =========================================

    const coOrderItems =
        document.getElementById(
            "co-order-items"
        );

    const coOrderTotal =
        document.getElementById(
            "co-order-total"
        );

    const paymentButtons =
        document.querySelectorAll(
            ".payment-button"
        );

    const printButton =
        document.getElementById(
            "print-receipt"
        );

    const cancelOrderButton =
        document.getElementById(
            "cancel-order"
        );

    const newOrderButton =
        document.getElementById(
            "new-order"
        );


    let completeOrderTotal = 0;
    let selectedPaymentMethod = null;


    if (
        coOrderItems &&
        coOrderTotal
    ) {

        let savedOrder = [];


        try {

            savedOrder =
                JSON.parse(
                    sessionStorage.getItem(
                        "stockwiseOrder"
                    )
                ) || [];

        } catch (error) {

            savedOrder = [];
        }


        coOrderItems.innerHTML = "";


        if (savedOrder.length === 0) {

            coOrderItems.innerHTML =
                "<p>No items in this order.</p>";

            coOrderTotal.textContent =
                "₱0.00";

        } else {

            savedOrder.forEach(
                function (item) {

                    const subtotal =
                        Number(item.price) *
                        Number(item.quantity);

                    completeOrderTotal +=
                        subtotal;


                    const row =
                        document.createElement(
                            "div"
                        );

                    row.className =
                        "order-item";


                    row.innerHTML = `
                        <span>
                            ${item.name}
                            <small>
                                x${item.quantity}
                            </small>
                        </span>

                        <span>
                            ₱${subtotal.toFixed(2)}
                        </span>
                    `;


                    coOrderItems.appendChild(
                        row
                    );
                }
            );


            coOrderTotal.textContent =
                "₱" +
                completeOrderTotal.toFixed(2);
        }
    }


    if (paymentButtons.length > 0) {

        paymentButtons.forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        paymentButtons.forEach(
                            function (otherButton) {

                                otherButton.classList.remove(
                                    "selected"
                                );
                            }
                        );


                        button.classList.add(
                            "selected"
                        );


                        selectedPaymentMethod =
                            button.dataset.method;
                    }
                );
            }
        );
    }


    if (printButton) {

        printButton.addEventListener(
            "click",
            function () {

                if (
                    completeOrderTotal <= 0
                ) {

                    alert(
                        "There is no order to print."
                    );

                    return;
                }


                if (
                    selectedPaymentMethod ===
                    null
                ) {

                    alert(
                        "Please select a payment method first."
                    );

                    return;
                }


                window.print();
            }
        );
    }


    if (cancelOrderButton) {

        cancelOrderButton.addEventListener(
            "click",
            function () {

                const confirmed =
                    confirm(
                        "Are you sure you want to cancel this order?"
                    );


                if (!confirmed) {

                    return;
                }


                sessionStorage.removeItem(
                    "stockwiseOrder"
                );


                window.location.href =
                    "Order.html";
            }
        );
    }


    if (newOrderButton) {

        newOrderButton.addEventListener(
            "click",
            function (event) {

                if (
                    completeOrderTotal <= 0
                ) {

                    sessionStorage.removeItem(
                        "stockwiseOrder"
                    );

                    return;
                }


                if (
                    selectedPaymentMethod ===
                    null
                ) {

                    event.preventDefault();

                    alert(
                        "Please select a payment method before completing the order."
                    );

                    return;
                }


                const previousSales =
                    Number(
                        localStorage.getItem(
                            "stockwiseTotalSales"
                        )
                    ) || 0;


                const updatedSales =
                    previousSales +
                    completeOrderTotal;


                localStorage.setItem(
                    "stockwiseTotalSales",
                    updatedSales.toString()
                );


                sessionStorage.removeItem(
                    "stockwiseOrder"
                );
            }
        );
    }

        // =========================================
    // DASHBOARD PAGE
    // =========================================

    const dashboardTotalSales =
        document.getElementById("dashboard-total-sales");

    const clickableCards =
        document.querySelectorAll(".clickable-card");


    if (dashboardTotalSales) {

        const totalSales =
            Number(
                localStorage.getItem("stockwiseTotalSales")
            ) || 0;

        dashboardTotalSales.textContent =
            "₱" + totalSales.toFixed(2);
    }


    if (clickableCards.length > 0) {

        clickableCards.forEach(function (card) {

            card.addEventListener("click", function () {

                window.location.href =
                    card.dataset.href;
            });
        });
    }

    // =========================================
    // REPORTS PAGE
    // =========================================

    const reportPeriod =
        document.getElementById("report-period");

    const reportSales =
        document.getElementById("report-sales");

    const reportProfit =
        document.getElementById("report-profit");

    const reportOrders =
        document.getElementById("report-orders");

    const salesOverview =
        document.getElementById("sales-overview");

    const fastProducts =
        document.getElementById("fast-products");

    const slowProducts =
        document.getElementById("slow-products");


    if (reportPeriod) {

        const reportData = {

            today: {
                sales: "₱25,000",
                profit: "₱5,000",
                orders: "200",
                overview: "Today Sales: ₱25,000",
                fast: [
                    "Rice",
                    "Cooking Oil"
                ],
                slow: [
                    "Margarine",
                    "Peanuts"
                ]
            },

            week: {
                sales: "₱145,000",
                profit: "₱29,000",
                orders: "1,120",
                overview: "This Week Sales: ₱145,000",
                fast: [
                    "Rice",
                    "Sugar"
                ],
                slow: [
                    "Flour",
                    "Margarine"
                ]
            },

            month: {
                sales: "₱620,000",
                profit: "₱124,000",
                orders: "4,850",
                overview: "This Month Sales: ₱620,000",
                fast: [
                    "Cooking Oil",
                    "Rice"
                ],
                slow: [
                    "Peanuts",
                    "Bihon"
                ]
            }
        };


        function updateReport() {

            const selectedPeriod =
                reportPeriod.value;

            const selectedData =
                reportData[selectedPeriod];


            reportSales.textContent =
                selectedData.sales;

            reportProfit.textContent =
                selectedData.profit;

            reportOrders.textContent =
                selectedData.orders;

            salesOverview.textContent =
                selectedData.overview;


            fastProducts.innerHTML = "";

            selectedData.fast.forEach(
                function (product) {

                    const productItem =
                        document.createElement("p");

                    productItem.textContent =
                        product;

                    fastProducts.appendChild(
                        productItem
                    );
                }
            );


            slowProducts.innerHTML = "";

            selectedData.slow.forEach(
                function (product) {

                    const productItem =
                        document.createElement("p");

                    productItem.textContent =
                        product;

                    slowProducts.appendChild(
                        productItem
                    );
                }
            );
        }


        reportPeriod.addEventListener(
            "change",
            updateReport
        );


        updateReport();
    }



    // =========================================
    // REPORTS BREAKDOWN PAGE
    // =========================================

    const breakdownSearch =
        document.getElementById(
            "breakdown-search"
        );

    const breakdownSort =
        document.getElementById(
            "breakdown-sort"
        );

    const breakdownTableBody =
        document.getElementById(
            "breakdown-table-body"
        );

    const breakdownRows =
        Array.from(
            document.querySelectorAll(
                ".breakdown-row"
            )
        );

    const breakdownNoResults =
        document.getElementById(
            "breakdown-no-results"
        );


    if (
        breakdownSearch &&
        breakdownSort &&
        breakdownTableBody &&
        breakdownRows.length > 0
    ) {

        const originalBreakdownOrder =
            breakdownRows.slice();


        function updateBreakdown() {

            const searchValue =
                breakdownSearch.value
                    .toLowerCase()
                    .trim();

            const selectedSort =
                breakdownSort.value;

            let sortedRows =
                originalBreakdownOrder.slice();


            if (selectedSort === "sold-high") {

                sortedRows.sort(
                    function (a, b) {

                        return Number(
                            b.dataset.sold
                        ) - Number(
                            a.dataset.sold
                        );
                    }
                );

            } else if (
                selectedSort === "sold-low"
            ) {

                sortedRows.sort(
                    function (a, b) {

                        return Number(
                            a.dataset.sold
                        ) - Number(
                            b.dataset.sold
                        );
                    }
                );

            } else if (
                selectedSort === "revenue-high"
            ) {

                sortedRows.sort(
                    function (a, b) {

                        return Number(
                            b.dataset.revenue
                        ) - Number(
                            a.dataset.revenue
                        );
                    }
                );

            } else if (
                selectedSort === "revenue-low"
            ) {

                sortedRows.sort(
                    function (a, b) {

                        return Number(
                            a.dataset.revenue
                        ) - Number(
                            b.dataset.revenue
                        );
                    }
                );
            }


            let visibleProducts = 0;


            sortedRows.forEach(
                function (row) {

                    breakdownTableBody.appendChild(
                        row
                    );


                    const productName =
                        row.dataset.product
                            .toLowerCase();


                    if (
                        productName.includes(
                            searchValue
                        )
                    ) {

                        row.style.display = "";
                        visibleProducts++;

                    } else {

                        row.style.display = "none";
                    }
                }
            );


            if (visibleProducts === 0) {

                breakdownNoResults.hidden = false;

            } else {

                breakdownNoResults.hidden = true;
            }
        }


        breakdownSearch.addEventListener(
            "input",
            updateBreakdown
        );


        breakdownSort.addEventListener(
            "change",
            updateBreakdown
        );


        updateBreakdown();
    }



    // =========================================
    // LOGIN PAGE
    // =========================================

    const loginForm =
        document.getElementById("login-form");

    const loginUsername =
        document.getElementById("username");

    const loginPassword =
        document.getElementById("password");

    const loginMessage =
        document.getElementById("login-message");

    const loginButton =
        document.getElementById("login-button");


    if (loginForm) {

        loginForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                const username =
                    loginUsername.value.trim();

                const password =
                    loginPassword.value;


                if (
                    username === "" ||
                    password === ""
                ) {

                    showLoginMessage(
                        "Please enter your username and password.",
                        false
                    );

                    return;
                }


                if (username.length < 3) {

                    showLoginMessage(
                        "Username must contain at least 3 characters.",
                        false
                    );

                    return;
                }


                if (password.length < 6) {

                    showLoginMessage(
                        "Password must contain at least 6 characters.",
                        false
                    );

                    return;
                }


                loginButton.disabled = true;
                loginButton.textContent = "Logging in...";


                authenticateUser(
                    username,
                    password
                );
            }
        );


        function authenticateUser(
            username,
            password
        ) {

            /*
                DATABASE READY AREA

                Kapag may backend/database na,
                dito ilalagay ang request sa server.

                The server should return whether
                the username and password are valid.

                Password verification must happen
                on the server, not inside this file.
            */


            const databaseConnected = false;


            if (!databaseConnected) {

                demoLogin();

                return;
            }


            /*
                FUTURE DATABASE RESULT EXAMPLE:

                if (loginAccepted) {

                    loginSuccess();

                } else {

                    loginFailed();
                }
            */
        }


        function demoLogin() {

            /*
                Temporary frontend demo only.

                Since wala pang database,
                valid-format credentials are accepted.
            */

            loginSuccess();
        }


        function loginSuccess() {

            showLoginMessage(
                "Login successful.",
                true
            );


            setTimeout(
                function () {

                    window.location.href =
                        "Dashboard.html";
                },
                500
            );
        }


        function loginFailed() {

            showLoginMessage(
                "Incorrect username or password.",
                false
            );


            loginButton.disabled = false;
            loginButton.textContent = "Login";
        }


        function loginError() {

            showLoginMessage(
                "Unable to log in. Please try again.",
                false
            );


            loginButton.disabled = false;
            loginButton.textContent = "Login";
        }


        function showLoginMessage(
            message,
            success
        ) {

            loginMessage.hidden = false;
            loginMessage.textContent = message;


            if (success) {

                loginMessage.style.color =
                    "#668575";

            } else {

                loginMessage.style.color =
                    "#9B4D55";
            }
        }
    }



    // =========================================
    // CREATE ACCOUNT PAGE
    // =========================================

    const createAccountForm =
        document.getElementById(
            "create-account-form"
        );

    const firstNameInput =
        document.getElementById("first-name");

    const lastNameInput =
        document.getElementById("last-name");

    const createEmailInput =
        document.getElementById("email");

    const createUsernameInput =
        document.getElementById(
            "create-username"
        );

    const createPasswordInput =
        document.getElementById(
            "create-password"
        );

    const createAccountMessage =
        document.getElementById(
            "create-account-message"
        );


    if (createAccountForm) {

        createAccountForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                const firstName =
                    firstNameInput.value.trim();

                const lastName =
                    lastNameInput.value.trim();

                const email =
                    createEmailInput.value.trim();

                const username =
                    createUsernameInput.value.trim();

                const password =
                    createPasswordInput.value;


                if (
                    firstName === "" ||
                    lastName === "" ||
                    email === "" ||
                    username === "" ||
                    password === ""
                ) {

                    showCreateAccountMessage(
                        "Please complete all account information.",
                        false
                    );

                    return;
                }


                if (
                    firstName.length < 2 ||
                    lastName.length < 2
                ) {

                    showCreateAccountMessage(
                        "First name and last name must contain at least 2 characters.",
                        false
                    );

                    return;
                }


                const namePattern =
                    /^[A-Za-z\s'-]+$/;


                if (
                    !namePattern.test(firstName) ||
                    !namePattern.test(lastName)
                ) {

                    showCreateAccountMessage(
                        "Please enter a valid first name and last name.",
                        false
                    );

                    return;
                }


                const emailPattern =
                    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


                if (!emailPattern.test(email)) {

                    showCreateAccountMessage(
                        "Please enter a valid email address.",
                        false
                    );

                    return;
                }


                if (username.length < 3) {

                    showCreateAccountMessage(
                        "Username must contain at least 3 characters.",
                        false
                    );

                    return;
                }


                if (password.length < 6) {

                    showCreateAccountMessage(
                        "Password must contain at least 6 characters.",
                        false
                    );

                    return;
                }


                showCreateAccountMessage(
                    "Account information is valid. Database registration will be connected later.",
                    true
                );


                createAccountForm.reset();
            }
        );


        function showCreateAccountMessage(
            message,
            success
        ) {

            createAccountMessage.hidden = false;
            createAccountMessage.textContent =
                message;


            if (success) {

                createAccountMessage.style.color =
                    "#668575";

            } else {

                createAccountMessage.style.color =
                    "#9B4D55";
            }
        }
    }



    // =========================================
    // REWARDS VIEW PAGE
    // =========================================

    const customerCredit =
        document.getElementById("customer-credit");

    const customerPoints =
        document.getElementById("customer-points");

    const payCreditButton =
        document.getElementById("pay-credit-button");

    const redeemPointsButton =
        document.getElementById(
            "redeem-points-button"
        );

    const rewardsViewMessage =
        document.getElementById(
            "rewards-view-message"
        );


    if (
        customerCredit &&
        customerPoints &&
        payCreditButton &&
        redeemPointsButton &&
        rewardsViewMessage
    ) {

        let creditAmount =
            Number(
                customerCredit.textContent
                    .replace("₱", "")
                    .replace(",", "")
                    .trim()
            );

        let rewardPoints =
            Number(
                customerPoints.textContent.trim()
            );


        function showRewardsViewMessage(
            message,
            success
        ) {

            rewardsViewMessage.hidden = false;

            rewardsViewMessage.textContent =
                message;


            if (success) {

                rewardsViewMessage.style.color =
                    "#668575";

            } else {

                rewardsViewMessage.style.color =
                    "#9B4D55";
            }
        }


        function updateRewardButtons() {

            if (creditAmount <= 0) {

                payCreditButton.disabled = true;
            }


            if (rewardPoints <= 0) {

                redeemPointsButton.disabled = true;
            }
        }


        payCreditButton.addEventListener(
            "click",
            function () {

                if (creditAmount <= 0) {

                    showRewardsViewMessage(
                        "This customer has no remaining credit.",
                        false
                    );

                    return;
                }


                const confirmed =
                    confirm(
                        "Mark this customer's credit as paid?"
                    );


                if (!confirmed) {

                    showRewardsViewMessage(
                        "Credit payment was cancelled.",
                        false
                    );

                    return;
                }


                creditAmount = 0;

                customerCredit.textContent =
                    "₱0.00";


                showRewardsViewMessage(
                    "Credit was marked as paid successfully.",
                    true
                );


                updateRewardButtons();
            }
        );


        redeemPointsButton.addEventListener(
            "click",
            function () {

                if (rewardPoints <= 0) {

                    showRewardsViewMessage(
                        "This customer has no reward points available.",
                        false
                    );

                    return;
                }


                const confirmed =
                    confirm(
                        "Redeem all " +
                        rewardPoints +
                        " available reward points?"
                    );


                if (!confirmed) {

                    showRewardsViewMessage(
                        "Reward redemption was cancelled.",
                        false
                    );

                    return;
                }


                const redeemedPoints =
                    rewardPoints;

                rewardPoints = 0;

                customerPoints.textContent =
                    "0";


                showRewardsViewMessage(
                    redeemedPoints +
                    " reward points were redeemed successfully.",
                    true
                );


                updateRewardButtons();
            }
        );


        updateRewardButtons();
    }



    // =========================================
    // NOTIFICATIONS PAGE
    // =========================================

    const markAllReadButton =
        document.getElementById(
            "mark-all-read"
        );

    const notificationCards =
        document.querySelectorAll(
            ".notification-card"
        );

    const notificationMessage =
        document.getElementById(
            "notification-message"
        );


    if (
        markAllReadButton &&
        notificationCards.length > 0 &&
        notificationMessage
    ) {

        function showNotificationMessage(
            message
        ) {

            notificationMessage.hidden = false;

            notificationMessage.textContent =
                message;

            notificationMessage.style.color =
                "#668575";
        }


        function markNotificationAsRead(
            card
        ) {

            if (
                !card.classList.contains(
                    "unread"
                )
            ) {

                return false;
            }


            card.classList.remove(
                "unread"
            );


            const notificationDot =
                card.querySelector(
                    ".notification-dot"
                );


            if (notificationDot) {

                notificationDot.remove();
            }


            return true;
        }


        function updateNotificationButton() {

            const unreadNotifications =
                document.querySelectorAll(
                    ".notification-card.unread"
                );


            if (
                unreadNotifications.length === 0
            ) {

                markAllReadButton.textContent =
                    "All notifications read";

                markAllReadButton.disabled = true;

            } else {

                markAllReadButton.textContent =
                    "Mark all as read";

                markAllReadButton.disabled = false;
            }
        }


        notificationCards.forEach(
            function (card) {

                card.addEventListener(
                    "click",
                    function () {

                        const changed =
                            markNotificationAsRead(
                                card
                            );


                        if (!changed) {

                            return;
                        }


                        showNotificationMessage(
                            "Notification marked as read."
                        );


                        updateNotificationButton();
                    }
                );
            }
        );


        markAllReadButton.addEventListener(
            "click",
            function () {

                const unreadNotifications =
                    document.querySelectorAll(
                        ".notification-card.unread"
                    );


                if (
                    unreadNotifications.length === 0
                ) {

                    return;
                }


                unreadNotifications.forEach(
                    function (card) {

                        markNotificationAsRead(
                            card
                        );
                    }
                );


                showNotificationMessage(
                    "All notifications were marked as read."
                );


                updateNotificationButton();
            }
        );


        updateNotificationButton();
    }



     // =========================================
    // SETTINGS - ACCOUNT / PROFILE
    // =========================================

    const profileSettingsForm =
        document.getElementById(
            "profile-settings-form"
        );

    const settingsFullName =
        document.getElementById(
            "settings-full-name"
        );

    const settingsEmail =
        document.getElementById(
            "settings-email"
        );

    const profileSettingsMessage =
        document.getElementById(
            "profile-settings-message"
        );


    if (
        profileSettingsForm &&
        settingsFullName &&
        settingsEmail &&
        profileSettingsMessage
    ) {

        profileSettingsForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                const fullName =
                    settingsFullName.value.trim();

                const email =
                    settingsEmail.value.trim();


                if (
                    fullName === "" ||
                    email === ""
                ) {

                    showProfileSettingsMessage(
                        "Please complete your profile information.",
                        false
                    );

                    return;
                }


                if (fullName.length < 2) {

                    showProfileSettingsMessage(
                        "Please enter a valid full name.",
                        false
                    );

                    return;
                }


                const namePattern =
                    /^[A-Za-z\s'.-]+$/;


                if (!namePattern.test(fullName)) {

                    showProfileSettingsMessage(
                        "Please enter a valid full name.",
                        false
                    );

                    return;
                }


                if (!settingsEmail.checkValidity()) {

                    showProfileSettingsMessage(
                        "Please enter a valid email address.",
                        false
                    );

                    return;
                }


                showProfileSettingsMessage(
                    "Profile changes are valid and ready to save.",
                    true
                );
            }
        );


        function showProfileSettingsMessage(
            message,
            success
        ) {

            profileSettingsMessage.hidden = false;

            profileSettingsMessage.textContent =
                message;


            if (success) {

                profileSettingsMessage.style.color =
                    "#668575";

            } else {

                profileSettingsMessage.style.color =
                    "#9B4D55";
            }
        }
    }



    // =========================================
    // SETTINGS - SYSTEM PREFERENCES
    // =========================================

    const systemPreferencesForm =
        document.getElementById(
            "system-preferences-form"
        );

    const currencySelect =
        document.getElementById("currency");

    const lowStockThreshold =
        document.getElementById(
            "low-stock-threshold"
        );

    const languageSelect =
        document.getElementById("language");

    const systemPreferencesMessage =
        document.getElementById(
            "system-preferences-message"
        );


    if (
        systemPreferencesForm &&
        currencySelect &&
        lowStockThreshold &&
        languageSelect &&
        systemPreferencesMessage
    ) {

        systemPreferencesForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                if (
                    lowStockThreshold.value === ""
                ) {

                    showSystemPreferencesMessage(
                        "Please enter a low stock threshold.",
                        false
                    );

                    return;
                }


                const threshold =
                    Number(
                        lowStockThreshold.value
                    );


                if (
                    !Number.isInteger(threshold) ||
                    threshold < 0
                ) {

                    showSystemPreferencesMessage(
                        "Low stock threshold must be a whole number that is zero or greater.",
                        false
                    );

                    return;
                }


                const selectedCurrency =
                    currencySelect.options[
                        currencySelect.selectedIndex
                    ].text;

                const selectedLanguage =
                    languageSelect.options[
                        languageSelect.selectedIndex
                    ].text;


                showSystemPreferencesMessage(
                    "Preferences saved: " +
                    selectedCurrency +
                    ", " +
                    selectedLanguage +
                    ", low stock threshold " +
                    threshold +
                    ".",
                    true
                );
            }
        );


        function showSystemPreferencesMessage(
            message,
            success
        ) {

            systemPreferencesMessage.hidden = false;

            systemPreferencesMessage.textContent =
                message;


            if (success) {

                systemPreferencesMessage.style.color =
                    "#668575";

            } else {

                systemPreferencesMessage.style.color =
                    "#9B4D55";
            }
        }
    }



    // =========================================
    // SETTINGS - NOTIFICATION PREFERENCES
    // =========================================

    const notificationPreferencesForm =
        document.getElementById(
            "notification-preferences-form"
        );

    const lowStockAlerts =
        document.getElementById(
            "low-stock-alerts"
        );

    const orderNotifications =
        document.getElementById(
            "order-notifications"
        );

    const expirationReminders =
        document.getElementById(
            "expiration-reminders"
        );

    const systemUpdates =
        document.getElementById(
            "system-updates"
        );

    const notificationPreferencesMessage =
        document.getElementById(
            "notification-preferences-message"
        );


    if (
        notificationPreferencesForm &&
        lowStockAlerts &&
        orderNotifications &&
        expirationReminders &&
        systemUpdates &&
        notificationPreferencesMessage
    ) {

        notificationPreferencesForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                let enabledNotifications = 0;


                if (lowStockAlerts.checked) {
                    enabledNotifications++;
                }


                if (orderNotifications.checked) {
                    enabledNotifications++;
                }


                if (expirationReminders.checked) {
                    enabledNotifications++;
                }


                if (systemUpdates.checked) {
                    enabledNotifications++;
                }


                if (enabledNotifications === 0) {

                    showNotificationPreferencesMessage(
                        "Notification preferences saved. All notification types are disabled.",
                        true
                    );

                } else {

                    showNotificationPreferencesMessage(
                        "Notification preferences saved successfully.",
                        true
                    );
                }
            }
        );


        function showNotificationPreferencesMessage(
            message,
            success
        ) {

            notificationPreferencesMessage.hidden =
                false;

            notificationPreferencesMessage.textContent =
                message;


            if (success) {

                notificationPreferencesMessage.style.color =
                    "#668575";

            } else {

                notificationPreferencesMessage.style.color =
                    "#9B4D55";
            }
        }
    }



    // =========================================
    // SETTINGS - SECURITY
    // =========================================

    const passwordSettingsForm =
        document.getElementById(
            "password-settings-form"
        );

    const currentPassword =
        document.getElementById(
            "current-password"
        );

    const newPassword =
        document.getElementById(
            "new-password"
        );

    const confirmPassword =
        document.getElementById(
            "confirm-password"
        );

    const passwordSettingsMessage =
        document.getElementById(
            "password-settings-message"
        );


    if (
        passwordSettingsForm &&
        currentPassword &&
        newPassword &&
        confirmPassword &&
        passwordSettingsMessage
    ) {

        passwordSettingsForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                const currentPasswordValue =
                    currentPassword.value;

                const newPasswordValue =
                    newPassword.value;

                const confirmPasswordValue =
                    confirmPassword.value;


                if (
                    currentPasswordValue === "" ||
                    newPasswordValue === "" ||
                    confirmPasswordValue === ""
                ) {

                    showPasswordSettingsMessage(
                        "Please complete all password fields.",
                        false
                    );

                    return;
                }


                if (newPasswordValue.length < 6) {

                    showPasswordSettingsMessage(
                        "New password must contain at least 6 characters.",
                        false
                    );

                    return;
                }


                if (
                    newPasswordValue !==
                    confirmPasswordValue
                ) {

                    showPasswordSettingsMessage(
                        "New password and confirmation do not match.",
                        false
                    );

                    return;
                }


                if (
                    currentPasswordValue ===
                    newPasswordValue
                ) {

                    showPasswordSettingsMessage(
                        "New password must be different from the current password.",
                        false
                    );

                    return;
                }


                /*
                    DATABASE READY AREA

                    Kapag may backend/database na,
                    dito ive-verify ng server ang
                    current password.

                    Kapag valid, backend din ang
                    magsa-save ng bagong password.

                    Passwords should not be stored
                    directly inside this JavaScript file.
                */


                showPasswordSettingsMessage(
                    "Password information is valid. Database verification will be connected later.",
                    true
                );


                passwordSettingsForm.reset();
            }
        );


        function showPasswordSettingsMessage(
            message,
            success
        ) {

            passwordSettingsMessage.hidden = false;

            passwordSettingsMessage.textContent =
                message;


            if (success) {

                passwordSettingsMessage.style.color =
                    "#668575";

            } else {

                passwordSettingsMessage.style.color =
                    "#9B4D55";
            }
        }
    }


});
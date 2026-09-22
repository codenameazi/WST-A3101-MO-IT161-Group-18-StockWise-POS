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
                        return item.name === productName;
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

                emptyMessage.style.display = "block";
                orderTotal.textContent = "₱0.00";
                selectedProductName = null;

                return;
            }

            emptyMessage.style.display = "none";

            let total = 0;


            order.forEach(function (item) {

                const subtotal =
                    item.price * item.quantity;

                total += subtotal;

                const orderItem =
                    document.createElement("div");

                orderItem.className = "order-item";


                if (item.name === selectedProductName) {
                    orderItem.classList.add("selected");
                }


                orderItem.innerHTML = `
                    <span>
                        ${item.name}
                        <small>x${item.quantity}</small>
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


                    if (selectedProductName === null) {

                        alert(
                            "Select an item from the order list first."
                        );

                        return;
                    }


                    const selectedProduct =
                        order.find(function (item) {

                            return item.name ===
                                selectedProductName;
                        });


                    if (selectedProduct.quantity > 1) {

                        selectedProduct.quantity--;

                    } else {

                        order =
                            order.filter(function (item) {

                                return item.name !==
                                    selectedProductName;
                            });

                        selectedProductName = null;
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

                                button.style.display = "";

                            } else {

                                button.style.display = "none";
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
                    }
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
                    productStatus ===
                        selectedStatus;


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

        // =========================================
        // SAVE CUSTOMER CHANGES
        // =========================================

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


        // =========================================
        // REMOVE CUSTOMER
        // =========================================

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


        // =========================================
        // REWARD EDIT MESSAGE
        // =========================================

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
        document.getElementById("co-order-items");

    const coOrderTotal =
        document.getElementById("co-order-total");

    const paymentButtons =
        document.querySelectorAll(".payment-button");

    const printButton =
        document.getElementById("print-receipt");

    const cancelOrderButton =
        document.getElementById("cancel-order");

    const newOrderButton =
        document.getElementById("new-order");


    if (coOrderItems && coOrderTotal) {

        const savedOrder =
            JSON.parse(
                sessionStorage.getItem("stockwiseOrder")
            ) || [];

        let total = 0;

        coOrderItems.innerHTML = "";


        if (savedOrder.length === 0) {

            coOrderItems.innerHTML =
                "<p>No items in this order.</p>";

        } else {

            savedOrder.forEach(function (item) {

                const subtotal =
                    item.price * item.quantity;

                total += subtotal;

                const row =
                    document.createElement("p");

                row.innerHTML = `
                    <span>${item.name} <small>x${item.quantity}</small></span>
                    <span>₱${subtotal.toFixed(2)}</span>
                `;

                coOrderItems.appendChild(row);
            });
        }


        coOrderTotal.textContent =
            "₱" + total.toFixed(2);
    }


    if (paymentButtons.length > 0) {

        paymentButtons.forEach(function (button) {

            button.addEventListener("click", function () {

                paymentButtons.forEach(function (btn) {
                    btn.classList.remove("selected");
                });

                button.classList.add("selected");
            });
        });
    }


    if (printButton) {

        printButton.addEventListener("click", function () {

            window.print();
        });
    }


    if (cancelOrderButton) {

        cancelOrderButton.addEventListener(
            "click",
            function () {

                const confirmed =
                    confirm(
                        "Are you sure you want to cancel this order?"
                    );

                if (confirmed) {

                    sessionStorage.removeItem(
                        "stockwiseOrder"
                    );

                    window.location.href = "Order.html";
                }
            }
        );
    }


    if (newOrderButton) {

        newOrderButton.addEventListener(
            "click",
            function () {

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
});
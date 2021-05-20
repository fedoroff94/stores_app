// Varibles
let notSelectedBlock = document.getElementById("not-selected");
let currentStoreBlock = document.getElementById("current-store");

let storesInputFilterContainer = document.getElementById("stores-search-id");
let storesInputFilter = document.getElementById("store-filter");

let storesFilterDeleteBtn = document.getElementById("delete-search-text");
let storesFilterSearchBtn = document.getElementById("search");
let storesFilterRefreshBtn = document.getElementById("refresh");

let storesWrapper = document.getElementById("stores-list");
let productsTable = document.getElementById("products-list");
let storeInfoContainer = document.getElementById("store-info");

let stores = document.getElementsByClassName("js-selected-store");

let productsInputFilterContainer = document.getElementById("product-search-id");
let productsInputFilter = document.getElementById("product-filter");

let productsFilterDeleteBtn = document.getElementById("delete-product-filter-id");
let productsFilterSearchBtn = document.getElementById("search-product-filter-id");
let productsFilterRefreshBtn = document.getElementById("refresh-product-filter-id");

let newStoreOptionsWindow = document.getElementById("new-store-window");
let createNewStoreBtn = document.getElementById("create-new-store");
let cancelNewStoreCreationBtn = document.getElementById("cancel-new-store-creation");
let createNewStoreBtnConfirm = document.getElementById("create-store-btn");

let newProductOptionsWindow = document.getElementById("new-product-window");
let createNewProductBtn = document.getElementById("create-new-product");
let cancelNewProductCreationBtn = document.getElementById("cancel-new-product-creation");

let deleteProductConfirmWindow = document.getElementById("delete-product-confirm-window-wrapper");
let cancelProductDeleteBtn = document.getElementById("cancel-product-btn-confirm");

let deleteStoreConfirmWindow = document.getElementById("delete-store-confirm-window-wrapper");
let cancelStoreDeleteBtn = document.getElementById("cancel-store-btn-confirm");
let deleteCurrentStoreBtn = document.getElementById("store-button-delete");
let deleteCurrentStoreBtnConfirm = document.getElementById("delete-store-btn-confirm");

let newStoreName = document.getElementById("new-store-name");
let newStoreEmail = document.getElementById("new-store-email");
let newStorePhone = document.getElementById("new-store-phone");
let newStoreAddress = document.getElementById("new-store-address");
let newStoreEstablished = document.getElementById("new-store-established");
let newStoreArea = document.getElementById("new-store-area");

//Create html template for each store from Stores
let createStore = (rawStore) => {

    const { Name, Address, FloorArea, Email, PhoneNumber, Established, id } = rawStore;

    let div = document.createElement("div");
    div.classList.add("store-item");

    div.addEventListener('click', (e) => {
        getCurrentStoreProducts(id)
        addActiveStoreClass(e);
        drawStoreTitle(rawStore);
    })

    div.innerHTML = `
                <div class="store-item-info">
                    <div class="store-item-name">${Name}</div>
                        <div>
                            <div class="store-item-area">${FloorArea}</div>
                            <div class="store-item-unit">sq.m</div>
                        </div>
                    </div>
                <div class='store-item-address'>${Address}</div>`;

    return div;
};

//Draw stores using created templates
let drawStores = (stores) => {
    storesWrapper.innerHTML = "";
    stores.forEach(rawStore => {
        let store = createStore(rawStore);
        storesWrapper.appendChild(store);
    })

}

//Create product raiting
let createRaiting = (Raiting) => {
    let activeStars = Raiting;
    let raitingList = [];

    for (let i = 0; i < 5; i++) {
        if (activeStars > 0) {
            raitingList.push(`<span class="active"></span>`);
            activeStars--;
        } else {
            raitingList.push(`<span></span>`);
        }
    }
    return raitingList;
}

//Create html products template
let createProduct = (rawProduct) => {

    const { Name, Price, Specs, SupplierInfo, MadeIn, ProductionCompanyName, Rating } = rawProduct;
    let raitingList = createRaiting(Rating);

    return `
        <tr class="table-row-product">
            <td class="product-name">
                <div><b>${Name}</b></div>
            </td>
            <td class="product-price"><b>${Price}</b> USD</td>
            <td class="product-specs hide-long-text" title="${Specs}">
                ${Specs}</td>
            <td class="product-sup-info hide-long-text" title="${SupplierInfo}">
                ${SupplierInfo}</td>
            <td class="product-country hide-long-text">${MadeIn}</td>
            <td class="product-company hide-long-text">${ProductionCompanyName}</td>
            <td class="product-raiting">
                <div class="raiting-container">
                    <div class="raiting-mini">
                        ${raitingList}
                    </div>                
                    <div class="arrow">
                    </div>
                    <div class="delete-product" id="delete-product-btn">
                    </div>
                </div>
            </td>
        </tr>`;

};

//Draw products using created templates
let drawProducts = (products) => {

    let productsList = products.map(rawProduct => {
        const product = createProduct(rawProduct);
        return product;
    })

    productsTable.innerHTML = productsList.join("");

    let deleteProductBtns = document.getElementsByClassName("delete-product");

    for (deleteProductBtn of deleteProductBtns) {
        deleteProductBtn.addEventListener("click", () => {
            showDeleteProductConfirmWindow();
        })
    }

    notSelectedBlock.style.display = "none";
    currentStoreBlock.style.display = "block";

    let productsCounter = [products.length, 0, 0, 0];

    for (let product of products) {
        switch (product.Status) {
            case "OK":
                productsCounter[1]++;
                break;
            case "OUT_OF_STOCK":
                productsCounter[2]++;
                break;
            case "STORAGE":
                productsCounter[3]++;
        }
    }

    createProductsStatuses(productsCounter);

    if (products.length === 0) {
        productsTable.innerHTML = `
                                    <tr class="empty-store-products-list">
                                        <td class="empty-store-products-list-col">
                                            There is no products in this store...
                                        </td>
                                    </tr>`;
        return
    }

}

let createProductsStatuses = ([total, ok, outOfStock, storage]) => {

    let storeFilter = document.getElementById("products-statuses");

    storeFilter.innerHTML = `
                            <div class="products-amount-container filter" id="products-amount">
                                <div class="products-amount">${total}</div>
                                <div class="products-amount-all">All</div>
                            </div>

                            <div class="ok-status-container" id="products-ok-status">
                                <div class="ok-status-amount">${ok}
                                    <div class="ok-status-figure filter">
                                    <div class="ok-status-svg"></div>
                                </div>
                            </div>
                                <div class="ok-status">Ok</div>
                            </div>

                            <div class="storage-status-container" id="products-storage-status">
                            <div class="storage-status-amount">${storage}
                                <div class="storage-status-figure filter">
                                    <div class="storage-status-svg"></div>
                                </div>
                            </div>
                            <div class="storage-status">Storage</div>
                            </div>

                            <div class="out-status-container" id="products-out-status">
                            <div class="out-status-amount">${outOfStock}
                                <div class="out-status-figure filter">
                                    <div class="out-status-svg"></div>
                                </div>
                            </div>
                            <div class="out-status">Out of stock</div>
                            </div>
                            `

    let productsOkStatus = serverProducts.filter(product => product.Status === "OK");
    let productsStorageStatus = serverProducts.filter(product => product.Status === "STORAGE");
    let productsOutStatus = serverProducts.filter(product => product.Status === "OUT_OF_STOCK");

    let amountProductsFilter = document.getElementById("products-amount");
    let okProductsFilter = document.getElementById("products-ok-status");
    let storageProductsFilter = document.getElementById("products-storage-status");
    let outProductsFilter = document.getElementById("products-out-status");

    amountProductsFilter.addEventListener("click", () => {
        drawProducts(serverProducts);
    })

    okProductsFilter.addEventListener("click", () => {
        drawProducts(productsOkStatus);
    })

    storageProductsFilter.addEventListener("click", () => {
        drawProducts(productsStorageStatus);
    })

    outProductsFilter.addEventListener("click", () => {
        drawProducts(productsOutStatus);
    })

    let productsFilters = document.querySelectorAll(".filter");

    let addClassToSelectedProductsFilter = (e) => {
        for (productsFilter of productsFilters) {
            productsFilter.classList.remove("choosen-filter");
        }
        e.currentTarget.classList.add("choosen-filter");
    }

    for (filter of productsFilters) {
        filter.addEventListener("click", (e) => {
            addClassToSelectedProductsFilter(e);
        })
    }
}

//Add active class to store
let addActiveStoreClass = (e) => {
    for (store of stores) {
        store.classList.remove("js-selected-store")
    }
    e.currentTarget.classList.add("js-selected-store")

}

//Create html title-template for each store from Stores
let createStoreTitle = (rawStore) => {
    const { Email, PhoneNumber, Address, Established, FloorArea, id } = rawStore;

    deleteCurrentStoreBtnConfirm.addEventListener("click", () => {
        deleteCurrentStore(id);
        cancelStoreDeleting();
        drawStores(serverStores);
    })

    return `<div class="first-info-block">
                <div><b>Email:</b> ${Email}</div>
                <div><b>Phone Number:</b> ${PhoneNumber}</div>
                <div><b>Address:</b> ${Address}</div>
            </div>

            <div class="second-info-block">
                <div><b>Established Date:</b> ${Established}</div>
                <div><b>Floor Area:</b> ${FloorArea}</div>
            </div>`;
}

let drawStoreTitle = (rawStore) => {

    let storeTitle = createStoreTitle(rawStore);

    storeInfoContainer.innerHTML = storeTitle;
}

let filterStores = () => {
    let filteredStores = serverStores;

    if (storesInputFilter.value && storesInputFilter.value.length) {
        filteredStores = serverStores.filter(({ Name, Address, FloorArea }) => {
            return Name.toLowerCase().includes(storesInputFilter.value.toLowerCase())
                || Address.toLowerCase().includes(storesInputFilter.value.toLowerCase())
                || String(FloorArea).includes(storesInputFilter.value);
        })
    }

    if (filteredStores.length === 0) {
        storesWrapper.innerHTML = `
                                    <div class="empty-store-list">
                                            There is no such store...
                                    </div>`;
        return
    }

    drawStores(filteredStores);
};

let filterProducts = () => {

    let filteredProducts = serverProducts;

    if (productsInputFilter.value && productsInputFilter.value.length) {

        filteredProducts = serverProducts.filter(({ Name, Specs, Price, SupplierInfo, MadeIn,
            ProductionCompanyName, Raiting }) => {
            return Name.toLowerCase().includes(productsInputFilter.value.toLowerCase())
                || Specs.toLowerCase().includes(productsInputFilter.value.toLowerCase())
                || String(Price).includes(productsInputFilter.value)
                || String(Raiting).includes(productsInputFilter.value)
                || SupplierInfo.toLowerCase().includes(productsInputFilter.value.toLowerCase())
                || MadeIn.toLowerCase().includes(productsInputFilter.value.toLowerCase())
                || ProductionCompanyName.toLowerCase().includes(productsInputFilter.value.toLowerCase());
        })

    }

    if (filteredProducts.length === 0) {
        productsTable.innerHTML = `
                                    <tr>
                                        <td>
                                            There is no such product in this store...
                                        </td>
                                    </tr>`;
        return
    }

    drawProducts(filteredProducts);

};

// Stores filter events
let deleteSearchStoreText = () => {

    if (storesInputFilter.value.length != 0) {
        storesInputFilter.value = "";
    }

    drawStores(serverStores);

    notSelectedBlock.style.display = "block";
    currentStoreBlock.style.display = "none";
}

let hideDeleteBtnStoreFilter = () => {
    storesFilterDeleteBtn.style.display = "none";
}

let showDeleteBtnStoreFilter = () => {
    storesFilterDeleteBtn.style.display = "block";
}

let hideRefreshBtnStoreFilter = () => {
    storesFilterRefreshBtn.style.display = "none";
}

let showRefreshBtnStoreFilter = () => {
    storesFilterRefreshBtn.style.display = "block";
}

storesFilterSearchBtn.addEventListener("click", () => {
    filterStores();
});

storesInputFilter.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        filterStores();
    }
});

storesInputFilter.addEventListener("focus", () => {
    hideRefreshBtnStoreFilter();
})

storesFilterDeleteBtn.addEventListener("click", () => {
    hideDeleteBtnStoreFilter();
    deleteSearchStoreText();
})

storesInputFilter.addEventListener("keydown", (e) => {
    if (e.key === "Backspace") {
        hideDeleteBtnStoreFilter();
        deleteSearchStoreText();
        drawStores(serverStores);
    }
});

storesInputFilter.addEventListener("keydown", () => {
    showDeleteBtnStoreFilter();
})

// Products filter events
let deleteSearchProductsText = () => {

    if (productsInputFilter.value.length != 0) {
        productsInputFilter.value = "";
    }

    drawProducts(serverProducts);

}

let hideDeleteBtnProductsFilter = () => {
    productsFilterDeleteBtn.style.display = "none";
}

let showDeleteBtnProductsFilter = () => {
    productsFilterDeleteBtn.style.display = "block";
}

let hideRefreshBtnProductsFilter = () => {
    productsFilterRefreshBtn.style.display = "none";
}

let showRefreshBtnProductsFilter = () => {
    productsFilterRefreshBtn.style.display = "block";
}

productsFilterSearchBtn.addEventListener("click", () => {
    filterProducts();
});

productsInputFilter.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        filterProducts();
    }
});

productsInputFilter.addEventListener("focus", () => {
    hideRefreshBtnProductsFilter();
})

productsFilterDeleteBtn.addEventListener("click", () => {
    hideDeleteBtnProductsFilter();
    deleteSearchProductsText();
})

productsInputFilter.addEventListener("keydown", (e) => {
    if (e.key === "Backspace") {
        hideDeleteBtnProductsFilter();
        deleteSearchProductsText();
        drawProducts(serverProducts);
    }
});

productsInputFilter.addEventListener("keydown", () => {
    showDeleteBtnProductsFilter();
})

//Sort box
let sortBtns = document.querySelectorAll(".sort-btn");

let toggleSortMode = (() => {

    let sortImgURL = "./assets/sort.svg";
    let sortUpImgURL = "./assets/sort-up.svg";
    let sortDownImgURL = "./assets/sort-down.svg";

    let sortModeArr = [sortImgURL, sortUpImgURL, sortDownImgURL];
    let sortImgIndex = 0;

    let handler = function (sortBtn) {
        sortImgIndex++; sortImgIndex %= sortModeArr.length;
        sortBtn.style.backgroundImage = `url(${sortModeArr[sortImgIndex]})`;
    }
    return handler;
})();

sortBtns.forEach(sortBtn => {

    let columnName = sortBtn.dataset.column;

    sortBtn.addEventListener("click", () => {
        toggleSortMode(sortBtn);
        sortProductsByColumn(columnName);
    })
})

let sortProductsByColumn = (() => {

    let ascSort = function (a, b) {
        if (typeof a[columnName] === "number") {
            return a[columnName] - b[columnName]
        } else {
            return a[columnName].localeCompare(b[columnName])
        }
    };

    let descSort = function (a, b) {
        if (typeof a[columnName] === "number") {
            return b[columnName] - a[columnName];
        } else {
            return b[columnName].localeCompare(a[columnName])
        }
    };

    let defaultSort = 0;
    let sortModeArr = [defaultSort, ascSort, descSort];
    let currentSortIndex = 0;

    let handler = function (columnName) {

        let apiProducts = serverProducts.slice();

        currentSortIndex++; currentSortIndex %= sortModeArr.length;

        let sortFunction = sortModeArr[currentSortIndex](columnName)

        apiProducts = !currentSortIndex ? apiProducts : apiProducts.sort(sortFunction);

        drawProducts(apiProducts);
    }

    return handler;

})();

// API
let baseURL = "http://localhost:3000/api/";


// Get all stores from server
let serverStores;

let getStores = (url) => {
    fetch(url)
        .then(response => response.json())
        .then(apiStores => {
            serverStores = apiStores;
            drawStores(apiStores);
        })
        .catch(error => {
            throw new Error(`Something goes wrong: ${error}`);
        })
}

getStores(`${baseURL}Stores?access_token=fef`);

//Get all products from server
let serverProducts;

let getCurrentStoreProducts = (id) => {
    fetch(`${baseURL}Stores/${id}/rel_Products?access_token=fef`)
        .then(response => response.json())
        .then(apiProducts => {
            serverProducts = apiProducts;
            drawProducts(apiProducts)
        })
        .catch(error => {
            throw new Error(`Something goes wrong: ${error}`);
        })
}

//Delete current store from server
let deleteCurrentStore = (id) => {
    fetch(`${baseURL}Stores/${id}?access_token=fef`, {
        method: "DELETE",
        body: id
    })
        .then(response => {
            response.json()
        })
        .catch(error => {
            throw new Error(`Something goes wrong: ${error}`);
        })
}

//Post store to the server 

let createNewStore = () => {

    let newStore = {
        Name: newStoreName.value,
        Email: newStoreEmail.value,
        PhoneNumber: newStorePhone.value,
        Address: newStoreAddress.value,
        Established: newStoreEstablished.value,
        FloorArea: Number(newStoreArea.value)
    }

    console.log(newStore);

    fetch(`${baseURL}Stores?access_token=fef`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
          },
        body: JSON.stringify(newStore)
    })
        .then(response => {
            response.json();
        })
        .catch(error => {
            throw new Error(`Something goes wrong: ${error}`);
        })
}

let showNewStoreOptionsWindow = () => {
    newStoreOptionsWindow.classList.add("display-flex");
}

let hideNewStoreOptionsWindow = () => {
    newStoreOptionsWindow.classList.remove("display-flex");
}

createNewStoreBtn.addEventListener("click", () => {
    showNewStoreOptionsWindow();
});

cancelNewStoreCreationBtn.addEventListener("click", () => {
    hideNewStoreOptionsWindow();
    refreshNewStoreInputs();
});

let showNewProductOptionsWindow = () => {
    newProductOptionsWindow.classList.add("display-flex");
}

let hideNewProductOptionsWindow = () => {
    newProductOptionsWindow.classList.remove("display-flex");
}

createNewProductBtn.addEventListener("click", () => {
    showNewProductOptionsWindow();
});

cancelNewProductCreationBtn.addEventListener("click", () => {
    hideNewProductOptionsWindow();
});

let showDeleteProductConfirmWindow = () => {
    deleteProductConfirmWindow.style.display = "flex";
}

let cancelProductDeleting = () => {
    deleteProductConfirmWindow.style.display = "none";
}

cancelProductDeleteBtn.addEventListener("click", () => {
    cancelProductDeleting();
})

let showDeleteStoreConfirmWindow = () => {
    deleteStoreConfirmWindow.style.display = "flex";
}

let cancelStoreDeleting = () => {
    deleteStoreConfirmWindow.style.display = "none";
}

deleteCurrentStoreBtn.addEventListener("click", () => {
    showDeleteStoreConfirmWindow();
})

cancelStoreDeleteBtn.addEventListener("click", () => {
    cancelStoreDeleting();
})

let refreshNewStoreInputs = () => {
    newStoreName.value = "";
    newStoreEmail.value = "";
    newStorePhone.value = "";
    newStoreAddress.value = "";
    newStoreEstablished.value = "";
    newStoreArea.value = "";
}

createNewStoreBtnConfirm.addEventListener("click", () => {
    createNewStore(); 
    refreshNewStoreInputs();
    hideNewStoreOptionsWindow();
    drawStores(serverStores);
})

import { menuArray } from "./data.js";
const cartArray = []

function renderMenu() {
    let menuHTML = ``
    menuArray.forEach(function(item){
        let {name, ingredients, price, emoji, id} = item
        menuHTML += `<div class="menu-item">
                        <div class="menu-item-container">
                            <div class="item-sub-container">
                                <div class="emoji-container"><h1 class="item-emoji">${emoji}</h1></div>
                                <div class="item-description">
                                    <h1>${name}</h1>
                                    <p>${ingredients.join(", ")}</p>
                                    <h2>$${price}</h2>
                                </div>
                            </div>
                            <button class="item-add-btn" data-add-item="${id}">+</button>
                        </div>
                    </div>`
    })
    document.getElementById("menu").innerHTML = menuHTML
}

renderMenu()

document.addEventListener("click", function(e){
    if(e.target.dataset.addItem) {
        addItem(e.target.dataset.addItem)
    }
    if(e.target.dataset.removeItem) {
        removeItem(e.target.dataset.removeItem)
    }
    if(e.target.id === "order-btn") {
        showPaymentModal()
    }
    if(e.target.id === "submit-btn") {
        confirmOrder(e)
    }
})

function addItem(itemID) {
    itemID = Number(itemID)
    if(cartArray.length != 0) {
        let itemFound = false
        cartArray.forEach(function(cartItem) {
            if(cartItem.id === itemID) {
                cartItem.count += 1
                itemFound = true
            }
        })
        if(!itemFound) {
            cartArray.push({id: itemID, count: 1})
        }
    }
    else {
        cartArray.push({id: itemID, count: 1})
    }
    renderOrder()
}

function renderOrder() {
    let total = 0
    let orderHTML = `<div class="order-title"><h1>Your order</h1></div><div class="order-container">`
    cartArray.forEach(function(cartItem){
        let itemObj = menuArray.filter(function(itemData){
            return cartItem.id === itemData.id
        })[0]
        orderHTML += `<div class="order-sub-container">
                        <div class="order-details">
                            <h1>${itemObj.name}</h1>
                            <button class="remove-btn" data-remove-item="${itemObj.id}">remove</button>
                        </div>
                        <div class="order-amount">
                            <h1>$${itemObj.price} x ${cartItem.count} - $${itemObj.price * cartItem.count}</h1>
                        </div>
                    </div>`
        total += itemObj.price * cartItem.count
    })
    orderHTML += `</div>
                <div class="total-container">
                    <div class="total-details">
                        <h1>Total price:</h1>
                    </div>
                    <div class="total-amount">
                        <h1>$${total}</h1>
                    </div>
                </div>
                <button class="order-btn" id="order-btn">Complete order</button>`
    document.getElementById("order").innerHTML = orderHTML
}

function removeItem(itemID) {
    itemID = Number(itemID)
    let delIndex
    cartArray.forEach(function(cartItem, index) {
        if(cartItem.id === itemID && cartItem.count > 1) {
            cartItem.count -= 1
        }
        else if(cartItem.id === itemID && cartItem.count <= 1) {
            delIndex = index
        }
    })
    delIndex ? cartArray.splice(delIndex, 1) : delIndex===0?cartArray.splice(delIndex, 1):null
    cartArray.length != 0 ? renderOrder() : document.getElementById("order").innerHTML = ``
}

function showPaymentModal() {
    document.getElementById("payment-modal").classList.toggle("hidden")
}

function confirmOrder(e) {
    e.preventDefault()
    let paymentForm = document.getElementById("payment-details")
    let paymentFormData = new FormData(paymentForm)
    let cardName = paymentFormData.get("cardName")
    document.getElementById("payment-modal").classList.toggle("hidden")
    document.getElementById("order").innerHTML = `<h1 class="confirm-order">Thanks, ${cardName} Your order is on its way!</h1>`
    paymentForm.reset()
}
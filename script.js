const ul = document.querySelector("ul");
const buyingItems = document.querySelector('.buying-items');
const total = document.querySelector('.total')
const checkOut = document.querySelector('#checkOut');
const productsInfo = document.querySelector('#productsInfo');

productsInfo.addEventListener('submit',(e)=>{
    e.preventDefault()
    let id = parseInt(productsInfo.elements[0].value);
    let pName = productsInfo.elements[1].value;
    let price = parseFloat(productsInfo.elements[2].value);
    
    if(id === NaN || pName === '' || price === NaN) return console.log('yes');
    productsInfo.elements[0].value=''
    productsInfo.elements[1].value=''
    productsInfo.elements[2].value=''
    let newProduct ={
        id : id,
        pName:pName,
        price: price,
    }
    
    products.push(newProduct)
    displayingProduct()
    localStorage.setItem('allProducts',JSON.stringify(products))
    
})
let products =  JSON.parse(localStorage.getItem('allProducts')) || [
    {id:1 , pName:"product-1",price:29.99},
    {id:2 , pName:"product-2",price:18.99},
    {id:3 , pName:"product-3",price:59.99},
    {id:4 , pName:"product-4",price:12.99353},
];

//retrive data from localstorage if cart is empty
let cart =JSON.parse(localStorage.getItem('allItems')) || []

//displaying the products
function displayingProduct() {
    ul.textContent  =``
    products.forEach((product)=>{
        const productList = document.createElement('li')
        const price= Number(product.price).toFixed(2);
        
        productList.innerHTML=`
            <span> ${product.pName} - $${price} </span> 
            <button data-id = '${product.id}'>Add to Cart</button>
        `
        ul.appendChild(productList)
    });
}
displayingProduct()
//add click event listener ot add to cart button 
ul.addEventListener('click',(e)=>{
        
        if(e.target.tagName === 'BUTTON'){
            const productId =  parseInt(e.target.getAttribute('data-id'))
            const product = products.find(p => p.id === productId);
            const uniqueId = Date.now();

        // Adding UID to the product =>to the copy of object (to avoid mutating the original)
        const productWithUid = {
            ...product,
            uid: uniqueId // Adding a unique ID based on current timestamp
        };
        checkOut.style.display = 'block';
        addToCart(productWithUid); // Use product with the UID added
        localStorage.setItem('allItems',JSON.stringify(cart))

        displayBuyingItems();
        }   
})

//creating an array to store the added product data
function addToCart(productWithUid){
    cart.push(productWithUid)
}


// function to display the added items
function displayBuyingItems() {
    buyingItems.innerHTML = ``  
    let totalPrice = 0;
    if (cart.length === 0) {
        emptyCart()
    }
    cart.forEach((item)=>{
        totalPrice+= Number(item.price);
        
        const li = document.createElement('li');
        const price= Number(item.price).toFixed(2);
        li.innerHTML=`${item.pName} - $${price} <input class='check-box' type= 'checkbox' checked='true'>`
        // li.innerHTML=`${item.pName} - $${item.price} <input type="button" value="remove">`
        buyingItems.appendChild(li);
        total.textContent = `Total Price : $${totalPrice.toFixed(2)}`
        const input = li.querySelector('input')
        input.addEventListener('change',()=>{
            removeItem(item.uid)
        });
    });
    
};

// function to remove the item from added cart list and localstorage 
function removeItem(uid) {
    let storedData = JSON.parse(localStorage.getItem('allItems'));

    // Filter out the item with the matching UID
    storedData = storedData.filter(item => item.uid !== uid);

    // Update localStorage with the remaining items
    localStorage.setItem('allItems', JSON.stringify(storedData));
    cart = storedData
    window.onload();
}

//event listener to checkout button 
checkOut.addEventListener('click',()=>{
    cart = [];
    emptyCart()
    localStorage.removeItem('allItems')
    checkOut.style.display="none"
    alert(`thank for checking Out`)
})

//function to display empty cart 
function emptyCart() {
    total.textContent =`Total Price : $0.00`
    buyingItems.innerHTML = `No product has been added to Checkout list !`
    checkOut.style.display = 'none'
}

window.onload = function () {
    // Retrieve data from localStorage
    const storedData = JSON.parse(localStorage.getItem('allItems'));
    
    buyingItems.innerHTML = '';  
    
    let totalPrice = 0;

    // Ensure storedData exists and is an array
    if (Array.isArray(storedData) && storedData.length > 0) {
        storedData.forEach((item) => {
            totalPrice += item.price;

            const li = document.createElement('li');
            const price= Number(item.price).toFixed(2);
            li.innerHTML = `${item.pName} - $${price} <input class='check-box' type='checkbox' checked='true'>`;
            buyingItems.appendChild(li);
            checkOut.style.display = 'block';

            const input = li.querySelector('input');
            input.addEventListener('change', () => {
                if (!input.checked) {
                    removeItem(item.uid); // Remove item if unchecked
                }
            });
        });
    } else {
        emptyCart();
    }
    console.log(typeof totalPrice);
    
    total.textContent = `Total Price : $${totalPrice.toFixed(2)}`;

    // If no items in cart, show empty cart message
    if (storedData && storedData.length === 0) {
        emptyCart();
    }
};


let nameForm = document.querySelector("#name_form");
let userName = document.querySelector(".user_name");
let user = document.querySelector(".user");
let UserName = document.querySelector(".User_Name");
let exit = document.querySelector("#exit");
let main = document.querySelector("main");
let password = document.querySelector("#password");

let currentUser = localStorage.getItem('currentUser');
if (currentUser) {
    userInfo(currentUser);
}

function exitPopup() {
    localStorage.removeItem('currentUser');
    user.innerHTML = `<img src="https://cdn-icons-png.flaticon.com/128/6325/6325109.png" width="40px" height="40px" alt=""> user`;
    UserName.style.display = "flex";
    exit.style.display = "none";
    main.style.display = "none";
}

function userInfo(name) {
    user.innerHTML = `<img src="https://cdn-icons-png.flaticon.com/128/6325/6325109.png" width="40px" height="40px" alt=""> ${name}`;
    UserName.style.display = "none";
    exit.style.display = "block";
    main.style.display = "block";
    exit.addEventListener("click", exitPopup);
}

nameForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = userName.value.trim();
    const password = nameForm.elements[1].value.trim();
    const existingUsers = JSON.parse(localStorage.getItem('userLogged')) || [];

    const userExists = existingUsers.find(user => user.name === name && user.password === password);

    if (userExists) {
        userInfo(userExists.name);
        localStorage.setItem('currentUser', userExists.name);
    } else {
        let newUser = { name, password };
        existingUsers.push(newUser);
        localStorage.setItem("userLogged", JSON.stringify(existingUsers));
        userInfo(name);
        localStorage.setItem('currentUser', name);
    }

    userName.value = "";
    nameForm.elements[1].value = "";
});

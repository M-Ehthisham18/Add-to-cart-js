const ul = document.querySelector("ul");
const buyingItems = document.querySelector('.buying-items');
const total = document.querySelector('.total')
const checkOut = document.querySelector('#checkOut');
const form = document.querySelector('form');

form.addEventListener('submit',(e)=>{
    e.preventDefault()
    let id = parseInt(form.elements[0].value);
    let pName = form.elements[1].value;
    let price = parseFloat(form.elements[2].value);
    form.elements[0].value=''
    form.elements[1].value=''
    form.elements[2].value=''
    console.log("yess");
    let newProduct ={
        id : id,
        pName:pName,
        price: price,
    }
    console.log(typeof newProduct.price);
    
    products.push(newProduct)
    displayingProduct()
    localStorage.setItem('allProducts',JSON.stringify(products))
    console.log(products);
    
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
        productList.innerHTML=`
            <span> ${product.pName} - $${product.price.toFixed(2)} </span> 
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
        totalPrice+= item.price;
        
        const li = document.createElement('li');
        li.innerHTML=`${item.pName} - $${item.price} <input class='check-box' type= 'checkbox' checked='true'>`
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
            li.innerHTML = `${item.pName} - $${item.price.toFixed(2)} <input class='check-box' type='checkbox' checked='true'>`;
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

    total.textContent = `Total Price : $${totalPrice.toFixed(2)}`;

    // If no items in cart, show empty cart message
    if (storedData && storedData.length === 0) {
        emptyCart();
    }
};



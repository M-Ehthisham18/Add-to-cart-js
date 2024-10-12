const ul = document.querySelector("ul");
const buyingItems = document.querySelector('.buying-items');
const total = document.querySelector('.total')
const checkOut = document.querySelector('#checkOut');

let products = [
    {id:1 , pName:"product-1",price:29.99},
    {id:2 , pName:"product-2",price:18.99},
    {id:3 , pName:"product-3",price:59.99},
    {id:4 , pName:"product-4",price:12.99353},
    
];

//displaying the products
products.forEach((product)=>{
    const productList = document.createElement('li')
    productList.innerHTML=`
        <span> ${product.pName} - $${product.price.toFixed(2)} </span> 
        <button data-id = '${product.id}'>Add to Cart</button>
    `
    ul.appendChild(productList)
});

//add click event listener ot add to cart button 
ul.addEventListener('click',(e)=>{
    if(e.target.tagName === 'BUTTON'){
        const productId =  parseInt(e.target.getAttribute('data-id'))
        const product = products.find(p => p.id === productId);
        checkOut.style.display = 'block'
        addToCart(product);
        displayBuyingItems();
    }    
})

//creating an array to store the added product data
let cart = []
function addToCart(product){
    cart.push(product)
}

// function to display the added items
function displayBuyingItems() {
    buyingItems.innerHTML = ``  
    let totalPrice = 0;
    cart.forEach((item)=>{
        totalPrice+= item.price;
        
        const li = document.createElement('li');
        li.innerHTML=`${item.pName} - $${item.price} <input class='check-box' type= 'checkbox' checked='true'>`
        buyingItems.appendChild(li);
        total.textContent = `Total Price : $${totalPrice.toFixed(2)}`
        const input = li.querySelector('input')
        li.addEventListener('change',(e)=>{
            // console.log(e.target);
            // removeItem(e.target)
            removeItem(item.id)
        });
    });
    if (cart.length === 0) {
        emptyCart()
    }
};

// function to remove the item to added cart list 
function removeItem(params) {
    cart =cart.filter( r => r.id !== params)
    displayBuyingItems()
}

//event listener to checkout button 
checkOut.addEventListener('click',()=>{
    cart = [];
    emptyCart()
    alert(`thank for checking Out`)
})

//function to display empty cart 
function emptyCart() {
    total.textContent =`Total Price : $0.00`
    buyingItems.innerHTML = `No product has been added to Checkout list !`
    checkOut.style.display = 'none'
}
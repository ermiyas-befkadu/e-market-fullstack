let card_value;
let cart_items;
let limit=5;
let offset=0;
const errorBox=document.getElementById("errorBox");
const moreButton=document.getElementById("moreButton");
let isClickable=true;
async function fetchCart(){
  const data=await fetch("/api/cart",{
    method:"post",
    headers:{"content-Type":"application/json"},
    body:JSON.stringify({
      limit:limit,
      offset:offset
    })
  })
   cart_items= await data.json();
if (data.status===200){
   for (let i=0;i<cart_items.cart.length;i++){
 card_creater(i);
 };
 if(cart_items.cart.length<limit){
  moreButton.disabled=true;
  moreButton.textContent='no more items';
  moreButton.style.cursor='not-allowed';
  return
 };
 isClickable=true;
 moreButton.disabled=false;
}
else if(data.status===404 || data.status===401){
  errorBox.textContent=await data.json();
  errorBox.style.background='var(--clr-error)';
  errorBox.style.display='block';
  setTimeout(() => {errorBox.style.display='none'}, 2500);
}

}
fetchCart(limit,offset);
moreButton.addEventListener('click',()=>{
    if(!isClickable){return;}
    limit =limit;
    offset+=limit;
    moreButton.disabled=true;
    fetchCart (limit,offset);
});



    function card_creater(i){
    const quantity=document.createElement('span');
    quantity.className='quantity';
    quantity.textContent=cart_items.cart[i].quantity; 
    quantity.title=`quantity in your cart: ${cart_items.cart[i].quantity}`
    const item_image_container= document.createElement('div');
    item_image_container.className='item-img-container';

    const image = document.createElement('img');
    image.className='item-img';
     image.src=`${cart_items.products[i].image}`;

    item_image_container.appendChild(image);

    const product_name =document.createElement('h2');
    product_name.className='product-name';
    product_name.innerText=`${cart_items.products[i].name}`;

    const product_description=document.createElement('p');
    product_description.className='product-description';
    product_description.innerText=`${cart_items.products[i].description}`;
    const currency_type=document.createElement('div');
    currency_type.className='currency-type';
    currency_type.innerText=`${cart_items.products[i].currencytype} `;
    const product_price=document.createElement('span');
    currency_type.appendChild(product_price)
    product_price.className='product-price';
    product_price.innerText=`${cart_items.products[i].price}`;

    const remove_from_cart_button=document.createElement('button');
    remove_from_cart_button.className='remove-from-cart-button';

    const material_symbol_outlined=document.createElement('span');
    material_symbol_outlined.className='material-symbols-outlined';
    remove_from_cart_button.appendChild(material_symbol_outlined);
    material_symbol_outlined.innerText='add_shopping_cart';
    const buy_btn=document.createElement('button');
    buy_btn.className='buy-button';
    buy_btn.textContent='BUY';

    const product_card= document.createElement('div');
    product_card.classList.add('product-card');
    product_card.value=`${cart_items.products[i].id}`;
    product_card.name=cart_items.cart[i].id
    product_card.classList.add(`product-card-no${cart_items.cart[i].id}`)
    card_value=product_card.value;

    product_card.appendChild(quantity);
    product_card.appendChild(item_image_container);
    product_card.appendChild(product_name);
    product_card.appendChild(product_description);
    product_card.appendChild(currency_type);
    product_card.appendChild(remove_from_cart_button);
    product_card.appendChild(buy_btn);
    const products_list=document.querySelector('.products-list');

    products_list.appendChild(product_card);
    product_card.addEventListener('click',redirecter);
    function redirecter(){
    location.href=`./product-detail.html?item_id=${product_card.value}`;}
    remove_from_cart_button.addEventListener('click',(event)=>{
      event.stopPropagation();
      remover(product_card.name);
    });
    buy_btn.addEventListener("click",async(e)=>{
      e.stopPropagation();
    buy_btn.disabled=true;
    buy_btn.style.cursor='not-allowed';
    await buyFunction(cart_items.products[i].id,cart_items.cart[i].quantity,cart_items.products[i].price);
    buy_btn.disabled=false;
    buy_btn.style.cursor='default';
    })
    }
    const search_input= document.querySelector('.search-input');

 let search_input_value =search_input.value;
const search_button=document.querySelector('.search-button');
search_button.addEventListener('click',()=>{  
   search_input_value =search_input.value.trim().toLowerCase();
  location.href=`./products.html?search=${search_input_value}`;})


async function remover(id){
const cartId=Number(id);
const result=await fetch("/api/deleteCart",{
  method:"post",
  headers:{"content-Type":"application/json"},
  body:JSON.stringify({cartId})
})
if(result.status===200){
  const card= document.querySelector(`.product-card-no${id}`);
  card.remove();
  errorBox.textContent=await result.json();
  errorBox.style.background='var(--clr-success)';
  errorBox.style.display='block';
  setTimeout(() => {errorBox.style.display='none'}, 2500);
}
else if(result.status===404||result.status===401||result.status===400){
  errorBox.textContent=await result.json();
  errorBox.style.background='var(--clr-error)';
  errorBox.style.display='block';
  setTimeout(() => {errorBox.style.display='none'}, 2500);
}

else{
  errorBox.textContent='Unknown error';
  errorBox.style.background='var(--clr-error)';
  errorBox.style.display='block';
  setTimeout(() => {errorBox.style.display='none'}, 2500);
}
};
async function buyFunction(item_id,quantity,price){
    const total=quantity*price;
    // const balance=Number(document.querySelector('.yourBalance').textContent);
    // if(total>balance){
    // errorBox.style.background='var(--clr-error)';
    // errorBox.textContent='total price is over your balance';
    // errorBox.style.display='flex';
    // setTimeout(()=>{errorBox.style.display='none'},2500);
    // return;
    // }
    const data={
        total:total,
        itemId:item_id,
        quantity:quantity,
        price:price
    };
    const result=await fetch("/api/buy",{
        method:"post",
        headers:{"content-Type":"application/json"},
        body:JSON.stringify(data)
    })
    const resultData=await result.json();
    if(result.status===200){

    errorBox.style.background='var(--clr-success)';
    errorBox.textContent= resultData.message;
    errorBox.style.display='flex';
    errorBox.style.position='fixed';
    setTimeout(()=>{errorBox.style.display='none'},2500);
    }
    else if(result.status===500||result.status===400||result.status===404){
    errorBox.style.background='var(--clr-error)';
    errorBox.textContent= resultData;
    errorBox.style.display='flex';
    errorBox.style.position='fixed';
    setTimeout(()=>{errorBox.style.display='none'},2500);
    }
    else if(result.status===401){
        location.href='/login';
    }
};
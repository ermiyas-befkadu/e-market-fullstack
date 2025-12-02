
import { products} from "./data.js";
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  console.log(cart.length);
  let card_value;
for (let k=0;k<cart.length;k++){
 let i=cart[k]-1;

card_creater(i);
}



    function card_creater(i){
        const item_image_container= document.createElement('div');
    item_image_container.className='item-img-container';

    const image = document.createElement('img');
    image.className='item-img';
     image.src=`${products[i].image}`;

    item_image_container.appendChild(image);

    const product_name =document.createElement('h2');
    product_name.className='product-name';
    product_name.innerText=`${products[i].name}`;

    const product_description=document.createElement('p');
    product_description.className='product-description';
    product_description.innerText=`${products[i].description}`;
    const currency_type=document.createElement('div');
    currency_type.className='currency-type';
    currency_type.innerText=`${products[i].currency_type} `;
    const product_price=document.createElement('span');
    currency_type.appendChild(product_price)
    product_price.className='product-price';
    product_price.innerText=`${products[i].price}`;

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
    product_card.className='product-card';
    product_card.value=`${products[i].id}`
    card_value=product_card.value;

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
    remove_from_cart_button.addEventListener('click',()=>{
      event.stopPropagation();
      remover(i);
    })
    return card_value;
    }
    const search_input= document.querySelector('.search-input');

 let search_input_value =search_input.value;
const search_button=document.querySelector('.search-button');
search_button.addEventListener('click',()=>{  
   search_input_value =search_input.value.trim().toLowerCase();
  location.href=`./products.html?search=${search_input_value}`;})


function remover(i){
  let cart=JSON.parse( localStorage.getItem('cart'));
  let id=products[i].id;
  if(cart.includes(id)){
    let index=cart.indexOf(id);
   cart.splice(index,1);

   localStorage.setItem('cart',JSON.stringify(cart));
   location.href='cart.html'; 
  }

}
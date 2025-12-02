
import { products} from "./data.js";

const error_box=document.querySelector('.error-box');
error_box.style.display='none';
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

    const add_to_cart_button=document.createElement('button');
    add_to_cart_button.className='add-to-cart-button';
           add_to_cart_button.addEventListener('click',()=>{
             event.stopPropagation();
            store(i);
    });

    const material_symbol_outlined=document.createElement('span');
    material_symbol_outlined.className='material-symbols-outlined';
    add_to_cart_button.appendChild(material_symbol_outlined);
    material_symbol_outlined.innerText='add_shopping_cart';

    const product_card= document.createElement('div');
    product_card.className='product-card';
    product_card.value=`${products[i].id}`;

    product_card.appendChild(item_image_container);
    product_card.appendChild(product_name);
    product_card.appendChild(product_description);
    product_card.appendChild(currency_type);
    product_card.appendChild(add_to_cart_button);
    const products_list=document.querySelector('.products-list');

    products_list.appendChild(product_card);
        product_card.addEventListener('click',redirecter);
    function redirecter(){
      
    location.href=`./product-detail.html?item_id=${product_card.value}`;

}
}
const search_input= document.querySelector('.search-input');

 let search_input_value =search_input.value;
const search_button=document.querySelector('.search-button');
search_button.addEventListener('click',()=>{  
   search_input_value =search_input.value.trim().toLowerCase();
  location.href=`./products.html?search=${search_input_value}`;})


const page_url=location.href;
const page_url_array= page_url.split('=');
const search_unfiltered= page_url_array[1]||0;
let search;
if(search_unfiltered){search= search_unfiltered.replaceAll('%20',' ');}



let item_found=false;
for (let i=0;i<products.length;i++){
   if (search_unfiltered==0){
    card_creater(i);}
    else if (products[i].name.trim().toLowerCase().includes(search)){
        card_creater(i);
        item_found=true;
    }
    else if(i==products.length-1&&!item_found){
      error_box.style.display='flex';
      error_box.textContent=`No item found for: ${search}`;
      for (let i=0;i<products.length;i++){card_creater(i);}

    }
          
}
  

function store(i) {
  const product_id = products[i].id;
  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  if (cart.includes(product_id)) {
    error_box.style.display='flex';
       error_box.style.position='fixed';
    error_box.textContent='item is already in cart';
    error_box.style.background='var(--clr-warning)';
     setTimeout(()=>{error_box.style.display='none'},2500)
    return;
  }
    else{
     error_box.style.display='flex';
     error_box.style.position='fixed';
    error_box.textContent='item was added to cart successfully';
    error_box.style.background='var(--clr-success)';
     setTimeout(()=>{error_box.style.display='none';
            error_box.style.background='var(--clr-error)';

     },2500)
  }

  cart.unshift(product_id);
  localStorage.setItem('cart', JSON.stringify(cart));

  console.log('Added to cart:', cart);

}



//Search button
const searchForm=document.querySelector('.searchForm');
searchForm.addEventListener('submit',async()=>{
    event.preventDefault();
    const formData =new FormData(searchForm);
    let name_raw =formData.get("search-input");
    let name=name_raw.trim().replaceAll(' ','+').toLowerCase()
    location.href=`/products?search=${name}`
});
const moreButton=document.getElementById("moreButton");
let isClickable=true;

//download search name from url
const page_url=location.href;
const page_url_array= page_url.split('=');
const search_unfiltered= page_url_array[1]||null;
let search=search_unfiltered?search_unfiltered.trim().replaceAll('+',' ').toLowerCase():null;

const error_box=document.querySelector('.error-box');

//fetch products(default)
let products;

    let limit=10;
    let offset=0;
    let id=null;
    let Name=search;

async function fetchProducts(limit,offset) {

    const condition={
        limit:limit,
        offset:offset,
        id:id,
        name:Name,
    }
    try {
        await fetch("/search/products",{
            method:"post",
            headers:{ "Content-Type": "application/json" },
            body:JSON.stringify(condition)
        })
        .then(res=>res.json()).then( 
        fetchedProducts=>{products=fetchedProducts ;return products;})
        .catch((error)=>{(console.log(error))})
            console.log(products)

    } catch (error) {
            error_box.style.display='flex';
        error_box.style.position='fixed';
        error_box.style.background='var(--clr-error)';
        error_box.innerHTML=`couldn't load products please <a href='/products'> try again</a>`
        }
        
        function card_creater(i){
            
            const item_image_container= document.createElement('div');
            item_image_container.className='item-img-container';
        
            const image = document.createElement('img');
            image.className='item-img';
            image.src=`${products[i].image}`;
            image.alt=`image of ${products[i].name}`;
            item_image_container.appendChild(image);
        
            const product_name =document.createElement('h2');
            product_name.className='product-name';
            product_name.innerText=`${products[i].name}`;
        
            const product_description=document.createElement('p');
            product_description.className='product-description';
            product_description.innerText=`${products[i].description}`;
            const currency_type=document.createElement('div');
            currency_type.className='currency-type';
            currency_type.innerText=`${products[i].currencytype} `;
            const product_price=document.createElement('span');
            currency_type.appendChild(product_price)
            product_price.className='product-price';
            product_price.innerText=`${products[i].price}`;
            

            const add_to_cart_button=document.createElement('button');
            add_to_cart_button.className='add-to-cart-button';
                   add_to_cart_button.addEventListener('click',()=>{
                     event.stopPropagation();
                     add_to_cart_button.disabled=true;
                     add_to_cart_button.style.cursor='not-allowed';
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
              
            location.href=`./product-detail?item-id=${product_card.value}`;
        
        }
        }
    if(products.length<limit){
    moreButton.disabled=true;
    moreButton.style.cursor='not-allowed';
    moreButton.textContent='no more items';
    isClickable=false;
    }

        if(products){
    for(let i=0;i<=products.length;i++){
        card_creater(i);
    }}



    };
fetchProducts(limit,offset);
moreButton.addEventListener('click',()=>{
    if(!isClickable){return;}
    limit =10;
    offset+=10;
    fetchProducts(limit,offset);
});

async function  store(i){
    const data={
        productId:products[i].id
    }
const result= await fetch("/addToCart",{
    method:"post",
    headers:{"content-Type":"application/json"},
    body:JSON.stringify(data)
});
if (result.status===200){
    error_box.style.background='var(--clr-success)';
    error_box.textContent= await result.json();
    error_box.style.display='flex';
    setTimeout(()=>{error_box.style.display='none'},2500); 
document.querySelector(".add-to-cart-button").disabled=false;
document.querySelector(".add-to-cart-button").style.cursor='default';


}
else if(result.status===404||result.status===400){
    error_box.style.background='var(--clr-error)';
    error_box.textContent= await result.json();
    error_box.style.display='flex';
    setTimeout(()=>{error_box.style.display='none'},2500);
}
          document.querySelector(".add-to-cart-button").disabled=false;
          document.querySelector(".add-to-cart-button").style.cursor='default';
}

  
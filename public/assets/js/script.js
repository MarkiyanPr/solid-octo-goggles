/* Search_panel */

const request = new XMLHttpRequest();
let input_search_panel = document.querySelector('.search-form-text-input');
let search_result_panel = document.querySelector('.search-result-panel');
let results_products_box = document.querySelector('.results-products-box-flex');
input_search_panel.addEventListener('input', ()=>{
    setTimeout(()=>{
        if(input_search_panel.value.length > 0){
            const url = "/result?panel_text=" + input_search_panel.value;
            request.open("GET", url, true);
            request.setRequestHeader('Content-Type', 'application/x-www-form-url');
            request.addEventListener("readystatechange", ()=>{
                if(request.readyState === 4 && request.status === 200){
                    let result_list_products = JSON.parse(request.responseText);
                    if(result_list_products.length!=0){
                        search_result_panel.style.display = 'block';
                        let text = ``;
                        for(let res_prod of result_list_products){
                            let prod_block = `
                            <a href="/product/${res_prod.id}">
                                <div class="result-product">
                                    <img  class="result-product-img" src="${res_prod.img}" alt="">
                                    <p class="result-product-name">${res_prod.name}</p>
                                    <h2 class="result-product-price">${res_prod.price}</h2>
                                </div>     
                            </a>
                            `
                            text+=prod_block;
                        }
                        results_products_box.innerHTML = text;
                    }
                }
            })
            request.send();
        }
        else{
            search_result_panel.style.display = 'none';
        }
    }, 300);
});


/*  */

let color_variant_text = document.querySelector('.product-color-type-text');


let color_variants_box_images = document.querySelectorAll('.product-color-variants-img');

for(let img of color_variants_box_images){
    img.addEventListener('mousemove', ()=>{
        color_variant_text.textContent = img.alt;
    })
}



let header_accordeon = document.querySelector('.accordeon-wrapper');
let shop_category = document.querySelector('.navigation-menu__item-title');

shop_category.addEventListener('mouseover', ()=>{
    header_accordeon.classList.toggle('accordeon-wrapper-visible');
})
document.querySelector('.main').addEventListener('mouseover', ()=>{
    header_accordeon.classList.remove('accordeon-wrapper-visible');
});


shop_category.addEventListener('mouseover', ()=>{
    let b_navigation_list = JSON.parse(localStorage.getItem('navigation'));
    let text = '';
    for(let element of b_navigation_list){
        let a = 
        `<a href="">
            <li class="accordeon-category-list-el">${element.categories}</li>
        </a>`;
        text+=a;
    }
    document.querySelector('.accordeon-category-list').innerHTML = text;
    categoriesHeader = document.querySelectorAll('.accordeon-category-list-el');

    for(let categoryHeader of categoriesHeader){
        categoryHeader.addEventListener('mouseover', ()=>{
            let b_navigation_list = JSON.parse(localStorage.getItem('navigation'));
            let sections = [];
            
            for(let cat of b_navigation_list){
                if(categoryHeader.textContent==cat.categories){
                    sections = cat.sections;
                    break;
                }
            }
            let cattext = '';
            for(let section of sections){
                cattext += `
                <ul class="accordeon-section-list">
                <h2>${section.sectionsName}</h2>
                `;
                for(let s of section.navigation){
                    let a = `
                    <a href='/section/${s}'>
                        <li class="accordeon-section-list-el">${s}</li>
                    </a>
                    `;
                    cattext+=a;
                }
                cattext+=`</ul>`;
            }
            document.querySelector('.accordeon-sections-box').innerHTML = cattext;
        })
    }
})

let categoriesHeader = []
categoriesHeader = document.querySelectorAll('.accordeon-category-list-el');





let cart_link = "/cart";
let cart_add_btn = document.querySelector('.product-service-box__addToCartButton-box');
try{
    cart_add_btn.addEventListener('click', ()=>{
        let product_id = (document.URL.split('/'))[(document.URL.split('/')).length-1];
        let cart = JSON.parse(window.localStorage.getItem('cart')) || [];
        if(cart.length==0){
            cart_link+=`?cart=${product_id}`;
        }else{
            cart_link+=`&cart=${product_id}`;
        }
        cart.push(product_id);
        document.querySelector('.cartview-count').textContent = cart.length;
        localStorage.setItem("cart", JSON.stringify(cart));
        document.querySelector('.cartview-count').style.display = 'block';
        document.querySelector('.cartview a').href = (cart_link + "&cart=0");
    });
}
catch{

}
(()=>{
    cart_link = "/cart";
    let cart = JSON.parse(window.localStorage.getItem('cart')) || [];
    if(cart.length>0){
        cart_link+="?";
        document.querySelector('.cartview-count').textContent = cart.length;
        document.querySelector('.cartview-count').style.display = 'block';
        for(let c of cart){
            cart_link+=`cart=${c}&`;
        }
        cart_link = cart_link.slice(0, -1);
    }
    document.querySelector('.cartview a').href = (cart_link + "&cart=0");
})()


/* Можно корректировать скидку */

function normalPrice(price){
    if(!price.includes('.')){
        price = price.replace(',','.');
    }
    price = parseFloat(price.split(/,|\s/).join(''));
    return price;
}
function countTotalPrice(){
    let totalPrice = 0;
    let prices = document.querySelectorAll('.cart-item-setting-price');
    for(let p of prices){
        totalPrice+=normalPrice(p.getAttribute('data-value-product-price'));
    }
    if(!toString(totalPrice).includes('.')){
        /* totalPrice += ".00"; */
    }
    return totalPrice.toFixed(2);
}
try{
(()=>{
    document.querySelector('.total-price').textContent = "AED " + countTotalPrice();
})()
}catch{

}


try{
    let remove_btns = document.querySelectorAll('.cart-item-remove-btn');
    for(let remove_btn of remove_btns){
        remove_btn.addEventListener('click', ()=>{
            let remove_id = remove_btn.parentNode.parentNode.parentNode.parentNode.getAttribute('data-cart-id');
            let cart = JSON.parse(window.localStorage.getItem('cart')) || [];
            cart = cart.filter((x)=>{if(x==remove_id){return false}return true})
            document.querySelector('.cartview-count').textContent = cart.length;
            localStorage.setItem("cart", JSON.stringify(cart));
            document.querySelector(`.cart-item[data-cart-id="${remove_id}"]`).remove();
            document.querySelector('.total-price').textContent = "AED " + countTotalPrice();
        });
    }
}catch{

}







try{
var swiper = new Swiper(".slide-content", {
    slidesPerView: 3,
    spaceBetween: 30,
    slidesPerGroup: 3,
    loop: true,
    loopFillGroupWithBlank: true,
})

var swiper_mini = new Swiper('.main-products_slide-content', {
    slidesPerView: parseInt(document.querySelector('.product-wrapper').clientWidth / 120),
    spaceBetween: 30,
    slidesPerGroup: 1,
    loop: true,
    loopFillGroupWithBlank: true,
});
}catch{

}


let burger = document.querySelector('.burger-btn');
let burger_wrapper = document.querySelector('.burger-menu-wrapper');
let burger_menu = document.querySelector('.burger-menu');

burger.addEventListener('click', (e)=>{
    burger_menu.style.display = 'block';
    burger_wrapper.style.display = 'block';
}, true)


burger_wrapper.addEventListener('click', (e)=>{
    if(e.target.classList.contains('burger-menu-wrapper')){
        burger_menu.style.display = 'none';
        burger_wrapper.style.display = 'none'; 
    }
})

/* document.addEventListener('click', (e)=>{
    console.log(e.target.getAttribute('data-value'));
    if(!(document.querySelector('.burger-menu')).contains(e.target) && e.target != burger){
        burger_menu.style.display = 'none';
        burger_wrapper.style.display = 'none';    
    }
}) */





function RenderBurgerNav(){
    
    let b_navigation_list = JSON.parse(localStorage.getItem('navigation'));
    let b_sections_chosen = (()=>{
        if(burger_panel_section.getAttribute('data-category-chosen')=='')
            return '';
        for(let nav of b_navigation_list){
            if(nav.categories == burger_panel_section.getAttribute('data-category-chosen')){
                return Array.from(nav.sections, x => x.sectionsName)
            }
        }
    })();
    
    let b_products_chosen = (()=>{
        if(burger_panel_products.getAttribute('data-section-chosen')=='')
            return '';
        for(let nav of b_navigation_list){
            if(nav.categories == burger_panel_section.getAttribute('data-category-chosen')){
                for(let s of nav.sections){
                    if(s.sectionsName == burger_panel_products.getAttribute('data-section-chosen')){
                        return s.navigation;
                    }
                }
            }
        }
    })();
    
    if(b_sections_chosen!=''){
        let text = `
        <li class="burger-navbar-panel-element burger-navbar-panel-back-btn">
            <img src="../img/burger-panel-btn-arrow.png" alt="" class="burger-navbar-panel-element-arrow">
            <p class="burger-navbar-panel-element-text">${burger_panel_section.getAttribute('data-category-chosen')}</p>
        </li>
        `;
        for(let s of b_sections_chosen){
            let li = `
            <li class="burger-navbar-panel-element" data-value="${s}">
                <p class="burger-navbar-panel-element-text">${s}</p>
                <img src="../img/burger-panel-arrow.png" alt="" class="burger-navbar-panel-element-arrow">
            </li>
            `
            text+=li;
        }
        document.querySelector('[data-panel-name ="section"] ul').innerHTML = text;
    }
    if(b_products_chosen!=''){
        let text = `
        <li class="burger-navbar-panel-element burger-navbar-panel-back-btn">
            <img src="../img/burger-panel-btn-arrow.png" alt="" class="burger-navbar-panel-element-arrow">
            <p class="burger-navbar-panel-element-text">${burger_panel_products.getAttribute('data-section-chosen')}</p>
        </li>
        `;
        for(let s of b_products_chosen){
            let li = `
            <li class="burger-navbar-panel-element" data-value="${s}">
                <a href='/section/${s}'>
                    <p class="burger-navbar-panel-element-text">${s}</p>
                </a>
            </li>
            `
            text+=li;
        };
        document.querySelector('[data-panel-name ="products"] ul').innerHTML= text;
    }

    

    burger_panel_section_element = document.querySelectorAll('[data-panel-name ="section"] li');
    burger_panel_section_element.forEach(l=>{
        if(!l.classList.contains('burger-navbar-panel-back-btn')){
            l.addEventListener('click', ()=>{
                burger_panel_products.classList.add('burger-menu-navbar-panel-show');
                burger_panel_products.setAttribute('data-section-chosen', l.getAttribute('data-value'));
                RenderBurgerNav();
            })
        }else{
            l.addEventListener('click', ()=>{
                document.querySelector('[data-panel-name ="'+l.parentNode.parentNode.getAttribute('data-panel-name')+'"]').classList.remove('burger-menu-navbar-panel-show');
                burger_panel_section.setAttribute('data-category-chosen', '');
            })
        }
    })

    burger_panel_products_element = document.querySelectorAll('[data-panel-name ="products"] li');
    burger_panel_products_element.forEach(l=>{
    if(l.classList.contains('burger-navbar-panel-back-btn')){
        l.addEventListener('click', ()=>{
            burger_panel_products.setAttribute('data-section-chosen', '');
            document.querySelector('[data-panel-name ="'+l.parentNode.parentNode.getAttribute('data-panel-name')+'"]').classList.remove('burger-menu-navbar-panel-show');
        })
    }
})
}




let burger_nav_element = document.querySelectorAll('.burger-element');
burger_nav_element.forEach(l=>{
    l.addEventListener('click', ()=>{
        burger_panel_category.classList.add('burger-menu-navbar-panel-show');
        burger_panel_category.setAttribute('data-nav-chosen', l.getAttribute('data-value'));
    })
})


let burger_panel_category = document.querySelector('[data-panel-name ="category"]');
let burger_panel_category_element = document.querySelectorAll('[data-panel-name ="category"] li');
burger_panel_category_element.forEach(l=>{
    if(!l.classList.contains('burger-navbar-panel-back-btn')){
        l.addEventListener('click', ()=>{
            burger_panel_section.classList.add('burger-menu-navbar-panel-show');
            burger_panel_section.setAttribute('data-category-chosen', l.getAttribute('data-value'));
            RenderBurgerNav();
        })
    }else{
        l.addEventListener('click', ()=>{
            document.querySelector('[data-panel-name ="'+l.parentNode.parentNode.getAttribute('data-panel-name')+'"]').classList.remove('burger-menu-navbar-panel-show');
            burger_panel_category.setAttribute('data-nav-chosen', '');
        })
    }
})

let burger_panel_section = document.querySelector('[data-panel-name ="section"]');
let burger_panel_section_element = document.querySelectorAll('[data-panel-name ="section"] li');
burger_panel_section_element.forEach(l=>{
    if(!l.classList.contains('burger-navbar-panel-back-btn')){
        l.addEventListener('click', ()=>{
            burger_panel_products.classList.add('burger-menu-navbar-panel-show');
            burger_panel_products.setAttribute('data-section-chosen', l.getAttribute('data-value'));
            RenderBurgerNav();
        })
    }else{
        l.addEventListener('click', ()=>{
            document.querySelector('[data-panel-name ="'+l.parentNode.parentNode.getAttribute('data-panel-name')+'"]').classList.remove('burger-menu-navbar-panel-show');
            burger_panel_section.setAttribute('data-category-chosen', '');
        })
    }
})

let burger_panel_products = document.querySelector('[data-panel-name ="products"]');
let burger_panel_products_element = document.querySelectorAll('[data-panel-name ="products"] li');
burger_panel_products_element.forEach(l=>{
    if(l.classList.contains('burger-navbar-panel-back-btn')){
        l.addEventListener('click', ()=>{
            burger_panel_products.setAttribute('data-section-chosen', '');
            document.querySelector('[data-panel-name ="'+l.parentNode.parentNode.getAttribute('data-panel-name')+'"]').classList.remove('burger-menu-navbar-panel-show');;
        })
    }
})


try{
    let proceed_btn = document.querySelector('.proceed-to-chckout-btn');
    proceed_btn.addEventListener('click', ()=>{
        link = "/form";
        let cart = JSON.parse(window.localStorage.getItem('cart')) || [];
        if(cart.length>0){
            link+="?";
            document.querySelector('.cartview-count').textContent = cart.length;
            document.querySelector('.cartview-count').style.display = 'block';
            for(let c of cart){
                link+=`cart=${c}&`;
            }
            link = link.slice(0, -1);
        }
        window.location.href = (link + "&cart=0");
    });
}catch{

}

try{
    let form_price = document.querySelector('.priceInfoWrapper p');

}catch{

}
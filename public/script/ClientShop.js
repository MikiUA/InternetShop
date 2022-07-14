function initialize(){

    shop_box=document.getElementById('shop_list_bar');
    item_box=document.getElementById('item_list_bar');
    current_shop=null;
    socket = io.connect();
    LoadShopList();
}

function LoadShopList(){
    let req=null;
    socket.emit('load shop list',req,function(res_shops){
        shop_box.innerHTML='';
        for(var i = 0; i < res_shops.length; i++){
            DisplayShop(res_shops[i]);
        }
        SelectShop(document.querySelector('.shop_container'));
    });
}
function DisplayShop(shop){
    const usr=document.createElement("div");
    shop_box.appendChild(usr);
    let sn=shop.name;
    usr.outerHTML=`
    <div class="shop_container" data-shopid="`+sn+`" onclick="SelectShop(this)">`+sn+`</div>
    `;
    return shop_box.append('');
}

function SelectShop(a_shop){
    console.log(a_shop);
    if(!a_shop) {console.log("SelectShop : No Shop"); return 0;}
    try{
    if(current_shop)   current_shop.classList.toggle("active_shop");
        current_shop=a_shop;
        current_shop.classList.toggle("active_shop");
        let req=current_shop.dataset.shopid;
        socket.emit('load item list',req,function(res_msgs){
            item_box.innerHTML='';
            for(var i = 0; i < res_msgs.length; i++){
                DisplayItem(res_msgs[i]);
            }
        });
    }
    catch(err){console.log(err);}
}

// function LoadItemList(){}
function DisplayItem(data){
    if(!data) return 'err';
    const usr=document.createElement("div");
    item_box.appendChild(usr);
    try{
        // background: url("../img/drums.jpg") center center no-repeat;
        usr.outerHTML=`
        <div class="item_container">
            <img class="item_image" src="`+data.image_url+`"></img>
            <div class="item_name">`+data.name+`</div>
            <div class="item_cost">`+data.cost+`$</div>
            <div class="item_quantity">left:` +data.quantity_left+`</div>
            <div class="order_btn_wrap">
                <button onclick="AddOrder(this,'`+data._id+`')" class="order_btn">Order</button>
                <button onclick="ChangeAmount(this,-1)" class="order_minus">-</button>
                <input class="order_amount" value=0 />
                <button onclick="ChangeAmount(this,1)" class="order_plus">+</button>
            </div>
        </div>`;
    }
    catch(err){
        usr.outerHTML=`
        <div class="item_container">
            err item
        </div>`;
        console.log(err);
    }

    return item_box.append('');
}
function ChangeAmount(changebtn,amount) {
    let cur_amount=changebtn.parentNode.childNodes[5];
    cur_amount.value=Number.parseInt(cur_amount.value)+Number.parseInt(amount);
}

function AddOrder(orderbtn,data_id){
    let cur_amount=orderbtn.parentNode.childNodes[5].value;
    if(cur_amount==0)return 0;
    let req={
        item_id:data_id,
        amount:cur_amount
    };
    localStorage.setItem(data_id,cur_amount);
    
    // let order = JSON.parse(localStorage.getItem("order"));
    // if(!order) order=" ";
    // console.log(order);
    // order.push(JSON.stringify(req));
    // localStorage.setItem("order", JSON.stringify(order));
}


function initialize(){
    // shop_box=document.getElementById('shop_list_bar');
    item_box=document.getElementById('item_list_bar');  
    total_cost=0;
    temp_order_list={};
    socket = io.connect();
    LoadOrderList();
    UpdateTempStorage();

}
async function UpdateTempStorage() {
console.log("UpdateTempStorage");
    Object.keys(localStorage).forEach(function(key){
        console.log(key,localStorage.getItem(key));
       temp_order_list[key]=localStorage.getItem(key);
     });
}

function LoadOrderList(){
    UpdateTempStorage();
    UpdateTotalCost();
    Object.keys(localStorage).forEach(function(key){
        // item_box.innerHTML='';
        socket.emit('load item by id',key,function(response_item){
           DisplayItem(response_item[0],localStorage.getItem(key));
        });
     });
}

function DisplayItem(data,quantity){
    if(!data) return 'err';
    const usr=document.createElement("div");
    item_box.appendChild(usr);
    try{
        usr.outerHTML=`
        <div class="item_container">
            <img class="item_image" src="`+data.image_url+`"></img>
            <div class="item_name">`+data.name+`</div>
            <div class="item_cost">`+data.cost+`$</div>
            <div class="item_quantity">Ordered:` +quantity+`</div>
            <div class="order_btn_wrap">
                <button onclick="ChangeOrder(this,'`+data._id+`')" class="order_btn">Quantity</button>
                <button onclick="ChangeAmount(this,-1)" class="order_minus">-</button>
                <input class="order_amount" value=`+quantity+` />
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
function ChangeOrder(orderbtn,data_id){
    let cur_amount=orderbtn.parentNode.childNodes[5].value;
    if(cur_amount==0)return 0;

    localStorage.setItem(data_id,cur_amount);


    let item_upd=orderbtn.parentNode.parentNode.childNodes[7];
    item_upd.innerHTML="Ordered: "+cur_amount;
    UpdateTotalCost();
    //TODO find a form solution to store currently ordered quantity
    //There is an idea to just input every info in item_container.dataset, 
    //  does not seem faster, but still better for potential future updates
}
async function UpdateTotalCost(){
    await UpdateTempStorage();
    console.log(total_cost);
    console.log(temp_order_list);
    total_cost=0;
    let display=document.getElementById('total_cost');
    for (const key in temp_order_list){
        console.log(key);
        await socket.emit('load item by id',key,function(response_item){
            total_cost+=response_item[0].cost*localStorage.getItem(key);
        //    console.log(response_item[0].cost,localStorage.getItem(key))
        //    console.log(total_cost);
        display.innerHTML="Total cost: "+total_cost+'$';
        });
    }
    console.log(total_cost);
    //  });
    
}
function SubmitOrder(){
    let form = document.getElementById('login_form');
    let name=form.childNodes[1].lastChild.value,
    email=form.childNodes[3].lastChild.value,
    phone=form.childNodes[5].lastChild.value,
    address=form.childNodes[7].lastChild.value
    // orderlist=localStorage;
    // if(!name || !email || !phone ||!address) {console.log ("fill out all the boxes"); return 0;}
    let req={
        'name':name,
    'email':email,
    'phone':phone,
    'adress':address,
    'orderlist':temp_order_list};
    console.log("sent a request to a server: ",req);
    socket.emit('post full order',req,function(response){
       console.log("server responce: ",response);
    //    localStorage.clear();
    });
}
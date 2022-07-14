function mos_title(login) {
    let ret= ` 
    <div class='mos_title'>
    <a href=index.html class="title_item">Shop</a>
    <a href=cart.html class="title_item">Shoping cart</a>
    `;
    // if (!login) ret+=`<a href=login.html class="title_item">Log in</a>`
   
    ret+=` </div>`; 

    return ret;
  }

  const title=document.getElementById('mos_title');
  if(title){
    title.innerHTML=mos_title();
  }
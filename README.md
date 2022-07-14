# InternetShop
A website template. Order items from different shops and view(edit) your order cart. Uses node.js, express, mongoDB, socket.io

Simple website template.<br> To run on your computer you need to:
- have Node.js installed
- have MongoDB installed
- install the following dependencies via 'npm': npm i express mongoose socket.io
- if you want to create a temporary mongo database on your computer:in the "server.js" file uncomment line 32 "filldb()" for a single run and then comment it back
- run npm start and goto localhost:8000 in your browser
- if you want to edit website and autoreload it on save then: npm install nodemon npm run devstart;

<br>
From the mainpage to add an item to your order cart adjust quantity you want and press "Order".<br>
From the cart page to adjust quantity of an item press "quantity" button.
Items in your cart are stored in your local storage, so they do not delete when you close the browser.
To clear your local storage every time you finish your order and submit it then: in "/public/script/ClientCart.js" uncomment last code line ("localStorage.clear();")

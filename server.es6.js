const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const fs = require('fs');
const Inventario = require('./Inventario');

const port = 8080
app.use(express.static('public'));

let almacen = new Inventario();

let messages = [];

io.on("connection", (socket) =>{
    let products = almacen.getProductos();
    socket.emit('listProducts', products);
    socket.emit('messages', messages);

    socket.on('new-product', function(data){
        almacen.addProducto(data);
        products = almacen.getProductos();
        io.sockets.emit('listProducts', products);
    })

    socket.on('new-message', function(data){
       messages.push(data);
       let json = JSON.stringify(messages)

       fs.promises.writeFile("Lista de productos.txt",json)
           .then(console.log("Mensaje guardado con éxito"));
       
       io.sockets.emit('messages', messages);
    
    })


})

http.listen(port, () => {
    console.log("El servidor http está corriendo en el puerto " + port);
})
const { Socket } = require('dgram');
const express= require('express');
const app = express();
const { v4: uuidv4 } = require('uuid');
const {ExpressPeerServer} = require('peer');

const server = require('http').Server(app);
const peerServer = ExpressPeerServer(server,{
    debug:true
})
app.use('/peerjs',peerServer)
const PORT= 3030;
const io = require('socket.io')(server)
app.set('view engine','ejs');
app.use(express.static('public'))
app.get("/",(req,res)=>{
    res.redirect(`/${uuidv4()}`);
})


app.get("/:room",(req,res)=>{
    res.render('room',{roomId:req.params.room})
})



io.on('connection', socket => {
  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId)
    socket.to(roomId).emit('user-connected',userId);
    // messages
    socket.on('message', (message) => {
      //send message to the same room
      io.to(roomId).emit('createMessage', message)
    })
  }); 
});
server.listen(3030,()=>{
    console.log("Listeing on port  3030");
});

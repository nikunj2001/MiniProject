// const { text } = require("stream/consumers");

const socket = io('/')
const videoGrid=document.getElementById("video-grid")    
const myVideo = document.createElement('video');
myVideo.muted = true;
var peer= new Peer(undefined,{
    path:'/peerjs',
    host:'/',
    port :'3030'
}) 
let mtVideoStream;
navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then(stream => {
  myVideoStream = stream;
  addVideoStream(myVideo, stream)
  peer.on('call', call => {
    call.answer(stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
      addVideoStream(video, userVideoStream)
    })
  })
    
   

socket.on('user-connected',(userId)=>{
    connectToNewUser(userId,stream);
})
})
peer.on('open',id=>{
   socket.emit('join-room',ROOM_ID,id);
})
const connectToNewUser=(userId, stream) =>{
  const call = myPeer.call(userId, stream)
  const video = document.createElement('video')
  call.on('stream', userVideoStream => {
    addVideoStream(video, userVideoStream)
  })
}

const addVideoStream=(video,stream)=>{
    video.srcObject = stream;
    video.addEventListener('loadedmetadata',()=>{
        video.play()
    })
    videoGrid.append(video)
 }
const scrollToBottom=()=>{
     d=$('.main__chat_window');
    d.scrollTop(d.prop("scrollHeight"));
}
 const text=$('input')
 $('html').keydown((e)=>{
     if(e.which==13 && text.val().length!==0){
         socket.emit('message',text.val());
         text.val('')
     }
 })
 socket.on('createMessage',message=>{
     $('ul').append(`<li class="message" ><b>user</b><br/>${message}</li>`)
 })
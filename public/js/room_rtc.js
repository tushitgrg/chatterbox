function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}



const APP_ID ="5bf65decd1ab4ed392ae7e1bbfc50953";
let uid = sessionStorage.getItem("uid");
if(!uid){
uid = generateRandomString(10);
sessionStorage.setItem("uid",uid)
}


let token = null;
let client;

let rtmclient;
let channel;

const queryString = window.location.search
const urlPARAMS = new URLSearchParams(queryString)
meeting_id =urlPARAMS.get('id');
if(!meeting_id){
    window.location.href="/";
}
if(!localStorage.getItem("displayName")){
    window.location = "/?id="+meeting_id
}


let localtracks = []
let remoteUsers = {}
let localScreenTracks;
let sharingScreen = false;

let joinRoom =async () =>{
client =AgoraRTC.createClient({mode:"rtc",codec:"vp8"});
await client.join(APP_ID,meeting_id,token,uid)
joinStream()

client.on("user-published",handleUserPublished)
client.on("user-left",handleUserLeft)
}

let joinStream = async () =>{

    rtmclient = await AgoraRTM.createInstance(APP_ID)
    await rtmclient.login({uid,token})

    await rtmclient.addOrUpdateLocalUserAttributes({'name':localStorage.getItem("displayName")})
    channel = await rtmclient.createChannel(meeting_id)

    await channel.join()

    channel.on("MemberJoined",handlememberjoined)
  
    channel.on("MemberLeft",handlememberleft)


    channel.on("ChannelMessage",addmessagetoDOM)
    addBotMessage(`${localStorage.getItem("displayName")} Just Joined 👋`)

    getMembers();
localtracks = await AgoraRTC.createMicrophoneAndCameraTracks({},{
    encoderConfig:{
        width:{min:640,ideal:1920,max:1920},
        height:{min:480,ideal:1080,max:1080}
    }
});
let player = `  <div class="video__container" id="user-container-${uid}">
<div class="video_player" id="user-${uid}"></div>
</div>`
document.getElementById("streams__container").insertAdjacentHTML("beforeend",player)
document.getElementById(`user-container-${uid}`).addEventListener("click",expandVideo)
localtracks[1].play(`user-${uid}`)

await client.publish([localtracks[0],localtracks[1]])
}

let handleUserPublished = async (user,mediaType)=>{
    remoteUsers[user.uid] = user;
    await client.subscribe(user,mediaType)
    let player = document.getElementById(`user-container-${user.uid}`)
    if(!player){
         player = `  <div class="video__container" id="user-container-${user.uid}">
        <div class="video_player" id="user-${user.uid}"></div>
        </div>`
        document.getElementById("streams__container").insertAdjacentHTML("beforeend",player)
      
    }
    

    if(document.getElementById("stream__box").style.display){
        document.getElementById(`user-container-${user.uid}`).style.width ="100px"
        document.getElementById(`user-container-${user.uid}`).style.height ="100px"
    }
    document.getElementById(`user-container-${user.uid}`).addEventListener("click",expandVideo)
    if(mediaType==="video"){
        user.videoTrack.play(`user-${user.uid}`)
    }
    if(mediaType==="audio"){
        user.audioTrack.play()
    }
    
}
let handleUserLeft = async (user)=>{
    delete remoteUsers[user.uid]
document.getElementById(`user-container-${user.uid}`).remove();
if(useridindisplay===`user-container-${user.uid}`){
    displayFrame.style.display=null
    videoFrames=document.getElementsByClassName("video__container")
    for(let i=0; i<videoFrames.length;i++){
       
        videoFrames[i].style.width="300px"
        videoFrames[i].style.height="300px"}
        useridindisplay= null;
      
}
}

let toggleMic = async (e)=>{
    let button = e.currentTarget;
    if(localtracks[0].muted){
        await localtracks[0].setMuted(false)
        button.classList.add("active")
    }else{
        await localtracks[0].setMuted(true)
        button.classList.remove("active")
    }
    }

let toggleCamera = async (e)=>{
let button = e.currentTarget;
uid = sessionStorage.getItem("uid");
if(localtracks[1].muted){
    await localtracks[1].setMuted(false)
    button.classList.add("active");
    
}else{
    await localtracks[1].setMuted(true)
    button.classList.remove("active")
   
}
}
let switchToCamera = async () =>{
    player = `  <div class="video__container" id="user-container-${uid}">
    <div class="video_player" id="user-${uid}"></div>
    </div>`
   
   displayFrame.insertAdjacentHTML("beforeend",player)
   document.getElementById(`user-container-${uid}`).addEventListener("click",expandVideo)
 localtracks[1].play(`user-${uid}`)
 await client.publish([localtracks[1]])
}

let toggleScreen = async (e) =>{
screenbutton = e.currentTarget;
camerabutton = document.getElementById("camera-btn");
if(!sharingScreen){
    sharingScreen=true;
    await localtracks[1].setMuted(true)
    camerabutton.classList.remove("active")
    camerabutton.style.display="none"
    screenbutton.classList.add("active")
    localScreenTracks = await AgoraRTC.createScreenVideoTrack()
    document.getElementById(`user-container-${uid}`).remove()
    displayFrame.style.display="block";
    player = `  <div class="video__container" id="user-container-${uid}">
    <div class="video_player" id="user-${uid}"></div>
    </div>`
   displayFrame.insertAdjacentHTML("beforeend",player)
   document.getElementById(`user-container-${uid}`).addEventListener("click",expandVideo)
   videoFrames=document.getElementsByClassName("video__container")
   for(let i=0; i<videoFrames.length;i++){
      
       videoFrames[i].style.width="100px"
       videoFrames[i].style.height="100px"}
    useridindisplay = `user-container-${uid}`
    localScreenTracks.play(`user-${uid}`)
    await client.unpublish([localtracks[1]])
    await client.publish([localScreenTracks])
    if(localScreenTracks){
        localScreenTracks.on('track-ended',async ()=>{
            camerabutton.style.display="block"
    screenbutton.classList.add("active")
    sharingScreen=false;
    document.getElementById(`user-container-${uid}`).remove()
    await client.unpublish([localScreenTracks])
switchToCamera();
        })
    }
}else{
    camerabutton.style.display="block"
    screenbutton.classList.add("active")
    sharingScreen=false;
    document.getElementById(`user-container-${uid}`).remove()
    await client.unpublish([localScreenTracks])
switchToCamera();
}
}

let leaveRoom = ()=>{
    window.location="/"
}
document.getElementById("camera-btn").addEventListener("click",toggleCamera)

document.getElementById("mic-btn").addEventListener("click",toggleMic)
document.getElementById("screen-btn").addEventListener("click",toggleScreen)
document.getElementById("leave-btn").addEventListener("click",leaveRoom)
joinRoom()

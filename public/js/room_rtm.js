let handlememberjoined = async(MemberID) =>{
   
console.log(`User Joined ${MemberID}`)
addMembertoDom(MemberID)

let {name} = await rtmclient.getUserAttributesByKeys(MemberID,['name'])
addBotMessage(`${name} Just Joined 👋`)

}
let updateNumber = async() =>{
    let members = await channel.getMembers();
    document.getElementById("members__count").innerText = members.length;
}
let addMembertoDom = async (MemberID) => {
    updateNumber();
   let {name} = await rtmclient.getUserAttributesByKeys(MemberID,['name'])
    let memberswrapper =document.getElementById("member__list");

    let memberItem = `<div class="member__wrapper" id="member__${MemberID}__wrapper">
    <span class="green__icon"></span>
    <p class="member_name">${name}</p>
</div>`

memberswrapper.insertAdjacentHTML("beforeend",memberItem);


}


let addmessagetoDOM = async (message,memberid) => {
let data = JSON.parse(message.text)
addmessage(data.message,data.name)
   
    }

let addBotMessage = async(message) =>{
 
        let messageWrapper = document.getElementById('messages')
    
        let newMessage = `
        <div class="message__wrapper">
        <div class="message__body__bot">
            
            <p class="message__text__bot">${message}</p>
        </div>
    </div>
`
    
     
     messageWrapper.insertAdjacentHTML("beforeend",newMessage)
     let lastMessage = document.querySelector('.message__wrapper:last-child');
     if (lastMessage) {
         lastMessage.scrollIntoView();
     }
    }

let addmessage = async(message,name) =>{
    let messageWrapper = document.getElementById('messages')

    let newMessage = `
    <div class="message__wrapper">
    <div class="message__body">
        <strong class="message__author"> ${name}</strong>
        <p class="message__text">${message}</p>
    </div>
 </div>`

 
 messageWrapper.insertAdjacentHTML("beforeend",newMessage)
 let lastMessage = document.querySelector('.message__wrapper:last-child');
 if (lastMessage) {
     lastMessage.scrollIntoView();
 }
}


let sendMessage = async(e)=>{
    e.preventDefault()
   
    let message = e.target.message.value
  let  name = localStorage.getItem("displayName")


  channel.sendMessage({ text: JSON.stringify({
    "message":message, "name" :name
  }) })

    addmessage(message,name)
    e.target.reset();
}

let handlememberleft = async(MemberID) =>{
    updateNumber();
    let name = document.getElementById(`member__${MemberID}__wrapper`).innerText;
    document.getElementById(`member__${MemberID}__wrapper`).remove();


addBotMessage(`👋 ${name} Just Left  `)
    
}

let leaveChannel = async()=>{
    await channel.leave()
    await rtmclient.logout()
}

let getMembers = async () =>{
    let members = await channel.getMembers();
    for(let i=0; i<members.length; i++){
        addMembertoDom(members[i])
    }
}

document.getElementById("message__form").addEventListener('submit',sendMessage)
window.addEventListener("beforeunload",leaveChannel)

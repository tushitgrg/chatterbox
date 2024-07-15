function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}

const queryString = window.location.search
const urlPARAMS = new URLSearchParams(queryString)
meeting_id =urlPARAMS.get('id');
if(meeting_id){
    document.getElementById("meetingtxt").value=meeting_id;
}
function joinRoom(nametxt,meetingtxt){

    if(!nametxt.value || nametxt.value==""){
alert("Please Enter a Name")
return;
    }

let meetingid;

    localStorage.setItem("displayName",nametxt.value);
    if(!meetingtxt.value || meetingtxt.value==""){
      
    meetingid = generateRandomString(15);
    }else{
       
        meetingid = meetingtxt.value;
    }
    window.location = '/meeting?id='+meetingid

}

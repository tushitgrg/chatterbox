function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
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
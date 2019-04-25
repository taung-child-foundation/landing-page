const sendMailMessage = () =>{
    fetch("/push", {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: document.getElementById('inputName').value,
            email: document.getElementById('inputEmail').value,
            message: document.getElementById('inputBody').value
        })
    })
        .then((response) => bootbox.alert({
            message: response.status === 200 ?
                "Thanks for contacting us.<br/>We'll be in touch soon 😇" :
                `Error code: ${response.status}`,
            size: 'small'}))
        .catch(()=> bootbox.alert({
            message: "something went wrong!",
            size: 'small'}))
};
const gen = () => (fetch ("/form").then(value => console.log(value)))//document.getElementById('TargetObject').innerHTML = )

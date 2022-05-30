/*
(async () => {

async function authenticate(accounts) {
    let response = await fetch("/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(accounts)
    })
    return await response.json();
};

//function setup() {
    $("#submitButton").click(async (e) => {
        e.preventDefault();
        let username = $('#username').val();
        let password = $('#password').val();
    
        const response = authenticate({username: username, password: password});
        console.log(response);
        if (!response) {
            console.log(false);
            return $('.result').html('Username taken!');
        }
        return window.location.href = "/profile";
    })
//}
*/

function savetoDataBase() {
    let username = $('#username').val();
    let password = $('#password').val();
    console.log(username);
    console.log(password);
    $.ajax({
        url: '/register',
        type: 'POST',
        data: {
            user: username,
            password: password,
        },
        success: function (data, text) {
            window.alert(data);
            window.location.href = '/login'
        },
        error: function (request, status, error) {
            window.alert(status);
        }
    })
}

$(document).ready(function(){
    $("#submitButton").click(function(event){
        event.preventDefault();
        console.log('test');
        savetoDataBase();
    });
});

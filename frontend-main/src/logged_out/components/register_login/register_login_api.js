const base_url = 'http://letteryou-test.us-east-2.elasticbeanstalk.com';

export const registerUser = async(username, last_name, first_name, phone_number, email, password) => {

    const endpoint = base_url + "/register";
    const data = JSON.stringify({
        "last_name": last_name,
        "first_name": first_name,
        "email": email,
        "username": username,
        "password": password,
        "phone_number": phone_number
    });
    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            body: data,
            headers: {
                'Accept': 'application/json',
                "Content-type": "application/json"
            }
        });

        if (response.ok) {
            return "accountCreated";
        }
        const jsonResponse = await response.json();
        console.log("An error occurred: " + response.status + " " + jsonResponse["error"]["message"]);
        throw new Error(jsonResponse["error"]["message"]);
    }
    catch (error) {
        if (error.message === "Username has been taken") {
            return "usernameExisted";
        }
        if (error.message === "Email has been taken") {
            return "emailExisted";
        }
        console.log(error.message);
        return "fail";
    }
}

export const authenticateUser = async(username, password) => {
    const endpoint = base_url + "/login";
    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Authorization': `bearer ${username}:${password}`
            }
        });
        const jsonResponse = await response.json();
        if (response.ok) {
            localStorage.setItem("token", jsonResponse["token"]);
            localStorage.setItem("username", jsonResponse["username"]);
            localStorage.setItem("user_id", jsonResponse["user_id"]);
            return "loggedIn";
        }
        console.log("An error occurred: " + response.status + " " + jsonResponse["error"]["message"])
        throw new Error(jsonResponse["error"]["message"]);
    }
    catch (error) {
        if (error.message === "Invalid Username") {
            return "invalidUsername";
        }
        if (error.message === "Invalid Password") {
            return "invalidPassword";
        }
        console.log(error.message);
        return "failed";
    }
}

export const emailVerifyUser = async() => {
    const current_url = window.location;
    const token = new URLSearchParams(current_url.search).get('token');
    const username = new URLSearchParams(current_url.search).get('username');
    console.log("token: ", token);
    console.log("username: ", username);

    const endpoint = base_url + `/emailverify?token=${token}&username=${username}`;
    console.log("endpoint: ", endpoint);
    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                "Content-type": "application/json",
            }
        });
        console.log(response.status + " " + response.text());
        if (response.ok) {
            return "SUCCESS驗證成功，歡迎登入使用";
        }
        throw new Error(response.status);
    }
    catch (error) {
        if (error.message === 401) {
            return "ERROR使用者名稱無效或信箱已被註冊過";
        }
        return "ERROR發生錯誤";
    }
}
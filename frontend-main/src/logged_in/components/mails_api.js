const postal_url = 'http://letteryoutest-env.eba-528he9px.us-east-2.elasticbeanstalk.com';
const base_url = 'http://letteryou-test.us-east-2.elasticbeanstalk.com';

export const createDraft = async(
    title,
    to_user_email,
    context,
    send_veri_interval,
    MAX_MISS_TIME,
    veri_mail_expiration
) => {
    const endpoint = base_url + `/users/${localStorage.getItem("user_id")}/draft-box`;
    const data = JSON.stringify({
        to_user_email: to_user_email,
        context: context,
        title: title,
        send_veri_interval: send_veri_interval,
        MAX_MISS_TIME: MAX_MISS_TIME,
        veri_mail_expiration: veri_mail_expiration
    });
    console.log("creat draft api - body data: ", data);
    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `bearer ${localStorage.getItem("token")}`
            },
            body: data
        });
        const jsonResponse = await response.json();
        if (response.ok) {
            // draft id is return
            console.log("A new draft is created, draft_id: ", jsonResponse["draft_id"]);
            return "draftCreated";
        }
        console.log("An error occurred: " + response.status + " " + jsonResponse["error"]["message"]);
        throw new Error(response.status);
    } catch (error) {
        return "failed";
    }
}

export const updateDraft = async(
    draft_id,
    title,
    to_user_email,
    context,
    send_veri_interval,
    MAX_MISS_TIME,
    veri_mail_expiration) => {
    const endpoint = base_url + `/users/${localStorage.getItem("user_id")}/draft-box/${draft_id}`;
    console.log(endpoint);
    const data = JSON.stringify({
        to_user_email: to_user_email,
        context: context,
        title: title,
        send_veri_interval: send_veri_interval,
        MAX_MISS_TIME: MAX_MISS_TIME,
        veri_mail_expiration: veri_mail_expiration
    });
    console.log("update draft api - body data: ", data);
    try {
        const response = await fetch(endpoint, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `bearer ${localStorage.getItem("token")}`
            },
            body: data
        });
        const jsonResponse = await response.json();
        if (response.ok) {
            // draft id is return
            console.log(jsonResponse["message"]);
            return "draftUpdated";
        }
        console.log("An error occurred: " + response.status + " " + jsonResponse["error"]["message"]);
        throw new Error(response.status);
    } catch (error) {
        return "failed";
    }
}

export const getUserDraftBox = async(status) => {
    const endpoint = base_url + `/users/${localStorage.getItem("user_id")}/draft-box?status=${status}`;
    console.log(endpoint);
    try {
        //send request
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `bearer ${localStorage.getItem("token")}`
            }
        });
        //handle response if succesful
        const jsonResponse = await response.json();
        if (response.ok) {
            // return draftbox content
            return jsonResponse;
        }
        //request failed
        console.log("An error occurred: " + jsonResponse["error"]["message"]);
        throw new Error(response.status);
    }
    //handle response if succesful
    catch (error) {
        if (error.message === 400) {
            //error code 400
            return "failed 連線時間已到，請重新登入";
        } else if (error.message === 404) {
            //error code 404
            return "failed 伺服器連結錯誤";
        } else if (error.message === 500) {
            return "failed 資料庫發生錯誤"
        } else {
            return "failed 失敗";
        }
    }
}

export const deleteDraft = async(draft_id) => {
        const endpoint = base_url + `/users/${localStorage.getItem("user_id")}/draft-box/${draft_id}`;
        try {
            //send request
            const response = await fetch(endpoint, {
                method: 'DELETE',
                headers: {
                    'Authorization': `bearer ${localStorage.getItem("token")}`
                }
            });
            //handle response if succesful
            if (response.ok) {
                // return draftbox content
                return "刪除成功";
            }
            //request failed
            console.log("An error occurred: " + response.statusText);
            throw new Error(response.status);
        }

        catch (error) {

        if (error.message === 400) {
            //error code 400
            return "連線時間已到，請重新登入";
        }
        else if (error.message === 404) {
            //error code 404
            return "伺服器連結錯誤";
        }
        else if (error.message === 500) {
            return "資料庫發生錯誤"
        }
        else {
            return "失敗";
        }
    }
}

export const pending = async(
    draft_id,
    send_veri_interval,
    MAX_MISS_TIME,
    veri_mail_expiration) => {
    const endpoint = postal_url + `/pending`;
    console.log(endpoint);
    const data = JSON.stringify({
        user_id: parseInt(localStorage.getItem("user_id")),
        draft_id: parseInt(draft_id),
        send_veri_interval: send_veri_interval,
        MAX_MISS_TIME: MAX_MISS_TIME,
        veri_mail_expiration: veri_mail_expiration
    });
    console.log("pending api - body data: ", data);
    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `bearer ${localStorage.getItem("token")}`
            },
            body: data
        });
        if (response.ok) {
            return "信件已在等待寄送中";
        }
        throw new Error(response.status);

    }
    catch (error) {

        if (error.message === 404) {
            return "找不到草稿";
        }
        else if (error.message === 400) {
            return "信件已在寄信區"
        }
        else {
            return "失敗";
        }
    }
}

export const cancel = async(draft_id) => {
    const endpoint = postal_url + `/cancel`;

    const data = JSON.stringify({
        user_id: parseInt(localStorage.getItem("user_id")),
        draft_id: parseInt(draft_id)
    });
    console.log("cancel data: ", data)
    try {
        //send request
        const response = await fetch(endpoint, {
            method: 'DELETE',
            headers: {
                'Authorization': `bearer ${localStorage.getItem("token")}`,
                'Content-Type': 'application/json'
            },
            body: data
        });
        //handle response if succesful
        if (response.ok) {
            // return draftbox content
            return "取消寄送";
        }
        //request failed
        console.log("An error occurred: " + response.statusText);
        throw new Error(response.status);
    }
    catch (error) {
        if (error.message === 400) {
            //error code 400
            return "連線時間已到，請重新登入";
        }
        else if (error.message === 404) {
            //error code 404
            return "伺服器連結錯誤";
        }
        else if (error.message === 500) {
            return "資料庫發生錯誤"
        }
        else {
            return "失敗";
        }
    }
}

export const getInbox = async() => {
    const endpoint = base_url + `/users/${localStorage.getItem("user_id")}/inbox`;
    try {
        //send request
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `bearer ${localStorage.getItem("token")}`
            }
        });
        //handle response if succesful
        const jsonResponse = await response.json();
        if (response.ok) {
            // return draftbox content
            return jsonResponse;
        }
        //request failed
        console.log("An error occurred: " + jsonResponse["error"]["message"]);
        throw new Error(response.status);
    }
    catch (error) {
        if (error.message === 400) {
            //error code 400
            return "failed 連線時間已到，請重新登入";
        }
        else if (error.message === 404) {
            //error code 404
            return "failed 伺服器連結錯誤";
        }
        else if (error.message === 500) {
            return "failed 資料庫發生錯誤"
        }
        else {
            return "failed 失敗";
        }
    }
}
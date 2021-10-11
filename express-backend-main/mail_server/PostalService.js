const db = require("../db");

const DatabaseError = require("../errors/DatabaseError");
const NotFoundError = require("../errors/NotFoundError");
const asyncHandler = require("../errors/asyncHandler");

const findUser = async (email) => {
    const command = "SELECT id FROM users where email = $1";

    const results = await db.query(command, [email]).catch((err) => {
        throw new DatabaseError("Something Went Wrong", err);
    });

    if (results.rows.length < 1) {
        throw new NotFoundError("User Not Found");
    }

    return results.rows[0].id;
}

const findSenderEmail = async (user_id) => {
    command = "SELECT email from users WHERE id = $1";
    results = await db.query(command, [user_id]).catch((err) => {
        throw new DatabaseError("Something Went Wrong", err);
    });
    if (results.rows.length < 1) {
        throw new NotFoundError("Email Not Found");
    }
    return results.rows[0].email;
}


const findRecieverEmail = async (draft_id) => {
    const command = "SELECT to_user_email from drafts WHERE id = $1";
    const results = await db.query(command, [draft_id]).catch((err) => {
        throw new DatabaseError("Something Went Wrong", err);
    });

    if (results.rows.length < 1) {
        throw new NotFoundError("Email Not Found");
    }

    return results.rows[0].to_user_email;
}

const sendMail = async (draft_id) => {
    let email = await findRecieverEmail(draft_id);
    let command = "UPDATE drafts SET status = 'inbox', owner_id = $1 WHERE id = $2";
    let params = [await findUser(email), draft_id];

    const results = await db.query(command, params).catch((err) => {
        throw new DatabaseError("Something Went Wrong", err);
    });
    if(email){
        let sendemail = require("../routes/sendemail.js");
        sendemail(
            email, 
            "《時空郵差—收信通知》",  
                "您好！\n" +
                "這裡是「時空郵差」，XXX先生/女士寄送給您一封重要的信件，\n" +
                "請至您的收信區查看本信，謝謝！\n" +
                "時空郵差：http://letteryou-test.us-east-2.elasticbeanstalk.com/" + "\n" +
                "\n" +
                "註：如您未使用「時空郵差」的服務，請忽略本信，謝謝！");    
    }
    
    return 1;
}

const pending = async (draft_id) => {
    let command = "UPDATE drafts SET status = 'pending' WHERE id = $1";
    let params = [draft_id];

    const results = await db.query(command, params).catch((err) => {
        throw new DatabaseError("Something Went Wrong", err);
    });
    return 1;
}

const cancel = async (draft_id) => {
    let command = "UPDATE drafts SET status = 'draft' WHERE id = $1";
    let params = [draft_id];

    const results = await db.query(command, params).catch((err) => {
        throw new DatabaseError("Something Went Wrong", err);
    });

    return 1;
}

const sendVeriMail = async (user_id, valid_key) => {
    let email = await findSenderEmail(user_id);
    console.log(email);
    let sendemail = require("../routes/sendemail.js");
    sendemail(
        email,
        "《時空郵差—生歿狀態確認信》", 
            "您好！\n" +
            "這裡是「時空郵差」，若您收到此封生歿狀態確認信，請透過以下連結確認您的狀態：\n" +
            `http://letteryoutest-env.eba-528he9px.us-east-2.elasticbeanstalk.com/verify/${valid_key}`  + "\n" +
            "若不小心錯過此連結的有效期限，且若此封信為最後一封確認信，將會寄出信件，請務必注意。\n"+
            "謝謝您喜愛我們的服務，祝您有個愉快的一天！\n" +
            "\n" +
            "註：如您未使用「時空郵差」的服務，請忽略本信，謝謝！");
}


module.exports = {
    sendMail,
    pending,
    cancel,
    sendVeriMail
};

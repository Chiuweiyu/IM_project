const Heap = require("./Heap.js");
const Mail = require("./Mail.js");
const { pending, cancel } = require("./PostalService.js");
const express = require("express");
const fs = require("fs");
const CronJob = require('cron').CronJob;

const app = express();
const port = 8080;
const cors = require('cors');
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

function cmp(a, b) { return a.nextHandleTime < b.nextHandleTime; };

const mailpool = (fs.readdirSync('./taskBackup').findIndex(f => f == "backup.json") < 0) ?
    new Heap(comparator = cmp) :
    new Heap(comparator = cmp, data = require("./taskBackup/backup.json"));

function reverseHashID(first_segment, second_segment){
    const user_id = Math.round((first_segment/second_segment)**0.5);
    const draft_id = Math.round((second_segment/user_id)**0.5);
    return [user_id, draft_id];
}

// const { authenticateToken } = require("../routes/authenticate");

app.get("/", (req, res) => {
   res.status(200).send(`Hello!`);
});

// app.use(authenticateToken);    

app.post("/pending", (req, res) => {
    console.log("pending req: " + JSON.stringify(req.body));
    const { user_id, draft_id, send_veri_interval, MAX_MISS_TIME, veri_mail_expiration } = req.body;

    if (mailpool.find(user_id, draft_id) != -1) //exist
    {
        res.status(400).send('this item is in the queue');
    } else {
        mailpool.push(new Mail(user_id, draft_id, send_veri_interval, MAX_MISS_TIME, veri_mail_expiration, mailpool));
        pending(draft_id)
            .then(() => {
                mailpool.toJson("./taskBackup/backup.json");
                res.status(200).send(`Pushed the mail to queue!`);
            }); 
    }
});
 
app.delete("/cancel", (req, res) => {
    console.log("cancel req: " + JSON.stringify(req.body));
    const { user_id, draft_id } = req.body;
    try {
        mailpool.delete(user_id, draft_id);
        cancel(draft_id)
            .then(() => {
                mailpool.toJson("./taskBackup/backup.json");
                res.status(200).send('Cancelled!');
            }); 

    } catch (err) {
        console.log("NOT FOUND")
        res.status(404).send('NOT FOUND');
    }
});

app.get("/verify/:t", (req, res) => {
    const valid_key = req.originalUrl.split("/")[2];
    console.log("verify req: " + valid_key );
    message = valid_key.split("?");

    ind = mailpool.find(...reverseHashID(message[0], message[1]));
    if (ind == -1) {
        console.log("USER NOT FOUND");
        res.redirect(303, "http://letteryou-test.us-east-2.elasticbeanstalk.com/verify-fail");
    } else {
        const result = mailpool.item(ind).GetVerification(message[2]);
        if (result < 0) {
            res.redirect(303, "http://letteryou-test.us-east-2.elasticbeanstalk.com/verify-fail");
        } 
        else{
            res.redirect(303, "http://letteryou-test.us-east-2.elasticbeanstalk.com/verify-ok");
            mailpool.toJson("./taskBackup/backup.json");
        }
    } 

});


new CronJob('* * * * * *', function() {
    let current = mailpool.peek();
    if (current && current.nextHandleTime <= Date.now()) {
        current.UpdateStatus();
    };
}, null, true, 'Asia/Taipei');


new CronJob('*/10 * * * * *', async() => {
    mailpool.toJson("./taskBackup/backup.json");
}, null, true, 'Asia/Taipei');


app.listen(port, () => { console.log(`Listening in port ${port}`); });

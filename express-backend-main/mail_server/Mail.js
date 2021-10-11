class Mail {
    
    constructor(user_id, draft_id, send_veri_interval, MAX_MISS_TIME, veri_mail_expiration, container){
      this.user_id = user_id;
      this.draft_id = draft_id;
      this.container = container;
      this.constructTime = Date.now();
      this._send_veri_interval = send_veri_interval;
      this.nextHandleTime = this.constructTime + send_veri_interval;

      this._status = "waiting for sending";
      this._MAX_MISS_TIME = MAX_MISS_TIME;
      this._DirectlySends = (MAX_MISS_TIME == 0);
      this._cumulativeMiss = 0;
      this._veri_mail_expiration = veri_mail_expiration;
      this._veri_token = "";
    };

    _hashID(){
        return (this.user_id**3 * this.draft_id**2 + "?" + this.user_id * this.draft_id**2);
    }

    
    _Status(){
        return this._status;
    };

    async _SendVerification(){ 
        const {sendVeriMail} = require("./PostalService.js");
        let token = "";
        for(let i = 0; i < 4; i++){token += Math.random().toString(36).substring(2);}; // generating random token
        this._veri_token = token;
        const valid_key = this._hashID()+"?" + token;
        console.log("Send a verification mail to " + this.user_id + "/" + this.draft_id);
        await sendVeriMail(this.user_id, valid_key);

        this._status = "waiting for verification";  //change status
        this.nextHandleTime = Date.now() + this._veri_mail_expiration;
        this.container.heapify();
    }

    GetVerification(token){
        if (token != this._veri_token)
            return -1;
        
        if(this._status == "waiting for verification")
        {
            console.log("Get verification mail from " + this.user_id + "/" + this.draft_id);
            this._veri_token = "";
            this.cumulativeMiss = 0;
            this._status = "waiting for sending";
            this.nextHandleTime = Date.now() + this._send_veri_interval;
            this.container.heapify();
            return 0;
        }
    };

    async _Miss(){
        this._cumulativeMiss++;
        if(this._cumulativeMiss >= this._MAX_MISS_TIME)
            this._sendMail();
        else{
            await this._SendVerification();
            console.log(this.user_id + "/" + this.draft_id + " has missed " + this._cumulativeMiss  + " mail(s).");
        }
        
    };
    
    async _sendMail(){
        const {sendMail} = require("./PostalService.js");
        console.log("Send a mail: " + this.user_id +"/"+ this.draft_id);
        sendMail(this.draft_id);
        this.container.delete(this.user_id, this.draft_id);
    };

    UpdateStatus(){
        if(this._DirectlySends){
            this._sendMail();
        }
        else{
            if(this._status == "waiting for sending")  //Time's up. Send a verification mail.
                this. _SendVerification();
            else{  // status == waiting for verification.  // Time's up. We haven't get a verification response yet.
                this._Miss();   
            }
        }
    };
};
  
module.exports = Mail;

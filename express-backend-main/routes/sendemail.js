const nodemailer = require('nodemailer');
const {google} = require('googleapis');
const dotenv = require('dotenv');
dotenv.config();

const REDIRECT_URI = 'https://developers.google.com.oauthplayground';
const oAuth2Client = new google.auth.OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET, REDIRECT_URI);

oAuth2Client.setCredentials({refresh_token: process.env.REFRESH_TOKEN});

const sendemail = async (email, subject, text) => {
  try{
    const accessToken = await oAuth2Client.getAccessToken();
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.MAILUSER,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: accessToken
      },
    });

    await transporter.sendMail({
      from: process.env.MAILUSER, // sender address
      to: email, // list of receivers
      subject: subject, // Subject line
      text: text, // plain text body
      //html: html, // html body
    });

    console.log("email sent sucessfully");
  } catch(error){
    console.log(error, "email not sent");
  }
  
}
   
module.exports = sendemail;
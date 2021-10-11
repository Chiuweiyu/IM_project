const resetpasswordRouter = require("express").Router();
const db = require("../db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const sendEmail = require("./sendemail");
const DatabaseError = require("../errors/DatabaseError");
const UnauthorizedError = require("../errors/UnauthorizedError");
const BadRequestError = require("../errors/BadRequestError");
const asyncHandler = require("../errors/asyncHandler");

module.exports = resetpasswordRouter;

// check email
const findNameByEmail = async (email) => {  
    const results = await db
        .query("SELECT * FROM users WHERE email = $1", [email])
        .catch((err) => {
            throw new DatabaseError("Something Went Wrong", err);
        });
  
    if (Array.isArray(results.rows) && results.rows.length < 1) {
        throw new NotFoundError("User Not Found");
      }
    return results.rows[0].username;
  };

const generateResetToken = (payload) => {
  return jwt.sign(payload, process.env.SECRET, {
      expiresIn: "1800s",
  });
};

const findPassByEmail = async(email) =>{
    const results = await db
        .query("SELECT * FROM users WHERE email = $1", [email])
        .catch((err) => {
            throw new DatabaseError("Something Went Wrong", err);
        });
  
    if (Array.isArray(results.rows) && results.rows.length < 1) {
        throw new NotFoundError("User Not Found");
      }
    return results.rows[0].password;
}

const findPassByName = async(username) =>{
    const results = await db
        .query("SELECT * FROM users WHERE username = $1", [username])
        .catch((err) => {
            throw new DatabaseError("Something Went Wrong", err);
        });
  
    if (Array.isArray(results.rows) && results.rows.length < 1) {
        throw new NotFoundError("User Not Found");
    }
    return results.rows[0].password;
}

const checkToken = async (token, username) => {
    if (token == null) {
        throw new BadRequestError("JWT Must Be Provided");
    }
    try {
        const payload = await jwt.decode(token, process.env.SECRET);
        const oldpass = await findPassByName(payload.name);
        if (payload.name === username && payload.pass === oldpass) {
        return true;
        }
        else{
            return false;
        }
    } catch (err) {
        throw new UnauthorizedError("JWT Verify Failed");
    }
  };

const sendresetemail = async(req, res, next) =>{
    const user = req.body;
    try{
        const username = await findNameByEmail(user.email);
        const password = await findPassByEmail(user.email);
        if(username !== null){
            const payload = {
                name: username,
                pass: password,
            };
            const token = generateResetToken(payload);
            const link = `${process.env.BASE_URL}/reset-page?token=${token}&username=${username}`;
            sendEmail(user.email, 'Resetpassword', link);
        }
        if(username === null){
            throw new UnauthorizedError("Invalid email");
        }
    } catch(err){
        return next(err);
    }
    res.status(200).send('Email was sent');
}

const resetpassword = async (req, res, next) =>{
    const user = req.body;
    const username = req.params.username;
    const userToken = req.params.token;
    const authen = await checkToken(userToken, username);
    console.log(authen);
    if(authen){
        const passwordHash = await bcrypt.hash(user.newpassword, 10);
        const command =
        "UPDATE users SET password = $1 WHERE username = $2 RETURNING *"; 
        
        const result = await db
            .query(command, [
                passwordHash,
                username,
            ])
            .catch((err) => {
                throw new DatabaseError("Upadate Failed", err);
            })
        if (typeof result.rows == "undefined") {
            return next(new NotFoundError("User not found"));
        }
    }
    else {
        throw new UnauthorizedError(`The link is expired`);
    }
     
    res.status(200).send(`Hello ${username}, your password has been reset!`);
};

resetpasswordRouter.post('/', asyncHandler(sendresetemail));
resetpasswordRouter.put('/:username/:token', asyncHandler(resetpassword));

// resetpasswordRouter.param("draft_id", (req, res, next, id) => {
//     req.draft_id = id;
//     return next();
//   });
  



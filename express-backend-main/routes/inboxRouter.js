const inboxRouter = require("express").Router();

const db = require("../db");

const { authenticateToken } = require("./authenticate");

const BadRequestError = require("../errors/BadRequestError");
const UnauthorizedError = require("../errors/UnauthorizedError");
const NotFoundError = require("../errors/NotFoundError");
const DatabaseError = require("../errors/DatabaseError");
const asyncHandler = require("../errors/asyncHandler");

module.exports = inboxRouter;

// find user, check user existence
// inboxRouter.use(asyncHandler(async (req, res, next) => {
//     const command = "SELECT EXISTS (SELECT 1 FROM users WHERE id = $1)";

//     const results = await db.query(command, [req.user_id]).catch((err) => {
//         throw new DatabaseError("Something Went Wrong", err);
//     });

//     if (results.rows[0].exists === false) {
//         throw new NotFoundError("User Not Found");
//     } else {
//         return next();
//     }
// }));

inboxRouter.use(authenticateToken);

// get user inbox
inboxRouter.get("/", asyncHandler(async (req, res, next) => {
    let command = "SELECT * FROM drafts WHERE owner_id = $1 AND status = 'inbox' ORDER BY drafts.created DESC";
    let params = [req.user_id];

    const results = await db.query(command, params).catch((err) => {
        throw new DatabaseError("Something Went Wrong", err);
    });

    res.status(200).json({
        inbox_letters: results.rows,
    });
}));
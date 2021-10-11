const draftBoxRouter = require("express").Router();

const db = require("../db");

const { authenticateToken } = require("./authenticate");

const asyncHandler = require("../errors/asyncHandler")
const BadRequestError = require("../errors/BadRequestError");
const UnauthorizedError = require("../errors/UnauthorizedError");
const NotFoundError = require("../errors/NotFoundError");
const DatabaseError = require("../errors/DatabaseError");

module.exports = draftBoxRouter;


// // find user, check user existence
// draftBoxRouter.use(asyncHandler(async (req, res, next) => {
//   const command = "SELECT EXISTS (SELECT 1 FROM users WHERE id = $1)";

//   const results = await db.query(command, [req.user_id]).catch((err) => {
//     throw new DatabaseError("Something Went Wrong", err);
//   });

//   if (results.rows[0].exists === false) {
//     throw new NotFoundError("User Not Found");
//   } else {
//     return next();
//   }
// }));


draftBoxRouter.use(authenticateToken);


// get user draft box
draftBoxRouter.get("/", asyncHandler(async(req, res, next) => {
    const command_draft = "SELECT * FROM drafts WHERE owner_id = $1 AND status = 'draft' ORDER BY drafts.created DESC";
    const command_pending = "SELECT * FROM drafts WHERE owner_id = $1 AND status = 'pending' ORDER BY drafts.created DESC";
    let command = req.query.hasOwnProperty('status') && req.query.status === 'pending' ? command_pending : command_draft
    let params = [req.user_id];

    const results = await db.query(command, params).catch((err) => {
        throw new DatabaseError("Something Went Wrong", err);
    });

    res.status(200).json({
        drafts: results.rows,
    });
}));


// create draft
draftBoxRouter.post("/", asyncHandler(async(req, res, next) => {
    let command = "INSERT INTO drafts (user_id, to_user_email, context, title, owner_id, send_veri_interval, MAX_MISS_TIME, veri_mail_expiration) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *";

    const svi = req.body.hasOwnProperty('send_veri_interval') ? req.body.send_veri_interval : null
    const mmt = req.body.hasOwnProperty('MAX_MISS_TIME') ? req.body.MAX_MISS_TIME : null
    const vme = req.body.hasOwnProperty('veri_mail_expiration') ? req.body.veri_mail_expiration : null

    const results = await db
        .query(command, [req.user_id, req.body.to_user_email, req.body.context, req.body.title, req.user_id, svi, mmt, vme])
        .catch((err) => {
            throw new DatabaseError("Something Went Wrong", err);
        });

    res.status(201).json({
        draft_id: results.rows[0].id,
    });
}));


draftBoxRouter.param("draft_id", (req, res, next, id) => {
    req.draft_id = id;
    return next();
});


// get draft
draftBoxRouter.get("/:draft_id", asyncHandler(async(req, res, next) => {
    let command = "SELECT * FROM drafts WHERE id = $1 AND user_id = $2";

    const results = await db
        .query(command, [req.draft_id, req.user_id])
        .catch((err) => {
            throw new DatabaseError("Something Went Wrong", err);
        });

    if (Array.isArray(results.rows) && results.rows.length < 1) {
        throw new NotFoundError("Draft Not Found");
    }
    res.status(200).json(results.rows[0]);
}));


// update draft
draftBoxRouter.put("/:draft_id", asyncHandler(async(req, res, next) => {
    const command =
        "UPDATE drafts SET to_user_email = $1, context = $2, title = $3, send_veri_interval = $4, MAX_MISS_TIME = $5, veri_mail_expiration = $6 WHERE id = $7 RETURNING *";

    const svi = req.body.hasOwnProperty('send_veri_interval') ? req.body.send_veri_interval : null
    const mmt = req.body.hasOwnProperty('MAX_MISS_TIME') ? req.body.MAX_MISS_TIME : null
    const vme = req.body.hasOwnProperty('veri_mail_expiration') ? req.body.veri_mail_expiration : null

    const results = await db
        .query(command, [req.body.to_user_email, req.body.context, req.body.title, svi, mmt, vme, req.draft_id])
        .catch((err) => {
            throw new DatabaseError("Something Went Wrong", err);
        });

    if (typeof results.rows == "undefined") {
        return next(new NotFoundError("Resource not found"));
    } else if (Array.isArray(results.rows) && results.rows.length < 1) {
        return next(new NotFoundError("Draft not found"));
    }

    res.status(200).json({ message: `Updated draft ${req.draft_id} of UID ${req.user_id}` });
}));


// delete draft
draftBoxRouter.delete("/:draft_id", asyncHandler(async(req, res, next) => {
    const command = "DELETE FROM drafts WHERE id = $1 AND user_id = $2";

    await db.query(command, [req.draft_id, req.user_id]).catch((err) => {
        throw new DatabaseError("Something Went Wrong", err);
    });

    res.status(204).send();
}));
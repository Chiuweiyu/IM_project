/*
    Central Router
        Any incoming requests will be routed to this place then get distributed
*/
const apiRouter = require('express').Router();

const { authenticateUser, registerUser, deleteUser, authenticateToken, emailVerifyUser } = require('./authenticate');
const draftBoxRouter = require('./draftBoxRouter');
const DatabaseError = require('../errors/DatabaseError');
const asyncHandler = require('../errors/asyncHandler');
const resetpasswordRouter = require('./resetpassword.js');

module.exports = apiRouter;

// home page
apiRouter.get('/', (req, res) => {
    res.send('Home Page');
})

// login & register
apiRouter.get('/login', (req, res, next) => {
    res.status(200).send();
})

apiRouter.post('/login', asyncHandler(authenticateUser));

apiRouter.post('/register', asyncHandler(registerUser));

apiRouter.delete('/register', authenticateToken, asyncHandler(deleteUser));

apiRouter.put('/emailverify/:username/:token', asyncHandler(emailVerifyUser));

apiRouter.use('/resetpassword', resetpasswordRouter);


// draft box
apiRouter.use('/users/:user_id/draft-box', (req, res, next) => {
    req.user_id = req.params.user_id;
    next();
}, require('./draftBoxRouter'));

// inbox
apiRouter.use('/users/:user_id/inbox', (req, res, next) => {
    req.user_id = req.params.user_id;
    next();
}, require('./inboxRouter'));

// error handlers
apiRouter.use((err, req, res, next) => {
    if (err instanceof DatabaseError) {
        console.error(`${err.name}: ${err.message}`);
        if (err.inner) console.error(`${err.inner.name}: ${err.inner.message}`);
    }
    next(err);
});

apiRouter.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
        error: {
            message: err.message
        }
    });
})
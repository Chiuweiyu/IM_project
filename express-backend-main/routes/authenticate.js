const db = require("../db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const sendEmail = require("./sendemail");
const BadRequestError = require("../errors/BadRequestError");
const UnauthorizedError = require("../errors/UnauthorizedError");
const DatabaseError = require("../errors/DatabaseError");

/* used as middleware to anthenticate every request */
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    return next(new BadRequestError("JWT Must Be Provided"));
  }

  try {
    let decoded = jwt.verify(token, process.env.SECRET);
    req.payload = decoded;
  } catch (err) {
    if (err.message == "jwt expired") {
      return res.redirect(303, '/')
    }
    return next(err);
  }

  return next();
};

/* for refreshing token maybe? */
const generateAccessToken = (payload) => {
  return jwt.sign(payload, process.env.SECRET, {
    expiresIn: "3600s",
  });
};

// generate email verify token
const generateVerifyToken = (payload) => {
  return jwt.sign(payload, process.env.SECRET, {
    expiresIn: "1800s",
  });
};

// verify email register token
const verifyToken = async (token, username) => {
  if (token == null) {
    throw new BadRequestError("JWT Must Be Provided");
  }

  try {
    const payload = await jwt.decode(token, process.env.SECRET);
    const trashEmail = await findEmailByName(payload.name);
    if (payload.name === username && payload.email === trashEmail) {
      return true;
    }
    else {
      return false;
    }
  } catch (err) {
    throw new UnauthorizedError("Email Verify Failed");
  }
};
/* 
    1. authenticate user name 
    2. validate password
    3. generate JWT token
    4. return response
*/
const authenticateUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  const username = authHeader && authHeader.split(" ")[1].split(":")[0];
  const claimedPassword = authHeader && authHeader.split(" ")[1].split(":")[1];

  // if missing username or password
  if (username == null || claimedPassword == null) {
    throw new BadRequestError(
      'WWW-Authenticate: Bearer realm="Protected User Realm"'
    );
  }

  const results = await db
    .query("SELECT * FROM users WHERE username = $1", [username])
    .catch((err) => {
      throw new DatabaseError("Something Went Wrong", err);
    });

  if (Array.isArray(results.rows) && results.rows.length < 1) {
    throw new UnauthorizedError("Invalid Username");
  }

  const user = results.rows[0];

  const match = await bcrypt.compare(claimedPassword, user.password);

  if (!match) {
    throw new UnauthorizedError(`Invalid Password`);
  }

  const { password, ...payload } = user;

  const token = generateAccessToken(payload);

  console.log(`User ID ${user.id} Authenticated.`);

  res.status(200).json({
    username: user.username,
    user_id: user.id,
    token: token
  });
};

// check email from mainuser
const findEmail = async (email) => {
  const command = "SELECT EXISTS (SELECT 1 FROM users WHERE email = $1)";

  const results = await db.query(command, [email]).catch((err) => {
    throw new DatabaseError("Something Went Wrong", err);
  });

  if (results.rows[0].exists === true) {
    throw new UnauthorizedError("Email has been taken");
  }
  return false;
};

// check email from trashuser
const findTrashEmail = async (email) => {
  const command = "SELECT EXISTS (SELECT 1 FROM trashusers WHERE email = $1)";

  const results = await db.query(command, [email]).catch((err) => {
    throw new DatabaseError("Something Went Wrong", err);
  });

  if (results.rows[0].exists === true) {
    return true;
  }
  return false;
};

// check username
const findUsername = async (username) => {
  const command = "SELECT EXISTS (SELECT 1 FROM users WHERE username = $1)";

  const results = await db.query(command, [username]).catch((err) => {
    throw new DatabaseError("Something Went Wrong", err);
  });

  if (results.rows[0].exists === true) {
    throw new UnauthorizedError("Username has been taken");
  }
  return false;
};

// check username from trashtable
const findTrashUsername = async (username) => {
  const command = "SELECT EXISTS (SELECT 1 FROM trashusers WHERE username = $1)";

  const results = await db.query(command, [username]).catch((err) => {
    throw new DatabaseError("Something Went Wrong", err);
  });

  if (results.rows[0].exists === true) {
    throw new UnauthorizedError("Username has been taken");
  }
  return false;
}

// ONLY used for trashusers
const findEmailByName = async (username) => {
  const results = await db
    .query("SELECT * FROM trashusers WHERE username = $1", [username])
    .catch((err) => {
      throw new DatabaseError("Something Went Wrong", err);
    });

  if (Array.isArray(results.rows) && results.rows.length < 1) {
    throw new NotFoundError("User Not Found");
  }
  return results.rows[0].email;
}
// add user to mainuser
const addMainUser = async (user) => {
  // password had been hashed when added into trashuser table
  const command =
    "INSERT INTO users (first_name, last_name, email, username, password) VALUES ($1, $2, $3, $4, $5) RETURNING *";
  const results = await db
    .query(command, [
      user.first_name,
      user.last_name,
      user.email,
      user.username,
      user.password,
    ])
    .catch((err) => {
      throw new DatabaseError("Insertion Failed", err);
    });

  if (Array.isArray(results.rows) && results.rows.length < 1) {
    throw new DatabaseError("Something Went Wrong");
  }

  return true;
}

// add user to trashuser
const addTrashUser = async (user) => {
  const password = user.password;
  //console.log(passsword);
  const passwordHash = await bcrypt.hash(password, 10);
  const command =
    "INSERT INTO trashusers (first_name, last_name, email, username, password) VALUES ($1, $2, $3, $4, $5) RETURNING *";
  const results = await db
    .query(command, [
      user.first_name,
      user.last_name,
      user.email,
      user.username,
      passwordHash,
    ])
    .catch((err) => {
      throw new DatabaseError("Insertion Failed", err);
    });

  if (Array.isArray(results.rows) && results.rows.length < 1) {
    throw new DatabaseError("Something Went Wrong");
  }
  return true;
}

// delete user by email
const deleteUserByEmail = async (email) => {
  const command = "DELETE FROM trashusers WHERE email = $1";
  await db.query(command, [email]).catch((err) => {
    throw new DatabaseError("Something Went Wrong", err);
  });
}

// register user
const registerUser = async (req, res, next) => {
  const user = req.body;

  const mainChecks = await Promise.all([
    findEmail(user.email),
    findUsername(user.username),
  ]);

  const trashChecks = await findTrashEmail(user.email);
  // avoid repeat register 
  // delete previous not verified register
  if (trashChecks === true) {
    await deleteUserByEmail(user.email);
  }
  const trashNameCheck = await findTrashUsername(user.username);
  await addTrashUser(user);

  try {
    const payload = {
      name: user.username,
      email: user.email,
    };
    const token = generateVerifyToken(payload);
    const link = `${process.env.BASE_URL}/reset-page?token=${token}&username=${user.username}`;

    await sendEmail(user.email, 'Email Verification', link);
  } catch (err) {
    return next(err);
  }

  res.status(200).send('Verfication Email was sent, pleas check your mailbox!');
};

const emailVerifyUser = async (req, res, next) => {
  const username = req.params.username;
  const userToken = req.params.token;

  const verify = await verifyToken(userToken, username);
  if (verify) {
    const results = await db
      .query("SELECT * FROM trashusers WHERE username = $1", [username])
      .catch((err) => {
        throw new DatabaseError("Something Went Wrong", err);
      });

    if (Array.isArray(results.rows) && results.rows.length < 1) {
      throw new UnauthorizedError("Invalid Username");
    }
    const user = results.rows[0];
    await addMainUser(user);
    await deleteUserByEmail(user.email);
  }
  res.status(200).json({
    authenticated: true,
    message: `Hello New User, ${username}!`,
  });
};

const deleteUser = async (req, res, next) => {
  const command = "DELETE FROM users WHERE username = $1";

  console.log(req.payload.username)

  await db.query(command, [req.payload.username]).catch((err) => {
    throw new DatabaseError("Deletion Failed", err);
  })

  res.redirect(301, '/login');
}

module.exports = {
  authenticateToken,
  authenticateUser,
  registerUser,
  deleteUser,
  emailVerifyUser,
};



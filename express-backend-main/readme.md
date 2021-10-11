# Usage

## clone repository
```bash
cd ~/YOUR_WORKSPACE_PATH
git clone https://github.com/Vertical-Perpendicular/express-backend.git
```

## install dependencies

```bash
npm install
```

## start server

```bash
npm start
npm dev
```

It'll restart the server whenever there's file changes.

## Handy API(s)

### Database access

For simply one query,

```javascript
const db = require(`${relative_dir}/db`);

const command = 'SELECT * FROM table_name WHERE attr1=$1 and attr2=$2';

const results = db.query(command, [attr1, attr2]);

console.log(results.rows);
```
yet u first need to setup database configs in /db/index.js
```
const command = "SELECT * FROM table_name WHERE attr1=$1 and attr2=$2";

const results = await db.query(command, [attr1, attr2]);

console.log(results.rows);
```

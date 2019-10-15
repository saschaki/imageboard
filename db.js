const spicedPg = require("spiced-pg");
/*
let db;
if (process.env.DATABASE_URL) {
    db = spicedPg(process.env.DATABASE_URL);
} else {
    const { dbUser, dbPass } = require("./secrets");
    db = spicedPg(`postgres://${dbUser}:${dbPass}@localhost:5432/imageboard`);
}
*/
let db;
db = spicedPg(`postgres://postgres:postgres@localhost:5432/imageboard`);

function getOrderedImages() {
    return db.query(`SELECT * FROM images ORDER BY id DESC;`);
}

module.exports = {
    getOrderedImages
};

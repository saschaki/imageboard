const { dbUser, dbPass } = require("./secrets.json");
const spicedPg = require("spiced-pg");
const db = spicedPg(`postgres://${dbUser}:${dbPass}@localhost:5432/imageboard`);

function getImages() {
    return db.query(`
        SELECT *,
            (SELECT Min(id) FROM images)
            AS lowest_id
        FROM images
        ORDER BY id DESC
        LIMIT 1;`);
}

function getMoreImages(oldestId) {
    return db
        .query(
            `SELECT *,
                (SELECT Min(id) FROM images)
                AS lowest_id
            FROM images WHERE id < $1
            ORDER BY id DESC
            LIMIT 1;`,
            [oldestId]
        )
        .catch(err => {
            console.log(err);
            return Promise.reject(new Error("Can't get more images"));
        });
}

function getImage(id) {
    return db.query(`SELECT * FROM images WHERE $1 = id`, [id]);
}

function getComments(imageId) {
    return db
        .query(`SELECT * FROM comments WHERE $1 = image_id ORDER BY id DESC;`, [
            imageId
        ])
        .catch(err => {
            console.log(err);
            return Promise.reject(new Error("Can't get comments"));
        });
}

function addImage(username, title, desc, imageUrl) {
    return db
        .query(
            `
        INSERT INTO images (username, title, description, url) VALUES ($1, $2, $3, $4) RETURNING *;
        `,
            [username, title, desc, imageUrl]
        )
        .catch(err => {
            console.log(err);
            return Promise.reject(new Error("Can't insert image"));
        });
}

function addComment(username, comment, imageId) {
    return db
        .query(
            `
        INSERT INTO comments (username, comment, image_id) VALUES ($1, $2, $3) RETURNING *;
        `,
            [username, comment, imageId]
        )
        .catch(err => {
            console.log(err);
            return Promise.reject(new Error("Can't insert comment"));
        });
}

function deleteImage(id) {
    return db
        .query(`DELETE FROM images CASCADE WHERE id = $1`, [id])
        .catch(err => {
            console.log(err);
            return Promise.reject(new Error("Can't delete comment"));
        });
}

function deleteComment(id) {
    return db.query(
        `
        DELETE FROM comments
        WHERE image_id = $1
        `,
        [id]
    );
}

module.exports = {
    getImages,
    getMoreImages,
    getImage,
    getComments,
    addImage,
    addComment,
    deleteImage,
    deleteComment
};

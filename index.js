const express = require("express");
const app = express();
//const db = require("./db");
const {
    getImages,
    getMoreImages,
    getImage,
    addImage,
    getComments,
    addComment,
    deleteImage,
    deleteComment
} = require("./db");
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");
const s3 = require("./s3");
const { s3Url } = require("./config");
const port = 8080;

const diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 4097152
    }
});

app.use(
    express.urlencoded({
        extended: false
    })
);

app.use(express.json());

app.use(express.static("./public"));
app.get("/images", (req, res) => {
    getImages()
        .then(({ rows }) => {
            res.json(rows);
        })
        .catch(err => {
            console.log(err);
        });
});

app.get("/more-images/:oldestId", (req, res) => {
    const { oldestId } = req.params;
    getMoreImages(oldestId)
        .then(({ rows }) => {
            res.json(rows);
        })
        .catch(err => {
            console.log(err);
        });
});

app.get("/images/:imageId", (req, res) => {
    const { imageId } = req.params;
    getImage(imageId)
        .then(({ rows }) => {
            console.log(("testrun", rows[0]));
            res.json(rows);
        })
        .catch(err => {
            console.log(err);
        });
});

app.post("/upload", uploader.single("image"), s3.upload, (req, res) => {
    const { username, title, desc } = req.body;
    const { file } = req;
    const url = `${s3Url}${file.filename}`;
    addImage(username, title, desc, url)
        .then(({ rows }) => {
            res.json(rows[0]);
        })
        .catch(err => {
            console.log(err);
            res.sendStatus(500);
        });
});

app.get("/images/:id/comments", (req, res) => {
    const { id: imageId } = req.params;
    getComments(imageId)
        .then(({ rows }) => {
            res.json(rows);
        })
        .catch(err => {
            console.log(err);
        });
});

app.post("/images/:id/comments", (req, res) => {
    const { username, comment, imageId } = req.body;
    addComment(username, comment, imageId)
        .then(({ rows }) => {
            res.json(rows[0]);
        })
        .catch(err => {
            console.log(err);
            res.sendStatus(500);
        });
});

app.post("/delete/:id", (req, res) => {
    const { id: imageId } = req.params;
    deleteComment(Number(imageId))
        .then(deleteImage(Number(imageId)))
        .then(() => getImage())
        .then(({ rows }) => {
            res.json(rows);
        });
});

app.listen(port, console.log("Server is listening on port ", port));

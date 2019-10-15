const express = require("express");
const app = express();
const port = 8080;
const { getOrderedImages, addImage } = require("./db");
app.use(express.static("./public"));
app.use(express.static("./uploads"));

const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");
const s3 = require("./s3");
const { s3Url } = require("./config");

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
        fileSize: 2097152
    }
});

app.get("/images", (req, res) => {
    getOrderedImages()
        .then(({ rows }) => {
            res.json(rows);
        })
        .catch(error => {
            console.log(error);
        });
});

app.post("/upload", uploader.single("image"), s3.upload, function(req, res) {
    const { username, title, desc } = req.body;
    const imageUrl = `${s3Url}${req.file.filename}`;
    addImage(imageUrl, username, title, desc)
        .then(function({ rows }) {
            console.log("image added");
            res.json({ username, title, desc, imageUrl, id: rows[0].id });
        })
        .catch(function(err) {
            console.log(err);
            res.sendStatus(500);
        });
    //console.log(req.body);
    if (req.file) {
        /*
        res.json({
            success: true
        });
        */
        console.log("Upload worked");
        res.sendStatus(200);
    } else {
        /*
        res.json({
            success: false
        });
        */
        console.log("Upload Error");
        res.sendStatus(500);
    }
});

app.listen(port, () => console.log(`I'm listening.`));

const express = require("express");
const app = express();
const port = 8080;
const { getOrderedImages } = require("./db");

app.use(express.static("./public"));

app.get("/images", (req, res) => {
    getOrderedImages().then(({ rows }) => {
        res.json(rows);
    });
});

app.listen(port, () => console.log(`I'm listening.`));

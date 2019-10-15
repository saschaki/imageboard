const aws = require("aws-sdk");
const fs = require("fs");

let secrets;
if (process.env.NODE_ENV == "production") {
    secrets = process.env; // in prod the secrets are environment variables
} else {
    secrets = require("./secrets"); // in dev they are in secrets.json which is listed in .gitignore
}

const s3 = new aws.S3({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET
});

exports.upload = function(req, res, next) {
    if (!req.file) {
        //if multer fails
        console.log("multer failed");
        res.sendStatus(500);
        return;
    }
    const { filename, mimetype, size, path } = req.file;

    s3.putObject({
        Bucket: "spicedling", //if own amazone bucket own name
        ACL: "public-read", //everyone who has the url can see the image
        Key: filename,
        Body: fs.createReadStream(path), //content of the object
        ContentType: mimetype, //headers that amazon senst when user access, contentheader, sizeheader, required
        ContentLength: size
    })
        .promise()
        .then(() => {
            console.log("worked");
            //worked
            next();
        })
        .catch(err => {
            //uh oh
            console.log(err);
            res.sendStatus(500);
        });
};

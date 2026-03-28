const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

app.use(express.static("../frontend"));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

app.post("/upload", upload.single("image"), (req, res) => {

    const description = req.body.description;
    const imageName = req.file.filename;

    const newReport = {
        image: imageName,
        description: description
    };

    const data = JSON.parse(fs.readFileSync("reports.json"));

    data.push(newReport);

    fs.writeFileSync("reports.json", JSON.stringify(data, null, 2));

    console.log("Report saved:", newReport);

    res.send("Report uploaded successfully");



});

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
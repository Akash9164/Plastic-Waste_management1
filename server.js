const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();

app.use(cors());
app.use(express.json());

const uploadsDir = "uploads";

// create uploads folder if it doesn't exist
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

app.post("/upload", upload.single("image"), (req, res) => {

  try {

    const description = req.body.description;
    const imageName = req.file.filename;

    const newReport = {
      image: imageName,
      description: description
    };

    let data = [];

    if (fs.existsSync("reports.json")) {
      const fileContent = fs.readFileSync("reports.json");
      data = JSON.parse(fileContent || "[]");
    }

    data.push(newReport);

    fs.writeFileSync("reports.json", JSON.stringify(data, null, 2));

    console.log("Report saved:", newReport);

    res.json({
      message: "Report uploaded successfully!"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Upload failed"
    });

  }

});

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});

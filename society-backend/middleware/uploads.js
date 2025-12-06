const multer = require("multer");
const fs = require("fs");
const path = require("path");

// Path to uploads folder (relative to backend root)
const uploadDir = path.join(__dirname, "../uploads");

// Create folder if it doesn’t exist
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("✅ Created uploads folder at:", uploadDir);
}

// Multer storage (temporary save in uploads folder)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Temporary file name — Sharp will overwrite with processed version
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// File filter (optional: allow only images)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

module.exports = upload;

import express from "express";
import multer from "multer";
import Jimp from "jimp";
import cors from "cors";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const app = express();

// CORS
app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
}));

app.use(express.json());

// Path setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const imagesDir = path.join(__dirname, "images");
const editsDir = path.join(__dirname, "edits");

if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir);
if (!fs.existsSync(editsDir)) fs.mkdirSync(editsDir);

// MULTER STORAGE WITH EXT
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, imagesDir),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const unique = Date.now() + "-" + Math.round(Math.random() * 1E9);
        cb(null, unique + ext);
    }
});

const upload = multer({ storage });

// Upload route
app.post("/upload", upload.single("image"), (req, res) => {
    res.json({ filename: req.file.filename });
});

// Serve original images
app.get("/image/:filename", (req, res) => {
    res.sendFile(path.join(imagesDir, req.params.filename));
});

// Serve edited images (**FIX HERE**)
app.get("/edit-image/:filename", (req, res) => {
    res.sendFile(path.join(editsDir, req.params.filename));
});

// Edit logic
app.post("/edit", async (req, res) => {
    try {
        const { filename, text } = req.body;

        const ext = path.extname(filename);
        const base = path.basename(filename, ext);
        const editedName = `edited_${base}${ext}`;

        const imgPath = path.join(imagesDir, filename);
        const outputPath = path.join(editsDir, editedName);

        const image = await Jimp.read(imgPath);
        const font = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);

        image.print(font, 10, 10, text);
        await image.writeAsync(outputPath);

        res.json({ edited: editedName });

    } catch (err) {
        console.error("EDIT ERROR:", err);
        res.status(500).json({ error: err.message });
    }
});

app.listen(3001, () => console.log("Image service running on port 3001"));

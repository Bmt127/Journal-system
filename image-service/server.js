import express from "express";
import multer from "multer";
import Jimp from "jimp";
import cors from "cors";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

/* =========================
   KEYCLOAK AUTH
========================= */
import { expressjwt } from "express-jwt";
import jwksRsa from "jwks-rsa";

/* =========================
   APP INIT
========================= */
const app = express();
const PORT = process.env.PORT || 8080;

/* =========================
   KEYCLOAK CONFIG
========================= */
const KEYCLOAK_URL = "https://keycloakk.app.cloud.cbh.kth.se";
const KEYCLOAK_REALM = "healthcare-realm";
const KEYCLOAK_CLIENT_ID = "image-service";

const checkJwt = expressjwt({
    secret: jwksRsa.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${KEYCLOAK_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/certs`
    }),
    audience: KEYCLOAK_CLIENT_ID,
    issuer: `${KEYCLOAK_URL}/realms/${KEYCLOAK_REALM}`,
    algorithms: ["RS256"]
});

/* =========================
   MIDDLEWARE
========================= */
app.use(cors({
    origin: "*",
    methods: ["GET", "POST"]
}));

app.use(express.json());

/* =========================
   PATH SETUP
========================= */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const imagesDir = path.join(__dirname, "images");
const editsDir = path.join(__dirname, "edits");

fs.mkdirSync(imagesDir, { recursive: true });
fs.mkdirSync(editsDir, { recursive: true });

/* =========================
   HEALTH CHECK (OPEN)
========================= */
app.get("/healthz", (req, res) => {
    res.status(200).send("OK");
});

/* =========================
   AUTH REQUIRED BELOW
========================= */
app.use(checkJwt);

/* =========================
   MULTER STORAGE
========================= */
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, imagesDir),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, unique + ext);
    }
});

const upload = multer({ storage });

/* =========================
   ROUTES
========================= */

// Upload image
app.post("/upload", upload.single("image"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No image uploaded" });
    }

    res.json({
        filename: req.file.filename,
        url: `/image/${req.file.filename}`
    });
});

// Serve original images
app.get("/image/:filename", (req, res) => {
    const filePath = path.join(imagesDir, req.params.filename);

    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: "Image not found" });
    }

    res.sendFile(filePath);
});

// Serve edited images
app.get("/edit-image/:filename", (req, res) => {
    const filePath = path.join(editsDir, req.params.filename);

    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: "Edited image not found" });
    }

    res.sendFile(filePath);
});

// Edit image (add text)
app.post("/edit", async (req, res) => {
    try {
        const { filename, text } = req.body;

        if (!filename || !text) {
            return res.status(400).json({ error: "filename and text required" });
        }

        const ext = path.extname(filename);
        const base = path.basename(filename, ext);
        const editedName = `edited_${base}${ext}`;

        const inputPath = path.join(imagesDir, filename);
        const outputPath = path.join(editsDir, editedName);

        if (!fs.existsSync(inputPath)) {
            return res.status(404).json({ error: "Original image not found" });
        }

        const image = await Jimp.read(inputPath);
        const font = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);

        image.print(font, 10, 10, text);
        await image.writeAsync(outputPath);

        res.json({
            edited: editedName,
            url: `/edit-image/${editedName}`
        });

    } catch (err) {
        console.error("EDIT ERROR:", err);
        res.status(500).json({ error: err.message });
    }
});

/* =========================
   START SERVER
========================= */
app.listen(PORT, () => {
    console.log(`Image service running on port ${PORT}`);
});

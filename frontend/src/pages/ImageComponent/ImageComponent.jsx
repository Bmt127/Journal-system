import { useState } from "react";
import axios from "axios";
import "./ImageComponent.css";

const api = axios.create({
    baseURL: "http://localhost:3001"
});

export default function ImageComponent() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadedFilename, setUploadedFilename] = useState("");
    const [editText, setEditText] = useState("");
    const [editedFilename, setEditedFilename] = useState("");

    async function handleUpload() {
        if (!selectedFile) return alert("Välj en bild först");

        const formData = new FormData();
        formData.append("image", selectedFile);

        try {
            const response = await api.post("/upload", formData);
            setUploadedFilename(response.data.filename);
            setEditedFilename("");
        } catch (err) {
            console.error(err);
            alert("Kunde inte ladda upp bild");
        }
    }

    async function handleEdit() {
        if (!uploadedFilename) return alert("Ingen bild uppladdad");
        if (!editText.trim()) return alert("Ingen text angiven");

        try {
            const response = await api.post("/edit", {
                filename: uploadedFilename,
                text: editText
            });

            setEditedFilename(response.data.edited);
        } catch (err) {
            console.error(err);
            alert("Gick inte att redigera bilden");
        }
    }

    return (
        <div className="image-container">
            <h2>Bildhantering</h2>

            <div className="upload-section">
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setSelectedFile(e.target.files[0])}
                />
                <button onClick={handleUpload}>Ladda upp bild</button>
            </div>

            {uploadedFilename && (
                <div className="preview-section">
                    <h3>Uppladdad bild</h3>
                    <img
                        src={`http://localhost:3001/image/${uploadedFilename}`}
                        alt="uploaded"
                        className="preview-image"
                    />
                </div>
            )}

            {uploadedFilename && (
                <div className="edit-section">
                    <input
                        type="text"
                        placeholder="Text att skriva på bilden"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                    />
                    <button onClick={handleEdit}>Lägg till text</button>
                </div>
            )}

            {editedFilename && (
                <div className="preview-section">
                    <h3>Redigerad bild</h3>

                    <img
                        src={`http://localhost:3001/edit-image/${editedFilename}`}
                        alt="edited"
                        className="preview-image"
                    />
                </div>
            )}
        </div>
    );
}

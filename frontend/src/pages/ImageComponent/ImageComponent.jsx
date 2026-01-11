import { useState } from "react";
import { imageApi } from "../../api/imageApi";
import "./ImageComponent.css";

export default function ImageComponent() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadedFilename, setUploadedFilename] = useState("");
    const [editText, setEditText] = useState("");
    const [editedFilename, setEditedFilename] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleUpload() {
        if (!selectedFile) {
            alert("Välj en bild först");
            return;
        }

        const formData = new FormData();
        formData.append("image", selectedFile);

        try {
            setLoading(true);

            const res = await imageApi.post("/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            setUploadedFilename(res.data.filename);
            setEditedFilename("");
            setEditText("");
        } catch (err) {
            console.error(err);
            alert("Kunde inte ladda upp bild");
        } finally {
            setLoading(false);
        }
    }

    async function handleEdit() {
        if (!uploadedFilename) {
            alert("Ingen bild uppladdad");
            return;
        }

        if (!editText.trim()) {
            alert("Ange text");
            return;
        }

        try {
            setLoading(true);

            const res = await imageApi.post("/edit", {
                filename: uploadedFilename,
                text: editText
            });

            setEditedFilename(res.data.edited);
        } catch (err) {
            console.error(err);
            alert("Gick inte att redigera bilden");
        } finally {
            setLoading(false);
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
                <button onClick={handleUpload} disabled={loading}>
                    {loading ? "Laddar..." : "Ladda upp bild"}
                </button>
            </div>

            {uploadedFilename && (
                <div className="preview-section">
                    <h3>Uppladdad bild</h3>
                    <img
                        src={`/image-api/image/${uploadedFilename}`}
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
                    <button onClick={handleEdit} disabled={loading}>
                        {loading ? "Bearbetar..." : "Lägg till text"}
                    </button>
                </div>
            )}

            {editedFilename && (
                <div className="preview-section">
                    <h3>Redigerad bild</h3>
                    <img
                        src={`/image-api/edit-image/${editedFilename}`}
                        alt="edited"
                        className="preview-image"
                    />
                </div>
            )}
        </div>
    );
}

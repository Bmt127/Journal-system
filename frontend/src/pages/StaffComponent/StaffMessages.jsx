import { useEffect, useState, useRef, useCallback } from "react";
import { userApi } from "../../api/userApi";
import { messageApi } from "../../api/messageApi";
import {
    TextareaAutosize,
    Button,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    Typography,
    Paper
} from "@mui/material";
import "./StaffMessages.css";

export default function StaffMessages() {
    const [conversation, setConversation] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [content, setContent] = useState("");
    const [error, setError] = useState(null);

    const endRef = useRef(null);

    /* -----------------------------
       Load users
    ------------------------------*/
    useEffect(() => {
        const loadUsers = async () => {
            try {
                const res = await userApi.get("/users");
                setUsers(res.data);
            } catch {
                setError("Kunde inte hämta användare");
            }
        };
        loadUsers();
    }, []);

    /* -----------------------------
       Load conversation
    ------------------------------*/
    const loadConversation = useCallback(async (otherKeycloakId) => {
        if (!otherKeycloakId) {
            setConversation([]);
            return;
        }

        try {
            const res = await messageApi.get(`/messages/me/conversation/${otherKeycloakId}`);
            setConversation(res.data || []);
        } catch {
            setError("Kunde inte ladda konversation");
        }
    }, []);

    useEffect(() => {
        if (selectedUser) {
            loadConversation(selectedUser.keycloakId);
        }
    }, [selectedUser, loadConversation]);

    /* -----------------------------
       Auto scroll
    ------------------------------*/
    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [conversation]);

    /* -----------------------------
       Send
    ------------------------------*/
    const handleSend = async () => {
        if (!content.trim() || !selectedUser) return;

        try {
            await messageApi.post("/messages/me", {
                receiverKeycloakId: selectedUser.keycloakId,
                content: content.trim()
            });

            setContent("");
            await loadConversation(selectedUser.keycloakId);
        } catch {
            setError("Kunde inte skicka meddelande");
        }
    };

    const getSenderName = (keycloakId) => {
        const u = users.find(x => x.keycloakId === keycloakId);
        return u ? `${u.username} (${u.role})` : "Okänd";
    };

    return (
        <div className="message-container">
            <Typography variant="h5" sx={{ mb: 2 }}>Meddelanden</Typography>

            {error && <Typography color="error">{error}</Typography>}

            <FormControl fullWidth size="small" sx={{ mb: 3 }}>
                <InputLabel>Välj person</InputLabel>
                <Select
                    value={selectedUser ? selectedUser.keycloakId : ""}
                    onChange={(e) => {
                        const u = users.find(x => x.keycloakId === e.target.value);
                        setSelectedUser(u);
                    }}
                >
                    {users
                        .filter(u => u.role === "PATIENT" || u.role === "DOCTOR")
                        .map(u => (
                            <MenuItem key={u.keycloakId} value={u.keycloakId}>
                                {u.username} ({u.role})
                            </MenuItem>
                        ))}
                </Select>
            </FormControl>

            {selectedUser && (
                <>
                    <div className="message-list">
                        {conversation.length === 0 && (
                            <Typography variant="body2">Ingen konversation än.</Typography>
                        )}

                        {conversation.map(m => (
                            <Paper
                                key={m.id}
                                className={`message-item ${
                                    m.senderKeycloakId === selectedUser.keycloakId
                                        ? "received"
                                        : "sent"
                                }`}
                            >
                                <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                                    {getSenderName(m.senderKeycloakId)}
                                </Typography>
                                <Typography>{m.content}</Typography>
                                <Typography variant="caption">
                                    {new Date(m.timestamp).toLocaleString()}
                                </Typography>
                            </Paper>
                        ))}

                        <div ref={endRef} />
                    </div>

                    <Paper sx={{ p: 2, mt: 2 }}>
                        <TextareaAutosize
                            minRows={3}
                            placeholder="Skriv ett meddelande..."
                            className="message-input"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                        <Button variant="contained" sx={{ mt: 1 }} onClick={handleSend}>
                            Skicka
                        </Button>
                    </Paper>
                </>
            )}
        </div>
    );
}

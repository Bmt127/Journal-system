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
import "./MessagePage.css";

export default function MessagePage() {
    const [conversation, setConversation] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [content, setContent] = useState("");
    const [error, setError] = useState(null);

    const messagesEndRef = useRef(null);

    /* ----------------------------------
       Load users from user-service
    -----------------------------------*/
    useEffect(() => {
        const loadUsers = async () => {
            try {
                const res = await userApi.get("/users");
                setUsers(res.data);
            } catch (err) {
                console.error("Failed to load users", err);
                setError("Kunde inte hämta användare");
            }
        };

        loadUsers();
    }, []);

    /* ----------------------------------
       Load conversation with selected user
    -----------------------------------*/
    const loadConversation = useCallback(async (otherKeycloakId) => {
        if (!otherKeycloakId) {
            setConversation([]);
            return;
        }

        try {
            const res = await messageApi.get(`/messages/me/conversation/${otherKeycloakId}`);
            setConversation(res.data || []);
        } catch (err) {
            console.error("Failed to load conversation", err);
            setError("Kunde inte ladda konversation");
        }
    }, []);

    useEffect(() => {
        if (!selectedUser) return;
        loadConversation(selectedUser.keycloakId);
    }, [selectedUser, loadConversation]);

    /* ----------------------------------
       Auto scroll to bottom
    -----------------------------------*/
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [conversation]);

    /* ----------------------------------
       Send message
    -----------------------------------*/
    const handleSend = async () => {
        if (!content.trim() || !selectedUser) return;

        try {
            await messageApi.post("/messages/me", {
                receiverKeycloakId: selectedUser.keycloakId,
                content: content.trim()
            });

            setContent("");
            await loadConversation(selectedUser.keycloakId);
        } catch (err) {
            console.error("Failed to send message", err);
            setError("Kunde inte skicka meddelande");
        }
    };

    /* ----------------------------------
       Resolve sender name
    -----------------------------------*/
    const getSenderName = (senderKeycloakId) => {
        const u = users.find(x => x.keycloakId === senderKeycloakId);
        if (!u) return "Okänd";
        return `${u.username} (${u.role})`;
    };

    return (
        <div className="message-container">
            <Typography variant="h5" sx={{ mb: 2 }}>Meddelanden</Typography>

            {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}

            {/* -------------------------------
                User selector
            --------------------------------*/}
            <FormControl fullWidth size="small" sx={{ mb: 3 }}>
                <InputLabel>Välj person</InputLabel>
                <Select
                    value={selectedUser ? selectedUser.keycloakId : ""}
                    onChange={(e) => {
                        const user = users.find(u => u.keycloakId === e.target.value);
                        setSelectedUser(user);
                    }}
                >
                    {users
                        .filter(u => u.role === "DOCTOR" || u.role === "STAFF")
                        .map(u => (
                            <MenuItem key={u.keycloakId} value={u.keycloakId}>
                                {u.username} ({u.role})
                            </MenuItem>
                        ))}
                </Select>
            </FormControl>

            {/* -------------------------------
                Conversation
            --------------------------------*/}
            {selectedUser && (
                <>
                    <div className="message-list">
                        {conversation.length === 0 && (
                            <Typography variant="body2" sx={{ mb: 1 }}>
                                Ingen konversation än.
                            </Typography>
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
                                <Typography variant="caption" sx={{ display: "block", mt: 0.5 }}>
                                    {new Date(m.timestamp).toLocaleString()}
                                </Typography>
                            </Paper>
                        ))}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* -------------------------------
                        Input
                    --------------------------------*/}
                    <Paper sx={{ p: 2, mt: 2 }}>
                        <TextareaAutosize
                            minRows={3}
                            placeholder="Skriv ett meddelande..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="message-input"
                        />
                        <Button
                            variant="contained"
                            onClick={handleSend}
                            sx={{ mt: 1 }}
                        >
                            Skicka
                        </Button>
                    </Paper>
                </>
            )}
        </div>
    );
}

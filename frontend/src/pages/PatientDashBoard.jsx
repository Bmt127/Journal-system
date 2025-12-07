import { useState, useEffect } from "react";
import { Tabs, Tab } from "@mui/material";
import { useNavigate, Outlet, useLocation } from "react-router-dom";

export default function PatientDashboard() {
    const [value, setValue] = useState(0);
    const navigate = useNavigate();
    const location = useLocation();

    // redirect /patient → /patient/profile
    useEffect(() => {
        if (location.pathname === "/patient") {
            navigate("/patient/profile");
        }
    }, [location.pathname, navigate]);

    // update tab based on route
    useEffect(() => {
        if (location.pathname.includes("/patient/profile")) setValue(0);
        else if (location.pathname.includes("/patient/observations")) setValue(1);
        else if (location.pathname.includes("/patient/conditions")) setValue(2);
        else if (location.pathname.includes("/patient/messages")) setValue(3);
    }, [location.pathname]);

    const handleChange = (event, newValue) => {
        if (newValue === "logout") return;

        if (newValue === 0) navigate("/patient/profile");
        if (newValue === 1) navigate("/patient/observations");
        if (newValue === 2) navigate("/patient/conditions");
        if (newValue === 3) navigate("/patient/messages");
    };

    const handleLogout = () => {
        localStorage.removeItem("userId");
        localStorage.removeItem("role");
        navigate("/login");
    };

    return (
        <div>
            <Tabs
                value={value}
                onChange={handleChange}
                variant="scrollable"
                scrollButtons="auto"
            >
                <Tab label="Profil" value={0} />
                <Tab label="Observationer" value={1} />
                <Tab label="Tillstånd" value={2} />
                <Tab label="Meddelanden" value={3} />
                <Tab
                    label="Logga ut"
                    value="logout"
                    onClick={handleLogout}
                    style={{ marginLeft: "auto", color: "red" }}
                />
            </Tabs>

            <div style={{ marginTop: "20px", padding: "10px" }}>
                <Outlet />
            </div>
        </div>
    );
}

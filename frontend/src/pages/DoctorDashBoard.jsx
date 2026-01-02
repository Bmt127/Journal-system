import { useState, useEffect } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import "./DoctorDashboard.css";
import {keycloak} from "../keycloak";

export default function DoctorDashboard() {
    const [tabIndex, setTabIndex] = useState(0);
    const navigate = useNavigate();
    const location = useLocation();

    // Redirect /doctor → /doctor/profile
    useEffect(() => {
        if (location.pathname === "/doctor") {
            navigate("/doctor/profile", { replace: true });
        }
    }, [location.pathname, navigate]);

    // Sync tab with route
    useEffect(() => {
        if (location.pathname.includes("/doctor/profile")) setTabIndex(0);
        else if (location.pathname.includes("/doctor/patients")) setTabIndex(1);
        else if (location.pathname.includes("/doctor/messages")) setTabIndex(2);
        else if (location.pathname.includes("/doctor/search")) setTabIndex(3);
        else if (location.pathname.includes("/doctor/images")) setTabIndex(4);
    }, [location.pathname]);

    const handleTab = (index) => {
        if (index === 0) navigate("/doctor/profile");
        if (index === 1) navigate("/doctor/patients");
        if (index === 2) navigate("/doctor/messages");
        if (index === 3) navigate("/doctor/search");
        if (index === 4) navigate("/doctor/images");
    };

    const handleLogout = () => {
        keycloak.logout({
            redirectUri: window.location.origin,
        });
    };

    return (
        <div className="doctor-dashboard-container">
            <h2 className="doctor-dashboard-title">Läkarportal</h2>

            <div className="doctor-dashboard-card">
                <div className="doctor-tabs">

                    <div
                        className={`doctor-tab ${tabIndex === 0 ? "active" : ""}`}
                        onClick={() => handleTab(0)}
                    >
                        Profil
                    </div>

                    <div
                        className={`doctor-tab ${tabIndex === 1 ? "active" : ""}`}
                        onClick={() => handleTab(1)}
                    >
                        Patienter
                    </div>

                    <div
                        className={`doctor-tab ${tabIndex === 2 ? "active" : ""}`}
                        onClick={() => handleTab(2)}
                    >
                        Meddelanden
                    </div>

                    <div
                        className={`doctor-tab ${tabIndex === 3 ? "active" : ""}`}
                        onClick={() => handleTab(3)}
                    >
                        Sök
                    </div>

                    <div
                        className={`doctor-tab ${tabIndex === 4 ? "active" : ""}`}
                        onClick={() => handleTab(4)}
                    >
                        Bilder
                    </div>

                    <div
                        className="doctor-tab logout-tab"
                        onClick={handleLogout}
                        style={{ marginLeft: "auto", color: "red", fontWeight: "bold" }}
                    >
                        Logga ut
                    </div>
                </div>

                <div className="doctor-tab-content">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

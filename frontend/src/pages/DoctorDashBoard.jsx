import { useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import "./DoctorDashboard.css";

export default function DoctorDashboard() {
    const [tabIndex, setTabIndex] = useState(0);
    const navigate = useNavigate();

    const handleTab = (index) => {
        setTabIndex(index);

        if (index === 0) navigate("/doctor/profile");
        if (index === 1) navigate("/doctor/patients");
        if (index === 2) navigate("/doctor/messages");
        if (index === 3) navigate("/doctor/search");
        if (index === 4) navigate("/doctor/images"); // Bildhantering (Lab 2)
    };

    const handleLogout = () => {
        localStorage.removeItem("userId");
        localStorage.removeItem("role");
        navigate("/login");
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

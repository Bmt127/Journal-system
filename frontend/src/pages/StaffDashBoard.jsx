import { useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import "./StaffDashBoard.css";

export default function StaffDashboard() {
    const [tabIndex, setTabIndex] = useState(0);
    const navigate = useNavigate();

    const handleTab = (index) => {
        setTabIndex(index);
        if (index === 0) navigate("/staff/patients");
        if (index === 1) navigate("/staff/messages");
        if (index === 2) navigate("/staff/search/patients");
        if (index === 3) navigate("/staff/search/practitioners");
    };

    const handleLogout = () => {
        localStorage.removeItem("userId");
        localStorage.removeItem("role");
        navigate("/login");
    };

    return (
        <div className="staff-dashboard-container">
            <h2 className="staff-dashboard-title">Personalportal</h2>

            <div className="staff-dashboard-card">
                <div className="staff-tabs">

                    <div
                        className={`staff-tab ${tabIndex === 0 ? "active" : ""}`}
                        onClick={() => handleTab(0)}
                    >
                        Patienter
                    </div>

                    <div
                        className={`staff-tab ${tabIndex === 1 ? "active" : ""}`}
                        onClick={() => handleTab(1)}
                    >
                        Meddelanden
                    </div>

                    <div
                        className={`staff-tab ${tabIndex === 2 ? "active" : ""}`}
                        onClick={() => handleTab(2)}
                    >
                        Sök patienter
                    </div>

                    <div
                        className={`staff-tab ${tabIndex === 3 ? "active" : ""}`}
                        onClick={() => handleTab(3)}
                    >
                        Sök vårdpersonal
                    </div>

                    <div
                        className="staff-tab logout-tab"
                        onClick={handleLogout}
                        style={{ marginLeft: "auto", color: "red", fontWeight: "bold" }}
                    >
                        Logga ut
                    </div>
                </div>

                <div className="staff-tab-content">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

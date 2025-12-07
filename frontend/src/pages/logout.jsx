import { useState } from "react"
import { useNavigate } from "react-router-dom"
import StaffPatientList from "./StaffComponent/StaffPatientList"
import StaffMessages from "./StaffComponent/StaffMessages"
import "./StaffDashBoard.css"

export default function StaffDashboard() {
    const [tabIndex, setTabIndex] = useState(0)
    const navigate = useNavigate()

    const handleLogout = () => {
        localStorage.removeItem("user")
        navigate("/login")
    }

    return (
        <div className="staff-dashboard-container">
            <h2 className="staff-dashboard-title">Personalportal</h2>

            <div className="staff-dashboard-card">
                <div className="staff-tabs">
                    <div
                        className={`staff-tab ${tabIndex === 0 ? "active" : ""}`}
                        onClick={() => setTabIndex(0)}
                    >
                        Patienter
                    </div>

                    <div
                        className={`staff-tab ${tabIndex === 1 ? "active" : ""}`}
                        onClick={() => setTabIndex(1)}
                    >
                        Meddelanden
                    </div>

                    {/* Logout-knappen */}
                    <div
                        className="staff-tab logout-tab"
                        onClick={handleLogout}
                        style={{ marginLeft: "auto", color: "red" }}
                    >
                        Logga ut
                    </div>
                </div>

                <div className="staff-tab-content">
                    {tabIndex === 0 && <StaffPatientList />}
                    {tabIndex === 1 && <StaffMessages />}
                </div>
            </div>
        </div>
    )
}

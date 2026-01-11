import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import RoleRoute from "./auth/RoleRoute";

// Patient
import PatientDashboard from "./pages/PatientDashBoard";
import ProfilePage from "./pages/PatientComponent/ProfilePage";
import ObservationPage from "./pages/PatientComponent/ObservationPage";
import ConditionPage from "./pages/PatientComponent/ConditionPage";
import MessagePage from "./pages/PatientComponent/MessagePage";

// Doctor
import DoctorDashboard from "./pages/DoctorDashBoard";
import DoctorProfilePage from "./pages/DoctorComponent/DoctorProfilePage";
import PatientList from "./pages/DoctorComponent/PatientList";
import DoctorMessagePage from "./pages/DoctorComponent/DoctorMessagePage";

// Staff
import StaffDashboard from "./pages/StaffDashBoard";
import StaffPatientList from "./pages/StaffComponent/StaffPatientList";
import StaffMessages from "./pages/StaffComponent/StaffMessages";

// Search
import PatientSearch from "./pages/SearchComponent/PatientSearch";
import PractitionerSearch from "./pages/SearchComponent/PractitionerSearch";

// Image
import ImageComponent from "./pages/ImageComponent/ImageComponent";

function App({ keycloak }) {
    // Hämta rollerna från Keycloak-token (standardplatsen för realm-roller)
    const roles = keycloak.tokenParsed?.realm_access?.roles || [];

    const getStartRoute = () => {
        // Ändrat till stora bokstäver för att matcha Keycloak
        if (roles.includes("DOCTOR")) return "/doctor";
        if (roles.includes("STAFF")) return "/staff";
        return "/patient";
    };

    return (
        <Router>
            <Routes>

                {/* Start route efter Keycloak-login */}
                <Route path="/" element={<Navigate to={getStartRoute()} />} />

                {/* ================= PATIENT ================= */}
                <Route
                    path="/patient"
                    element={
                        /* Ändrat till stora bokstäver för att RoleRoute ska släppa igenom dig */
                        <RoleRoute allowedRoles={["PATIENT"]} userRoles={roles}>
                            <PatientDashboard keycloak={keycloak} />
                        </RoleRoute>
                    }
                >
                    <Route index element={<Navigate to="profile" />} />
                    <Route path="profile" element={<ProfilePage />} />
                    <Route path="observations" element={<ObservationPage />} />
                    <Route path="conditions" element={<ConditionPage />} />
                    <Route path="messages" element={<MessagePage />} />
                    <Route path="images" element={<ImageComponent />} />
                </Route>

                {/* ================= STAFF ================= */}
                <Route
                    path="/staff"
                    element={
                        <RoleRoute allowedRoles={["STAFF"]} userRoles={roles}>
                            <StaffDashboard keycloak={keycloak} />
                        </RoleRoute>
                    }
                >
                    <Route index element={<Navigate to="patients" />} />
                    <Route path="patients" element={<StaffPatientList />} />
                    <Route path="messages" element={<StaffMessages />} />
                    <Route path="search/patients" element={<PatientSearch />} />
                    <Route path="search/practitioners" element={<PractitionerSearch />} />
                    <Route path="images" element={<ImageComponent />} />
                </Route>

                {/* ================= DOCTOR ================= */}
                <Route
                    path="/doctor"
                    element={
                        <RoleRoute allowedRoles={["DOCTOR"]} userRoles={roles}>
                            <DoctorDashboard keycloak={keycloak} />
                        </RoleRoute>
                    }
                >
                    <Route index element={<Navigate to="profile" />} />
                    <Route path="profile" element={<DoctorProfilePage />} />

                    {/* Dropdown med alla patienter */}
                    <Route path="patients" element={<PatientList />} />

                    <Route path="messages" element={<DoctorMessagePage />} />
                    <Route path="search" element={<PatientSearch />} />
                    <Route path="images" element={<ImageComponent />} />
                </Route>


                {/* Fallback vid felaktig URL */}
                <Route path="*" element={<Navigate to="/" />} />

            </Routes>
        </Router>
    );
}

export default App;
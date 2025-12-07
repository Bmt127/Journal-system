import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";

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

// Image handling page
import ImageComponent from "./pages/ImageComponent/ImageComponent";

function App() {
    return (
        <Router>
            <Routes>

                {/* Login */}
                <Route path="/" element={<LoginPage />} />
                <Route path="/login" element={<LoginPage />} />

                {/* Patient */}
                <Route path="/patient" element={<PatientDashboard />}>
                    <Route index element={<Navigate to="profile" />} />
                    <Route path="profile" element={<ProfilePage />} />
                    <Route path="observations" element={<ObservationPage />} />
                    <Route path="conditions" element={<ConditionPage />} />
                    <Route path="messages" element={<MessagePage />} />

                    {/* Patient: image handling */}
                    <Route path="images" element={<ImageComponent />} />
                </Route>

                {/* Staff */}
                <Route path="/staff" element={<StaffDashboard />}>
                    <Route index element={<Navigate to="patients" />} />
                    <Route path="patients" element={<StaffPatientList />} />
                    <Route path="messages" element={<StaffMessages />} />
                    <Route path="search/patients" element={<PatientSearch />} />
                    <Route path="search/practitioners" element={<PractitionerSearch />} />

                    {/* Staff: image handling */}
                    <Route path="images" element={<ImageComponent />} />
                </Route>

                {/* Doctor */}
                <Route path="/doctor" element={<DoctorDashboard />}>
                    <Route index element={<Navigate to="profile" />} />
                    <Route path="profile" element={<DoctorProfilePage />} />
                    <Route path="patients" element={<PatientList />} />
                    <Route path="messages" element={<DoctorMessagePage />} />
                    <Route path="search" element={<PatientSearch />} />

                    {/* Doctor: image handling */}
                    <Route path="images" element={<ImageComponent />} />
                </Route>

            </Routes>
        </Router>
    );
}

export default App;

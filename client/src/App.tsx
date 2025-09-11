import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LandingPage } from "./pages/LandingPage";
import LoginPage from "./pages/Login"; 
import { AppointmentManagement } from "./components/AppointmentManagement";
import { Dashboard } from "./pages/Dashboard";
// import FrontDeskSystem from "./pages/Ui";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage/>} />
        <Route path="/home" element={<Dashboard/>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/appoint" element={<AppointmentManagement />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

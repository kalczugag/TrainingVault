import { Routes, Route } from "react-router-dom";

import PrivateOutlet from "@/pages/Outlets/PrivateOutlet";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Dashboard from "@/pages/Dashboard";
import Calendar from "@/pages/Calendar";

const App = () => {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route element={<PrivateOutlet />}>
                <Route index element={<Dashboard />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/dashboard" element={<div>dasbhoard</div>} />
                <Route
                    path="/profile"
                    element={
                        <div>in the future it will be user settings modal</div>
                    }
                />
            </Route>
        </Routes>
    );
};

export default App;

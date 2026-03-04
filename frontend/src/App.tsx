import { Routes, Route } from "react-router-dom";

import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Dashboard from "@/pages/Dashboard";
import PrivateOutlet from "@/pages/Outlets/PrivateOutlet";

const App = () => {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route element={<PrivateOutlet />}>
                <Route index element={<Dashboard />} />
            </Route>
        </Routes>
    );
};

export default App;

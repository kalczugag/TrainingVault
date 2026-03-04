import { Routes, Route } from "react-router-dom";

import Login from "@/pages/Login";
import Register from "@/pages/Register";
import PrivateOutlet from "@/pages/PrivateOutlet";

const App = () => {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route element={<PrivateOutlet />}>
                <Route index element={<h1>Dashboard</h1>} />
            </Route>
        </Routes>
    );
};

export default App;

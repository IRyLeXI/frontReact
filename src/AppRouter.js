import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './App';
import MainPage from './Pages/MainPage/MainPage';
import Login from './Pages/login/Login';
import Register from './Pages/Register/Register';

function AppRouter() {
    return (
        <Router>
            <Routes>
                <Route path="/main" element={<MainPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/" element={<App />} />
            </Routes>
        </Router>
    );
}

export default AppRouter;

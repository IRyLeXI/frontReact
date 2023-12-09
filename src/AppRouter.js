import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './App';
import MainPage from './Pages/MainPage/MainPage';
import Login from './Pages/login/Login';
import Register from './Pages/Register/Register';
import RegisterPsychologist from "./Pages/Register/RegisterPsyhologist";
import AllPsychologist from "./Pages/Psyhologists/AllPsyhologist";
import SinglePsychologist from "./Pages/Psyhologists/Psyholog/Psyholog";
import Events from "./Pages/Events/Events";
import ArticlesPage from "./Pages/Articles/ArticlesPage"
function AppRouter() {
    return (
        <Router>
            <Routes>
                <Route path="/main" element={<MainPage />} />
                <Route path="/articles" element={<ArticlesPage/>} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/register/psychologist" element={<RegisterPsychologist />} />
                <Route path="/psychologists" element={<AllPsychologist />} />
                <Route path="/psychologist" element={<SinglePsychologist />} />
                <Route path="/" element={<App />} />
                <Route path="/events" element={<Events/>} />
            </Routes>
        </Router>
    );
}

export default AppRouter;

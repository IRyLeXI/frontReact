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
import UserPage from "./Pages/UserPage/UserPage";
import ChatPage from "./Pages/UserPage/Chats/ChatsPage";
import Chat from "./Pages/UserPage/Chats/Chat/Chat";
import AllUsers from "./Pages/UserPage/AllUsers/AllUsers";
import Requests from "./Pages/UserPage/Requests/Requests";
import Edit from "./Pages/UserPage/EditAccountPage/EditAcount";
import AdminPanel from "./Pages/AdminPanel/AdminPanel";
import VideoChat from "./Pages/VideoChat/VideoChat";
import Sessions from "./Pages/Session/Sessions";
function AppRouter() {
    return (
        <Router>
            <Routes>
                <Route path="/sessions" element={<Sessions/>} />

                <Route path="/requests" element={<Requests/>} />
                <Route path="/video" element={<VideoChat/>} />
                <Route path="/admin/panel" element={<AdminPanel/>} />
                <Route path="/user/page/edit" element={<Edit/>} />
                <Route path="/chat" element={<Chat/>} />
                <Route path="/users" element={<AllUsers/>} />
                <Route path="/chats" element={<ChatPage/>} />
                <Route path="/user/page" element={<UserPage/>} />
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

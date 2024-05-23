import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './App';
import MainPage from './Pages/MainPage/MainPage';
import Login from './Pages/login/Login';
import Register from './Pages/Register/Register';
import RegisterPsychologist from "./Pages/Register/RegisterPsyhologist";
import AllPsychologist from "./Pages/Projects/AllProjects";
import Project from "./Pages/Projects/Project/Project";  // Змініть назву компоненту на той, що відповідає вашим проектам
import Events from "./Pages/Events/Events";
import ArticlesPage from "./Pages/Articles/ArticlesPage"
import UserPage from "./Pages/UserPage/UserPage";
import CreateProject from './Pages/Projects/CreateProject';
import AllUsers from "./Pages/UserPage/AllUsers/AllUsers";
import Requests from "./Pages/UserPage/Requests/Requests";
import Edit from "./Pages/UserPage/EditAccountPage/EditAcount";
import AdminPanel from "./Pages/AdminPanel/AdminPanel";
import OtherUserPage from './Pages/UserPage/AllUsers/OtherUserPage';
import Chat from './Pages/UserPage/Chats/Chat'
import Chats from './Pages/UserPage/Chats/Chats';
import InvestorRequests from './Investor/InvestorRequests';
function AppRouter() {
    return (
        <Router>
            <Routes>
                <Route path="/user/:userId" element={<OtherUserPage />} />
                <Route path="/create-project" element={<CreateProject/>} />
                <Route path="/requests" element={<Requests/>} />
                <Route path="/admin/panel" element={<AdminPanel/>} />
                <Route path="/user/page/edit" element={<Edit/>} />
                <Route path="/users" element={<AllUsers/>} />
                <Route path="/user/page" element={<UserPage/>} />
                <Route path="/chat" element={<Chat/>} />
                <Route path="/chats" element={<Chats/>} />
                <Route path="/main" element={<MainPage />} />
                <Route path="/investions" element={<InvestorRequests />} />

                <Route path="/articles" element={<ArticlesPage/>} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/register/psychologist" element={<RegisterPsychologist />} />
                <Route path="/projects" element={<AllPsychologist />} />
                <Route path="/project/:id" element={<Project />} />  {/* Динамічний маршрут для проектів */}
                <Route path="/" element={<App />} />
                <Route path="/events" element={<Events/>} />
            </Routes>
        </Router>
    );
}

export default AppRouter;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import './Project.css';
import Header from './Header';
import Posts from './Posts';
import Members from './Members';
import Tasks from './Tasks';
import CreatePost from './CreatePost';
import InvestmentRequests from './InvestmentRequests';
import InvestmentRequestForm from './InvestmentRequestForm';
import SideBar from "../../MainPage/SideBar";
import UserSideBar from '../../UserPage/UserSideBar';

const Project = () => {
    const [project, setProject] = useState(null);
    const [posts, setPosts] = useState([]);
    const [usernames, setUsernames] = useState({});
    const [isMember, setIsMember] = useState(false);
    const [activeMenu, setActiveMenu] = useState('main');
    const [userRole, setUserRole] = useState('');
    const [imageUrl, setimageUrl] = useState('');

    useEffect(() => {
        console.log(localStorage.getItem('projectId'));
        const token = localStorage.getItem('jwtToken');
        const decodedToken = jwtDecode(token);
        setUserRole(decodedToken.role);

        fetchProjectData();
    }, []);

    const fetchProjectData = async () => {
        try {
            var projectId = localStorage.getItem('projectId');
            var responseProject = await axios.get(`https://localhost:7068/api/Project/id/${projectId}`);
            var responsePosts = await axios.get(`https://localhost:7068/api/Post/GetFull/${projectId}`);
            console.log(responsePosts);
           
            if (responseProject.status === 200 && responsePosts.status === 200) {
                setProject(responseProject.data);
                setPosts(responsePosts.data);
                console.log(responsePosts.data)

                setimageUrl( responseProject.data.imageBase64
                ? `data:image/jpeg;base64,${responseProject.data.imageBase64}`
                : 'https://via.placeholder.com/300x200?text=No+Image+Available');
                
                fetchUsernames(responsePosts.data);
                checkIfMember(projectId);
            }
        } catch (error) {
            console.error('Error fetching project data:', error);
        }
    };

    const fetchUsernames = async (posts) => {
        const uniqueUserIds = new Set();
        posts.forEach(post => {
            post.comments.result.forEach(comment => {
                uniqueUserIds.add(comment.authorId);
            });
        });

        const promises = [...uniqueUserIds].map(id =>
            axios.get(`https://localhost:7068/api/User/Id/${id}`)
        );

        const results = await Promise.all(promises);
        const names = {};
        results.forEach(result => {
            if (result.status === 200) {
                const user = result.data;
                names[user.id] = `${user.firstname} ${user.lastname}`;
            }
        });

        setUsernames(names);
    };

    const checkIfMember = async (projectId) => {
        try {
            const token = localStorage.getItem('jwtToken');
            const decodedToken = jwtDecode(token);
            const userId = decodedToken.Id;

            const response = await axios.get(`https://localhost:7068/api/Project/GetAll/Members/${projectId}`);
            if (response.status === 200) {
                const members = response.data;

                const isUserMember = members.some(member => member.id === userId);
                setIsMember(isUserMember);
                console.log(`Is user a member: ${isUserMember}`);
            }
        } catch (error) {
            console.error('Error checking project membership:', error);
        }
    };
    const handleMenuClick = (menu) => {
        setActiveMenu(menu);
        
    };

    return (
        <div>
            {jwtDecode(localStorage.getItem('jwtToken')) != null ? <UserSideBar /> : <SideBar />}
            {project && (
                <div className="project-header">
<img src={imageUrl}  alt={project.name} className="project-photo" />                    <div className="project-info">
                        <h1 className="project-name">{project.name}</h1>
                        <p className="project-description">{project.description}</p>
                    </div>
                    {isMember && (
                        <div className="menu">
                            <button className={activeMenu === 'main' ? 'active' : ''} onClick={() => handleMenuClick('main')}>Основна</button>
                            <button className={activeMenu === 'createPost' ? 'active' : ''} onClick={() => handleMenuClick('createPost')}>Створити пост</button>
                            <button className={activeMenu === 'members' ? 'active' : ''} onClick={() => handleMenuClick('members')}>Учасники</button>
                            <button className={activeMenu === 'tasks' ? 'active' : ''} onClick={() => handleMenuClick('tasks')}>Завдання</button>
                            {userRole === 'Investor' && (
                                <button className={activeMenu === 'invest' ? 'active' : ''} onClick={() => handleMenuClick('invest')}>Стати інвестором</button>
                            )}
                            {project.creatorId === jwtDecode(localStorage.getItem('jwtToken')).Id && (
                                <button className={activeMenu === 'investmentRequests' ? 'active' : ''} onClick={() => handleMenuClick('investmentRequests')}>Investment Requests</button>
                            )}
                        </div>
                    )}
                    <div className="menu">
                    {userRole === 'Investor' && (
                                <button className={activeMenu === 'invest' ? 'active' : ''} onClick={() => handleMenuClick('invest')}>Стати інвестором</button>
                            )}
                    </div>
                </div>
            )}
            <div className="main-container">
                {activeMenu === 'main' && (
                    <Posts posts={posts} setPosts={setPosts} fetchProjectData={fetchProjectData} usernames={usernames} />
                )}
                {activeMenu === 'createPost' && (
                    <CreatePost projectId={project.id} fetchProjectData={fetchProjectData} />
                )}
                {activeMenu === 'members' && (
                    <Members projectId={project.id} />
                )}
                {activeMenu === 'tasks' && (
                    <Tasks projectId={project.id} />
                )}
                {activeMenu === 'invest' && (
                    <InvestmentRequestForm projectId={project.id} />
                )}
                {activeMenu === 'investmentRequests' && (
                    <InvestmentRequests projectId={project.id} />
                )}
            </div>
        </div>
    );
};

export default Project;

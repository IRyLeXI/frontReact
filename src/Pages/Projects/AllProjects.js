import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainFooter from '../MainPage/MainFooter';
import './AllPsyhologist.css';
import SideBar from '../MainPage/SideBar';
import UserSideBar from '../UserPage/UserSideBar';
import refreshToken from '../../Helpers/refreshToken';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const ProjectCard = ({ project }) => {
    let navigate = useNavigate();

    function handleClick() {
        localStorage.setItem('projectId', project.id);
        navigate(`/project/${project.id}`);
    }

    const imageUrl = project.image
        ? `data:image/jpeg;base64,${project.image}`
        : 'https://via.placeholder.com/300x200?text=No+Image+Available';

    return (
        <div className="project-card" onClick={handleClick}>
            <img src={imageUrl} alt={project.name} className="project-image" />
            <h2>{project.name}</h2>
            <p>Category: {project.category}</p>
        
           
        </div>
    );
};

const ProjectsPage = () => {
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [projects, setProjects] = useState([]);
    const [userProjects, setUserProjects] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [userRole, setUserRole] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const authorized = await refreshToken();
                setIsAuthorized(authorized);
                const token = localStorage.getItem('jwtToken');
                const decodedToken = jwtDecode(token);
                const userId = decodedToken.Id;
                const userRole = decodedToken.role;
                console.log(decodedToken.role);
                setUserRole(userRole);
                await getAllProjects();
                await getAllCategories();
                if (userRole === "Student" || userRole === "Admin" || userRole === "Mentor") {
                    await getUserProjects(userId);
                }
            } catch (error) {
                console.error('Error during data fetching:', error);
            }
        };

        fetchData();
    }, []);

    const getAllProjects = async () => {
        try {
            const response = await axios.get("https://localhost:7068/api/Project/GetAll");
            if (response.status === 200) {
                setProjects(response.data);
                console.log(response);
            }
        } catch (error) {
            console.error('Error fetching projects:', error);
        }
    };

    const getAllCategories = async () => {
        try {
            const response = await axios.get("https://localhost:7068/api/Project/GetAll/Categories");
            if (response.status === 200) {
                setCategories(response.data);
                console.log(response);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const getUserProjects = async (userId) => {
        try {
            console.log(userId);
            const response = await axios.get(`https://localhost:7068/api/Project/Get/User/projects/${userId}`);
            if (response.status === 200) {
                setUserProjects(response.data);
                console.log(response);
            }
        } catch (error) {
            console.error('Error fetching user projects:', error);
        }
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleCategoryChange = async (e) => {
        const category = e.target.value;
        setSelectedCategory(category);
        if (category === 'All') {
            await getAllProjects();
        } else {
            try {
                const response = await axios.get(`https://localhost:7068/api/Project/GetAll/${category}`);
                if (response.status === 200) {
                    setProjects(response.data);
                    console.log(response);
                }
            } catch (error) {
                console.error(`Error fetching projects for category ${category}:`, error);
            }
        }
    };

    const showUserProjects = async () => {
        const token = localStorage.getItem('jwtToken');
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.Id;
        await getUserProjects(userId);
        setSelectedCategory('User');
    };

    const filteredProjects = (selectedCategory === 'User' ? userProjects : projects).filter(project =>
        project.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="background-123">
            {isAuthorized ? <UserSideBar /> : <SideBar />}
            <div className="projects-page">
                <input
                    type="text"
                    className="search-bar"
                    placeholder="Search projects..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                />
                <div className="projects-controls">
                    <select className="category-select" value={selectedCategory} onChange={handleCategoryChange}>
                        <option value="All">All Projects</option>
                        {categories.map(category => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                    <div className="tabs">
                        {userRole === "Student" || userRole === "Admin" || userRole === "Mentor" ? (
                            <button className={selectedCategory === 'User' ? 'active' : ''} onClick={showUserProjects}>My Startups</button>
                        ) : null}
                        {userRole === "Student" || userRole === "Admin" ? (
                            <button className="create-startup-button" onClick={() => navigate('/create-project')}>Create Startup</button>
                        ) : null}
                    </div>
                </div>
                <div className="projects-list">
                    {filteredProjects.map(project => (
                        <ProjectCard key={project.id} project={project} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProjectsPage;

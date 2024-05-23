import React from 'react';
import './Project.css';

const Header = ({ project, activeMenu, handleMenuClick }) => (
    <div className="project-header">
        <img src={project.ImageBase64 ? `data:image/jpeg;base64,${project.ImageBase64}` : "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/2048px-No_image_available.svg.png"}alt={project.name} className="project-photo" />
        <div className="project-info">
            <h1 className="project-name">{project.name}</h1>
            <p className="project-description">{project.description}</p>
        </div>
        <div className="menu">
            <button className={activeMenu === 'main' ? 'active' : ''} onClick={() => handleMenuClick('main')}>Основна</button>
            <button className={activeMenu === 'createPost' ? 'active' : ''} onClick={() => handleMenuClick('createPost')}>Створити пост</button>
            <button className={activeMenu === 'members' ? 'active' : ''} onClick={() => handleMenuClick('members')}>Учасники</button>
            <button className={activeMenu === 'tasks' ? 'active' : ''} onClick={() => handleMenuClick('tasks')}>Завдання</button>
        </div>
    </div>
);

export default Header;

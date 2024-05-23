import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const CreateProject = () => {
    const [project, setProject] = useState({
        category: '',
        name: '',
        description: '',
        analog: '',
        investmentMoney: ''
    });
    const [image, setImage] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProject({
            ...project,
            [name]: value
        });
    };

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('jwtToken');
        const decodedToken = jwtDecode(token);
        const creatorId = decodedToken.Id;

        const formData = new FormData();
        formData.append('category', project.category);
        formData.append('name', project.name);
        formData.append('description', project.description);
        formData.append('analog', project.analog);
        formData.append('investmentMoney', project.investmentMoney);
        formData.append('creatorId', creatorId);
        if (image) {
            formData.append('fromFile', image);
        }

        try {
            await axios.post('https://localhost:7068/api/Project/Create', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            });
            navigate('/projects');
        } catch (error) {
            console.error('Error creating project:', error);
        }
    };

    return (
        <div className="create-project-container">
            <h2>Create Project</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="category">Category</label>
                    <input type="text" id="category" name="category" value={project.category} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input type="text" id="name" name="name" value={project.name} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea id="description" name="description" value={project.description} onChange={handleChange} required></textarea>
                </div>
                <div className="form-group">
                    <label htmlFor="analog">Analog</label>
                    <input type="text" id="analog" name="analog" value={project.analog} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="investmentMoney">Investment Money</label>
                    <input type="number" id="investmentMoney" name="investmentMoney" value={project.investmentMoney} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="fromFile">Image</label>
                    <input type="file" id="fromFile" name="fromFile" accept="image/*" onChange={handleImageChange} />
                </div>
                <button type="submit">Create Project</button>
            </form>
        </div>
    );
};

export default CreateProject;

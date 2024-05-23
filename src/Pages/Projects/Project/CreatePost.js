import React, { useState } from 'react';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";

const CreatePost = ({ projectId, fetchProjectData }) => {
    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    const [image, setImage] = useState(null);

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    };

    const handleTextChange = (e) => {
        setText(e.target.value);
    };

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const token = localStorage.getItem('jwtToken');
        const decodedToken = jwtDecode(token);
        const authorId = decodedToken.Id;
    
        const formData = new FormData();
        formData.append('title', title);
        formData.append('text', text);
        formData.append('projectId', projectId);
        formData.append('authorId', authorId);
        if (image) {
            formData.append('fromFile', image);
        }
    
        try {
            await axios.post(
                'https://localhost:7068/api/Post/Create',
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data' // Додано
                    }
                }
            );
    
            // Clear the form fields
            setTitle('');
            setText('');
            setImage(null);
    
            // Reload the posts to reflect the new post
            fetchProjectData();
        } catch (error) {
            console.error('Error creating post:', error);
        }
    };
    

    return (
        <div className="create-post-container">
            <h2>Створити пост</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="title">Заголовок</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={handleTitleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="text">Текст</label>
                    <textarea
                        id="text"
                        value={text}
                        onChange={handleTextChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="image">Зображення</label>
                    <input
                        type="file"
                        id="image"
                        onChange={handleImageChange}
                        accept="image/*"
                    />
                </div>
                <button type="submit">Створити</button>
            </form>
        </div>
    );
};

export default CreatePost;

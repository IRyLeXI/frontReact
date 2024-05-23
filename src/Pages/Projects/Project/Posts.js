import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faComment } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";

const Posts = ({ posts, setPosts, fetchProjectData, usernames }) => {
    const [commentsVisible, setCommentsVisible] = useState({});
    const [commentText, setCommentText] = useState('');
    console.log(posts);
    const toggleComments = (postId) => {
        setCommentsVisible(prevState => ({
            ...prevState,
            [postId]: !prevState[postId]
        }));
    };

    const handleLike = async (postId) => {
        try {
            const token = localStorage.getItem('jwtToken');
            const response = await axios.post(
                `https://localhost:7068/api/Post/Like/post`,
                {
                    postId: postId,
                    userId: jwtDecode(token).Id
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            
            // Update likes after successful request
            const updatedPosts = posts.map(post => {
                if (post.post.id === postId) {
                    return {
                        ...post,
                        post: {
                            ...post.post,
                            likes: response.data
                        }
                    };
                }
                return post;
            });
            setPosts(updatedPosts);
        } catch (error) {
            console.error('Error liking post:', error);
        }
    };

    const handleCommentChange = (event) => {
        setCommentText(event.target.value);
    };

    const handleCommentSubmit = async (postId) => {
        try {
            const token = localStorage.getItem('jwtToken');
            await axios.post(
                `https://localhost:7068/api/Comment/Create`,
                {
                    authorId: jwtDecode(token).Id,
                    text: commentText,
                    postId: postId
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            // Clear comment input after successful submission
            setCommentText('');
            // Reload posts to show the new comment
            fetchProjectData();
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    return (
        <div className="main-container">
            {posts.length > 0 ? (
                posts.map(({ post, user, comments }) => (
                    <div key={post.id} className="post-card">
                        <div className="post-header">
                            <img src={`data:image/jpeg;base64,${user.imageBase64}`}  alt={`${user.firstname} ${user.lastname}`} className="post-avatar" />
                            <div className="post-author-info">
                                <h2>{`${user.firstname} ${user.lastname}`}</h2>
                            </div>
                        </div>
                        <div className="post-content">
                            <h3>{post.title}</h3>
                            <p>{post.text}</p>
                            <div className="post-image-container">
                                <img src={`data:image/jpeg;base64,${post.imageBase64}`}  alt={post.title} className="post-image" />
                                <div className="post-actions">
                                    <div className="icon-container" onClick={() => handleLike(post.id)}>
                                        <FontAwesomeIcon icon={faThumbsUp} />
                                        <span>{post.likes}</span>
                                    </div>
                                    <div className="icon-container" onClick={() => toggleComments(post.id)}>
                                        <FontAwesomeIcon icon={faComment} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        {commentsVisible[post.id] && (
                            <div className="post-comments">
                                {comments.result.length > 0 ? (
                                    comments.result.map(comment => (
                                        <div key={comment.id} className="comment">
                                            <p><strong>{usernames[comment.authorId]}</strong>: {comment.text}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p>No comments yet.</p>
                                )}
                                <div className="comment-input">
                                    <input
                                        type="text"
                                        placeholder="Add a comment..."
                                        value={commentText}
                                        onChange={handleCommentChange}
                                    />
                                    <button onClick={() => handleCommentSubmit(post.id)}>Submit</button>
                                </div>
                            </div>
                        )}
                    </div>
                ))
            ) : (
                <p>No posts found for this project.</p>
            )}
        </div>
    );
};

export default Posts;

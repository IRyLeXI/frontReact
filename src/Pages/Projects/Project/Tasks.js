import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import './Tasks.css';

const Tasks = ({ projectId }) => {
    const [tasks, setTasks] = useState([]);
    const [userTasks, setUserTasks] = useState([]);
    const [isCreator, setIsCreator] = useState(false);
    const [members, setMembers] = useState([]);
    const [authors, setAuthors] = useState({});
    const [users, setUsers] = useState({});
    const [newTask, setNewTask] = useState({ title: '', message: '', expiredDate: '', userId: '' });
    const [activeTab, setActiveTab] = useState('allTasks');

    const fetchTasks = async () => {
        try {
            const response = await axios.get(`https://localhost:7068/api/Task/Get/ByProject/${projectId}`);
            if (response.status === 200) {
                const tasksData = response.data.map(task => {
                    if (new Date(task.expiredDate) < new Date() && task.status !== 'done') {
                        task.status = 'ended';
                    }
                    return task;
                });
                setTasks(tasksData);

                const token = localStorage.getItem('jwtToken');
                const decodedToken = jwtDecode(token);
                const userId = decodedToken.Id;

                const userSpecificTasks = tasksData.filter(task => task.userId === userId);
                setUserTasks(userSpecificTasks);

                const responseMembers = await axios.get(`https://localhost:7068/api/Project/GetAll/Members/${projectId}`);
                if (responseMembers.status === 200) {
                    setMembers(responseMembers.data);

                    const currentUser = responseMembers.data.find(member => member.id === userId);
                    if (currentUser && (currentUser.project_role === 1 || currentUser.project_role === 2)) {
                        setIsCreator(true);
                    }
                }

                const authorPromises = tasksData.map(task => axios.get(`https://localhost:7068/api/User/id/${task.authorId}`));
                const userPromises = tasksData.map(task => axios.get(`https://localhost:7068/api/User/id/${task.userId}`));
                const authorResponses = await Promise.all(authorPromises);
                const userResponses = await Promise.all(userPromises);
                const authorsData = authorResponses.reduce((acc, response) => {
                    if (response.status === 200) {
                        const user = response.data;
                        acc[user.id] = `${user.firstname} ${user.lastname}`;
                    }
                    return acc;
                }, {});
                const usersData = userResponses.reduce((acc, response) => {
                    if (response.status === 200) {
                        const user = response.data;
                        acc[user.id] = `${user.firstname} ${user.lastname}`;
                    }
                    return acc;
                }, {});
                setAuthors(authorsData);
                setUsers(usersData);
            }
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, [projectId]);

    const handleStatusChange = async (taskId) => {
        try {
            await axios.post('https://localhost:7068/api/Task/Update/Status', {
                TaskId: taskId,
                Status: 'Done'
            });

            fetchTasks();
        } catch (error) {
            console.error('Error updating task status:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewTask({ ...newTask, [name]: value });
    };

    const handleCreateTask = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('jwtToken');
        const decodedToken = jwtDecode(token);
        const authorId = decodedToken.Id;

        const task = {
            ...newTask,
            projectId,
            authorId,
            date: new Date(),
            status: 'running'
        };

        try {
            await axios.post('https://localhost:7068/api/Task/Create', task);
            setNewTask({ title: '', message: '', expiredDate: '', userId: '' });
            fetchTasks();
        } catch (error) {
            console.error('Error creating task:', error);
        }
    };

    return (
        <div className="tasks-container">
            <div className="tasks-tabs">
                <button className={activeTab === 'allTasks' ? 'active' : ''} onClick={() => setActiveTab('allTasks')}>Всі Завдання</button>
                <button className={activeTab === 'userTasks' ? 'active' : ''} onClick={() => setActiveTab('userTasks')}>Мої Завдання</button>
                {isCreator && <button className={activeTab === 'createTask' ? 'active' : ''} onClick={() => setActiveTab('createTask')}>Створити Завдання</button>}
            </div>

            {activeTab === 'allTasks' && (
                <div className="all-tasks">
                    {tasks.map(task => (
                        <div key={task.id} className="task-card">
                            <h3>{task.title}</h3>
                            <p className={task.status === 'ended' ? 'task-status ended' : 'task-status'}>Status: {task.status}</p>
                            <p>Автор: {authors[task.authorId] || task.authorId}</p>
                            <p>Для: {users[task.userId] || task.userId}</p>
                        </div>
                    ))}
                </div>
            )}

            {activeTab === 'userTasks' && (
                <div className="user-tasks">
                    {userTasks.map(task => (
                        <div key={task.id} className="task-card">
                            <h3>{task.title}</h3>
                            <p>{task.message}</p>
                            <p className={task.status === 'done' ? 'task-status done' : 'task-status'}>Status: {task.status}</p>
                            {new Date(task.expiredDate) >= new Date() && task.status !== 'done' && (
                                <button onClick={() => handleStatusChange(task.id)}>Підтвердити</button>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {activeTab === 'createTask' && (
                <div className="create-task">
                    <form onSubmit={handleCreateTask}>
                        <input type="text" name="title" placeholder="Title" value={newTask.title} onChange={handleInputChange} required />
                        <textarea name="message" placeholder="Message" value={newTask.message} onChange={handleInputChange} required />
                        <input type="date" name="expiredDate" value={newTask.expiredDate} onChange={handleInputChange} required />
                        <select name="userId" value={newTask.userId} onChange={handleInputChange} required>
                            <option value="">Виберіть користувача</option>
                            {members.map(member => (
                                <option key={member.id} value={member.id}>{member.firstname} {member.lastname}</option>
                            ))}
                        </select>
                        <button type="submit">Створити</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Tasks;

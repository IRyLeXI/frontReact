import React from 'react';
import { useNavigate } from 'react-router-dom';

function App() {
    const navigate = useNavigate();

    const goToLogin = () => {
        navigate('/login');
    };

    const goToRegister = () => {
        navigate('/register');
    };

    return (
        <div>
            <h1>Ласкаво просимо!</h1>
            <p>Виберіть дію:</p>
            <ul>
                <li>
                    <button onClick={goToLogin}>Логін</button>
                </li>
                <li>
                    <button onClick={goToRegister}>Реєстрація</button>
                </li>
            </ul>
        </div>
    );
}

export default App;

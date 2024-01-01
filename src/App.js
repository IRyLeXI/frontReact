import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function App() {
    const navigate = useNavigate();

    useEffect(() => {
        navigate('/login');
    }, []); // Порожній масив означає, що ефект виконується лише при монтажі компонента

    return (
        <div>

        </div>
    );
}

export default App;

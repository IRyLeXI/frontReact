import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Імпорт Axios

function App() {
    const [message, setMessage] = useState(''); // Стан для зберігання рядка

    useEffect(() => {
        // Виконуємо GET-запит до бекенду після завантаження компонента
        axios.get('https://testapp2004.azurewebsites.net/Home/getAll/Clothes')
            .then(response => {
                // Отримали дані від бекенду
                setMessage(response.data); // Зберігаємо рядок в стані message
            })
            .catch(error => {
                console.error('Помилка отримання даних від сервера:', error);
            });
    }, []);

    return (
        <div className="App">
            <header className="App-header">
                <p>Рядок з сервера:</p>
                <p>{message}</p> {/* Відображаємо рядок */}
            </header>
        </div>
    );
}

export default App;

import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Імпорт Axios

function App() {
    const [numbers, setNumbers] = useState([]); // Стан для зберігання чисел

    useEffect(() => {
        // Виконуємо GET-запит до бекенду після завантаження компонента
        axios.get('https://testapp2004.azurewebsites.net/Home/getAll/Clothes')
            .then(response => {
                // Отримали дані від бекенду
                setNumbers(response.data);
            })
            .catch(error => {
                console.error('Помилка отримання даних від сервера:', error);
            });
    }, []);

    return (
        <div className="App">
            <header className="App-header">
                <p>Список чисел з сервера:</p>
                <ul>
                    {numbers.map((number, index) => (
                        <li key={index}>{number}</li>
                    ))}
                </ul>
            </header>
        </div>
    );
}

export default App;
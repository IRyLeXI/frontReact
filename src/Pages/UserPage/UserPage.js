import React from 'react';
import './UserPage.css';
import UserSideBar from "./UserSideBar"; // Підключаємо файл стилів для userPage

function UserPage() {
    const user = {
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/User_icon_2.svg/1200px-User_icon_2.svg.png',
        nickname: 'UserNickname',
        name: 'John',
        lastname: 'Doe',
        friendsCount: 123,
        description: 'якийсь опис юзера якийсь опис юзера якийсь опис юзера якийсь опис юзера якийсь опис юзера якийсь опис юзера якийсь опис юзера якийсь опис юзера якийсь опис юзера якийсь опис юзера '
    };

    const handleEditAccount = () => {
        // Дії при натисканні на кнопку "Редагувати акаунт"
        // Наприклад, відкриття форми для редагування
    };

    return (
        <div>
        <UserSideBar></UserSideBar>
        <div className="user-page-container">

            <div className="user-card">
                <div className="left-section">
                    <div className="user-image" style={{ backgroundImage: `url(${user.image})` }}></div>
                    <h1>{user.nickname}</h1>
                    <p>{user.name} {user.lastname}</p>
                    <p>Friends: {user.friendsCount}</p>
                </div>
                <div className="right-section">
                    <p className="user-description">{user.description}</p>
                    <button className="edit-button" onClick={handleEditAccount}>Edit Account</button>
                </div>
            </div>
        </div>
        </div>
    );
}

export default UserPage;

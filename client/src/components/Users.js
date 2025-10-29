import React, {useContext, useState} from 'react';
import { observer } from "mobx-react-lite";
import { Context } from "../index";
import { Row, Form, Button } from "react-bootstrap";
import UserItem from "./UsersItem";
import {fetchUser} from '../http/userAPI'

const Users = observer(() => {
    const { user } = useContext(Context);
    const [userId, setUserId] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);

    const handleSearch = async () => {
        try {
            if (userId.trim() === '') {
                setSelectedUser(null); // Если строка поиска пуста, сбрасываем выбранного пользователя
            } else {
                const data = await fetchUser(userId); // Иначе, делаем поиск
                setSelectedUser(data);
            }
        } catch (error) {
            console.error('Ошибка при получении пользователя:', error);
        }
    };

    const handleIdChange = (e) => {
        const value = e.target.value;
        if (!value) {
            setSelectedUser(null); // Сбрасываем выбранный заказ, если поле поиска по ID пустое
        }
        setUserId(value);
    };

    return (
        <div>
            <Form.Group>
                <Form.Label>Введите ID пользователя:</Form.Label>
                <Form.Control
                    type="text"
                    value={userId}
                    onChange={handleIdChange}
                />
            </Form.Group>
            <Button className='mt-3' onClick={handleSearch}>Поиск</Button>
            <Row className="">
                {selectedUser ? (
                    <UserItem key={selectedUser.id} user={selectedUser} />
                ) : (
                    user.users.map(user =>
                        <UserItem key={user.id} user={user} />
                    )
                )}
            </Row>
        </div>
    );
});

export default Users;
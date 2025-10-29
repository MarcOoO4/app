import React, {useContext, useState} from 'react';
import {Dropdown, Form, Modal} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {createOrder} from "../../http/orderAPI";
import {observer} from "mobx-react-lite";
import {format} from "date-fns";
import {Context} from "../../index";

const CreateOrder = observer( ({show, onHide}) => {
    const [price, setPrice] = useState('');
    const [product_location, setProduct_location] = useState('');
    const [volume, setVolume] = useState('');
    const [weight, setWeight] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [userId, setUserId] = useState('');

    const { manager } = useContext(Context);

    const id = localStorage.getItem('id');

    const isAdmin = manager.isAdmin; // Проверяем, является ли пользователь администратором

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const [selectedStatus, setSelectedStatus] = useState(""); // Состояние для хранения выбранного маркетплейса
    // Функция для обновления состояния заказа
    const handleStatusSelect = (status) => {
        setSelectedStatus(status);
    };

    const addOrder = async () => {
        try {
            const formattedDate = format(selectedDate || new Date(), 'yyyy.MM.dd');
            const order = {
                order_status: isAdmin ? selectedStatus : 'Создан',
                date: formattedDate,
                price: isAdmin ? price  : '0',
                product_location,
                volume,
                weight,
                userId: isAdmin ? userId : parseInt(id),
            };

            window.location.reload();// Закрыть модальное окно после успешного добавления заказа
            onHide();
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <Modal
            show={show}
            onHide={onHide}
            size="lg"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Добавить заказ
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    {isAdmin && (
                        <Form.Group controlId="formDate">
                            <DatePicker
                                selected={selectedDate}
                                onChange={handleDateChange}
                                dateFormat="dd.MM.yyyy"
                                placeholderText="Выберите дату заказа"
                                className="form-control mt-3"
                            />
                        </Form.Group>
                    )}

                    {isAdmin && (
                        <Dropdown className="mt-3">
                            <Dropdown.Toggle>
                                {selectedStatus ? selectedStatus : 'Статус заказа'}
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item onClick={() => handleStatusSelect("Создан")}>Создан</Dropdown.Item>
                                <Dropdown.Item onClick={() => handleStatusSelect("Ожидает забора с ТК")}>Ожидает забора с тк</Dropdown.Item>
                                <Dropdown.Item onClick={() => handleStatusSelect("В работе")}>В работе</Dropdown.Item>
                                <Dropdown.Item onClick={() => handleStatusSelect("Ожидает отгрузки на склад")}>Ожидает отгрузки на склад</Dropdown.Item>
                                <Dropdown.Item onClick={() => handleStatusSelect("Завершен")}>Завершен</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    )}

                    <Form.Control
                        className="mt-3"
                        placeholder={"Введите местоположение товара"}
                        value={product_location}
                        onChange={e => setProduct_location(e.target.value) }
                    />

                    <Form.Control
                        className="mt-3"
                        placeholder={"Введите объем товара (м³)"}
                        type="number"
                        value={volume}
                        onChange={e => setVolume(e.target.value)}
                    />

                    <Form.Control
                        className="mt-3"
                        placeholder={"Введите вес товара (кг)"}
                        type="number"
                        value={weight}
                        onChange={e => setWeight(e.target.value)}
                    />

                    {isAdmin && (
                        <Form.Control
                            className="mt-3"
                            placeholder={"Введите цену заказа"}
                            type="number"
                            value={price}
                            onChange={e => setPrice(e.target.value)}
                        />
                    )}

                    {isAdmin && (
                        <Form.Control
                            className="mt-3"
                            placeholder={"Введите ID клиента"}
                            type="number"
                            value={userId}
                            onChange={e => setUserId(e.target.value)}
                        />
                    )}

                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-danger" onClick={onHide}>Закрыть</Button>
                <Button variant="outline-success" onClick={addOrder}>Добавить</Button>
            </Modal.Footer>
        </Modal>
    );
});

export default CreateOrder;
import React, { useState, useEffect } from 'react';
import {Modal, Form, Button, Dropdown} from "react-bootstrap";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {updateOrder, deleteOrder} from "../../http/orderAPI";
import { format } from 'date-fns';

const EditOrder = ({ show, onHide, selectedOrder}) => {

    const [price, setPrice] = useState('');
    const [product_location, setProduct_location] = useState('')
    const [volume, setVolume] = useState('')
    const [weight, setWeight] = useState('')
    const [selectedDate, setSelectedDate] = useState('')
    const [userId, setUserId] = useState('')
    const [productId, setProductId] = useState('')
    const [updatedAt, setUpdatedAt] = useState('')


    const handleDateChange = (date) => {
        setSelectedDate(date);
    };


    const [selectedStatus, setSelectedStatus] = useState(""); // Состояние для хранения выбранного маркетплейса
    // // Функция для обновления состояния заказа
    const handleStatusSelect = (status) => {
        setSelectedStatus(status);
    };


    useEffect(() => {
        if (selectedOrder) {
            setPrice(selectedOrder.price || '');
            setProduct_location(selectedOrder.product_location || '');
            setVolume(selectedOrder.volume|| '');
            setWeight(selectedOrder.weight || '');
            setSelectedDate(selectedOrder.date || '');
            setSelectedStatus(selectedOrder.order_status || '');
            setUserId(selectedOrder.userId || '');
            setProductId(selectedOrder.productId || '');
            setUpdatedAt(selectedOrder.updatedAt || '');
        }
    }, [selectedOrder]);

    const handleUpdateOrder = async () => {
        try {
            const formattedDate = format(selectedDate, 'yyyy.MM.dd');
            const updatedOrder = {
                id: selectedOrder.id,
                order_status: selectedStatus ? selectedStatus : 'Создан',
                date: formattedDate,
                price,
                product_location,
                volume,
                weight,
                userId,
                productId,
                updatedAt,
            };

            await updateOrder(selectedOrder.id, updatedOrder);

            onHide(); // Закрыть модальное окно после успешного обновления заказа
            window.location.reload(); // Обновить страницу
        } catch (error) {
            console.error('Ошибка при обновлении заказа:', error);
        }
    };

    const handleDeleteOrder = async () => {
        if (window.confirm('Вы уверены, что хотите удалить этот заказ?')) {
            try {
                await deleteOrder(selectedOrder.id);
                // Получение обновлённого списка заказов после успешного создания
                onHide(); // Закрыть модальное окно после успешного удаления заказа заказа
            } catch (error) {
                console.error('Ошибка при удалении заказа:', error);
            }
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
                <Modal.Title>Редактировать заказ</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="formDate">
                        <Form.Label className="p-1">Дата заказа:</Form.Label>
                        <DatePicker
                            selected={selectedDate}
                            onChange={handleDateChange}
                            dateFormat="dd.MM.yyyy"
                            placeholderText="Выберите дату заказа"
                            className="form-control mt-3"
                        />
                    </Form.Group>
                    <Form.Group controlId="formStatus">
                        <Form.Label className="mt-3">Статус заказа:</Form.Label>
                        <Dropdown>
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
                    </Form.Group>

                    <Form.Group controlId="formProductLocation">
                        <Form.Label className="mt-3">Местоположение товара:</Form.Label>
                        <Form.Control
                            placeholder={"Введите местоположение товара"}
                            value={product_location}
                            onChange={e => setProduct_location(e.target.value) }
                        />
                    </Form.Group>

                    <Form.Group controlId="formVolume">
                        <Form.Label className="mt-3">Объем товара (м³):</Form.Label>
                        <Form.Control
                            placeholder={"Введите объем товара (м³)"}
                            type="number"
                            value={volume}
                            onChange={e => setVolume(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group controlId="formWeight">
                        <Form.Label className="mt-3">Вес товара (кг):</Form.Label>
                        <Form.Control
                            placeholder={"Введите вес товара (кг)"}
                            type="number"
                            value={weight}
                            onChange={e => setWeight(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group controlId="formPrice">
                        <Form.Label className="mt-3">Цена заказа:</Form.Label>
                        <Form.Control
                            placeholder={"Введите цену заказа"}
                            type="number"
                            value={price}
                            onChange={e => setPrice(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group controlId="formUserId">
                        <Form.Label className="mt-3">ID клиента:</Form.Label>
                        <Form.Control
                            placeholder={"Введите ID клиента"}
                            type="number"
                            value={userId}
                            onChange={e => setUserId(e.target.value)}
                        />
                    </Form.Group>

                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>Отмена</Button>
                <Button variant="danger" onClick={handleDeleteOrder}>Удалить заказ</Button>
                <Button variant="primary" onClick={handleUpdateOrder}>Сохранить изменения</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default EditOrder;
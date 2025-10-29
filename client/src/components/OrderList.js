import React, {useContext, useState} from 'react';
import {observer} from "mobx-react-lite";
import {Context} from "../index";
import {Button, Form} from "react-bootstrap";
import OrderItem from "./OrderItem";
import EditOrder from './modals/EditOrder'

const OrderList = observer (() => {
    const {order} = useContext(Context)
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [editModalShow, setEditModalShow] = useState(false);
    const [orderId, setOrderId] = useState('');
    const [searchedOrderId, setSearchedOrderId] = useState('')
    const [isSearchedOrder, setIsSearchedOrder] = useState(false);

    const handleSearchOrder = () => {
        const foundOrder = order.orders.find(order => order.id === parseInt(orderId));
        if (foundOrder) {
            setSelectedOrder(foundOrder);
            setSearchedOrderId(orderId);
            setIsSearchedOrder(true);
        } else {
            setSelectedOrder(null);
            setSearchedOrderId(''); // Сбрасываем ID заказа, если он не найден
            alert('Заказ с указанным ID не найден.');
        }
    };

    const handleEditOrder = (order) => {
        setSelectedOrder(order);
        setEditModalShow(true);
    };

    const handleDeleteOrder = () => {
        // Обработчик события для удаления заказа
    };

    const handleOrderIdChange = (e) => {
        const value = e.target.value;
        if (!value) {
            setSelectedOrder(null); // Сбрасываем выбранный заказ, если поле поиска по ID пустое
        }
        setOrderId(value);
    };

    const sortedOrders = order.orders.slice().sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    return (
        <div>
            <Form.Group>
                <Form.Label>Введите ID заказа:</Form.Label>
                <Form.Control
                    type="text"
                    value={orderId}
                    onChange={handleOrderIdChange}

                />
            </Form.Group>
            <Button className='mt-3' onClick={handleSearchOrder}>Поиск</Button>

            {selectedOrder && (
                <OrderItem
                    key={selectedOrder.id}
                    order={selectedOrder}
                    onEdit={handleEditOrder}
                    onDelete={handleDeleteOrder}
                />
            )}
            {/* Отображение всех заказов */}
            {!selectedOrder && sortedOrders.map(order =>
                <OrderItem
                    key={order.id}
                    order={order}
                    onEdit={handleEditOrder}
                    onDelete={handleDeleteOrder}
                />
            )}
            {/* Модальное окно для редактирования заказа */}
            {selectedOrder && (
                <EditOrder
                    show={editModalShow}
                    onHide={() => {
                        setEditModalShow(false);
                        if (!isSearchedOrder) {
                            setSelectedOrder(null); // Сбрасываем выбранный заказ, если он не был выбран после поиска по ID
                        }
                        if (searchedOrderId) {
                            setOrderId(searchedOrderId); // Устанавливаем значение orderId равным найденному ID
                        }

                    }}
                    selectedOrder={selectedOrder}
                />
            )}
        </div>
    );
});

export default OrderList;
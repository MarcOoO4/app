import React, {useContext} from 'react';
import {Container, Button} from "react-bootstrap";
import { Context } from "../index";
import './service.css';

const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // добавляем 1, так как месяцы в JS начинаются с 0
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
}

const ServiceItem = ({service, onEdit}) => {
    const { manager } = useContext(Context);
    const isAdmin = manager.isAdmin; // Проверяем, является ли пользователь администратором

    return (
        <Container className="containerService">
            <table className="fixed-width-table-service my-3">
                <thead>
                <tr>
                    <th>ID набора услуг</th>
                    <th>Услуги</th>
                    <th>Упаковка</th>
                    <th>Маркетплейс</th>
                    <th>Город отгрузки</th>
                    <th>ID товара</th>
                    {isAdmin && <th>ID клиента</th>}
                    {isAdmin && <th>Действия</th>}
                    <th>Дата последнего изменения</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>{service.id}</td>
                    <td>{service.service}</td>
                    <td>{service.servicePackage}</td>
                    <td>{service.marketplace}</td>
                    <td>{service.shipment}</td>
                    <td>{service.productId}</td>
                    {isAdmin && <td>{service.userId}</td>}
                    {isAdmin && (
                        <td>
                            <Button variant="info" onClick={() => onEdit(service)}>Редактировать</Button>
                        </td>
                    )}
                    <td>{formatDate(service.updatedAt)}</td>
                </tr>
                </tbody>
            </table>
        </Container>
    )
}

export default ServiceItem;
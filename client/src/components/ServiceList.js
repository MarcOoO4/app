import React, {useState, useContext} from 'react';
import {observer} from "mobx-react-lite";
import {Button, Form} from "react-bootstrap";
import ServiceItem from "./ServiceItem";
import EditService from './modals/EditService'
import {Context} from "../index";

const ServiceList = observer (() => {
    const {service} = useContext(Context)
    const [selectedService, setSelectedService] = useState(null);
    const [editModalShow, setEditModalShow] = useState(false);
    const [serviceId, setServiceId] = useState('');
    const [searchedServiceId, setSearchedServiceId] = useState('')
    const [isSearchedService, setIsSearchedService] = useState(false);

    const handleSearchService = () => {
        const foundService = service.services.find(service => service.id === parseInt(serviceId));
        if (foundService) {
            setSelectedService(foundService);
            setSearchedServiceId(serviceId);
            setIsSearchedService(true);
        } else {
            setSelectedService(null);
            setSearchedServiceId(''); // Сбрасываем ID заказа, если он не найден
            alert('Заказ с указанным ID не найден.');
        }
    };

    const handleEditService = (service) => {
        setSelectedService(service);
        setEditModalShow(true);
    };

    const handleDeleteService = () => {
        // Обработчик события для удаления заказа
    };

    const handleServiceIdChange = (e) => {
        const value = e.target.value;
        if (!value) {
            setSelectedService(null); // Сбрасываем выбранный заказ, если поле поиска по ID пустое
        }
        setServiceId(value);
    };

    const sortedServices = service.services.slice().sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    return (
        <div>
            <Form.Group>
                <Form.Label>Введите ID товара:</Form.Label>
                <Form.Control
                    type="text"
                    value={serviceId}
                    onChange={handleServiceIdChange}
                />
            </Form.Group>
            <Button className='mt-3' onClick={handleSearchService}>Поиск</Button>

            {selectedService && (
                <ServiceItem
                    key={selectedService.id}
                    service={selectedService}
                    onEdit={handleEditService}
                    onDelete={handleDeleteService}
                />
            )}
            {/* Отображение всех товаров */}
            {!selectedService && sortedServices.map(service => (
                <ServiceItem
                    key={service.id}
                    service={service}
                    onEdit={handleEditService}
                    onDelete={handleDeleteService}
                />
            ))}
            {selectedService && (
                <EditService
                    show={editModalShow}
                    onHide={() => {
                        setEditModalShow(false);
                        if (!isSearchedService) {
                            setSelectedService(null); // Сбрасываем выбранный заказ, если он не был выбран после поиска по ID
                        }
                        if (searchedServiceId) {
                            setServiceId(searchedServiceId); // Устанавливаем значение serviceId равным найденному ID
                        }

                    }}
                    selectedService={selectedService}
                />
            )}
        </div>
    );
});

export default ServiceList;
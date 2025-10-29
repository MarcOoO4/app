import React, { useState, useEffect } from 'react';
import {Modal, Form, Button, Dropdown} from "react-bootstrap";
import {updateService, deleteService} from "../../http/serviceAPI";

const EditService = ({ show, onHide, selectedService}) => {

    const [productId, setProductId] = useState('');
    const [userId, setUserId] = useState('');
    const [updatedAt, setUpdatedAt] = useState('')

    const [selectedPackages, setSelectedPackages] = useState([]);
    const [selectedPackage, setSelectedPackage] = useState([]);
    const [selectedPackageInput, setSelectedPackageInput] = useState('');
    const [selectedServices, setSelectedServices] = useState([]);
    const [selectedServ, setSelectedServ] = useState('');
    const [selectedServiceInput, setSelectedServiceInput] = useState('');
    const [selectedMarketplace, setSelectedMarketplace] = useState(""); // Состояние для хранения выбранного маркетплейса
    const [selectedShipment, setSelectedShipment] = useState("");

    // Функция для обновления состояния при выборе маркетплейса
    const handleMarketplaceSelect = (marketplace) => {
        setSelectedMarketplace(marketplace);
    };

    const handleShipmentSelect = (shipment) => {
        setSelectedShipment(shipment);
    };

    const handlePackageSelect = (servicePackage) => {
        setSelectedPackages([...selectedPackages, servicePackage]);
        setSelectedPackageInput(selectedPackageInput + (selectedPackageInput.length > 0 ? ', ' : '') + servicePackage);
    };

    const handleRemovePackage = (removedPackage) => {
        const updatedPackages = selectedPackages.filter(pkg => pkg !== removedPackage);
        setSelectedPackages(updatedPackages);
        setSelectedPackageInput(updatedPackages.join(', '));
    };

    const handleServiceSelect = (service) => {
        setSelectedServices([...selectedServices, service]);
        setSelectedServiceInput(selectedServiceInput + (selectedServiceInput.length > 0 ? ', ' : '') + service);
    };


    const handleRemoveService = (removedService) => {
        const updatedServices = selectedServices.filter(src => src !== removedService);
        setSelectedServices(updatedServices);
        setSelectedServiceInput(updatedServices.join(', '));
    };

    useEffect(() => {
        if (selectedService) {
            setSelectedServ(selectedService.service || '');
            setSelectedShipment(selectedService.shipment || '');
            setProductId(selectedService.productId|| '');
            setUserId(selectedService.userId|| '');
            setSelectedMarketplace(selectedService.marketplace || '');
            setUpdatedAt(selectedService.updatedAt || '');
            setSelectedPackage(Array.isArray(selectedService.servicePackage) ? selectedService.servicePackage : []);
            setSelectedServiceInput(selectedService.service || '');
            setSelectedPackageInput(selectedService.servicePackage || '');
            const services = selectedService.service ? selectedService.service.split(', ') : [];
            const packages = selectedService.servicePackage ? selectedService.servicePackage.split(', ') : [];
            setSelectedServices(services);
            setSelectedServiceInput(services.join(', '));
            setSelectedPackages(packages);
            setSelectedPackageInput(packages.join(', '));
        }
    }, [selectedService]);

    const handleUpdateService = async () => {
        try {
            const updatedService = {
                id: selectedService.id,
                marketplace: selectedMarketplace || '',
                service: selectedServices.length > 0 ? selectedServices.join(', ') : selectedService.service,
                servicePackage: selectedPackages.length > 0 ? selectedPackages.join(', ') : selectedService.servicePackage,
                shipment: selectedShipment || '',
                productId: parseInt(productId),
                userId: parseInt(userId),
                updatedAt,
            };
            await updateService(selectedService.id, updatedService);

            onHide(); // Закрыть модальное окно после успешного обновления услуг
            window.location.reload(); // Обновить страницу
        } catch (error) {
            console.error('Ошибка при обновлении услуг:', error);
        }
    };

    const handleDeleteService = async () => {
        if (window.confirm('Вы уверены, что хотите удалить эти услуги?')) {
            try {
                await deleteService(selectedService.id);
                onHide(); // Закрыть модальное окно после успешного удаления заказа заказа
                window.location.reload(); // Обновить страницу
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
                    <Form.Group controlId="formSelectedServ">
                        <Form.Label>Выбранные услуги:</Form.Label>
                        <Dropdown>
                            <Dropdown.Toggle>
                                {selectedServices.length > 0 ? 'Выбрано: ' + selectedServiceInput : 'Выберите услугу'}
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item onClick={() => handleServiceSelect("Не требуется")}>Не требуется</Dropdown.Item>
                                <Dropdown.Item onClick={() => handleServiceSelect("Маркировка товара")}>Маркировка товара</Dropdown.Item>
                                <Dropdown.Item onClick={() => handleServiceSelect("Убрать бирку")}>Убрать бирку</Dropdown.Item>
                                <Dropdown.Item onClick={() => handleServiceSelect("Проверка на брак")}>Проверка на брак</Dropdown.Item>
                                <Dropdown.Item onClick={() => handleServiceSelect("Сброный товар")}>Сброный товар</Dropdown.Item>
                                <Dropdown.Item onClick={() => handleServiceSelect("Добавить бирку")}>Добавить бирку</Dropdown.Item>
                                {/* Add more package options as needed */}
                            </Dropdown.Menu>
                        </Dropdown>
                    </Form.Group>
                    <Form.Control
                        className="mt-2"
                        placeholder={"Услуги"}
                        readOnly
                        value={selectedServiceInput}
                    />
                    {selectedServices.map((src, index) => (
                        <Button
                            key={index}
                            variant="outline-secondary"
                            size="sm"
                            className="mt-2 mr-2"
                            onClick={() => handleRemoveService(src)}
                        >
                            {src} &times;
                        </Button>
                    ))}

                    <Form.Group controlId="formSelectedPackage">
                        <Form.Label className="mt-3">Выбранная упаковка:</Form.Label>
                        <Dropdown>
                            <Dropdown.Toggle>
                                {selectedPackages.length > 0 ? 'Выбрано: ' + selectedPackageInput : 'Выберите упаковку'}
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item onClick={() => handlePackageSelect("Не требуется")}>Не требуется</Dropdown.Item>
                                <Dropdown.Item onClick={() => handlePackageSelect("Картонная коробка")}>Картонная коробка</Dropdown.Item>
                                <Dropdown.Item onClick={() => handlePackageSelect("Стрейч пленка")}>Стрейч пленка</Dropdown.Item>
                                <Dropdown.Item onClick={() => handlePackageSelect("Пакет с бегунком")}>Пакет с бегунком</Dropdown.Item>
                                <Dropdown.Item onClick={() => handlePackageSelect("Пупырчатая пленка")}>Пупырчатая пленка</Dropdown.Item>
                                <Dropdown.Item onClick={() => handlePackageSelect("ZIP-пакет")}>ZIP-пакет</Dropdown.Item>
                                <Dropdown.Item onClick={() => handlePackageSelect("Запайка в плёнку")}>Запайка в плёнку</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Form.Group>
                    <Form.Control
                        className="mt-2"
                        placeholder={"Упаковка"}
                        readOnly
                        value={selectedPackageInput}
                    />
                    {selectedPackages.map((pkg, index) => (
                        <Button
                            key={index}
                            variant="outline-secondary"
                            size="sm"
                            className="mt-2 mr-2"
                            onClick={() => handleRemovePackage(pkg)}
                        >
                            {pkg} &times;
                        </Button>
                    ))}

                    <Form.Group controlId="formSelectedShipment">
                        <Form.Label className="mt-3">Город отгрузки:</Form.Label>
                        <Dropdown>
                            <Dropdown.Toggle>
                                {selectedShipment ? selectedShipment : 'Выберите город отгрузки'}
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item onClick={() => handleShipmentSelect("Не требуется")}>Не требуется</Dropdown.Item>
                                <Dropdown.Item onClick={() => handleShipmentSelect("Москва")}>Москва</Dropdown.Item>
                                <Dropdown.Item onClick={() => handleShipmentSelect("Санкт-Петербург")}>Санкт-Петербург</Dropdown.Item>
                                <Dropdown.Item onClick={() => handleShipmentSelect("Казань")}>Казань</Dropdown.Item>
                                <Dropdown.Item onClick={() => handleShipmentSelect("Екатеринбург")}>Екатеринбург</Dropdown.Item>
                                <Dropdown.Item onClick={() => handleShipmentSelect("Тула")}>Тула</Dropdown.Item>
                                <Dropdown.Item onClick={() => handleShipmentSelect("Краснодар")}>Краснодар</Dropdown.Item>
                                <Dropdown.Item onClick={() => handleShipmentSelect("Невинномысск")}>Невинномысск</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Form.Group>

                    <Form.Group controlId="formSelectedMarketplace">
                        <Form.Label className="mt-3">Маркетплейс:</Form.Label>
                        <Dropdown>
                            <Dropdown.Toggle>
                                {selectedMarketplace ? selectedMarketplace : 'Выберите маркетплейс'}
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item onClick={() => handleMarketplaceSelect("Wildberries")}>Wildberries</Dropdown.Item>
                                <Dropdown.Item onClick={() => handleMarketplaceSelect("Ozon")}>Ozon</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Form.Group>

                    <Form.Group controlId="formProductId">
                        <Form.Label className="mt-3">ID товара:</Form.Label>
                        <Form.Control
                            placeholder={"Введите ID товара"}
                            type="number"
                            value={productId}
                            onChange={e => setProductId(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group controlId="formProductId">
                        <Form.Label className="mt-3">ID Пользователя:</Form.Label>
                        <Form.Control
                            placeholder={"Введите ID пользователя"}
                            type="number"
                            value={userId}
                            onChange={e => setUserId(e.target.value)}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>Отмена</Button>
                <Button variant="danger" onClick={handleDeleteService}>Удалить заказ</Button>
                <Button variant="primary" onClick={handleUpdateService}>Сохранить изменения</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default EditService;
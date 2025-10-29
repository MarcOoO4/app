import React, {useContext, useState} from 'react';
import {Dropdown, Form, Modal} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import 'react-datepicker/dist/react-datepicker.css';
import {createService} from "../../http/serviceAPI";
import {observer} from "mobx-react-lite";
import {Context} from "../../index";

const CreateService = observer( ({show, onHide}) => {

    const [userId, setUserId] = useState('');
    const [productId, setProductId] = useState('');
    const [selectedPackages, setSelectedPackages] = useState([]);
    const [selectedPackage, setSelectedPackage] = useState('');
    const [selectedPackageInput, setSelectedPackageInput] = useState('');
    const [selectedServices, setSelectedServices] = useState([]);
    const [selectedService, setSelectedService] = useState('');
    const [selectedServiceInput, setSelectedServiceInput] = useState('');
    const [selectedMarketplace, setSelectedMarketplace] = useState(""); // Состояние для хранения выбранного маркетплейса
    const [selectedShipment, setSelectedShipment] = useState("");

    const { manager } = useContext(Context);

    const id = localStorage.getItem('id');

    const isAdmin = manager.isAdmin; // Проверяем, является ли пользователь администратором

    // Функция для обновления состояния при выборе маркетплейса
    const handleMarketplaceSelect = (marketplace) => {
        setSelectedMarketplace(marketplace);
    };

    const handleShipmentSelect = (shipment) => {
        setSelectedShipment(shipment);
    };

    const handlePackageSelect = (servicePackage) => {
        setSelectedPackage(servicePackage);
        setSelectedPackages([...selectedPackages, servicePackage]);
        setSelectedPackageInput(selectedPackageInput + (selectedPackageInput.length > 0 ? ', ' : '') + servicePackage);
    };

    const handleRemovePackage = (removedPackage) => {
        const updatedPackages = selectedPackages.filter(pkg => pkg !== removedPackage);
        setSelectedPackages(updatedPackages);
        setSelectedPackageInput(updatedPackages.join(', '));
    };

    const handleServiceSelect = (service) => {
        setSelectedService(service);
        setSelectedServices([...selectedServices, service]);
        setSelectedServiceInput(selectedServiceInput + (selectedServiceInput.length > 0 ? ', ' : '') + service);
    };

    const handleRemoveService = (removedService) => {
        const updatedServices = selectedServices.filter(pkg => pkg !== removedService);
        setSelectedServices(updatedServices);
        setSelectedServiceInput(updatedServices.join(', '));
    };

    const addService = async () => {
        try {
            const services = {
                service: selectedServices.join(', '),
                servicePackage: selectedPackages.join(', '),
                shipment: selectedShipment ? selectedShipment: '',
                marketplace: selectedMarketplace ? selectedMarketplace: '',
                productId: parseInt(productId),
                userId: isAdmin ? userId : parseInt(id),
            };

            const createdService = await createService(services); // Используем функцию создания заказа из orderAPI.js
            console.log('Service created:', createdService);

            onHide();
            window.location.reload();// Закрыть модальное окно после успешного добавления заказа
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
                    Добавить услуги
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Dropdown className="mt-3">
                        <Dropdown.Toggle>
                            {selectedService ? 'Выбрано: ' + selectedService : 'Выберите услугу'}
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
                    <Form.Control
                        className="mt-3"
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

                    <Dropdown className="mt-3">
                        <Dropdown.Toggle>
                            {selectedPackage ? 'Выбрано: ' + selectedPackage : 'Выберите упаковку'}
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
                    <Form.Control
                        className="mt-3"
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
                    <Dropdown className="mt-3">
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

                    <Dropdown className="mt-3">
                        <Dropdown.Toggle>
                            {selectedMarketplace ? selectedMarketplace : 'Выберите маркетплейс'}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item onClick={() => handleMarketplaceSelect("Wildberries")}>Wildberries</Dropdown.Item>
                            <Dropdown.Item onClick={() => handleMarketplaceSelect("Ozon")}>Ozon</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>

                    <Form.Control
                        className="mt-3"
                        placeholder={"Введите ID товара"}
                        type="number"
                        value={productId}
                        onChange={e => setProductId(e.target.value)}
                    />

                    {isAdmin && (
                        <Form.Control
                        className="mt-3"
                        placeholder={"Введите ID заказчика"}
                        type="number"
                        value={userId}
                        onChange={e => setUserId(e.target.value)}
                        />
                    )}
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-danger" onClick={onHide}>Закрыть</Button>
                <Button variant="outline-success" onClick={addService}>Добавить</Button>
            </Modal.Footer>
        </Modal>
    );
});

export default CreateService;
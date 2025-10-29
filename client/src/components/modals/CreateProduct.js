import React, {useContext, useState} from 'react';
import {Form, Modal} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import 'react-datepicker/dist/react-datepicker.css';
import {createProduct} from "../../http/productAPI";
import {observer} from "mobx-react-lite";
import {Context} from "../../index";

const CreateProduct = observer( ({show, onHide}) => {

    const [price, setPrice] = useState('');
    const [product_name, setProduct_name] = useState('');
    const [volume, setVolume] = useState('');
    const [sides, setSides] = useState('');
    const [quantity_product, setQuantity_product] = useState('');
    const [userId, setUserId] = useState('');
    const [orderId, setOrderId] = useState('');

    const { manager } = useContext(Context);

    const id = localStorage.getItem('id');

    const isAdmin = manager.isAdmin; // Проверяем, является ли пользователь администратором

    const addProduct = async () => {
        try {
            const product = {
                product_name,
                price: isAdmin ? price  : '0',
                volume,
                quantity_product,
                sides,
                userId: isAdmin ? userId : parseInt(id),
                orderId: orderId,
            };

            const createdProduct = await createProduct(product); // Используем функцию создания заказа из productAPI.js
            console.log('Product created:', createdProduct);

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
                    Добавить товар
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Control
                        placeholder={"Введите название товара"}
                        value={product_name}
                        onChange={(e) => setProduct_name(e.target.value) }
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
                        placeholder={"Введите сумму сторон единицы товара (см)"}
                        type="number"
                        value={sides}
                        onChange={e => setSides(e.target.value)}
                    />

                    {isAdmin && (
                        <Form.Control
                            className="mt-3"
                            placeholder={"Введите цену товара"}
                            type="number"
                            value={price}
                            onChange={e => setPrice(e.target.value)}
                        />
                    )}

                    <Form.Control
                        className="mt-3"
                        placeholder={"Введите количество товара (шт)"}
                        type="number"
                        value={quantity_product}
                        onChange={e => setQuantity_product(e.target.value)}
                    />

                    <Form.Control
                        className="mt-3"
                        placeholder={"Введите ID заказа"}
                        type="number"
                        value={orderId}
                        onChange={e => setOrderId(e.target.value)}
                    />

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
                <Button variant="outline-success" onClick={addProduct}>Добавить</Button>
            </Modal.Footer>
        </Modal>
    );
});

export default CreateProduct;
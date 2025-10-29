import React, { useState, useEffect } from 'react';
import {Modal, Form, Button} from "react-bootstrap";
import {updateProduct, deleteProduct} from "../../http/productAPI";

const EditProduct = ({ show, onHide, selectedProduct}) => {
    const [price, setPrice] = useState('');
    const [product_name, setProduct_name] = useState('');
    const [volume, setVolume] = useState('')
    const [sides, setSides] = useState('')
    const [quantity_product, setQuantity_product] = useState('')
    const [userId, setUserId] = useState('')
    const [orderId, setOrderId] = useState('');
    const [updatedAt, setUpdatedAt] = useState('')


    useEffect(() => {
        if (selectedProduct) {
            setPrice(selectedProduct.price || '');
            setProduct_name(selectedProduct.product_name || '');
            setVolume(selectedProduct.volume|| '');
            setSides(selectedProduct.sides|| '');
            setQuantity_product(selectedProduct.quantity_product || '');
            setUserId(selectedProduct.userId || '');
            setOrderId(selectedProduct.orderId || '');
            setUpdatedAt(selectedProduct.updatedAt || '');
        }
    }, [selectedProduct]);

    const handleUpdateProduct = async () => {
        try {
            const updatedProduct = {
                id: selectedProduct.id,
                product_name,
                price,
                volume,
                sides,
                quantity_product,
                orderId,
                userId,
                updatedAt,
            };

            await updateProduct(selectedProduct.id, updatedProduct);

            onHide(); // Закрыть модальное окно после успешного обновления заказа
            window.location.reload(); // Обновить страницу
        } catch (error) {
            console.error('Ошибка при обновлении заказа:', error);
        }
    };

    const handleDeleteProduct = async () => {
        if (window.confirm('Вы уверены, что хотите удалить этот заказ?')) {
            try {
                await deleteProduct(selectedProduct.id);
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
                    <Form.Group controlId="formProductName">
                        <Form.Label>Название товара:</Form.Label>
                        <Form.Control
                            placeholder={"Введите название товара"}
                            value={product_name}
                            onChange={(e) => setProduct_name(e.target.value) }
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

                    <Form.Group controlId="formSides">
                        <Form.Label className="mt-3">Сумма сторон единицы товара (см):</Form.Label>
                        <Form.Control
                            placeholder={"Введите сумму сторон единицы товара (см)"}
                            type="number"
                            value={sides}
                            onChange={e => setSides(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group controlId="formPrice">
                        <Form.Label className="mt-3">Цена товара:</Form.Label>
                        <Form.Control
                            placeholder={"Введите цену товара"}
                            type="number"
                            value={price}
                            onChange={e => setPrice(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group controlId="formQuantityProduct">
                        <Form.Label className="mt-3">Количество товара (шт):</Form.Label>
                        <Form.Control
                            placeholder={"Введите количество товара (шт)"}
                            type="number"
                            value={quantity_product}
                            onChange={e => setQuantity_product(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group controlId="formOrderId">
                        <Form.Label className="mt-3">ID заказа:</Form.Label>
                        <Form.Control
                            placeholder={"Введите ID заказа"}
                            type="number"
                            value={orderId}
                            onChange={e => setOrderId(e.target.value)}
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
                <Button variant="danger" onClick={handleDeleteProduct}>Удалить заказ</Button>
                <Button variant="primary" onClick={handleUpdateProduct}>Сохранить изменения</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default EditProduct;
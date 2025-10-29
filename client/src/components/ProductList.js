import React, {useState, useContext} from 'react';
import {observer} from "mobx-react-lite";
import {Button, Form} from "react-bootstrap";
import ProductItem from "./ProductItem";
import EditProduct from './modals/EditProduct'
import {Context} from "../index"; // Импортируем функцию fetchProducts

const ProductList = observer (() => {
    const {product} = useContext(Context)
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [editModalShow, setEditModalShow] = useState(false);
    const [productId, setProductId] = useState('');
    const [searchedProductId, setSearchedProductId] = useState('')
    const [isSearchedProduct, setIsSearchedProduct] = useState(false);

    const handleSearchProduct = () => {
        const foundProduct = product.products.find(product => product.id === parseInt(productId));
        if (foundProduct) {
            setSelectedProduct(foundProduct);
            setSearchedProductId(productId);
            setIsSearchedProduct(true);
        } else {
            setSelectedProduct(null);
            setSearchedProductId(''); // Сбрасываем ID заказа, если он не найден
            alert('Заказ с указанным ID не найден.');
        }
    };

    const handleEditProduct = (product) => {
        setSelectedProduct(product);
        setEditModalShow(true);
    };

    const handleDeleteProduct = () => {
        // Обработчик события для удаления заказа
    };

    const handleProductIdChange = (e) => {
        const value = e.target.value;
        if (!value) {
            setSelectedProduct(null); // Сбрасываем выбранный заказ, если поле поиска по ID пустое
        }
        setProductId(value);
    };

    const sortedProducts = product.products.slice().sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    return (
        <div>
            <Form.Group>
                <Form.Label>Введите ID товара:</Form.Label>
                <Form.Control
                    type="text"
                    value={productId}
                    onChange={handleProductIdChange}
                />
            </Form.Group>
            <Button className='mt-3' onClick={handleSearchProduct}>Поиск</Button>

            {selectedProduct && (
                <ProductItem
                    key={selectedProduct.id}
                    product={selectedProduct}
                    onEdit={handleEditProduct}
                    onDelete={handleDeleteProduct}
                />
            )}
            {/* Отображение всех товаров */}
            {!selectedProduct && sortedProducts.map(product => (
                <ProductItem
                    key={product.id}
                    product={product}
                    onEdit={handleEditProduct}
                    onDelete={handleDeleteProduct}
                />
            ))}
            {selectedProduct && (
                <EditProduct
                    show={editModalShow}
                    onHide={() => {
                        setEditModalShow(false);
                        if (!isSearchedProduct) {
                            setSelectedProduct(null); // Сбрасываем выбранный заказ, если он не был выбран после поиска по ID
                        }
                        if (searchedProductId) {
                            setProductId(searchedProductId); // Устанавливаем значение productId равным найденному ID
                        }

                    }}
                    selectedProduct={selectedProduct}
                />
            )}
        </div>
    );
});

export default ProductList;
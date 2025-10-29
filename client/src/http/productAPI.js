import {$authHost} from "./index";

export const createProduct = async (product) => {
    const {data} = await $authHost.post('api/product', product)
    return data
}

export const fetchProducts = async () => {
    const {data} = await $authHost.get('api/product')
    return data
}

export const updateProduct = async (id, product) => {
    const {data} = await $authHost.put(`api/product/productupdate/${id}`, product)
    return data
}
export const deleteProduct = async (id) => {
    const {data} = await $authHost.delete(`api/product/productdelete/${id}`)
    return data
}
import {makeAutoObservable} from "mobx";

export default class ProductStore {
    constructor() {
        this._products = []
        this._product = {}
        makeAutoObservable(this)
    }

    setProducts(products) {
        this._products = products;
    }

    get products() {
        return this._products
    }

    get product() {
        return this._product
    }
}
import {makeAutoObservable} from "mobx";

export default class ServiceStore {
    constructor() {
        this._services = []
        this._service = {}
        makeAutoObservable(this)
    }

    setServices(services) {
        this._services = services;
    }

    get services() {
        return this._services
    }

    get service() {
        return this._service
    }
}
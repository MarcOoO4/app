import {makeAutoObservable} from "mobx";

export default class ManagerStore {
    constructor() {
        this._isAuth = false
        this._manager = {}
        this._isAdmin = false
        this._managers = []
        const storedIsAdmin = localStorage.getItem('isAdmin');
        if (storedIsAdmin) {
            this._isAdmin = JSON.parse(storedIsAdmin);
        }
        makeAutoObservable(this)
    }

    setIsAuth(bool) {
        this._isAuth = bool;
    }

    setManager(manager) {
        this._manager = manager;
    }
    setIsAdmin(bool) {
        this._isAdmin = bool
        // localStorage.setItem('isAdmin', JSON.stringify(bool));
    }

    setUsers(managers) {
        this._managers = managers;
    }

    get isAuth() {
        return this._isAuth
    }

    get manager() {
        return this._manager
    }

    get isAdmin() {
        return this._isAdmin
    }

    get managers() {
        return this._managers
    }

}
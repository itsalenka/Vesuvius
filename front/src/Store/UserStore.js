import {makeAutoObservable} from "mobx";

export default class UserStore {
    _account = []
    _isAuth = null
    _userRole = null
    _userId = null
    _trucks = []
    _drivers = []
    _company = []

    constructor() {
        this.check()
        makeAutoObservable(this)
    }

    get isAuth() {
        return this._isAuth
    }

    get userRole() {
        return this._userRole
    }

    get userId() {
        return this._userId
    }

    get company() {
        return this._company
    }

    get drivers() {
        return this._drivers
    }

    get trucks() {
        return this._trucks
    }

    get myRequests() {
        return this._myRequests
    }

    setIsAuth(bool) {
        this._isAuth = bool
    }

    setUserRole(user) {
        this._user = user
    }

    setCompany(company) {
        this._company = company
    }

    setUserId(id) {
        this._userId = id
    }

    setMyRequests(requests) {
        this._myRequests = requests
    }

    setDrivers(drivers) {
        this._drivers = drivers
    }

    setTrucks(trucks) {
        this._trucks = trucks
    }

    setAccount(obj) {
        this._account = obj;
    }

    get account() {
        return this._account;
    }


    check = async () => {
        if (!localStorage.getItem('access_token')) {
            this._isAuth = false
            this._userRole = null
            this._userId = null
            this._myRequests = null
            this._company = []
            this._account = []
        } else {
            this._isAuth = true
            this._userRole = localStorage.getItem('user_role')
            this._userId = localStorage.getItem('user_id')
        }
    }

}
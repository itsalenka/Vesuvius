import {_resetGlobalState, makeAutoObservable} from "mobx";

export default class RequestStore{
    _requests = []
    ws = null

    constructor() {
        this.ws = new WebSocket('wss://ten:5000')
        this.ws.onmessage = (e) => {
            this.setRequests(JSON.parse(e.data))
        }
        makeAutoObservable(this)
    }

    setRequests(requests){
        this._requests = requests

    }

    get requests(){
        return this._requests
    }
}
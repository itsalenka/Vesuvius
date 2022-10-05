//import {makeAutoObservable} from "mobx";

export default class LocationStore{
    _points = []
    ws = null

    constructor() {
        this.ws = new WebSocket('wss://ten:5000')
        this.ws.onmessage = (e) => {
            let data = JSON.parse(e.data)
            this.setPoints(data.id, data)
            //console.log()
            //console.log(this._points)
        }
        //makeAutoObservable(this)
    }

    setPoints(id, obj){
        this._points[id] = (obj)

    }

    get points(){
        return this._points;
    }
}
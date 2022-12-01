import {makeAutoObservable} from "mobx";

export default class FilterStore {

    _dateFilter = ''
    _typeTruckFilter = ''
    _ADRFilter = ''
    _From = ''
    _To = ''

    constructor() {
        makeAutoObservable(this)
    }

    getRequests(requests){
        return requests ? requests.filter(el => (this._dateFilter === '' || (this.compareDate(el.dateLoading, this._dateFilter)))
            && (this._typeTruckFilter === '' || el.typeTruck === this._typeTruckFilter)
            && (this._ADRFilter === '' || el.ADR === this._ADRFilter)
            && (this._From === '' || el.WRCity.toLowerCase().includes(this._From.toLowerCase()))
            && (this._To === '' || el.WCity.toLowerCase().includes(this._To.toLowerCase()))) : []
    }

    setDateFilter(date){
        this._dateFilter = date
    }
    get dateFilter(){
        return this._dateFilter
    }

    get typeTruckFilter(){
        return this._typeTruckFilter
    }
    setTypeTruckFilter(type){
        this._typeTruckFilter = type
    }

    get ADRFilter(){
        return this._ADRFilter
    }
    setADRFilter(adr){
        this._ADRFilter = adr
    }

    get To(){
        return this._To
    }
    setTo(city){
        this._To = city
    }

    get From(){
        return this._From
    }
    setFrom(city){
        this._From = city
    }

    compareDate(str, str2){

        let str1 = str.split(' ')[0];
        let parts1 = str1.split('.')
        let parts2 = str2.split('-')
        return parts1[2] == parts2[0] &&
            parts1[1] == parts2[1] &&
            parts1[0] == parts2[2]
    }
}


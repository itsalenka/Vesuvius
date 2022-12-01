import {makeAutoObservable} from "mobx";

export default class TypesStore{
    _ADRs = []
    _typesTruck = []
    constructor() {
        makeAutoObservable(this)
    }


    setADRs(adrs){
        this._ADRs = adrs
    }

    setTypesTruck(types){
        this._typesTruck = types
    }

    get ADRs(){
        return this._ADRs
    }

    get typesTruck(){
        return this._typesTruck
    }
}
import {makeAutoObservable} from "mobx";
//import {getAllCities, getCities} from "../https/cityAPI";

export default class CityStore{
    _cities = []
    _WRCities = []
    _WCities = []
    _countries = []
    _states = []
    _WRCountries = []
    _WRStates = []
    _WCountries = []
    _WStates = []
    constructor() {
        makeAutoObservable(this)
    }

    get cities(){
        return this._cities
    }

    setCities(cities){
        this._cities = cities
    }

    get WRCities(){
        return this._WRCities
    }

    setWRCities(cities){
        this._WRCities = cities
    }

    get WCities(){
        return this._WCities
    }

    setWCities(cities){
        this._WCities = cities
    }

    setCountries(countries){
        this._countries = countries
    }

    get countries(){
        return this._countries
    }

    setStates(states){
        this._states = states
    }

    get states(){
        return this._states
    }

    setWRStates(states){
        this._WRStates = states
    }

    get WRStates(){
        return this._WRStates
    }

    setWStates(states){
        this._WStates = states
    }

    get WStates(){
        return this._WStates
    }
}
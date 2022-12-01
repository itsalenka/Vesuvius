module.exports = class RequestDto{
    id
    dateLoading
    dateUnloading
    WRCity
    WCity
    weight
    typeTruck
    cargo
    rate
    ADR
    carrier

    constructor(model) {
        this.id = model.id
        this.dateLoading =this.getDate(model.dateLoading)
        this.dateUnloading = this.getDate(model.dateUnloading)
        this.WRCity = model.WRCountry + ', ' + model.WRState + ', ' + model.WRCity
        this.WCity = model.WCountry + ', ' + model.WState + ', ' + model.WCity
        this.weight = model.weight
        this.typeTruck = model.typeTruck.dataValues.name
        this.cargo = model.cargo
        this.rate = model.rate
        this.ADR = model.ADR.dataValues.name
        this.carrier = model.carrierId == null ? 'no' : 'yes'
    }

    getDate(str){
        let date = new Date(str)
        let day = date.getDay()
        let month = date.getMonth() + 1
        let year = date.getFullYear()
        let hours = date.getHours()
        let min = date.getMinutes()
        return this.addZero(day) + '.' + this.addZero(month) + '.' + year + ' ' + this.addZero(hours) + ":" + this.addZero(min);
    }

    addZero(number){
        return number < 10 ? `0${number.toString()}` : number.toString()
    }

}
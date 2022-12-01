module.exports = class AllRequestDto{
    id
    dateLoading
    WRCity
    WCity
    weight
    typeTruck
    typeLoading
    typeUnloading
    cargo
    rate
    ADR
    note
    carrier
    customer
    director
    phoneNumber
    city
    email
    driver

    constructor(model, companyCarrier, userCarrier, role, id, company) {
        console.log(model)
        this.id = model.id
        this.dateLoading = this.getDate(model.dateLoading)
        this.dateUnloading = this.getDate(model.dateUnloading)
        this.WRCity = model.WRCountry + ', ' + model.WRState + ', ' + model.WRCity
        this.WCity = model.WCountry + ', ' + model.WState + ', ' + model.WCity
        this.weight = model.weight
        this.volume = model.volume
        this.typeTruck = model.typeTruck.dataValues.name
        this.typeLoading = model.typeLoading
        this.typeUnloading = model.typeUnloading
        this.cargo = model.cargo
        this.rate = model.rate
        this.ADR = model.ADR.dataValues.name
        this.note = model.note
        this.carrier = model.carrierId
        this.customer = {
            id: model.customerId,
            nameCompany: model.customer.dataValues.name,
            director: model.customer.dataValues.director,
            phoneNumber: model.customer.dataValues.users[0].dataValues.phoneNumber,
            name: model.customer.dataValues.users[0].dataValues.name,
            email: model.customer.dataValues.users[0].dataValues.email,
            city: model.customer.dataValues.city,
        }
        if (model.customerId == company || model.driverId == id || model.carrierId == id) {
            this.loadLimit = model.loadLimit
            if(model.startLoad != undefined)
                this.startLoad = this.getDate(model.startLoad)
            if(model.startUnload)
                this.startUnload = this.getDate(model.startUnload)
            if(model.finishLoad)
                this.finishLoad = this.getDate(model.finishLoad)
            if(model.finishUnload)
                this.finishUnload = this.getDate(model.finishUnload)
            if (userCarrier && companyCarrier) {
                this.carrier = {
                    id: model.carrierId,
                    nameCompany: companyCarrier.name,
                    director: companyCarrier.director,
                    phoneNumber: userCarrier.phoneNumber,
                    name: userCarrier.name,
                    email: userCarrier.email,
                    city: companyCarrier.city,
                }
            }
            if (model.driver) {
                this.driver = {
                    id: model.driverId,
                    phoneNumber: model.driver.dataValues.phoneNumber,
                    email: model.driver.dataValues.email,
                    name: model.driver.dataValues.name,
                }

            }
        }
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
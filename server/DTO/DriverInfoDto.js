module.exports = class DriverInfoDto{
    id;
    name;
    phoneNumber;
    email;
    truck;
    constructor(model) {
        this.id = model.id;
        this.name = model.name;
        this.phoneNumber = model.phoneNumber;
        this.email = model.email;
        console.log(model.truck)
        this.truck = model.truck ? model.truck.dataValues.number : null;
    }
}
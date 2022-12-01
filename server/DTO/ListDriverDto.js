module.exports = class ListDriverDto{
    id;
    name;
    email;
    truck;
    constructor(model) {
        console.log(model)
        this.id = model.id;
        this.name = model.name;
        this.email = model.email;
        this.truck = model.truck ? model.truck.dataValues.number : 'none';
    }
}
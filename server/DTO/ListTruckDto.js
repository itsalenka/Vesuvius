module.exports = class ListTruckDto{
    number;
    brand;
    model;
    year;
    typeTruck;
    driver;
    id;

    constructor(model) {
        this.id = model.id;
        this.number = model.number;
        this.brand = model.brand;
        this.year = model.year;
        this.model = model.model;
        this.typeTruck = model.typeTruck.dataValues.name;
        this.driver = model.driver ? model.driver.dataValues.name : 'none';
    }

}
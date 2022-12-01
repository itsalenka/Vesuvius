module.exports = class TruckInfoDto{
    number;
    brand;
    model;
    year;
    typeTruck;
    driver;
    notes;
    maxWeight;
    maxVolume;
    id;
    isPearLoading;
    isUpLoading;
    isSideLoading;

    constructor(model) {
        this.id = model.id;
        this.number = model.number;
        this.brand = model.brand;
        this.year = model.year;
        this.model = model.model;
        this.notes = model.notes;
        this.maxVolume = model.maxVolume;
        this.maxWeight = model.maxWeight;
        this.isUpLoading = model.isUpLoading;
        this.isPearLoading = model.isPearLoading;
        this.isSideLoading = model.isSideLoading;
        this.typeTruck = model.typeTruck.dataValues.name;
        if(model.driver)
            this.driver = {name: model.driver.dataValues.name,
                            id: model.driver.dataValues.id};
    }

}
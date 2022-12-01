module.exports = class CompanyInfoDto{

    company;
    director;
    bankInfo;
    country;
    state;
    city;
    address;

    constructor(model) {
        this.company = model.name;
        this.director = model.director;
        this.bankInfo = model.bankInfo;
        this.country = model.country;
        this.state = model.state;
        this.city = model.city;
        this.address = model.address;
    }

}
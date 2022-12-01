module.exports = class CompanyInfoDto{

    email;
    phoneNumber;
    name;

    constructor(model) {
        this.email = model.email;
        this.phoneNumber = model.phoneNumber;
        this.name = model.name;
    }
}
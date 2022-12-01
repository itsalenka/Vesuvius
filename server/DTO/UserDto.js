module.exports = class UserDto{
    id;
    email;
    company;
    isActive;
    role;

    constructor(model) {
        this.id = model.id;
        this.email = model.email;
        this.company = model.companyId;
        this.isActive = model.isActivated;
        this.role = model.role;
    }

}
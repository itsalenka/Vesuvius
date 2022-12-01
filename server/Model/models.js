const {Model, DataTypes} = require('sequelize')


class User extends Model{}
class Company extends Model{}
class Token extends Model{}
class Request extends Model{}
class ADR extends Model{}
class Truck extends Model{}
class TypeTruck extends Model{}

let modelsSetUp = (sequelize) => {
    Company.init({
            id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
            name: {type: DataTypes.STRING, unique: true, allowNull: false},
            director: {type: DataTypes.STRING, allowNull: false},
            country: {type: DataTypes.STRING, allowNull: false},
            state: {type: DataTypes.STRING, allowNull: false},
            city: {type: DataTypes.STRING, allowNull: false},
            bankInfo: {type: DataTypes.STRING, allowNull: true},
            address: {type: DataTypes.STRING, allowNull: false},
        },
        {
            sequelize,
            modelName: "Company",
            tableName: 'Companies',
            timestamps: false
        });

    User.init( {
            id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
            email: {type: DataTypes.STRING, unique: true, allowNull: false},
            password: {type: DataTypes.STRING, allowNull: false},
            role: {type: DataTypes.STRING, allowNull: false},
            isActivated: {type: DataTypes.BOOLEAN, default: false, allowNull: false},
            activationLink: {type: DataTypes.STRING, allowNull: false},
            phoneNumber: {type: DataTypes.STRING, allowNull: false},
            name: {type: DataTypes.STRING, allowNull: false},
        },
        {
            sequelize,
            modelName: "User",
            tableName: "Users",
            timestamps: false
        });

    Token.init({
            refreshToken: {type: DataTypes.STRING, required: true},
        },
        {
            sequelize,
            modelName: "Token",
            tableName: "Tokens",
            timestamps: false
        })

    ADR.init({
            id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
            name: {type: DataTypes.STRING, allowNull: false},
        },
        {
            sequelize,
            modelName: "ADR",
            tableName: 'ADRs',
            timestamps: false
        })

    TypeTruck.init({
            id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
            name: {type: DataTypes.STRING, allowNull: false},
        },
        {
            sequelize,
            modelName: "TypeTruck",
            tableName: 'TypeTrucks',
            timestamps: false
        })

    Request.init({
            id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
            dateLoading: {type: DataTypes.DATE, allowNull: false},
            dateUnloading: {type: DataTypes.DATE, allowNull: false},
            WRCountry: {type: DataTypes.STRING, allowNull: false},
            WCountry: {type: DataTypes.STRING, allowNull: false},
            WRState: {type: DataTypes.STRING, allowNull: false},
            WState: {type: DataTypes.STRING, allowNull: false},
            WRCity: {type: DataTypes.STRING, allowNull: false},
            WRAddress: {type: DataTypes.STRING, allowNull: false},
            WCity: {type: DataTypes.STRING, allowNull: false},
            WAddress: {type: DataTypes.STRING, allowNull: false},
            weight: {type: DataTypes.INTEGER, allowNull: false},
            volume: {type: DataTypes.INTEGER, allowNull: false},
            typeLoading: {type: DataTypes.STRING, allowNull: false},
            typeUnloading: {type: DataTypes.STRING, allowNull: false},
            cargo: {type: DataTypes.STRING, allowNull: false},
            rate: {type: DataTypes.INTEGER, allowNull: false},
            note: {type: DataTypes.STRING, allowNull: true},
            startLoad: {type: DataTypes.DATE, allowNull: true},
            finishLoad: {type: DataTypes.DATE, allowNull: true},
            startUnload: {type: DataTypes.DATE, allowNull: true},
            finishUnload: {type: DataTypes.DATE, allowNull: true},
            isBlocked: {type: DataTypes.BOOLEAN, default: false},
            loadLimit: {type: DataTypes.INTEGER, allowNull: false},//hour от 1 до 48
        },
        {
            sequelize,
            modelName: "Request",
            tableName: 'Requests',
            timestamps: false
        })

    Truck.init({
            id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
            maxWeight: {type: DataTypes.INTEGER, allowNull: false},
            maxVolume: {type: DataTypes.INTEGER, allowNull: false},
            isUpLoading: {type: DataTypes.BOOLEAN, default: false},
            isSideLoading: {type: DataTypes.BOOLEAN, default: false},
            isPearLoading: {type: DataTypes.BOOLEAN, default: false},
            number: {type: DataTypes.STRING, unique: true, allowNull: false},
            brand: {type: DataTypes.STRING, allowNull: false},
            model: {type: DataTypes.STRING, allowNull: false},
            year: {type: DataTypes.INTEGER, allowNull: false},
            notes: {type: DataTypes.STRING, allowNull: true},
        },
        {
            sequelize,
            modelName: "Truck",
            tableName: 'Trucks',
            timestamps: false
        })

    Company.hasMany(User, { as: "users", foreignKey: "companyId"});
    User.belongsTo(Company, {
        as: "company",
    });

    TypeTruck.hasMany(Request, { as: "requests", foreignKey: "typeTruckId"});
    Request.belongsTo(TypeTruck, {
        as: "typeTruck",
    });

    TypeTruck.hasMany(Truck, { as: "trucks", foreignKey: "typeTruckId"});
    Truck.belongsTo(TypeTruck, {
        as: "typeTruck",
    });

    ADR.hasMany(Request, { as: "requests", foreignKey: "ADRId"});
    Request.belongsTo(ADR, {
        as: "ADR",
    });
    Company.hasMany(Request, { as: "CreatedRequests", foreignKey: "customerId"});
    Request.belongsTo(Company, {
        as: "customer",
    });

    Company.hasMany(Request, { as: "AcceptedRequests", foreignKey: "carrierId"});
    Request.belongsTo(Company, {
        as: "carrier",
    });

    User.hasMany(Request, { as: "requests",  foreignKey: "driverId"});
    Request.belongsTo(User, {
        as: "driver"
    });

    User.hasOne(Truck, { as: "truck",  foreignKey: "driverId"});
    Truck.belongsTo(User, {
        as: "driver"
    });

    Company.hasMany(Truck, { as: "trucks", foreignKey: "companyId"});
    Truck.belongsTo(Company, {
        as: "company",
    });

    User.hasMany(Token, { as: "tokens", foreignKey: "userId" });
    Token.belongsTo(User, {
        as: "user"
    });

    return {User, Request, TypeTruck, ADR, Company, Token, Truck};
}

module.exports.Models = (sequelize) => modelsSetUp(sequelize) ;
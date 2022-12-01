const{Sequelize} = require('sequelize')

const sequelize = new Sequelize(
    {
        username: 'User',
        password: 'User',
        database: 'Vesuvius_Node',
        host:     'localhost',
        dialect:  'mssql',
        pool:
            {
                max: 10,
                min: 0,
                idle: 10000
            }
    })

sequelize.sync().then(() =>
{
    console.log('success connection.');
}).catch(err => { console.log('Error while BD connecting: ' + err); });

module.exports = sequelize;
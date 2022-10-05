
class LocationService {
    async set(body){
       console.log(body)
        return 'ok'
    }
}

module.exports = new LocationService()
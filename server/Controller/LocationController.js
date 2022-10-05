const locationService = require("../Service/LocationService")
const WebSocket = require("ws");

module.exports = {
    setLocation: async (req, res, next) => {
        const { wss } = req.app.locals;
        const data = await locationService.set(req.body)
        await sendBroadcast(wss, req.body);
        return res.json(data)
    }
}

sendBroadcast = async (wss, body, idS) => {
    wss.clients.forEach(async (client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({id: '1', lat: body.latitude.toString(), lng: body.longitude.toString()}))
        }
    })
}
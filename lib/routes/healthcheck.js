class HealthCheckRoute
{
    constructor(server) {
        if (undefined === server) {
            throw new Error('Server not define');
        }

        this.server = server;
    }

    setup() {
        this.server.get('/health', this.sendResponse);
    } 

    sendResponse(request, response, next) {
        const health = {
            message : "ok"
        }

        try {
            response.send(health);
        } catch (err) {
            next(err)
        }
    }
}

module.exports = HealthCheckRoute;
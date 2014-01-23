//schema.js
module.exports = {

    clientRequest: {
        type: "object",
        properties: {
            posX: {
                type: "integer",
                minimum: 0
            }
            posY: {
                type: "integer",
                minimum: 0
            }
            level: {
                type: "integer",
                minimum: 0
            }
            zoom: {
                type: "integer",
                minimum: 1
            }

        },
        required: ["posX", "posY", "level", "zoom"]
    }

}

module.exports = {

    request: {
        type: "object",
        properties: {
            sessionId: {
                type: "string" //I suppose

            },
            clientRequest: {
                "$ref": "clientNodejsProtocol.js#/request"
            }

        },
        required: ["sessionId", "clientRequest"]

    },

    response: {
        type: "object",
        properties: {
            "type": {
                "enum": ["response"]
            },
            sessionId: {
                type: "string" //I suppose

            },
            clientResponse: {
                "$ref": "clientNodejsProtocol.js#/response"
            }


        },
        required: ["type", "sessionId", "clientResponse"]

    },


    newData: {
        type: "object",
        properties: {
            "type": {
                "enum": ["newData"]
            },
            sessionIds: {
                type: "array",
                minItems: 1,
                items: {
                    type: "string" //I suppose
                }
            },
            newData: {
                "$ref": "clientNodejsProtocol.js#/newData"
            }


        },
        required: ["type", "sessionId", "newData"]

    }


}

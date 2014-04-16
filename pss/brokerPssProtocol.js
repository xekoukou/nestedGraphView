module.exports {

    request: {
        type: "object",
        properties: {
            requestId: {
                type: "string"
            },
            request: {
                type: "object",
                oneof: [{
                        "$ref": "../clientNodejsProtocol.js#/definitions/searchRequest"
                    }, {
                        "$ref": ""
                    }, {
                        "$ref": ""
                    }

                ]
            }

        },
        required: ["requestId", "request"]

    },

    response: {
        type: "object",
        properties: {
            'type': {
                'enum': ['searchResponse']
            },
            nodeArray: {
                type: "array",
                minItems: 0,
                items: {
                    type: "object",
                    properties: {
                        id: {
                            type: "integer"
                        },
                        posX: {
                            type: "integer",
                            minimum: 0
                        },
                        posY: {
                            type: "integer",
                            minimum: 0
                        }


                    },
                    required: ["id", "posX", "posY"]
                }
            }

        },
        required: ["type", "nodeArray"]

    }

}

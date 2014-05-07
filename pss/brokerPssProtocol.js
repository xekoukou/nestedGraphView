module.exports {

    request: {
        type: "object",
        properties: {
            requestId: {
                type: "integer"
            },
            request: {
                type: "object",
                oneof: [{
                        "$ref": "../clientNodejsProtocol.js#/definitions/searchRequest"
                    }, {
                        "$ref": "#/definitions/newNodeRequest"
                    }, {
                        "$ref": "../clientNodejsProtocol.js#/definitions/newPosition"
                    }

                ]
            }

        },
        required: ["requestId", "request"],
        definitions: {
            newNodeRequest: {
                type: "object",
                properties: {
                    "type": {
                        "enum": ["newNodeRequest"]
                    },
                    node: {
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
                },
                required: ["type", "node"]
            }

        }

    },

    response: {
        type: "object",
        properties: {
            requestId: {
                type: "integer"
            },
            response: {
                type: "object",
                oneof: [{
                    "$ref": "$/definitions/searchResponse"
                }, {
                    "$ref": "$/definitions/newNodeResponse"
                }]
            }
        },
        required: ["requestId", "response"]

        ,
        definitions: {

            searchResponse: {
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

            },

            newNodeResponse: {
                type: "object",
                properties: {
                    type: {
                        "enum": ["newNodeResponse"]
                    },
                    ack: {
                        "enum": ["ok", "fail"]
                    }
                },
                required: ["ack"]
            }
        }

    }

}

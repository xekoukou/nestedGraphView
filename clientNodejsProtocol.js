//clientNodejsProtocol.js
module.exports = {

    request: {
        type: "object",
        properties: {
            "clientRequestId": {
                type: "integer"
            },
            'request': {
                oneOf: [{
                    '$ref': '#/definitions/searchRequest'
                }, {
                    '$ref': '#/definitions/newNode'
                }, {
                    '$ref': '#/definitions/delNode'
                }, {
                    '$ref': '#/definitions/newPosition'
                }, {
                    '$ref': '#/definitions/newNodeData'
                }, {
                    '$ref': '#/definitions/newLink'
                }, {
                    '$ref': '#/definitions/delLink'
                }],
            }
        },
        required: ['clientRequestId', 'request'],
        "additionalProperties": false,
        definitions: {
            searchRequest: {
                type: "object",
                properties: {
                    'type': {
                        enum: ['searchRequest']
                    },
                    "searchArray": {
                        type: "array",
                        minItems: 1,
                        items: {
                            type: "object",
                            properties: {
                                posX: {
                                    type: "integer",
                                    minimum: 0
                                },
                                posY: {
                                    type: "integer",
                                    minimum: 0
                                },
                                crit_pos: {
                                    type: "integer",
                                    minimum: 0
                                }


                            },
                            required: ["posX", "posY", "crit_pos"],
                            "additionalProperties": false
                        }
                    }

                },
                required: ["type", "searchArray"],
                "additionalProperties": false
            },

            'newNode': {
                type: "object",
                properties: {
                    'type': {
                        enum: ['newNode']
                    },
                    "node": {
                        type: "object",
                        properties: {
                            posX: {
                                type: "integer",
                                minimum: 0
                            },
                            posY: {
                                type: "integer",
                                minimum: 0
                            },
                            node: {
                                "$ref": "node.js#/node"
                            }
                        },
                        required: ['posX', 'posY', 'node'],
                        "additionalProperties": false
                    }
                },
                required: ['type', "node"],
                "additionalProperties": false
            },

            'delNode': {
                type: "object",
                properties: {
                    'type': {
                        enum: ['delNode']
                    },
                    "id": {
                        type: "integer",
                        minimum: 1
                    }
                },
                required: ['type', 'id'],
                "additionalProperties": false

            },

            newPosition: {
                type: "object",
                properties: {
                    'type': {
                        enum: ['newPosition']
                    },
                    id: {
                        type: "integer",
                        minimum: 1
                    },
                    posX: {
                        type: 'integer',
                        minimum: 0
                    },
                    posY: {
                        type: 'integer',
                        minimum: 0
                    }
                },
                required: ['type', 'id', 'posX', 'posY'],
                "additionalProperties": false
            },
            newNodeData: {
                type: "object",
                properties: {
                    'type': {
                        enum: ['newNodeData']
                    },
                    id: {
                        type: "integer",
                        minimum: 1
                    },
                    nodeData: {
                        type: 'object',

                    }
                },
                required: ['type', 'content'],
                "additionalProperties": false
            },
            newLink: {
                type: "object",
                properties: {
                    'type': {
                        enum: ['newLink']
                    },
                    link: {
                        type: "object",
                        properties: {
                            'origId': {
                                type: 'integer',
                                minimum: 1
                            },
                            'endId': {
                                type: 'integer',
                                minimum: 1
                            },
                            linkData: {
                                type: "object"
                            },
                        },
                        required: ["origId", "endId", "linkData"],
                        "additionalProperties": false
                    }
                },
                required: ['type', 'link'],
                "additionalProperties": false
            },
            delLink: {
                type: "object",
                properties: {
                    'type': {
                        enum: ['delLink']
                    },
                    'id': {
                        type: 'integer',
                        minimum: 0
                    }
                },
                required: ['type', 'id'],
                "additionalProperties": false
            }
        }
    },

    response: {
        type: "object",
        properties: {
            clientRequestId: {
                type: "integer"
            },
            'response': {
                oneof: [{
                    '$ref': '#/definitions/searchResponse'
                }]
            }
        },
        required: ['clientRequestId', 'response'],
        "additionalProperties": false


        ,
        definitions: {
            searchResponse: {
                type: "object",
                properties: {
                    'type': {
                        enum: ['searchResponse']
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
                                },
                                node: {
                                    "$ref": "node.js#/node"
                                }


                            },
                            required: ["id", "posX", "posY", "node"],
                            "additionalProperties": false
                        }
                    }

                },
                required: ["type", "nodeArray"],
                "additionalProperties": false
            }
        }
    }


    //There are no responses for the rest of te requests. If data have been saved one would simply check that they have by looking the graph.


    ,
    //this is sent to the client when changes have been made to the location he is viewing. it is sent without a prior request
    newData: {
        type: "object",
        properties: {
            //new or updated nodes
            newNodes: {
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
                        },
                        node: {
                            "$ref": "node.js#/node"
                        }


                    },
                    required: ["id", "posX", "posY", "node"],
                    "additionalProperties": false
                }
            },
            deletedNodes: {
                type: "array",
                minItems: 0,
                items: {
                    type: "object",
                    properties: {
                        id: {
                            type: "integer"
                        }


                    },
                    required: ["id"],
                    "additionalProperties": false
                }

            },
            newLinks: {
                type: "array",
                minItems: 0,
                items: {
                    "$ref": "node.js#/node/definitions/link"
                }
            }


        },
        "additionalProperties": false
    }
}

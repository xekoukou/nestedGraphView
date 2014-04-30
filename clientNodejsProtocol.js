//clientNodejsProtocol.js
module.exports = {

    request: {
        type: "object",
        properties: {
            clientRequestId: {
                type: "integer"
            },
            'request': {
                type: 'object',
                oneof: [{
                    '$ref': '#/definitions/searchRequest'
                }, {
                    '$ref': '#/definitions/newNode'
                }, {
                    '#ref': '#/definitions/delNode'
                }, {
                    '$ref': '#/definitions/newPosition'
                }, {
                    '$ref': '#/definitions/newNodeData'
                }, {
                    '$ref': '#/definitions/newlink'
                }, {
                    '#ref': '#/definitions/dellink'
                }],
            }
        },
        required: ['clientRequestId', 'request']
    },

    definitions: {
        searchRequest: {
            type: "object",
            properties: {
                'type': {
                    'enum': ['searchRequest']
                },
                searchArray: {
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
                        required: ["posX", "posY", "crit_pos"]
                    }
                }

            },
            required: ["type", "searchArray"]
        },

        'newNode': {
            type: "object",
            properties: {
                'type': {
                    'enum': ['newNode']
                },
                node: {
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
                            type: "object",
                        }
                    },
                    required: ['posX', 'posY', 'node']
                }
            },
            required: ['type', "node"]
        },
        'delNode': {
            type: "object",
            properties: {
                'type': {
                    'enum': ['delNode']
                },
                id: {
                    type: "integer",
                    minimum: 0
                }
            },
            required: ['type', 'id']

        },

        newPosition: {
            type: "object",
            properties: {
                'type': {
                    'enum': ['newPosition']
                },
                id: {
                    type: "integer",
                    minimum: 0
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
            required: ['type', 'id', 'posX', 'posY']
        },
        newNodeData: {
            type: "object",
            properties: {
                'type': {
                    'enum': ['newNodeData']
                },
                id: {
                    type: "integer",
                    minimum: 0
                },
                nodeData: {
                    type: 'object',

                }
            },
            required: ['type', 'content']
        },
        newlink: {
            type: "object",
            properties: {
                'type': {
                    'enum': ['newlink']
                },
                'orig': {
                    type: 'integer',
                    minimum: 0
                },
                'dest': {
                    type: 'integer',
                    minimum: 0
                },
                linkData: {
                    type: "object"
                }
            },
            required: ['type', 'orig', 'dest', 'linkData']
        },
        dellink: {
            type: "object",
            properties: {
                'type': {
                    'enum': ['dellink']
                },
                'linkid': {
                    type: 'integer',
                    minimum: 0
                }
            },
            required: ['type', 'linkid']
        }
    },

    response: {
        type: "object",
        properties: {
            clientRequestId: {
                type: "integer"
            },
            'response': {
                type: 'object',
                oneof: [{
                    '$ref': '#/rDefinitions/searchResponse'
                }]
            }
        },
        required: ['clientRequestId', 'response']


    },
    rdefinitions: {
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
                            },
                            node: {
                                type: "object"
                            }


                        },
                        required: ["id", "posX", "posY", "node"]
                    }
                }

            },
            required: ["type", "nodeArray"]
        }
    }


    //There are no responses for the rest of te requests. If data have been saved one would simply check that they have by looking the graph.


    ,
    //this is sent to the client when changes have been made to the location he is viewing. it is sent without a prior request
    newData: {
        type: "object",
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
                        type: "object"
                    }


                },
                required: ["id", "posX", "posY", "node"]
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
                required: ["id"]
            }

        },
        required: ["newNodes", "deletedNodes"]
    }
}

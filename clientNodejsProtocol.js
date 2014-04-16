//clientProtocol.js
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
                    '#ref': '#/definitions/updateRequest'
                }],
            }
        },
        required: ['clientRequestId', 'request']
    },

    definitions: [
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

        updateRequest: {
            type: 'Object',
            propeties: {
                'type': {
                    'enum': ['updateRequest']
                },
                request: {
                    type: 'object',
                    oneof: [{
                        '$ref': '#/definitions/newNode'
                    }, {
                        '$ref': '#/definitions/updateNode'
                    }, {
                        '#ref': '#/definitions/delNode'
                    }],
                }
            },
            required: ['type', 'request']
        },

        'newNode': {
            type: "object",
            properties: {
                'type': {
                    'enum': ['newNode']
                },
                posX: {
                    type: "integer",
                    minimum: 0
                },
                posY: {
                    type: "integer",
                    minimum: 0
                },
                parentId: {
                    type: "integer",
                    minimum: 0
                }
            },
            required: ['type', 'posX', 'posY', 'parentId']
        },
        'delNode': {
            type: "object",
            properties: {
                'type': {
                    'enum': ['delNode']
                },
                posX: {
                    type: "integer",
                    minimum: 0
                },
                posY: {
                    type: "integer",
                    minimum: 0
                },
                id: {
                    type: "integer",
                    minimum: 0
                }
            },
            required: ['type', 'id', 'posX', 'posY', ]

        },

        'updateNode': {
            type: 'object',
            properties: {
                'type': {
                    'enum': ['updateNode']
                },
                request: {
                    type: 'object',
                    oneof: [{
                            '$ref': '#/definitions/newPosition'
                        }, {
                            '$ref': '#/definitions/newContent'
                        }, {
                            '$ref': '#/definitions/newSummary'
                        }, {
                            '$ref': '#/definitions/newParentId'
                        }, {
                            '$ref': '#/definitions/newlink'
                        }, {
                            '#ref': '#/definitions/dellink'
                        }

                    ]

                }
            },
            required: ['type', 'request']
        },
        newPosition: {
            type: "object",
            properties: {
                'type': {
                    'enum': ['newPosition']
                },
                posX: {
                    type: 'integer',
                    minimum: 0
                }
                posY: {
                    type: 'integer',
                    minimum: 0
                }
            }
            required: ['type', 'posX', 'posY']
        },
        newContent: {
            type: "object",
            properties: {
                'type': {
                    'enum': ['newContent']
                },
                content: {
                    type: 'String',

                }
            },
            required: ['type', 'content']
        },
        newSummary: {
            type: "object",
            properties: {
                'type': {
                    'enum': ['newSummary']
                },
                summary: {
                    type: 'String',

                }
            },
            required: ['type', 'summary']
        },
        newParentId: {
            type: "object",
            properties: {
                'type': {
                    'enum': ['newParentId']
                },
                parentId: {
                    type: 'integer',
                    minimum: 1
                }


            },
            required: ['type', 'parentId']

        },
        newlink: {
            type: "object",
            properties: {
                'type': {
                    'enum': ['newlink']
                },
                'linkid': {
                    type: 'integer',
                    minimum: 0
                },
                'orig': {
                    type: 'integer',
                    minimum: 0
                },
                'dest': {
                    type: 'integer',
                    minimum: 0
                }
            },
            required: ['type', 'linkid', 'orig', 'dest']
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
                },
                'orig': {
                    type: 'integer',
                    minimum: 0
                },
                'dest': {
                    type: 'integer',
                    minimum: 0
                }
            },
            required: ['type', 'linkid', 'orig', 'dest']
        }
    ],

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
                }, {
                    '#ref': '#/rDefinitions/updateResponse'
                }],
            }
        },
        required: ['clientRequestId', 'response']


    },
    rdefinitions: [
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
                            nodeData: {
                                type: "object"
                            }


                        },
                        required: ["id", "posX", "posY", "nodeData"]
                    }
                }

            },
            required: ["type", "nodeArray"]
        },
        //TODO this is replica of the above code , change it to be the responses to the requests
        updateRequest: {
            type: 'Object',
            propeties: {
                'type': {
                    'enum': ['updateRequest']
                },
                request: {
                    type: 'object',
                    oneof: [{
                        '$ref': '#/definitions/newNode'
                    }, {
                        '$ref': '#/definitions/updateNode'
                    }, {
                        '#ref': '#/definitions/delNode'
                    }],
                }
            },
            required: ['type', 'request']
        },

        'newNode': {
            type: "object",
            properties: {
                'type': {
                    'enum': ['newNode']
                },
                posX: {
                    type: "integer",
                    minimum: 0
                },
                posY: {
                    type: "integer",
                    minimum: 0
                },
                parentId: {
                    type: "integer",
                    minimum: 0
                }
            },
            required: ['type', 'posX', 'posY', 'parentId']
        },
        'delNode': {
            type: "object",
            properties: {

                'type': {
                    'enum': ['delNode']
                },
                posX: {
                    type: "integer",
                    minimum: 0
                },
                posY: {
                    type: "integer",
                    minimum: 0
                },
                id: {
                    type: "integer",
                    minimum: 0
                }
            },
            required: ['type', 'id', 'posX', 'posY', ]

        },

        'updateNode': {
            type: 'object',
            properties: {
                'type': {
                    'enum': ['updateNode']
                },
                request: {
                    type: 'object',
                    oneof: [{
                            '$ref': '#/definitions/newPosition'
                        }, {
                            '$ref': '#/definitions/newContent'
                        }, {
                            '$ref': '#/definitions/newSummary'
                        }, {
                            '$ref': '#/definitions/newParentId'
                        }, {
                            '$ref': '#/definitions/newlink'
                        }, {
                            '#ref': '#/definitions/dellink'
                        }

                    ]

                }
            },
            required: ['type', 'request']
        },
        newPosition: {
            type: "object",
            properties: {
                'type': {
                    'enum': ['newPosition']
                },
                posX: {
                    type: 'integer',
                    minimum: 0
                }
                posY: {
                    type: 'integer',
                    minimum: 0
                }
            }
            required: ['type', 'posX', 'posY']
        },
        newContent: {
            type: "object",
            properties: {
                'type': {
                    'enum': ['newContent']
                },
                content: {
                    type: 'String',

                }
            },
            required: ['type', 'content']
        },
        newSummary: {
            type: "object",
            properties: {
                'type': {
                    'enum': ['newSummary']
                },
                summary: {
                    type: 'String',

                }
            },
            required: ['type', 'summary']
        },
        newParentId: {
            type: "object",
            properties: {
                'type': {
                    'enum': ['newParentId']
                },
                parentId: {
                    type: 'integer',
                    minimum: 1
                }


            },
            required: ['type', 'parentId']

        },
        newlink: {
            type: "object",
            properties: {
                'type': {
                    'enum': ['newlink']
                },
                'linkid': {
                    type: 'integer',
                    minimum: 0
                },
                'orig': {
                    type: 'integer',
                    minimum: 0
                },
                'dest': {
                    type: 'integer',
                    minimum: 0
                }
            },
            required: ['type', 'linkid', 'orig', 'dest']
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
                },
                'orig': {
                    type: 'integer',
                    minimum: 0
                },
                'dest': {
                    type: 'integer',
                    minimum: 0
                }
            },
            required: ['type', 'linkid', 'orig', 'dest']
        }
    ],
    //this is sent to the client when changes have been made to the location he is viewing. it is sent without a prior request
    newData: {
        type: "object",
//new or updated nodes
        nuNodes: {
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
                    nodeData: {
                        type: "object"
                    }


                },
                required: ["id", "posX", "posY", "nodeData"]
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

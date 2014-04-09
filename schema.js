//schema.js
module.exports = {

    searchRequest: {
        type: "object",
        properties: {
            level: {
                type: "integer",
                minimum: 0
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
		    required:["posX","posY","crit_pos"]
                }
            }

        },
        required: ["level", "searchArray"]
    }

    updateRequest: {
        type: 'Object',
        propeties: {
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
        }
        required: ['request'],

        definitions: [
            'newNode': {
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
                    level: {
                        type: "integer",
                        minimum: 0
                    },
                    parentId: {
                        type: "integer",
                        minimum: 0
                    }
                }

            },
            required: ['type', 'posX', 'posY', 'level', 'parentId']
        },
        'delNode': {
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
                level: {
                    type: "integer",
                    minimum: 0
                },
                id: {
                    type: "integer",
                    minimum: 0
                }
            },
            required: ['type', 'id', 'posX', 'posY', 'level']

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


    }
}
}

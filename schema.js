//schema.js
module.exports = {

    searchRequest: {
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
            level: {
                type: "integer",
                minimum: 0
            },
            zoom: {
                type: "integer",
                minimum: 1
            }

        },
        required: ["posX", "posY", "level", "zoom"]
    }

    updateRequest: {
        type: 'Object',
        propeties: {
            request: {
                type: 'object',
                oneof: [{
                    '$ref': '#/definitions/newNode'
                }, {
                    '$ref': '#/definitions/updatedNode'
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

            'updatedNode': {
                type: 'object',
                properties: {
                    'type': {
                        'enum': ['updatedNode']
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
                            },

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

            }
        }
    }
}

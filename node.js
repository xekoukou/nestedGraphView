//nodeSchema.js This is the schema of a node. This is a simple implementation that will have many performance problems
// this text file is for documentation purposes

module.exports = {

    node: {
        type: "object",
        properties: {
            id: {
                type: "integer"
            },
            setId: {
                type: "integer"
            },
            ancestorId: {
                type: "integer"
            },
            parentId: {
                type: "integer"
            },
            input: {
                type: "array",
                items: {
                    type: "object",
                    "$ref": "#/definitions/link"
                }
            },
            output: {
                type: "array",
                items: {
                    type: "object",
                    "$ref": "#/definitions/link"
                }
            },
            nodeData: {
                type: "object",
                properties: {
                    id: {
                        type: "integer"
                    },
                    hid: {
                        type: "string" //the sha2 of the previous historic identifier
                    },

                    summary: {
                        type: "string"
                    },
                    content: {
                        type: "string"
                    }
                },
                required: ["id", "hid"]
            },

        },
        required: ["id", "hid", "parentId", "input", "output", "nodeData"],

        definitions: {

            link: {
                type: "object",
                properties: {
                    "origId": {
                        type: "integer",
                        minimum: 1
                    },
                    "origSetId": {
                        type: "integer",
                    },
                    "origAncestorId": {
                        type: "integer",
                        minimum: 1
                    },
                    "endId": {
                        type: "integer",
                        minimum: 1
                    },
                    "endSetId": {
                        type: "integer",
                    },
                    "endAncestorId": {
                        type: "integer",
                        minimum: 1
                    },
                    linkData: {
                        type: "object",
                        properties: {
                            //there may be many link with the same data per node.
                            //for example the same product tranfered to multiple destinations or the same varriable sent to many functions
                            //We need to show only one instance of that product varriable
                            id: {
                                type: "integer",
                                minimum: 1
                            },
                            setId: {
                                type: "integer",
                            },
                            ancestorId: {
                                type: "integer",
                                minimum: 1

                            },
                            summary: {
                                type: "String"
                            },
                            content: {
                                type: "String"
                            }
                        },
                        required: ["id", "setId", "ancestorId"]
                    }
                },
                required: ["origId", "origSetId", "origAncestorId", "endId", "endSetId", "endAncestorId", "linkData"]
            }

        }
    }

}

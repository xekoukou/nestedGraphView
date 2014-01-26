module.exports = {

    config: {
        address: '127.0.0.1',
        port:'8000',
        secret: '234346hdsv b4dfngduingvkgnv',
        sessionExpiry: 30 * 60 * 1000, //if the user doesnt do anything
        cleanInterval: 60 * 1000, //every minute
        maxWidth: 1920, //used to create a big enough request for the position server
        maxHeight: 1080

    }

}

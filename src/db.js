const mongoose = require('mongoose')
// require('dotenv').config()

mongoose.connect(process.env.DB_URI_CLOUD, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
        console.log(`connected db`)
    })
    .catch(err => console.error(err))
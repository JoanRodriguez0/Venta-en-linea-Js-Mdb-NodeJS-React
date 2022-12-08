const app = require("./app")
const connectDatabase = require("./config/database")

//setting configuration file 
const dotenv = require("dotenv");
dotenv.config({path: 'Back/config/config.env'})

//database configuration
connectDatabase();

//server
const server = app.listen(process.env.PORT, () => {
    console.log(`Servidor iniciado en el puerto: ${process.env.PORT} en modo: ${process.env.NODE_ENV}`)
})

const swaggerAutogen = require('swagger-autogen')()

const outputFile = './docs/swagger.json'
const endpointsFiles = ['./routes/routes.js']

swaggerAutogen(outputFile, endpointsFiles)



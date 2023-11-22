var express = require('express');
var cors = require('cors');
const routes = require('./routes/routes.js');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./docs/swagger.json');
// const bodyParser = require('body-parser')

const PORT = process.env.PORT || 8000;
var app = express();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(bodyParser.json())

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', (req, res) => {
  res.send("Server is online!");
})

app.use((req, res, next) => {
  const token =  req.get('Authorization');
  if (token) {
    const apiKey = token.split(' ')[1]
    if (!apiKey || apiKey !== "dXNlcjpwYXNzd2Q") {
      res.status(401).json({error: 'unauthorised'})
    } else {
      next()
    }
  } else {
    res.status(401).json({error: 'no token'})
  }
})

app.use("/", routes);

app.use((err, _req, res, next) => {
  res.status(500).send("Default message. An unexpected error occured.")
})

app.listen(8000, function () {
  console.log(`Listening to Port ${PORT}`);
});


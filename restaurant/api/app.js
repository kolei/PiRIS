var createError = require('http-errors')
var express = require('express')
var path = require('path')
const cors = require('cors')

var indexRouter = require('./routes/index')

var app = express();

const corsOptions = {
  origin: true,
  credentials: true,
  methods: ['GET','POST','OPTIONS','PATCH','PUT','DELETE']
}

app.use(cors(corsOptions))

app.use(express.json())
// app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', indexRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404))
})

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
})

module.exports = app

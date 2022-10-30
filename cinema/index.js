'use strict'

const express = require('express')

//добавляю к консольному выводу дату и время
function console_log(fmt, ...aparams){
  fmt = (new Date()).toJSON().substr(0, 19)+' '+fmt
  console.log(fmt, ...aparams)
}

// создание экземпляра http-сервера
const app = express()

// метод .use задает команды, которые будут выполнены до разбора GET/POST команд

// декодирует параметры запроса
app.use( express.urlencoded() )
app.use( express.json() )

app.use('/up/images', express.static(__dirname +'/images') )

// логгирую все входящие запросы
app.use((req, res, next)=>{
  console_log('[express] %s request from %s, body: %s', req.path, req.ip, JSON.stringify(req.body))
  next()
})

const registeredUsers = []
const movies = [
  {movieId: 1, name: 'Дюна', description: 'Атрейдесы прибывают на планету, где им никто не рад. Фантастический эпос Дени Вильнёва с шестью «Оскарами»', age: 12, images: [], poster: 'duna.webp', tags: [], filters: ['new','inTrend','forMe']},
  {movieId: 2, name: 'Легенда о Зелёном Рыцаре', description: 'Наследник короля принимает вызов таинственного рыцаря. Захватывающее фэнтези по мотивам средневековой поэмы', age: 18, images: [], poster: 'green.webp', tags: [], filters: ['new','inTrend','forMe']}
]

function findUserByEmail(email) {
  for (let i = 0; i < registeredUsers.length; i++) {
    if (registeredUsers[i].email == email) 
      return registeredUsers[i]
  }
  return null
}

function findUserByToken(token) {
  for (let i = 0; i < registeredUsers.length; i++) {
    if (registeredUsers[i].token == token) 
      return registeredUsers[i]
  }
  return null
}

app.post('/auth/register', (req,res)=>{
  try {
    // if(req.headers.token==undefined) 
    //   throw new Error("В заголовке запроса нет токена")

    if(req.body.email==undefined) 
      throw new Error('Not found "email" param')

    if(req.body.password==undefined) 
      throw new Error('Not found "password" param')

    if(req.body.firstName==undefined) 
      throw new Error('Not found "firstName" param')

    if(req.body.lastName==undefined) 
      throw new Error('Not found "lastName" param')

    const re = new RegExp(`^[a-z0-9]+@[a-z0-9]+\.[a-z]{1,3}$`)
    if (!re.test(req.body.email))
      throw new Error('Param "email" don`t match template')

    let user = findUserByEmail(req.body.email)
    if (user == null)
      registeredUsers.push({
        email: req.body.email,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        token: registeredUsers.length + 1
      })

    res.status(201)
  } catch (error) {
    res.statusMessage = error.message
    res.status(400)
  }
  res.end()
})

app.post('/auth/login', (req,res)=>{
  try {
    if(req.body.email==undefined) 
      throw new Error('Not found "email" param')

    if(req.body.password==undefined) 
      throw new Error('Not found "password" param')

    let user = findUserByEmail(req.body.email)
    if (user == null) res.status(404)
    else {
      if (user.password != req.body.password)
        throw new Error('Wrong password')
      res.json({token: user.token})
    }
  } catch (error) {
    res.statusMessage = error.message
    res.status(400)
  }
  res.end()
})

app.get('/movies', (req,res)=>{
  try {
    if (typeof req.query.filter == 'undefined')
      throw new Error('Filter is required parameter')

    if(req.headers.authorization==undefined) 
      throw new Error('No Authorization header')

    let parts = req.headers.authorization.split(' ')
    if (parts.length == 2) {
      if (parts[0] == 'Bearer') {
        let user = findUserByToken(parts[1])
        if (user == null)
          throw new Error('User not found')
        else {
          let filtered = movies
            .filter(m => m.filters.includes(req.query.filter))
          let mapped = filtered.map(m => {
            return {
              movieId: m.movieId, 
              name: m.name,
              description: m.description,
              age: m.age, 
              images: m.images, 
              poster: m.poster, 
              tags: m.tags
            }
          })
          res.json(mapped)
        }
      } else
        throw new Error('Unsupported Authorization method')
    } else
      throw new Error('Bad Authorization content')
  } catch (error) {
    res.statusMessage = error.message
    res.status(400)
  }
  res.end()
})

// запуск сервера на порту 8080
app.listen(3019, '0.0.0.0', ()=>{
    console_log('HTTP сервер успешно запущен на порту 3019')
}).on('error', (err)=>{
    console_log('ошибка запуска HTTP сервера: %s', err)
})
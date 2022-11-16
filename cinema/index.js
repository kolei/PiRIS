'use strict'

const express = require('express')
const fileUpload = require('express-fileupload')
var cors = require('cors')
const md5 = require('md5')
const fs = require('fs')

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
app.use(fileUpload())

app.use('/up/images', cors(), express.static(__dirname +'/images') )
app.use('/swagger', cors(), express.static(__dirname +'/swagger') )

// логгирую все входящие запросы
app.use((req, res, next)=>{
  console_log('[express] %s %s request from %s, body: %s', req.method, req.path, req.ip, JSON.stringify(req.body))
  next()
})

const registeredUsers = []
const movies = [
  {movieId: 1, name: 'Дюна', description: 'Атрейдесы прибывают на планету, где им никто не рад. Фантастический эпос Дени Вильнёва с шестью «Оскарами»', age: "12", images: [], poster: 'duna.webp', tags: [], filters: ['new','inTrend','forMe']},
  {movieId: 2, name: 'Легенда о Зелёном Рыцаре', description: 'Наследник короля принимает вызов таинственного рыцаря. Захватывающее фэнтези по мотивам средневековой поэмы', age: "18", images: [], poster: 'green.webp', tags: [], filters: ['new','inTrend','forMe']},
  {movieId: 3, name: 'Главный герой', age: "16", images: [], poster: 'maincharacter.webp', tags: [], filters: ['new','inTrend','forMe'], description: 'Парень по имени Парень счастлив. Он живет в лучшем в мире городе Городе, работает на лучшей в мире работе в Банке и дружит с охранником по имени Приятель. И его совершенно не волнует, что Банк грабят по нескольку раз на дню, а улицы Города напоминают зону военных действий. Единственное, чего Парню не хватает для полного счастья — идеальной девушки, к которой у него имеется точный список требований. И вот однажды он видит на улице красотку, точь-в-точь как в его мечтах. Эта встреча изменит не только нашего главного героя, но и перевернёт весь известный ему мир.'},
  {movieId: 4, name: 'Петр I: Последний царь и первый император', age: "12", images: [], poster: 'Petr1.webp', tags: [], filters: ['new','inTrend','forMe'], description: 'Фигура императора Петра Великого, как и эпоха его становления и правления, до сих пор будоражит умы людей во всем мире. Создатели отвечают на вопросы, как занять престол, когда ты — четырнадцатый ребенок в семье; как отвоевать выход к морю, когда в стране нет профессиональной армии и флота; как за несколько десятилетий вывести в мировые лидеры страну, с которой раньше никто не считался и многие другие.'},
  {movieId: 5, name: 'Либерея: Охотники за сокровищами', age: "12", images: [], poster: 'Liberia.webp', tags: [], filters: ['new','inTrend','forMe'], description: 'При строительстве столичного метро рабочие обнаруживают драгоценный оклад, который доказывает — легендарная Библиотека Ивана Грозного существует! Но находка оказывается забыта на долгие годы, и уже в наше время попадает в руки ни о чем не подозревающего Ильи. Теперь его жизнь в опасности, ведь за старинным артефактом начинают охоту могущественные силы! Парень вынужден объединиться со странным незнакомцем, который утверждает, что оклад — это ключ к обнаружению Библиотеки. Помочь им в поисках и разгадать древние шифры берется красотка-филолог Арина. Теперь, чтобы обрести новые ключи-подсказки и приблизиться к разгадке, трио авантюристов нужно побывать в затерянных и опасных местах, разбросанных по всей России: от Вологды до Нарьян-Мара, на суше, под водой и даже в тайных подземельях Кремля.'},
  {movieId: 6, name: 'Грозный папа', age: '6', images: [], poster: 'formidableDad.webp', tags: [], filters: ['new','inTrend','forMe'], description: 'Поссорившись с сыном, царь Иван Грозный случайно ранит его – как на знаменитой картине Репина. Жизнь царевича на волоске. Чтобы все исправить, Грозный хочет отправиться в прошлое с помощью волшебного гримуара. Однако что-то пошло не так, и Грозный попадает в наше время, где знакомится с семьей Осиповых. Никита Осипов – неудачливый археолог и такой же неудачливый отец. Он давно потерял контакт с детьми – Ромкой и Полей. Но теперь они вместе отправляются в путешествие, чтобы помочь Грозному отыскать гримуар и спасти царевича.'},
  {movieId: 7, name: 'Сердце пармы', age: '16', images: [], poster: 'Heart.webp', tags: [], filters: ['new','inTrend','forMe'], description: 'Русский князь Михаил и юная Тиче — дети разных народов, разных миров и разных богов. Любовь молодого воителя и ведьмы-ламии кажется невозможной, но преодолевает все запреты, запуская маховик рока. Отныне только от Михаила зависит будущее родной пармы, древних суровых земель, напоенных чудодейственной мощью кровавых языческих богов. Здесь сталкиваются герои и призраки, князья и шаманы, вогулы и московиты. Здесь расстаться с жизнью — не так страшно, как выбрать между долгом, верностью братству и любовью к единственной женщине на свете.'},
  {movieId: 8, name: 'Большое путешествие. Специальная доставка', age: '6', images: [], poster: 'bigAdventure.webp', tags: [], filters: ['new','inTrend','forMe'], description: 'Прошло время с тех пор, как заяц Оскар и медведь Мик-Мик в компании своих друзей вернули домой маленького панду. С тех пор жили они спокойно и размеренно. Мик-Мик заботился о своих пчелах, а Оскар организовал в лесу американские горки. И вот однажды к берегу Мик-Мика прибивает корзину с малышом гризли. Кто-то снова перепутал адреса, а разбираться с этим придется Мик-Мику и Оскару. В компании друзей они отправляются в новое путешествие — теперь, чтобы вернуть домой малыша гризли.'},
  {movieId: 9, name: 'Шрамы Парижа', age: '18', images: [], poster: 'scars.webp', tags: [], filters: ['new','inTrend','forMe'], description: 'В ноябре 2015 года Париж пережил самые страшные теракты в своей истории. Жертвами тщательно спланированных актов насилия стали почти 400 человек. Но на этом преступники не собирались останавливаться. Чтобы предотвратить будущие угрозы, двум агентам придется провести одно из самых крупных расследований в истории Старого Света и помешать преступникам нанести новый удар. Теперь в опасности не только Франция, но и вся Европа.'},
  {movieId: 10, name: 'Паранормальные явления. Дом призраков', age: '16', images: [], poster: 'Paranormal.webp', tags: [], filters: ['new','inTrend','forMe'], description: 'Когда-то Шон был популярным видеоблогером, сделавшим имя на экстремальных роликах, в которых он бросал вызов собственным страхам, но однажды вляпался в скандал и потерял всех спонсоров. Записав видео с извинениями и снова получив финансирование, парень возвращается с новым леденящим душу проектом. Шон собирается провести ночной стрим из дома с привидениями, где более 100 лет назад повесилась одинокая женщина, а после неоднократно фиксировалась паранормальная активность.'}
]

const chats = [
  {chatId: '1', movieId: 1, name: 'Всё о дюне'},
  {chatId: '2', movieId: 2, name: 'Кто такой зелёный рыцарь?'},
  {chatId: '3', movieId: 4, name: 'Петр первый: великий император или разрушитель руси'}
]

const chatMessages = []

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

app.options('/auth/register', cors())
app.post('/auth/register', cors(), (req,res)=>{
  try {
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
    if (user == null) {
      let user = null
      let token = null
      do {
        token = Math.ceil(Math.random() * 999998)
        user = findUserByToken(token)
      } while (user != null);
      registeredUsers.push({
        email: req.body.email,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        token: token,
        avatar: ''
      })
    }

    res.status(201)
  } catch (error) {
    res.statusMessage = error.message
    res.status(400)
  }
  res.end()
})

app.options('/auth/login', cors())
app.post('/auth/login', cors(), (req,res)=>{
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

function checkAuth(req){
  if(req.headers.authorization==undefined) 
    throw new Error('No Authorization header')

  let parts = req.headers.authorization.split(' ')
  if (parts.length == 2) {
    if (parts[0] == 'Bearer') {
      let user = findUserByToken(parts[1])
      if (user == null)
        throw new Error('User not found')
      return user
    } else
      throw new Error('Unsupported Authorization method')
  } else
    throw new Error('Bad Authorization content')
}

app.options('/movies', cors())
app.get('/movies', cors(), (req,res)=>{
  try {
    if (typeof req.query.filter == 'undefined')
      throw new Error('Filter is required parameter')

    // checkAuth(req)

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
  } catch (error) {
    res.statusMessage = error.message
    res.status(400)
  }
  res.end()
})

function userModel (user) {
  const fileName = md5(user.email)+'.jpg'
  const userObj = {
    userId: user.token,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    avatar: user.avatar
  }
  if (fs.existsSync(__dirname + '/images/'+ fileName)) 
    userObj.avatar = fileName

  return [userObj]
}

app.options('/user', cors())
app.get('/user', cors(), (req,res)=>{
  try {
    let user = checkAuth(req)
    res.json(userModel(user))
  } catch (error) {
    res.statusMessage = error.message
    res.status(401)
  }
  res.end()
})

app.options('/user/chats', cors())
app.get('/user/chats', cors(), (req,res)=>{
  try {
    checkAuth(req)
    res.json(chats)
  } catch (error) {
    res.statusMessage = error.message
    res.status(401)
  }
  res.end()
})

function getChatMessage(message, user) {
  const fileName = md5(user.email)+'.jpg'
  return {
    chatId: message.chatId,
    messageId: message.messageId,
    creationDateTime: message.creationDateTime,
    firstName: user.firstName,
    lastName: user.lastName,
    avatar: fileName,
    text: message.text
  }
}

app.options('/chats/:movieId', cors())

/**
 * Список чатов фильма (неавторизованный доступ)
 */
app.get('/chats/:movieId', cors(), (req,res)=>{
  try {
    let result = []
    for (let i = 0; i < chats.length; i++) {
      if (chats[i].movieId == req.params.movieId) {
        result.push(chats[i])
      }
    }
    res.json(result)
  } catch (error) {
    res.statusMessage = error.message
    res.status(401)
  }
  res.end()
})

function findMovieById (movieId) {
  for (let i = 0; i < movies.length; i++) {
    if(movies[i].movieId == movieId)
      return movies[i]
  }
  return null
}

/**
 * Создание чата для фильма
 */
app.post('/chats/:movieId', cors(), (req,res)=>{
  try {
    // только авторизованный может добавить чат
    checkAuth(req)

    const chatName = req.body.name.trim()
    if (chatName == '') 
      throw new Error('Empty chat name')

    const movie = findMovieById(req.params.movieId)
    if(movie == null)
      throw new Error('Movie Id not found')  

    let chat = null
    let maxChatId = 0
    for (let i = 0; i < chats.length; i++) {
      maxChatId = Math.max(maxChatId, chats[i].chatId)
      if(chats[i].name == chatName && chats[i].movieId == req.params.movieId) {
        chat = chats[i]
      }
    }
    if (chat == null) {
      chat = {
        chatId: (maxChatId+1).toString(), 
        movieId: req.params.movieId, 
        name: chatName
      }
      chats.push(chat)
    }
    res.json(chat)
  } catch (error) {
    res.statusMessage = error.message
    res.status(400)
  }
  res.end()
})

/**
 * Список сообщений чата
 */
app.options('/chats/:chatId/messages', cors())
app.get('/chats/:chatId/messages', cors(), (req,res)=>{
  try {
    checkAuth(req)
    let messages = []
    // console_log('try get chat messages for chatId: %s', req.params.chatId)
    for (let i = 0; i < chatMessages.length; i++) {
      if(chatMessages[i].chatId == req.params.chatId) {
        let user = findUserByToken(chatMessages[i].userId)
        if(user != null) {
          let chatMessage = getChatMessage(chatMessages[i], user)
          messages.push(chatMessage)
        }
      }
    }
    res.json(messages)
  } catch (error) {
    res.statusMessage = error.message
    res.status(401)
  }
  res.end()
})

function dateToMysql(xDate) {
  return xDate.getFullYear().toString(10)
      + '-' + (xDate.getMonth()+1).toString(10).padStart(2,'0')
      + '-' + xDate.getDate().toString(10).padStart(2,'0')
      + ' ' + xDate.getHours().toString(10).padStart(2,'0')
      + ':' + xDate.getMinutes().toString(10).padStart(2,'0')  
}

app.post('/chats/:chatId/messages', cors(), (req,res)=>{
  try {
    let user = checkAuth(req)

    if (req.body.text.trim() == '') 
      throw new Error('Empty text')

    let newMessage = {
      chatId: req.params.chatId,
      messageId: chatMessages.length + 1,
      creationDateTime: dateToMysql(new Date()),
      userId: user.token,
      text: req.body.text
    }
    chatMessages.push(newMessage)
    res.json(getChatMessage(newMessage, user))
  } catch (error) {
    res.statusMessage = error.message
    res.status(401)
  }
  res.end()
})

app.options('/user/avatar', cors())
app.post('/user/avatar', cors(), (req, res) => {
  try {
    // console.log(req.files)

    if(req.body.token==undefined) 
      throw new Error('Not found "token" param in body')

    const user = findUserByToken(req.body.token)
    if(!user) throw new Error('User not found')

    const { file } = req.files
    if (!file) throw new Error('No file in request')

    const fileName = md5(user.email)+'.jpg'

    // console_log('try save avatar: %s', fileName)

    file.mv(__dirname + '/images/' + fileName)
    res.json(userModel(user))
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
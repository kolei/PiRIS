const express = require('express')
const { sequelize } = require('./models')
const { QueryTypes } = require('sequelize')
const md5 = require('md5')
const jwt = require('jsonwebtoken')

const app = express()
const port = 3000

app.use(express.json())

app.get('/api/menu-item', async (req, res) => {
  try {
    res.json(await sequelize.query(`
      SELECT *
      FROM MenuItem
    `, {
      logging: false,
      type: QueryTypes.SELECT
    }))
  } catch (error) {
    console.error(error)
  } finally {
    res.end()
  }
})

/**
 * Middleware авторизации
 */
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')

    if (token[0].toLowerCase() != 'bearer')
      return res.status(400).send('не поддерживаемый тип авторизации')

    jwt.verify(token[1], JWT_SECRET, (err, user) => {
      if (err) return res.status(403).send(err)
      req.user = user
      next()
    })
  } else {
    res.status(401).send('нет заголовка авторизации')
  }
}

/**
 * Вторым параметром запроса можно добавить массив middleware
 */
app.get('/api/cart', [authenticateJWT], async (req, res) => {
  try {
    res.json(await sequelize.query(`
      SELECT *
      FROM Cart
      -- WHERE userId=:userId
    `, {
      logging: false,
      type: QueryTypes.SELECT
      // replacements: {
      //   userId: req.user.id
      // }
    }))
  } catch (error) {
    console.error(error)
  } finally {
    res.end()
  }
})

app.post('/api/cart', async (req, res) => {
  try {
    await sequelize.query(`
      INSERT INTO Cart (menuItemId, quantity)
      VALUES (:menuItemId, :quantity)
    `,{
      logging: false,
      type: QueryTypes.INSERT,
      replacements: {
        menuItemId: req.body.menuItemId,
        quantity: req.body.quantity
      }
    })
  } catch (error) {
    console.warn('ошибка при добавлении блюда в корзину:', error.message)
    res.status(500).send(error.message)
  } finally {
    res.end()
  }
})

app.patch('/api/cart/:id', async (req, res) => {
  try {
    await sequelize.query(`
      UPDATE Cart 
      SET quantity=:quantity
      WHERE id=:id
    `,{
      logging: false,
      replacements: {
        id: req.params.id,
        quantity: req.body.quantity
      }
    })
  } catch (error) {
    console.warn('ошибка при редактировании корзины:', error.message)
    res.status(500).send(error.message)
  } finally {
    res.end()
  }
})

app.delete('/api/cart/:id', async (req, res) => {
  try {
    await sequelize.query(`
      DELETE 
      FROM Cart
      WHERE id=:id
    `,{
      logging: false,
      replacements: {
        id: req.params.id
      }
    })
  } catch (error) {
    console.warn('ошибка при удалении блюда из корзины:', error.message)
    res.status(500).send(error.message)
  } finally {
    res.end()
  }
}) 

const JWT_SECRET = process.env.JWT_SECRET

/**
 * В теле запроса должен быть объект с логином и паролем:
 * {
 *  "login": "ваш логин",
 *  "password": "пароль"
 * }
 */
app.post('/api/user/login', async (req, res) => {
  try {
    // const user = await sequelize.query(`
    //   SELECT *
    //   FROM User
    //   WHERE login=:login
    // `, {
    //   // параметр plain нужен, чтобы запрос вернул не массив записей, а конкретную запись
    //   // если записи с таким логином нет, то вернет null
    //   plain: true,
    //   logging: false,
    //   type: QueryTypes.SELECT,
    //   replacements: {
    //     login: req.body.login
    //   }
    // })

    const user = {
      password: md5('123456'),
      id: 1,
      roleId: 1
    }

    if (user) {
      // хешируем пароль
      const passwordMD5 = md5(req.body.password)

      if (user.password == passwordMD5) {

        // формируем токен
        const jwtToken = jwt.sign({
            id: user.id, 
            firstName: user.firstName,
            roleId: user.roleId 
          }, 
          JWT_SECRET
        )

        res.json(jwtToken)
      } else {
        res.status(401).send('не верный пароль')
      }
    } else {
      res.status(404).send('пользователь не найден')
    }
  } catch (error) {
    console.warn('ошибка при авторизации:', error.message)
    res.status(500).send(error.message)
  } finally {
    res.end()
  }
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

const express = require('express')
const { sequelize } = require('./models')
const { QueryTypes } = require('sequelize')

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


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

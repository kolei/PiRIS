export class MenuItem {
  constructor (title, price) {
    this.title = title
    this.price = price
  }
}

export class CartItem {
  constructor (menuItem) {
    this.title = menuItem.title
    this.price = menuItem.price
    this.quantity = 1
  }
}

export function calcItog (cartList) {
  if (Array.isArray(cartList) && cartList.length) {
    return cartList.reduce((total, item) => {
      // console.log('item', item)
      return total + item.price * item.quantity
    }, 0)
  }
  return 0
}
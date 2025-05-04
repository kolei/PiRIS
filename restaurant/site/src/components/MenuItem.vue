<template>
  <div 
    class="item"
  >
    <img 
      :src="`${API_URL}/${item.title}.jpg`"
      class="image"
    />
    <div class="title">
      {{ item.title }}<span v-if="quantity>0">&nbsp;{{ item.price }} руб</span>
    </div>
    <button
      v-if="quantity==0"
      class="price-button"
      @click="addItemToCart"
    >
      {{ item.price }} руб
    </button>
    <div v-else class="quantity-wrapper">
      <button 
        class="qty-minus qty-button"
        @click="removeItemFromCart"
      >
        -
      </button>
      <span class="qty-value">{{ quantity }}</span>
      <button 
        class="qty-plus qty-button"
        @click="addItemToCart"
      >
        +
      </button>
    </div>
  </div>
</template>

<script setup>
import { CartItem } from "@/helpers/common"
import { storeToRefs } from "pinia"
import { computed } from "vue"
import { useItemsStore, API_URL } from '/src/stores/items.js'

const props = defineProps({
  item: Object
})

const menuStore = useItemsStore()
const { cartList } = storeToRefs(menuStore)

function addItemToCart () {
  // console.log('Добавляю блюдо в корзину')
  const itemInCart = cartList.value.find(i => i.title == props.item.title)
  if (itemInCart) itemInCart.quantity++
  else cartList.value.push( new CartItem(props.item) )
}

function removeItemFromCart () {
  // console.log('Добавляю блюдо в корзину')
  const itemPos = cartList.value.findIndex(i => i.title == props.item.title)
  if (itemPos>=0) {
    cartList.value[itemPos].quantity--
    if (cartList.value[itemPos].quantity == 0) {
      cartList.value.splice(itemPos, 1)
    }
  }
}

const quantity = computed(() => {
  const itemInCart = cartList.value
    .find(i => i.title == props.item.title)

  if (itemInCart) return itemInCart.quantity
  else return ''
})
// defineExpose({ quantity })
</script>

<style lang="css" scoped>
.item {
  display: inline-block;
  width: 300px;
  margin: 8px;
  background-color: bisque;
  border-radius: 16px;
}
.image {
  width: 100%;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
}
.title {
  padding: 16px;
}
.price-button {
  width: calc(100% - 16px);
  margin: 8px;
  padding: 16px;
  border-radius: 12px;
  border: none;
  background-color: lightgray;
  cursor: pointer;
}
.quantity-wrapper {
  display: flex;
  width: 100%;
  padding: 8px;
  justify-content: space-between;
}
.qty-button {
  width: 50px;
  padding: 16px;
  border-radius: 12px;
  border: none;
  background-color: lightgray;
  cursor: pointer;
}
</style>
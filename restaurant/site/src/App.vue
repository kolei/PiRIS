<template>
  <main class="main">
    <div 
      class="menu"
      :style="`flex: calc(100% - ${cartWidth}px);`"  
    >
      <menu-item
        v-for="(item, index) in itemList"
        :key="index"
        :item="item"
      />
    </div>
    <div 
      v-if="cartList.length > 0"
      class="cart"
    >
      <cart-item-vue
        v-for="(item, index) in cartList"
        :key="index"
        :item="item"/>
      <div>
        Итого: {{ itog }}
      </div>
    </div>
  </main>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useItemsStore } from '/src/stores/items.js'
import MenuItem from '/src/components/MenuItem.vue'
import CartItemVue from '/src/components/CartItem.vue'
import { computed } from 'vue'
import { calcItog } from './helpers/common'

const menuStore = useItemsStore()
const { itemList, cartList } = storeToRefs(menuStore)

const cartWidth = computed(() => {
  return cartList.value.length ? 300 : 0
})

const itog = computed(() => {
  return calcItog(cartList.value)
})

menuStore.getItems()
</script>

<style scoped>
.main {
  width: 100%;
  display: flex;
}
.menu {
  display: inline-block;
  /* background-color: burlywood; */
}
.cart {
  display: inline-block;
  /* background-color: bisque; */
  flex: 300px;
}
</style>
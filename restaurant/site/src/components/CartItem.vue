<template>
  <div 
    class="item"
  >
    <img 
      :src="`${API_URL}/${item.title}.jpg`"
      class="image"
    />
    <div class="content">
      {{ item.title }} {{ quantity }}
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia"
import { computed } from "vue"
import { useItemsStore, API_URL } from '/src/stores/items.js'

const props = defineProps({
  item: Object
})
defineEmits(['click'])

const menuStore = useItemsStore()
const { cartList } = storeToRefs(menuStore)

const quantity = computed(() => {
  const itemInCart = cartList.value
    .find(i => i.title == props.item.title)

  // console.log('itemInCart', itemInCart)

  if (itemInCart) return itemInCart.quantity
  else return ''
})
</script>

<style lang="css" scoped>
.item {
  display: inline-block;
  width: calc(300px - 16px);
  height: 80px;
  margin: 8px;
  background-color: aquamarine;
  border-radius: 16px;
  cursor: pointer;
}
.image {
  display: inline-block;
  height: 100%;
  border-top-left-radius: 16px;
  border-bottom-left-radius: 16px;
}
.content {
  display: inline-block;
  padding: 16px;
}
</style>
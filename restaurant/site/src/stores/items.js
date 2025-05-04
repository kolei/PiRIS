import { ref } from 'vue'
import { defineStore } from 'pinia'

export const API_URL = 'https://restaurant.kolei.ru'

/**
 * Список блюд 
 */
export const useItemsStore = defineStore('items', () => {
  const itemList = ref([])
  const cartList = ref([])

  async function getItems () {
    if (itemList.value.length == 0) {
      const response = await fetch(`${API_URL}`);
      if (!response.ok) {
        throw new Error('Ошибка при получении списка блюд');
      }
      itemList.value = await response.json()
    }
    return itemList.value
  }

  return { itemList, getItems, cartList }
})
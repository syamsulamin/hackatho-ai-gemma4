import { ref } from 'vue'
import { BREBES_DATASET } from '~/data/brebes-dataset'
import type { BrebesItem } from '~/types/brebes'

const catalogItems = ref<BrebesItem[]>([...BREBES_DATASET])

export function useBusinessData() {
  function addItem(item: Omit<BrebesItem, 'id'>) {
    const newItem: BrebesItem = {
      ...item,
      id: `${item.category}-${Date.now()}`
    }
    catalogItems.value.unshift(newItem)
  }

  function updateItem(id: string, updated: Partial<BrebesItem>) {
    const idx = catalogItems.value.findIndex(i => i.id === id)
    if (idx >= 0) {
      catalogItems.value[idx] = { ...catalogItems.value[idx], ...updated } as BrebesItem
    }
  }

  function deleteItem(id: string) {
    catalogItems.value = catalogItems.value.filter(i => i.id !== id)
  }

  return {
    catalogItems,
    addItem,
    updateItem,
    deleteItem
  }
}

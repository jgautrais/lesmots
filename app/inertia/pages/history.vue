<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Head, Link } from '@inertiajs/vue3'
import NavBar from '../components/NavBar.vue'
import HistoryItem from '../components/HistoryItem.vue'
import { getAllGameHistory, type GameHistoryItem } from '../composables/useWordsPool'

const history = ref<GameHistoryItem[]>([])

onMounted(() => {
  history.value = getAllGameHistory()
})
</script>

<template>
  <Head title="Historique" />
  <div class="container mx-auto">
    <NavBar />

    <h2 class="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-gray-100">
      Historique des parties
    </h2>

    <div v-if="history.length > 0" class="max-w-md mx-auto px-4">
      <HistoryItem v-for="item in history" :key="item.day" :item="item" />
    </div>

    <div v-else class="text-center mt-10 text-gray-500 dark:text-gray-400">
      Aucune partie jouée pour le moment
    </div>
  </div>
</template>

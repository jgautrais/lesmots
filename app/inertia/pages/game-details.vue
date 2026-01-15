<script setup lang="ts">
import { computed } from 'vue'
import { Head, Link } from '@inertiajs/vue3'
import NavBar from '../components/NavBar.vue'
import WordsStats from '../components/WordsStats.vue'
import type { WordsPoolWithDay } from '../types/wordsPool'
import { formatDateForDisplay, isToday } from '../utils/date'

const props = defineProps<{
  wordsPool: WordsPoolWithDay | null
}>()

const formattedDate = computed(() =>
  props.wordsPool ? formatDateForDisplay(props.wordsPool.day) : ''
)

const gameUrl = computed(() =>
  props.wordsPool && !isToday(props.wordsPool.day) ? `/game/${props.wordsPool.day}` : '/'
)
</script>

<template>
  <Head :title="`Détails - ${formattedDate}`" />
  <div class="container mx-auto">
    <NavBar />

    <h2 class="text-xl font-bold text-center mb-6 text-gray-800 dark:text-gray-100 capitalize">
      {{ formattedDate }}
    </h2>

    <WordsStats v-if="wordsPool" :words-pool="wordsPool" />

    <div v-else class="text-center mt-10 text-gray-500 dark:text-gray-400">
      Aucune donnée disponible pour cette date
    </div>

    <div class="flex flex-col gap-3 items-center mt-10 mb-5">
      <Link
        :href="gameUrl"
        class="block text-lg font-bold text-center py-3 px-6 rounded bg-teal-500 dark:bg-teal-600 text-white w-fit"
      >
        Reprendre la partie
      </Link>
      <Link
        href="/history"
        class="block text-lg font-bold text-center py-3 px-6 rounded border border-gray-100 bg-gray-50 dark:bg-gray-600 dark:border-gray-500 w-fit"
      >
        Retour à l'historique
      </Link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Link } from '@inertiajs/vue3'
import { computed } from 'vue'
import type { GameHistoryItem } from '../composables/useWordsPool'
import { formatDateForDisplay, isToday } from '../utils/date'

const props = defineProps<{
  item: GameHistoryItem
}>()

const formattedDate = computed(() =>
  isToday(props.item.day) ? "Aujourd'hui" : formatDateForDisplay(props.item.day)
)

const gameUrl = computed(() => (isToday(props.item.day) ? '/' : `/game/${props.item.day}`))

const progressBarColor = computed(() => {
  const pct = props.item.completionPercentage
  if (pct === 100) return 'bg-gradient-to-r from-lime-500 via-cyan-500 to-teal-400 animate-pulse'
  if (pct >= 75) return 'bg-teal-400 dark:bg-teal-500'
  if (pct >= 50) return 'bg-yellow-400 dark:bg-yellow-500'
  return 'bg-gray-400 dark:bg-gray-500'
})
</script>

<template>
  <Link
    :href="gameUrl"
    class="block p-4 mb-6 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
  >
    <div class="flex justify-between items-center mb-2">
      <span class="font-medium text-gray-800 dark:text-gray-100 capitalize text-lg">
        {{ formattedDate }}
      </span>
      <span class="text-sm font-bold text-teal-500 dark:text-teal-300">
        {{ item.completionPercentage }}%
      </span>
    </div>

    <div class="w-full h-2 bg-gray-200 dark:bg-gray-500 rounded-full mb-2">
      <div
        :class="[progressBarColor, 'h-full rounded-full transition-all']"
        :style="{ width: `${item.completionPercentage}%` }"
      />
    </div>

    <div v-if="item.nineLetterWords.length > 0" class="mt-2">
      <span
        v-for="word in item.nineLetterWords"
        :key="word"
        class="inline-block mr-2 px-2 py-1 text-xs font-bold bg-teal-100 dark:bg-teal-800 text-teal-700 dark:text-teal-200 rounded"
      >
        {{ word.toUpperCase() }}
      </span>
    </div>

    <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
      {{ item.foundWords.length }} / {{ item.wordsPool.length }} mots
    </p>
  </Link>
</template>

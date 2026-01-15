<script setup lang="ts">
import { computed } from 'vue'
import type { SortedWordsPool } from '../types/wordsPool'

const props = defineProps<{
  wordLengthEntry: [string, string[]]
  wordsPoolSortedByLength: SortedWordsPool
}>()

const slideInDurations = [
  'animate-slideIn20',
  'animate-slideIn25',
  'animate-slideIn35',
  'animate-slideIn45',
]

const length = computed(() => props.wordLengthEntry[0])
const words = computed(() => props.wordLengthEntry[1])

const progressWidth = computed(() => {
  const total = props.wordsPoolSortedByLength[length.value]?.length || 1
  return `${(words.value.length / total) * 100}%`
})

const sortedWords = computed(() => [...words.value].sort((a, b) => a.localeCompare(b)))
</script>

<template>
  <div class="mb-4 border-t pt-1 border-gray-200 dark:border-gray-500">
    <div :class="[slideInDurations[+length % 4], 'flex content-center transition-all ease-out']">
      <p class="shrink-0 font-bold">
        {{ length }} lettres
      </p>
      <div class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-800 self-center ms-2">
        <div
          class="bg-teal-500 h-2.5 rounded-full dark:bg-teal-300"
          :style="{ width: progressWidth }"
        />
      </div>
      <p class="shrink-0 font-bold text-xs self-center min-w-10 ms-2 text-end">
        {{ words.length }} /
        <span class="min-w-5 inline-block text-start">
          {{ wordsPoolSortedByLength[length]?.length || 0 }}
        </span>
      </p>
    </div>
    <p class="text-xs mt-1 ms-1">
      <template
        v-for="(word, index) in sortedWords"
        :key="word"
      >
        <span :class="[slideInDurations[index % 4], 'transition-all ease-out inline-block']">
          {{ word }} </span>{{ index !== sortedWords.length - 1 ? ' ' : '' }}
      </template>
    </p>
  </div>
</template>

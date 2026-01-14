<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import FoundWordsNumber from './FoundWordsNumber.vue'
import NineLettersFoundWords from './NineLettersFoundWords.vue'
import WordsLengthStat from './WordsLengthStat.vue'
import { loadGameData } from '../composables/useWordsPool'
import type { WordsPoolWithDay, GameData, SortedWordsPool } from '../types/wordsPool'

const props = defineProps<{
  wordsPool: WordsPoolWithDay
}>()

const gameData = ref<GameData | null>(null)

const baseSortedWords: SortedWordsPool = {
  '9': [],
  '8': [],
  '7': [],
  '6': [],
  '5': [],
  '4': [],
}

const sortWordsByLength = (pool: string[]): SortedWordsPool => {
  return pool.reduce(
    (sortedWords: SortedWordsPool, word: string) => {
      const index = `${word.length}`
      if (sortedWords[index]) {
        sortedWords[index].push(word.toUpperCase())
      }
      return sortedWords
    },
    JSON.parse(JSON.stringify(baseSortedWords))
  )
}

const wordsPoolSortedByLength = computed(() =>
  gameData.value ? sortWordsByLength(gameData.value.wordsPool) : undefined
)

const foundWordsSortedByLength = computed(() =>
  gameData.value ? sortWordsByLength(gameData.value.foundWords) : undefined
)

const nineLettersFoundWords = computed(() => {
  if (!gameData.value?.foundWords.length) return undefined
  return gameData.value.foundWords.find((word) => word.length === 9)
})

const sortedEntries = computed(() => {
  if (!foundWordsSortedByLength.value) return []
  return Object.entries(foundWordsSortedByLength.value) as [string, string[]][]
})

onMounted(() => {
  gameData.value = loadGameData(props.wordsPool.day, props.wordsPool.wordsPool)
})
</script>

<template>
  <div v-if="gameData">
    <FoundWordsNumber :game-data="gameData" />
    <NineLettersFoundWords :nine-letters-found-words="nineLettersFoundWords" />
    <div class="mx-auto max-w-64 mt-6">
      <template v-if="foundWordsSortedByLength && wordsPoolSortedByLength">
        <WordsLengthStat
          v-for="entry in sortedEntries"
          :key="entry[0]"
          :word-length-entry="entry"
          :words-pool-sorted-by-length="wordsPoolSortedByLength"
        />
      </template>
    </div>
  </div>
</template>

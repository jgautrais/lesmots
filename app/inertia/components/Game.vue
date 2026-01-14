<script setup lang="ts">
import { ref, onMounted } from 'vue'
import LettersGrid from './LettersGrid.vue'
import FoundWordsNumber from './FoundWordsNumber.vue'
import { loadGameData, saveGameData } from '../composables/useWordsPool'
import type { WordsPoolWithDay, GameData } from '../types/wordsPool'

const props = defineProps<{
  wordsPool: WordsPoolWithDay
}>()

const gameData = ref<GameData | null>(null)

const addFoundWord = (word: string) => {
  if (gameData.value && !gameData.value.foundWords.includes(word)) {
    gameData.value.foundWords.push(word)
    saveGameData(props.wordsPool.day, gameData.value)
  }
}

onMounted(() => {
  gameData.value = loadGameData(props.wordsPool.day, props.wordsPool.wordsPool)
})
</script>

<template>
  <div v-if="gameData">
    <FoundWordsNumber :game-data="gameData" />
    <LettersGrid :words-pool="wordsPool" :game-data="gameData" @word-found="addFoundWord" />
  </div>
</template>

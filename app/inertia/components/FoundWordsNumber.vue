<script setup lang="ts">
import type { GameData } from '../types/wordsPool'

defineProps<{
  gameData: GameData
}>()
</script>

<template>
  <p class="text-center">
    <span class="font-bold text-teal-500 dark:text-teal-300">
      {{ gameData.foundWords.length }}
    </span>
    mot{{ gameData.foundWords.length > 1 ? 's' : '' }} trouvé{{
      gameData.foundWords.length > 1 ? 's' : ''
    }}
    sur <span class="font-bold">{{ gameData.wordsPool.length }}</span>
  </p>
</template>

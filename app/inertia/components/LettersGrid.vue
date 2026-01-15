<script setup lang="ts">
import { ref, computed } from 'vue'
import type { WordsPool, GameData } from '../types/wordsPool'
import DeleteIcon from './icons/DeleteIcon.vue'
import EraseIcon from './icons/EraseIcon.vue'

const props = defineProps<{
  wordsPool: WordsPool
  gameData: GameData
}>()

const emit = defineEmits<{
  wordFound: [word: string]
}>()

const shuffle = (array: string[]): string[] => {
  return [...array]
    .map((a) => ({ sort: Math.random(), value: a }))
    .sort((a, b) => a.sort - b.sort)
    .map((a) => a.value)
}

const slideInDurations = [
  'animate-slideIn20',
  'animate-slideIn25',
  'animate-slideIn35',
  'animate-slideIn45',
]

const word = ref('')
const shuffledLetters = ref(shuffle(props.wordsPool.letters))
const selectedLettersIndexes = ref<number[]>([])

const addLetter = (letter: string, index: number) => {
  word.value += letter
  selectedLettersIndexes.value.push(index)
}

const removeLastLetter = () => {
  word.value = word.value.slice(0, -1)
  selectedLettersIndexes.value.pop()
}

const resetWord = () => {
  word.value = ''
  selectedLettersIndexes.value = []
}

const foundWordButtonStyle = computed(() => {
  if (word.value.length < 4) return 'bg-transparent'
  if (props.gameData.foundWords.includes(word.value)) return 'bg-transparent'
  if (props.gameData.wordsPool.includes(word.value)) {
    return 'border-teal-200 dark:border-teal-500 bg-teal-50 dark:bg-teal-900'
  }
  return 'bg-transparent'
})

const foundWordStyle = computed(() => {
  if (word.value.length < 4) return 'text-gray-300 dark:text-gray-500'
  if (props.gameData.foundWords.includes(word.value)) {
    return 'text-teal-400 dark:text-teal-300'
  }
  if (props.gameData.wordsPool.includes(word.value)) {
    return 'text-gray-800 dark:text-gray-100 scale-125'
  }
  return 'text-gray-300 dark:text-gray-500'
})

const canSubmit = computed(() => props.gameData.wordsPool.includes(word.value))

const handleWordSubmit = () => {
  if (
    props.gameData.wordsPool.includes(word.value) &&
    !props.gameData.foundWords.includes(word.value)
  ) {
    emit('wordFound', word.value)
  }
}
</script>

<template>
  <div class="mx-auto max-w-64 mt-8">
    <button
      :class="[
        'transition-all ease-out block mx-auto min-h-16 align-middle text-2xl mb-4 font-bold tracking-widest min-w-full rounded border-2 border-gray-50 dark:border-gray-600',
        foundWordButtonStyle,
      ]"
      :disabled="!canSubmit"
      @click="handleWordSubmit"
    >
      <p :class="['transition-all ease-out', foundWordStyle]">
        &nbsp;{{ word.toUpperCase() }}&nbsp;
      </p>
    </button>

    <div class="grid grid-cols-3 gap-4">
      <button
        v-for="(letter, index) in shuffledLetters"
        :key="`${letter}-${index * 2}`"
        :class="[
          slideInDurations[index % 4],
          'transition-all ease-in border rounded border-gray-200 disabled:border-gray-100 dark:border-gray-500 disabled:dark:border-gray-600 text-center min-h-16 my-1 text-4xl font-bold',
          selectedLettersIndexes.includes(index)
            ? 'text-gray-300 dark:text-gray-500'
            : 'text-gray-700 dark:text-gray-100',
        ]"
        :disabled="selectedLettersIndexes.includes(index)"
        @click="addLetter(letter, index)"
      >
        {{ letter.toUpperCase() }}
      </button>
    </div>

    <div class="flex mt-5">
      <button
        class="touch-manipulation block mx-auto min-h-16 min-w-24 py-1 align-middle bg-gray-50 dark:bg-gray-600 rounded"
        :disabled="!word.length"
        aria-label="Effacer la dernière lettre"
        @click="removeLastLetter"
      >
        <DeleteIcon
          :class="[
            'mx-auto w-8 h-8',
            word.length ? 'text-gray-800 dark:text-gray-200' : 'text-gray-300 dark:text-gray-500',
          ]"
        />
      </button>
      <button
        class="touch-manipulation block mx-auto min-h-16 min-w-24 py-1 align-middle bg-gray-50 dark:bg-gray-600 rounded"
        :disabled="!word.length"
        aria-label="Effacer le mot"
        @click="resetWord"
      >
        <EraseIcon
          :class="[
            'mx-auto w-9 h-9',
            word.length ? 'text-gray-800 dark:text-gray-200' : 'text-gray-300 dark:text-gray-500',
          ]"
        />
      </button>
    </div>
  </div>
</template>

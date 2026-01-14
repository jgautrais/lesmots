<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  nineLettersFoundWords: string | undefined
}>()

const slideInDurations = [
  'animate-slideIn20',
  'animate-slideIn25',
  'animate-slideIn35',
  'animate-slideIn45',
]

const word = computed(() =>
  props.nineLettersFoundWords ? props.nineLettersFoundWords.toUpperCase() : '_________'
)

const letters = computed(() => word.value.split(''))
</script>

<template>
  <p class="text-center mt-9">
    <span
      :class="[
        'tracking-widest font-bold text-2xl',
        nineLettersFoundWords?.toUpperCase()
          ? 'text-teal-400 dark:text-teal-300'
          : 'text-gray-300 dark:text-gray-500'
      ]"
    >
      <span
        v-for="(letter, index) in letters"
        :key="`${letter}-${index * 2}`"
        :class="[slideInDurations[index % 4], 'transition-all ease-out inline-block px-1']"
      >
        {{ letter }}
      </span>
    </span>
  </p>
</template>

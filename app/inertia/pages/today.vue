<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3'
import NavBar from '../components/NavBar.vue'
import Game from '../components/Game.vue'
import type { WordsPoolWithDay } from '../types/wordsPool'

defineProps<{
  wordsPool: WordsPoolWithDay | null
}>()
</script>

<template>
  <Head title="Jouer" />
  <div class="container mx-auto">
    <NavBar />
    <Game
      v-if="wordsPool"
      :words-pool="wordsPool"
    />
    <div
      v-else
      class="text-center mt-10 text-gray-500"
    >
      Aucun jeu disponible pour aujourd'hui
    </div>
    <Link
      href="/stats"
      class="block text-lg font-bold text-center mt-10 py-3 px-6 rounded border border-gray-100 bg-gray-50 dark:bg-gray-600 dark:border-gray-500 w-fit mx-auto mb-5"
    >
      Détails
    </Link>
  </div>
</template>

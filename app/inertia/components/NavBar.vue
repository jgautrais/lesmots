<script setup lang="ts">
import { Link } from '@inertiajs/vue3'
import { useTheme } from '../composables/useTheme'
import DarkThemeIcon from './icons/DarkThemeIcon.vue'
import LightThemeIcon from './icons/LightThemeIcon.vue'

const { theme, switchTheme } = useTheme()
</script>

<template>
  <header class="container mx-auto w-full">
    <Link href="/">
      <h1 class="text-4xl font-bold text-center py-8 font-serif">Les Mots</h1>
    </Link>
    <button class="absolute top-9 right-4 md:right-8" @click="switchTheme">
      <LightThemeIcon v-if="theme === 'dark'" class="text-gray-100" />
      <DarkThemeIcon v-else class="text-slate-700" />
    </button>
  </header>
</template>

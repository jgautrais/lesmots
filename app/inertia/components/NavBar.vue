<script setup lang="ts">
import { computed } from 'vue'
import { Link } from '@inertiajs/vue3'
import { useTheme } from '../composables/useTheme'
import { getCurrentDateFormatted } from '../utils/date'
import DarkThemeIcon from './icons/DarkThemeIcon.vue'
import LightThemeIcon from './icons/LightThemeIcon.vue'
import HistoryIcon from './icons/HistoryIcon.vue'

const { theme, switchTheme } = useTheme()

const todayUrl = computed(() => `/game/${getCurrentDateFormatted()}`)
</script>

<template>
  <header class="container mx-auto w-full">
    <Link :href="todayUrl">
      <h1 class="text-4xl font-bold text-center py-8 font-serif">Les Mots</h1>
    </Link>
    <Link href="/history" class="absolute top-9 left-4 md:left-8 pe-8 pb-4">
      <HistoryIcon :class="theme === 'dark' ? 'text-gray-100' : 'text-slate-700'" />
    </Link>
    <button class="absolute top-9 right-4 md:right-8 ps-8 pb-4" @click="switchTheme">
      <LightThemeIcon v-if="theme === 'dark'" class="text-gray-100" />
      <DarkThemeIcon v-else class="text-slate-700" />
    </button>
  </header>
</template>

<script setup lang="ts">
import {
  CodeXml,
  Layers,
  ListChecks,
  Moon,
  Sun,
  Terminal,
} from 'lucide-vue-next'
import { ref, watchEffect } from 'vue'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ChecklistView from '@/views/ChecklistView.vue'
import ComponentsView from '@/views/ComponentsView.vue'
import HomeView from '@/views/HomeView.vue'

const themeKey = 'wails-starter-theme'
const savedTheme = localStorage.getItem(themeKey)
const dark = ref(
  savedTheme === 'dark' ||
    (savedTheme !== 'light' &&
      matchMedia('(prefers-color-scheme: dark)').matches),
)

watchEffect(() => {
  document.documentElement.classList.toggle('dark', dark.value)
  document.documentElement.style.colorScheme = dark.value ? 'dark' : 'light'
})

function toggleTheme() {
  dark.value = !dark.value
  localStorage.setItem(themeKey, dark.value ? 'dark' : 'light')
}
</script>

<template>
  <Tabs
    class="min-h-dvh gap-0 bg-background text-foreground"
    default-value="starter"
    :unmount-on-hide="false"
  >
    <header class="border-b border-border bg-card">
      <div
        class="mx-auto flex min-h-17 max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-3 sm:px-9"
      >
        <div class="flex items-center gap-3">
          <div
            class="grid size-9 place-items-center rounded-lg bg-primary text-primary-foreground"
          >
            <CodeXml :size="19" aria-hidden="true" />
          </div>
          <span class="text-sm font-semibold tracking-tight"
            >Desktop Starter</span
          >
        </div>

        <TabsList
          aria-label="Starter views"
          class="order-last max-sm:w-full sm:order-none"
        >
          <TabsTrigger value="starter" class="gap-2 px-3">
            <Terminal :size="15" aria-hidden="true" />
            Starter
          </TabsTrigger>
          <TabsTrigger value="components" class="gap-2 px-3">
            <Layers :size="15" aria-hidden="true" />
            Components
          </TabsTrigger>
          <TabsTrigger value="checklist" class="gap-2 px-3">
            <ListChecks :size="15" aria-hidden="true" />
            Checklist
          </TabsTrigger>
        </TabsList>

        <Button
          variant="outline"
          size="sm"
          type="button"
          :aria-label="dark ? 'Switch to light mode' : 'Switch to dark mode'"
          @click="toggleTheme"
        >
          <Sun v-if="dark" aria-hidden="true" />
          <Moon v-else aria-hidden="true" />
          <span class="hidden sm:inline">{{
            dark ? 'Light mode' : 'Dark mode'
          }}</span>
        </Button>
      </div>
    </header>
    <TabsContent value="starter">
      <HomeView />
    </TabsContent>
    <TabsContent value="components">
      <ComponentsView />
    </TabsContent>
    <TabsContent value="checklist">
      <ChecklistView />
    </TabsContent>
  </Tabs>
</template>

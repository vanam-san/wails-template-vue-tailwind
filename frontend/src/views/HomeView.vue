<script setup lang="ts">
import {
  ArrowRight,
  Check,
  Circle,
  LoaderCircle,
  Terminal,
  Workflow,
} from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useGreeting } from '@/composables/useGreeting'
import { greet } from '@/services/greet'

// Supply the Wails-backed call to the composable that owns form state.
const { name, greeting, error, status, submit } = useGreeting(greet)
const stack = ['Wails v3', 'Vue 3', 'TypeScript', 'Tailwind CSS']
const statusLabels = {
  idle: 'Awaiting first call',
  pending: 'Calling Go',
  success: 'Go call succeeded',
  error: 'Request needs attention',
}
</script>

<template>
  <main class="mx-auto max-w-6xl px-5 pb-12 pt-11 sm:px-9 sm:pt-15">
    <div class="mb-9">
      <h1 class="text-4xl font-semibold tracking-tight sm:text-5xl">
        Wails + Vue Starter
      </h1>
      <p
        class="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base"
      >
        Call a Go service directly from this desktop window.
      </p>
      <ul aria-label="Technology stack" class="mt-5 flex flex-wrap gap-2">
        <li v-for="technology in stack" :key="technology">
          <Badge variant="outline" class="bg-card px-2.5 py-1">{{
            technology
          }}</Badge>
        </li>
      </ul>
    </div>

    <div
      class="grid items-start gap-5 lg:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)]"
    >
      <Card class="gap-5">
        <CardHeader>
          <div
            class="mb-2 grid size-10 place-items-center rounded-lg bg-accent text-accent-foreground"
          >
            <Terminal :size="19" aria-hidden="true" />
          </div>
          <CardTitle>Try the Go service</CardTitle>
          <CardDescription
            >Send a name to the backend and inspect its
            response.</CardDescription
          >
        </CardHeader>

        <CardContent>
          <!-- Keep the webview on this page when the form is submitted. -->
          <form class="space-y-4" @submit.prevent="submit">
            <div class="space-y-2">
              <Label for="name">Your name</Label>
              <Input
                id="name"
                v-model="name"
                class="h-11"
                name="name"
                autocomplete="given-name"
                placeholder="e.g. Ada"
                :disabled="status === 'pending'"
                :aria-invalid="!!error"
                :aria-describedby="error ? 'greet-error' : undefined"
              />
              <p
                v-if="error"
                id="greet-error"
                role="alert"
                class="text-sm text-destructive"
              >
                {{ error }}
              </p>
            </div>
            <Button type="submit" :disabled="status === 'pending'">
              <LoaderCircle
                v-if="status === 'pending'"
                class="motion-safe:animate-spin"
                aria-hidden="true"
              />
              {{ status === 'pending' ? 'Greeting…' : 'Greet from Go' }}
              <ArrowRight v-if="status !== 'pending'" aria-hidden="true" />
            </Button>
          </form>

          <div
            class="mt-6 rounded-lg border border-border bg-muted px-4 py-3.5"
          >
            <h2 class="text-xs font-semibold text-muted-foreground">
              Go response
            </h2>
            <p
              role="status"
              class="mt-2 wrap-anywhere font-mono text-sm leading-relaxed"
            >
              {{ greeting || 'No response yet.' }}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card class="gap-5">
        <CardHeader>
          <div
            class="mb-2 grid size-10 place-items-center rounded-lg bg-accent text-accent-foreground"
          >
            <Workflow :size="19" aria-hidden="true" />
          </div>
          <CardTitle>Service bridge</CardTitle>
          <CardDescription>How your request reaches Go.</CardDescription>
        </CardHeader>
        <CardContent>
          <ol class="space-y-2 text-sm">
            <li class="rounded-md border border-border px-3 py-2.5 font-medium">
              Vue form
            </li>
            <li class="rounded-md border border-border px-3 py-2.5 font-medium">
              Generated Wails binding
            </li>
            <li class="rounded-md border border-border px-3 py-2.5 font-mono">
              GreetService.Greet
            </li>
          </ol>
          <div
            class="mt-5 flex items-center justify-between gap-3 border-t border-border pt-4 text-sm"
          >
            <span class="text-muted-foreground">Status</span>
            <span
              role="status"
              class="inline-flex items-center gap-2 font-medium"
            >
              <Check
                v-if="status === 'success'"
                :size="15"
                class="text-primary"
                aria-hidden="true"
              />
              <Circle
                v-else
                :size="9"
                class="text-muted-foreground"
                aria-hidden="true"
              />
              {{ statusLabels[status] }}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  </main>
</template>

<script setup lang="ts">
import {
  Check,
  CircleHelp,
  ClipboardList,
  ListChecks,
  RotateCcw,
} from 'lucide-vue-next'
import { computed, reactive } from 'vue'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

// Tasks are local to this view and reset when the webview reloads.
const tasks = reactive([
  {
    id: 'check-brand',
    title: 'Set your app name and icon',
    description: 'Update the product metadata and replace the default icon.',
    done: false,
  },
  {
    id: 'check-service',
    title: 'Try the Go service',
    description: 'Submit a greeting from the Starter tab.',
    done: false,
  },
  {
    id: 'check-controls',
    title: 'Review the component examples',
    description: 'Change the notification schedule and confirm the preview.',
    done: false,
  },
  {
    id: 'check-release',
    title: 'Build a release',
    description: 'Generate an installer for your target platform.',
    done: false,
  },
])

// Derive all progress indicators from the same checkbox state.
const completed = computed(() => tasks.filter((task) => task.done).length)
const allDone = computed(() => completed.value === tasks.length)
const percent = computed(() =>
  Math.round((completed.value / tasks.length) * 100),
)

function setAll(done: boolean) {
  for (const task of tasks) {
    task.done = done
  }
}
</script>

<template>
  <main class="mx-auto max-w-6xl px-5 pb-9 pt-8 sm:px-9 sm:pt-11">
    <h1 class="text-3xl font-semibold tracking-tight sm:text-4xl">
      Launch checklist
    </h1>
    <p class="mb-7 mt-2 text-sm text-muted-foreground">
      Follow these steps to turn the starter into your own desktop app.
    </p>

    <div
      class="grid items-start gap-5 lg:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)]"
    >
      <Card class="gap-5">
        <CardHeader>
          <div
            class="mb-2 grid size-10 place-items-center rounded-lg bg-accent text-accent-foreground"
          >
            <ClipboardList :size="19" aria-hidden="true" />
          </div>
          <CardTitle>Release tasks</CardTitle>
          <CardDescription
            >Check off each task as you finish it.</CardDescription
          >
        </CardHeader>
        <CardContent>
          <ul class="divide-y divide-border rounded-lg border border-border">
            <li
              v-for="task in tasks"
              :key="task.id"
              class="flex items-start gap-3 px-3 py-3"
            >
              <Checkbox
                :id="task.id"
                v-model="task.done"
                class="mt-0.5"
                :aria-describedby="`${task.id}-detail`"
              />
              <div class="min-w-0 flex-1">
                <Label :for="task.id">{{ task.title }}</Label>
                <p
                  :id="`${task.id}-detail`"
                  class="mt-1 text-xs leading-relaxed text-muted-foreground"
                >
                  {{ task.description }}
                </p>
              </div>
              <Badge
                :variant="task.done ? 'secondary' : 'outline'"
                class="shrink-0"
              >
                <Check v-if="task.done" aria-hidden="true" />
                {{ task.done ? 'Done' : 'Open' }}
              </Badge>
            </li>
          </ul>
          <div class="mt-5 flex flex-wrap gap-2">
            <Button type="button" :disabled="allDone" @click="setAll(true)">
              <ListChecks aria-hidden="true" />
              Check all
            </Button>
            <Button
              type="button"
              variant="outline"
              :disabled="completed === 0"
              @click="setAll(false)"
            >
              <RotateCcw aria-hidden="true" />
              Clear checks
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card class="gap-5">
        <CardHeader>
          <CardTitle id="checklist-progress">Checklist progress</CardTitle>
          <CardDescription>Updates as you check items.</CardDescription>
          <CardAction>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger as-child>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label="About checklist progress"
                  >
                    <CircleHelp aria-hidden="true" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent
                  >Checks reset when you reload the app.</TooltipContent
                >
              </Tooltip>
            </TooltipProvider>
          </CardAction>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="flex items-baseline justify-between gap-3" role="status">
            <span class="text-2xl font-semibold tabular-nums"
              >{{ percent }}%</span
            >
            <span class="text-xs text-muted-foreground"
              >{{ completed }} of {{ tasks.length }} done</span
            >
          </div>
          <Progress
            :model-value="percent"
            aria-labelledby="checklist-progress"
          />
          <Alert
            v-if="allDone"
            role="status"
            class="border border-border bg-accent text-accent-foreground"
          >
            <Check aria-hidden="true" />
            <AlertTitle>Checklist complete</AlertTitle>
            <AlertDescription
              >All launch tasks are marked done.</AlertDescription
            >
          </Alert>
        </CardContent>
      </Card>
    </div>
  </main>
</template>

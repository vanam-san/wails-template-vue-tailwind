<script setup lang="ts">
import { Bell, Check, SlidersHorizontal } from 'lucide-vue-next'
import { computed, ref } from 'vue'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'

const deliveryOptions = [
  { value: 'immediate', label: 'Immediately' },
  { value: 'daily', label: 'Daily digest' },
  { value: 'weekly', label: 'Weekly digest' },
]

const delivery = ref('daily')
const notifications = ref(true)
const includeSummary = ref(false)
const saved = ref(false)

const deliveryLabel = computed(
  () =>
    deliveryOptions.find((option) => option.value === delivery.value)?.label ??
    '',
)

function reset() {
  delivery.value = 'daily'
  notifications.value = true
  includeSummary.value = false
  saved.value = false
}
</script>

<template>
  <main class="mx-auto max-w-6xl px-5 pb-9 pt-8 sm:px-9 sm:pt-11">
    <h1 class="text-3xl font-semibold tracking-tight sm:text-4xl">
      Components
    </h1>
    <p class="mb-7 mt-2 text-sm text-muted-foreground">
      Try local shadcn-vue controls in a sample preferences panel.
    </p>

    <div
      class="grid items-start gap-5 lg:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)]"
    >
      <Card class="gap-5">
        <CardHeader>
          <div
            class="mb-2 grid size-10 place-items-center rounded-lg bg-accent text-accent-foreground"
          >
            <SlidersHorizontal :size="19" aria-hidden="true" />
          </div>
          <CardTitle>Notification preferences</CardTitle>
          <CardDescription
            >Changes update the example preview as you make
            them.</CardDescription
          >
        </CardHeader>

        <CardContent class="space-y-5">
          <div class="flex items-center justify-between gap-4">
            <div>
              <Label for="notifications">Enable notifications</Label>
              <p
                id="notifications-hint"
                class="mt-1 text-sm text-muted-foreground"
              >
                Show a notification in the preview.
              </p>
            </div>
            <Switch
              id="notifications"
              v-model="notifications"
              aria-describedby="notifications-hint"
              @update:model-value="saved = false"
            />
          </div>

          <div class="space-y-2 border-t border-border pt-4">
            <Label for="delivery">Delivery schedule</Label>
            <Select
              v-model="delivery"
              :disabled="!notifications"
              @update:model-value="saved = false"
            >
              <SelectTrigger id="delivery" class="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  v-for="option in deliveryOptions"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div class="flex items-center gap-2.5">
            <Checkbox
              id="include-summary"
              v-model="includeSummary"
              :disabled="!notifications"
              @update:model-value="saved = false"
            />
            <Label for="include-summary">Include a short summary</Label>
          </div>

          <div
            class="flex flex-wrap items-center gap-2 border-t border-border pt-4"
          >
            <Dialog>
              <DialogTrigger as-child>
                <Button type="button">Review preferences</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Confirm preferences</DialogTitle>
                  <DialogDescription>
                    {{
                      notifications
                        ? `Notifications are enabled. Delivery is set to ${deliveryLabel.toLowerCase()}.`
                        : 'Notifications are disabled.'
                    }}
                  </DialogDescription>
                </DialogHeader>
                <p
                  v-if="notifications && includeSummary"
                  class="text-sm text-muted-foreground"
                >
                  Each notification includes a short summary.
                </p>
                <DialogFooter>
                  <DialogClose as-child>
                    <Button type="button" variant="outline">Cancel</Button>
                  </DialogClose>
                  <DialogClose as-child>
                    <Button type="button" @click="saved = true">Confirm</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button type="button" variant="ghost" @click="reset">Reset</Button>
            <span
              v-if="saved"
              role="status"
              class="inline-flex items-center gap-1.5 text-sm text-primary"
            >
              <Check :size="15" aria-hidden="true" />
              Confirmed
            </span>
          </div>
        </CardContent>
      </Card>

      <Card class="gap-5">
        <CardHeader>
          <div
            class="mb-2 grid size-10 place-items-center rounded-lg bg-accent text-accent-foreground"
          >
            <Bell :size="18" aria-hidden="true" />
          </div>
          <CardTitle>Preview</CardTitle>
          <CardDescription>Example notification</CardDescription>
        </CardHeader>
        <CardContent aria-live="polite">
          <div
            v-if="notifications"
            class="rounded-lg border border-border bg-muted p-4"
          >
            <div class="flex flex-wrap items-center justify-between gap-2">
              <span class="font-semibold">Project activity</span>
              <Badge variant="outline">{{ deliveryLabel }}</Badge>
            </div>
            <p v-if="includeSummary" class="mt-2 text-muted-foreground">
              A short summary of changes appears here.
            </p>
          </div>
          <p
            v-else
            class="rounded-lg border border-border bg-muted p-4 text-muted-foreground"
          >
            Notifications are off.
          </p>
        </CardContent>
      </Card>
    </div>
  </main>
</template>

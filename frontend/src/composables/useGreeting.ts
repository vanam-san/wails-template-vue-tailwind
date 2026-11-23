import { ref } from 'vue'

type Greet = (name: string) => Promise<string>
type GreetingStatus = 'idle' | 'pending' | 'success' | 'error'

/** Manages form state. Injecting the greeting call lets tests run without Wails. */
export function useGreeting(greet: Greet) {
  const name = ref('')
  const greeting = ref('')
  const error = ref('')
  const status = ref<GreetingStatus>('idle')

  async function submit() {
    // A second submission could replace the first request's status and result.
    if (status.value === 'pending') return

    greeting.value = ''
    error.value = ''
    const value = name.value.trim()

    // Give immediate feedback before making a call across the Wails bridge.
    if (!value) {
      status.value = 'error'
      error.value = 'Enter your name to continue.'
      return
    }

    status.value = 'pending'
    try {
      greeting.value = await greet(value)
      status.value = 'success'
    } catch (cause) {
      error.value =
        cause instanceof Error && cause.message
          ? cause.message
          : 'The Go service could not complete the request. Try again.'
      status.value = 'error'
    }
  }

  return { name, greeting, error, status, submit }
}

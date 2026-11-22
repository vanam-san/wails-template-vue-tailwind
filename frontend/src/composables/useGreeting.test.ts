import { describe, expect, it, vi } from 'vitest'
import { useGreeting } from './useGreeting'

describe('useGreeting', () => {
  it('validates blank names without calling Go', async () => {
    const greet = vi.fn()
    const form = useGreeting(greet)
    form.name.value = '   '

    await form.submit()

    expect(greet).not.toHaveBeenCalled()
    expect(form.error.value).toBe('Enter your name to continue.')
  })

  it('blocks duplicate submissions and displays the Go result', async () => {
    let finish!: (value: string) => void
    const pending = new Promise<string>((resolve) => {
      finish = resolve
    })
    const greet = vi.fn(() => pending)
    const form = useGreeting(greet)
    form.name.value = '  Ada  '

    const request = form.submit()
    expect(form.status.value).toBe('pending')
    await form.submit()
    expect(greet).toHaveBeenCalledExactlyOnceWith('Ada')

    finish('Hello, Ada!')
    await request
    expect(form.greeting.value).toBe('Hello, Ada!')
    expect(form.status.value).toBe('success')
  })

  it('exposes a Go error and allows the user to retry', async () => {
    const greet = vi
      .fn()
      .mockRejectedValueOnce(new Error('Service unavailable'))
    greet.mockResolvedValueOnce('Hello, Ada!')
    const form = useGreeting(greet)
    form.name.value = 'Ada'

    await form.submit()
    expect(form.status.value).toBe('error')
    expect(form.error.value).toBe('Service unavailable')

    await form.submit()
    expect(form.status.value).toBe('success')
    expect(form.error.value).toBe('')
  })
})

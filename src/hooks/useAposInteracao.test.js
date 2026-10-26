import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useAposInteracao } from './useAposInteracao'

describe('useAposInteracao', () => {
  it('começa falso e vira verdadeiro na primeira interação', () => {
    const { result } = renderHook(() => useAposInteracao())
    expect(result.current).toBe(false)

    act(() => window.dispatchEvent(new Event('pointermove')))
    expect(result.current).toBe(true)
  })

  it('também reage a teclado e rolagem', () => {
    for (const evento of ['keydown', 'scroll']) {
      const { result, unmount } = renderHook(() => useAposInteracao())
      act(() => window.dispatchEvent(new Event(evento)))
      expect(result.current).toBe(true)
      unmount()
    }
  })
})

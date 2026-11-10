import {
  createContext, useCallback, useContext, useEffect, useMemo, useRef, useState,
} from 'react'

const Ctx = createContext(null)

/**
 * Небольшое глобальное состояние: черновик перевода (нужен, чтобы данные
 * жили между экранами «Перевод → Подтверждение → Успех»), скрытие баланса
 * и всплывающая подсказка для кнопок, за которыми нет отдельного экрана.
 */
export function AppStateProvider({ children }) {
  // Черновик пустой: получателя и сумму выбирает пользователь, заранее
  // ничего не подставлено. Счёт списания один, его и держим по умолчанию.
  const [transfer, setTransfer] = useState({
    contact: null,
    amount: '',
    message: '',
    from: { title: 'Black · 7711', available: 3558737.15 },
  })
  const [hideBalance, setHideBalance] = useState(false)
  const [toast, setToast] = useState(null)
  const timer = useRef(null)

  const showToast = useCallback((text) => {
    setToast(text)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setToast(null), 2000)
  }, [])

  // Таймер переживает размонтирование, иначе React ругается на setState
  // после ухода с экрана
  useEffect(() => () => clearTimeout(timer.current), [])

  const value = useMemo(
    () => ({
      transfer,
      setTransfer,
      hideBalance,
      toggleBalance: () => setHideBalance((v) => !v),
      toast,
      showToast,
    }),
    [transfer, hideBalance, toast, showToast]
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useApp() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useApp вызван вне AppStateProvider')
  return ctx
}

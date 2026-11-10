import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { AppStateProvider } from './state/AppState.jsx'
import TabBar from './components/TabBar.jsx'
import { Toast } from './components/Overlays.jsx'

import Login from './screens/Login.jsx'
import Pin from './screens/Pin.jsx'
import Home from './screens/Home.jsx'
import Card from './screens/Card.jsx'
import CardPlatinum from './screens/CardPlatinum.jsx'
import Savings from './screens/Savings.jsx'
import Cashback from './screens/Cashback.jsx'
import Statement from './screens/Statement.jsx'
import OperationDetails from './screens/OperationDetails.jsx'
import Analytics from './screens/Analytics.jsx'
import Payments from './screens/Payments.jsx'
import Regular from './screens/Regular.jsx'
import Bills from './screens/Bills.jsx'
import Transfer from './screens/Transfer.jsx'
import Between from './screens/Between.jsx'
import Topup from './screens/Topup.jsx'
import TransferConfirm from './screens/TransferConfirm.jsx'
import TransferSuccess from './screens/TransferSuccess.jsx'
import Invest from './screens/Invest.jsx'
import Chat from './screens/Chat.jsx'
import More from './screens/More.jsx'
import MoreSection from './screens/MoreSection.jsx'

// Таб-бар живёт на основных и продуктовых экранах — как в приложении банка.
// Поверх него открываются только модальные потоки: вход, перевод, детали операции.
const WITH_TABBAR = [
  '/home', '/payments', '/chat', '/more',
  '/card', '/card/platinum', '/savings', '/statement', '/analytics', '/invest',
]

function Shell() {
  const { pathname } = useLocation()

  // Нативное поведение: при переходе на новый экран скролл сбрасывается
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/pin" element={<Pin />} />
        <Route path="/home" element={<Home />} />
        <Route path="/card" element={<Card />} />
        <Route path="/card/platinum" element={<CardPlatinum />} />
        <Route path="/savings" element={<Savings />} />
        <Route path="/statement" element={<Statement />} />
        <Route path="/operation/:id" element={<OperationDetails />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/payments" element={<Payments />} />
        <Route path="/regular" element={<Regular />} />
        <Route path="/bills" element={<Bills />} />
        <Route path="/transfer" element={<Transfer />} />
        <Route path="/between" element={<Between />} />
        <Route path="/topup" element={<Topup />} />
        <Route path="/transfer/confirm" element={<TransferConfirm />} />
        <Route path="/transfer/success" element={<TransferSuccess />} />
        <Route path="/cashback" element={<Cashback />} />
        <Route path="/invest" element={<Invest />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/more" element={<More />} />
        <Route path="/more/:id" element={<MoreSection />} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
      {WITH_TABBAR.includes(pathname) && <TabBar />}
      <Toast />
    </>
  )
}

export default function App() {
  return (
    // HashRouter, а не BrowserRouter: на GitHub Pages нет серверного
    // роутинга, и прямой заход на /home иначе отдаёт 404.
    <HashRouter>
      <AppStateProvider>
        <Shell />
      </AppStateProvider>
    </HashRouter>
  )
}

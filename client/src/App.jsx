import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import WhatsAppButton from './components/WhatsAppButton'
import MobileCTA from './components/MobileCTA'
import FormModal from './components/FormModal'
import BookConsultant from './components/BookConsultant'
import HomePage from './pages/HomePage'
import ServicePage from './pages/ServicePage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import BlogPage from './pages/BlogPage'
import FAQPage from './pages/FAQPage'
import EMICalculatorPage from './pages/EMICalculatorPage'
import PrivacyPolicyPage from './pages/PrivacyPolicyPage'
import TermsPage from './pages/TermsPage'
import LoginPage from './pages/admin/LoginPage'
import AdminLayout from './pages/admin/AdminLayout'
import DashboardPage from './pages/admin/DashboardPage'
import ReviewsPage from './pages/admin/ReviewsPage'
import PartnersPage from './pages/admin/PartnersPage'
import BlogsPage from './pages/admin/BlogsPage'
import { captureUTMParams } from './utils/helpers'

function App() {
  const [modalOpen, setModalOpen] = useState(false)
  const [modalService, setModalService] = useState(null)
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')

  useEffect(() => { captureUTMParams(); }, [])

  const openModal = (service = null) => {
    setModalService(service)
    setModalOpen(true)
  }

  return (
    <>
      <ScrollToTop />
      {!isAdmin && <Header onApply={() => openModal()} />}
      <main className={isAdmin ? '' : 'min-h-screen'}>
        <Routes>
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms-and-conditions" element={<TermsPage />} />
          <Route path="/admin/login" element={<LoginPage />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="reviews" element={<ReviewsPage />} />
            <Route path="partners" element={<PartnersPage />} />
            <Route path="blogs" element={<BlogsPage />} />
          </Route>
          <Route path="/" element={<HomePage onApply={openModal} />} />
          <Route path="/services/:serviceId" element={<ServicePage onApply={openModal} />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:articleId" element={<Navigate to="/blog" replace />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/emi-calculator" element={<EMICalculatorPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      {!isAdmin && <Footer />}
      {!isAdmin && <WhatsAppButton />}
      {!isAdmin && <BookConsultant />}
      {/* {!isAdmin && <MobileCTA />} */}
      {!isAdmin && <FormModal isOpen={modalOpen} onClose={() => setModalOpen(false)} service={modalService} />}
    </>
  )
}

function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gradient-green mb-4">404</h1>
        <p className="text-xl text-gray-400 mb-8">Page not found</p>
        <a href="/" className="btn-green inline-block">Go Home</a>
      </div>
    </div>
  )
}

export default App

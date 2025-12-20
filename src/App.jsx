import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Booking from './pages/Booking';
import About from './pages/About';
import Dashboard from './pages/Dashboard';
import ConfirmQuote from './pages/ConfirmQuote';
import { AuthProvider, BookingProvider } from './context/BookingContext';
import './App.css'

export default function App() {

  return (
    <AuthProvider>
      <BookingProvider>
         <Header />
        <main style={{ paddingTop: '7rem'}}>
       <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/booking' element={<Booking />} />
        <Route path='/about' element={<About />} />
        <Route path='/panel' element={<Dashboard />} />
        <Route path='/confirm-quote/:quoteId' element={<ConfirmQuote />} />
        <Route path='*' element={<Home />} /> 
      </Routes>
        </main>
        <Footer />
     </BookingProvider>
    </AuthProvider>
  )
}



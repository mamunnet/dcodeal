import { MantineProvider } from '@mantine/core'
import { Home, Search, Grid2x2, User } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { NavItem } from './components/NavItem'
import { AccountPage } from './components/account/AccountPage'
import { CategoriesPage } from './components/CategoriesPage'
import { HomePage } from './components/HomePage'

function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'categories' | 'account'>('home')

  return (
    <MantineProvider>
      <div className="max-w-md mx-auto bg-gray-50 min-h-screen flex flex-col">
        <div className="flex-1 overflow-y-auto pb-20">
          <AnimatePresence mode="wait">
            {currentPage === 'home' && <HomePage key="home" />}
            {currentPage === 'categories' && <CategoriesPage key="categories" onBack={() => setCurrentPage('home')} />}
            {currentPage === 'account' && <AccountPage key="account" onBack={() => setCurrentPage('home')} />}
          </AnimatePresence>
        </div>

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 flex justify-between items-center max-w-md mx-auto shadow-lg">
          <NavItem 
            icon={<Home size={24} />} 
            label="Home" 
            active={currentPage === 'home'}
            onClick={() => setCurrentPage('home')}
          />
          <NavItem icon={<Search size={24} />} label="Search" />
          <NavItem 
            icon={<Grid2x2 size={24} />} 
            label="Categories" 
            active={currentPage === 'categories'}
            onClick={() => setCurrentPage('categories')}
          />
          <NavItem 
            icon={<User size={24} />} 
            label="Account" 
            active={currentPage === 'account'}
            onClick={() => setCurrentPage('account')}
          />
        </nav>
      </div>
    </MantineProvider>
  )
}

export default App

import { motion } from 'framer-motion'

interface NavItemProps {
  icon: React.ReactNode
  label: string
  active?: boolean
  onClick?: () => void
}

export function NavItem({ icon, label, active, onClick }: NavItemProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      className={`flex flex-col items-center gap-1 ${active ? 'text-green-600' : 'text-gray-500'}`}
      onClick={onClick}
    >
      {icon}
      <span className="text-xs font-medium">{label}</span>
    </motion.button>
  )
} 
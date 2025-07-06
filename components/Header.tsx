import { Heart, Shield, Activity } from 'lucide-react'

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-primary-600 rounded-lg">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">SmartHealth</h1>
              <p className="text-sm text-gray-500">SmartHealth Assessment</p>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#" className="text-gray-600 hover:text-primary-600 transition-colors">
              Home
            </a>
            <a href="#" className="text-gray-600 hover:text-primary-600 transition-colors">
              About
            </a>
            <a href="#" className="text-gray-600 hover:text-primary-600 transition-colors">
              Contact
            </a>
          </nav>
          
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-green-500" />
            <span className="text-sm text-gray-600">Secure & Private</span>
          </div>
        </div>
      </div>
    </header>
  )
} 
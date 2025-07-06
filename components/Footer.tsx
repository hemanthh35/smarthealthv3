export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">SmartHealth</h3>
            <p className="text-gray-300 text-sm">
              AI-powered health assessment tool designed to help you understand your symptoms and make informed health decisions.
            </p>
          </div>
          
          <div>
            <h4 className="text-md font-semibold mb-4">Important Notice</h4>
            <p className="text-gray-300 text-sm">
              This tool is for informational purposes only and should not replace professional medical advice. Always consult with a healthcare provider for proper diagnosis and treatment.
            </p>
          </div>
          
          <div>
            <h4 className="text-md font-semibold mb-4">Emergency</h4>
            <p className="text-gray-300 text-sm">
              If you're experiencing severe symptoms or a medical emergency, call emergency services immediately.
            </p>
            <div className="mt-2">
              <span className="text-red-400 font-semibold">Emergency: 911</span>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 text-center">
          <p className="text-gray-400 text-sm">
            © 2024 SmartHealth. All rights reserved. | Privacy Policy | Terms of Service
          </p>
        </div>
      </div>
    </footer>
  )
} 
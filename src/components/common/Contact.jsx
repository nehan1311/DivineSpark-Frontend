import React from 'react'
import { motion } from 'framer-motion'
import { Button } from '../ui/Button'

const Contact = () => {
  return (
    <section id="contact" className="py-20 md:py-28 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
          >
            <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-6 leading-tight" style={{ fontFamily: 'Inter, ui-sans-serif, system-ui' }}>
              Ready to Begin Your 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600"> Healing Journey?</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed" style={{ fontFamily: 'Inter, ui-sans-serif, system-ui' }}>
              Get in touch with us to schedule your personalized healing session or learn more about our transformative programs.
            </p>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-white rounded-3xl border border-gray-200 shadow-xl p-8 lg:p-10">
              <h3 className="text-2xl font-medium text-gray-900 mb-6" style={{ fontFamily: 'Inter, ui-sans-serif, system-ui' }}>
                Send us a Message
              </h3>
              
              <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Inter, ui-sans-serif, system-ui' }}>
                      First Name
                    </label>
                    <input 
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300" 
                      placeholder="Enter your first name"
                      style={{ fontFamily: 'Inter, ui-sans-serif, system-ui' }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Inter, ui-sans-serif, system-ui' }}>
                      Last Name
                    </label>
                    <input 
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300" 
                      placeholder="Enter your last name"
                      style={{ fontFamily: 'Inter, ui-sans-serif, system-ui' }}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Inter, ui-sans-serif, system-ui' }}>
                    Email Address
                  </label>
                  <input 
                    type="email"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300" 
                    placeholder="Enter your email address"
                    style={{ fontFamily: 'Inter, ui-sans-serif, system-ui' }}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Inter, ui-sans-serif, system-ui' }}>
                    Phone Number (Optional)
                  </label>
                  <input 
                    type="tel"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300" 
                    placeholder="Enter your phone number"
                    style={{ fontFamily: 'Inter, ui-sans-serif, system-ui' }}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Inter, ui-sans-serif, system-ui' }}>
                    Message
                  </label>
                  <textarea 
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300" 
                    placeholder="Tell us about your healing goals or any questions you have..."
                    style={{ fontFamily: 'Inter, ui-sans-serif, system-ui' }}
                  />
                </div>
                
                <Button 
                  className="w-full h-12 rounded-xl text-base font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1" 
                  style={{
                    backgroundColor: '#059669', 
                    color: '#FFFFFF', 
                    border: 'none',
                    fontFamily: 'Inter, ui-sans-serif, system-ui'
                  }}
                >
                  Send Message
                </Button>
              </form>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {/* Contact Information */}
            <div className="bg-white rounded-3xl border border-gray-200 shadow-xl p-8">
              <h3 className="text-2xl font-medium text-gray-900 mb-6" style={{ fontFamily: 'Inter, ui-sans-serif, system-ui' }}>
                Contact Information
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1" style={{ fontFamily: 'Inter, ui-sans-serif, system-ui' }}>
                      Email Address
                    </h4>
                    <p className="text-gray-600" style={{ fontFamily: 'Inter, ui-sans-serif, system-ui' }}>
                      hello@divinespark.example
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1" style={{ fontFamily: 'Inter, ui-sans-serif, system-ui' }}>
                      Phone Number
                    </h4>
                    <p className="text-gray-600" style={{ fontFamily: 'Inter, ui-sans-serif, system-ui' }}>
                      +91 99999 99999
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1" style={{ fontFamily: 'Inter, ui-sans-serif, system-ui' }}>
                      Location
                    </h4>
                    <p className="text-gray-600" style={{ fontFamily: 'Inter, ui-sans-serif, system-ui' }}>
                      Pune, India
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Response Time */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl border border-green-200 p-8">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="text-lg font-medium text-gray-900" style={{ fontFamily: 'Inter, ui-sans-serif, system-ui' }}>
                  Quick Response
                </h4>
              </div>
              <p className="text-gray-700 leading-relaxed" style={{ fontFamily: 'Inter, ui-sans-serif, system-ui' }}>
                We typically respond to all inquiries within 24 hours. For urgent matters, please call us directly.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Contact



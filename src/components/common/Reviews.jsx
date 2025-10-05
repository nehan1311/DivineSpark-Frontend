import React from 'react'
import { motion } from 'framer-motion'

const testimonials = [
  {
    quote: 'I felt an immediate sense of calm and relief after the session.',
    name: 'A. Sharma'
  },
  {
    quote: 'The workshops brought clarity and improved my sleep. Highly recommended!',
    name: 'R. Patel'
  },
  {
    quote: 'Gentle, powerful, and transformative experience.',
    name: 'M. Khan'
  }
]

const Reviews = () => {
  return (
    <section id="reviews" className="py-20 md:py-28 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
          >
            <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-6 leading-tight" style={{ fontFamily: 'Inter, ui-sans-serif, system-ui' }}>
              What Our 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600"> Clients Say</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed" style={{ fontFamily: 'Inter, ui-sans-serif, system-ui' }}>
              Real stories from people who have experienced transformation through our healing sessions.
            </p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 md:gap-10">
          {testimonials.map((t, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
              className="relative bg-white rounded-3xl border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-500 p-8 text-center transform hover:-translate-y-2"
            >
              {/* Quote Icon */}
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/>
                  </svg>
                </div>
              </div>

              <div className="pt-6">
                <p className="text-gray-700 text-lg leading-relaxed mb-6 italic" style={{ fontFamily: 'Inter, ui-sans-serif, system-ui' }}>
                  "{t.quote}"
                </p>
                
                <div className="flex items-center justify-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-green-600 font-medium text-lg" style={{ fontFamily: 'Inter, ui-sans-serif, system-ui' }}>
                      {t.name.charAt(0)}
                    </span>
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-gray-900" style={{ fontFamily: 'Inter, ui-sans-serif, system-ui' }}>
                      {t.name}
                    </div>
                    <div className="text-sm text-gray-500" style={{ fontFamily: 'Inter, ui-sans-serif, system-ui' }}>
                      Verified Client
                    </div>
                  </div>
                </div>
              </div>

              {/* Star Rating */}
              <div className="flex justify-center mt-4 space-x-1">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Trust Elements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ delay: 0.4 }}
          className="text-center mt-16"
        >
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray-500 mb-8" style={{ fontFamily: 'Inter, ui-sans-serif, system-ui' }}>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>95% Client Satisfaction</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>500+ Success Stories</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Trusted by Families</span>
            </div>
          </div>
          
          <p className="text-gray-600 mb-6" style={{ fontFamily: 'Inter, ui-sans-serif, system-ui' }}>
            Join hundreds of satisfied clients who have transformed their lives
          </p>
        </motion.div>
      </div>
    </section>
  )
}

export default Reviews

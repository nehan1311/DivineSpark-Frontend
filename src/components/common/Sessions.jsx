import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Button } from '../ui/Button'

const cards = [
  {
    title: 'Children Workshops',
    text: 'Interactive sessions to nurture mindfulness and positivity in children.',
    img: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?q=80&w=1200&auto=format&fit=crop'
  },
  {
    title: 'Meditation Sundays',
    text: 'Weekly guided meditation to restore inner peace and clarity.',
    img: 'https://images.unsplash.com/photo-1517832207067-4db24a2ae47c?q=80&w=1200&auto=format&fit=crop'
  },
  {
    title: 'Workshops in Pune/Thailand',
    text: 'Transformative healing workshops conducted across Pune and Thailand.',
    img: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=1200&auto=format&fit=crop'
  }
]

const Sessions = () => {
  return (
    <section id="sessions" className="py-20 md:py-28 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
          >
            <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-6 leading-tight" style={{ fontFamily: 'Inter, ui-sans-serif, system-ui' }}>
              Your Path to 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600"> Healing & Growth</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed" style={{ fontFamily: 'Inter, ui-sans-serif, system-ui' }}>
              Discover transformative healing experiences designed to nurture your mind, body, and spirit through gentle energy work.
            </p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 md:gap-10">
          {cards.map((card, idx) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
              className="group relative rounded-3xl border border-gray-200 bg-white shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:-translate-y-2"
            >
              <div className="relative h-56 w-full overflow-hidden">
                <div 
                  className="h-full w-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110" 
                  style={{ backgroundImage: `url(${card.img})` }} 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              
              <div className="p-8">
                <h3 className="text-xl font-medium text-gray-900 mb-3 leading-tight" style={{ fontFamily: 'Inter, ui-sans-serif, system-ui' }}>
                  {card.title}
                </h3>
                <p className="text-gray-600 leading-relaxed mb-6" style={{ fontFamily: 'Inter, ui-sans-serif, system-ui' }}>
                  {card.text}
                </p>
                
                <div className="flex items-center text-green-600 font-medium text-sm group-hover:text-green-700 transition-colors duration-300" style={{ fontFamily: 'Inter, ui-sans-serif, system-ui' }}>
                  <span>Learn More</span>
                  <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
              
              {/* Decorative element */}
              <div className="absolute top-4 right-4 w-12 h-12 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ delay: 0.4 }}
          className="text-center mt-16"
        >
          <p className="text-gray-600 mb-6" style={{ fontFamily: 'Inter, ui-sans-serif, system-ui' }}>
            Ready to begin your healing journey?
          </p>
          <Link to="/sessions">
            <Button 
              size="lg" 
              className="px-8 py-3 rounded-full text-base font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1" 
              style={{
                backgroundColor: '#059669', 
                color: '#FFFFFF', 
                border: 'none',
                fontFamily: 'Inter, ui-sans-serif, system-ui'
              }}
            >
              Explore All Sessions
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

export default Sessions



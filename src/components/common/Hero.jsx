import React from 'react'
import { motion } from 'framer-motion'
import { Button } from '../ui/Button'
import { Link } from 'react-router-dom'
import heroBg from '../../assets/homePage1.jpg'

const Hero = () => {
  return (
    <section
      id="hero"
      className="relative bg-no-repeat bg-cover bg-center min-h-screen w-full flex items-center justify-center px-6 md:px-12 before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/75 before:via-white/60 before:to-white/80"
      style={{ backgroundImage: `url(${heroBg})` }}
    >
      <div className="relative z-10 max-w-4xl mx-auto text-center pt-24 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-gray-900 mb-8 leading-[1.1] tracking-tight" style={{ fontFamily: 'Inter, ui-sans-serif, system-ui' }}>
            Feed the Soul with 
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 font-normal">
              Divine Healing
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed font-light" style={{ fontFamily: 'Inter, ui-sans-serif, system-ui' }}>
            Energy-based healing to bring peace, health, and happiness into your life.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link to="/sessions">
              <Button 
                size="lg" 
                className="min-w-[220px] h-14 rounded-full text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1" 
                style={{
                  backgroundColor: '#059669', 
                  color: '#FFFFFF', 
                  border: 'none',
                  fontFamily: 'Inter, ui-sans-serif, system-ui'
                }} 
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#047857'
                  e.target.style.transform = 'translateY(-2px)'
                }} 
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#059669'
                  e.target.style.transform = 'translateY(0)'
                }}
              >
                Start Your Healing Journey
              </Button>
            </Link>
            
            <Link to="/about">
              <Button 
                variant="outline" 
                size="lg" 
                className="min-w-[180px] h-14 rounded-full text-lg font-medium border-2 border-gray-300 text-gray-700 hover:border-green-500 hover:text-green-700 transition-all duration-300" 
                style={{ fontFamily: 'Inter, ui-sans-serif, system-ui' }}
              >
                Learn More
              </Button>
            </Link>
          </div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray-500"
            style={{ fontFamily: 'Inter, ui-sans-serif, system-ui' }}
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>500+ Lives Transformed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>10+ Years Experience</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Non-Touch Therapy</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span>Drug-Free Healing</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default Hero



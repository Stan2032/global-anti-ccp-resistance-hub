import React from 'react'
import { motion } from 'framer-motion'
import { Shield, Globe, Users, FileText } from 'lucide-react'

const LoadingScreen = () => {
  const icons = [Shield, Globe, Users, FileText]

  return (
    <div className="min-h-screen bg-[#0a0e14] flex items-center justify-center">
      <div className="text-center">
        {/* Logo and Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <div className="flex items-center justify-center mb-4">
            <Shield className="w-16 h-16 text-[#22d3ee] mr-4" />
            <div>
              <h1 className="text-4xl font-bold gradient-text">
                Global Resistance Hub
              </h1>
              <p className="text-slate-400 text-lg">
                Coordinating worldwide resistance against authoritarian oppression
              </p>
            </div>
          </div>
        </motion.div>

        {/* Animated Icons */}
        <div className="flex justify-center space-x-8 mb-8">
          {icons.map((Icon, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                delay: index * 0.2,
                duration: 0.5,
                type: "spring",
                stiffness: 100
              }}
              className="p-4 bg-[#111820] rounded-full"
            >
              <Icon className="w-8 h-8 text-[#22d3ee]" />
            </motion.div>
          ))}
        </div>

        {/* Loading Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="w-64 mx-auto"
        >
          <div className="bg-[#111820] rounded-full h-2 mb-4">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ delay: 1, duration: 2, ease: "easeInOut" }}
              className="bg-[#4afa82] h-2"
            />
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.5 }}
            className="text-slate-400 text-sm"
          >
            Initializing secure connections...
          </motion.p>
        </motion.div>

        {/* Security Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.5 }}
          className="mt-8 p-4 bg-[#111820] border border-[#1c2a35] max-w-md mx-auto"
        >
          <div className="flex items-center justify-center mb-2">
            <Shield className="w-5 h-5 text-green-400 mr-2" />
            <span className="text-green-400 font-medium">Security Check</span>
          </div>
          <p className="text-slate-300 text-sm">
            Verifying connection security and initializing encrypted channels...
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default LoadingScreen

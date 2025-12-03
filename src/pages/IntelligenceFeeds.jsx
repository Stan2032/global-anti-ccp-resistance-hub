import React from 'react'
import { motion } from 'framer-motion'
import LiveIntelligenceFeed from '../components/intelligence/LiveIntelligenceFeed'

const IntelligenceFeeds = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div>
        <h1 className="text-3xl font-bold gradient-text">Intelligence Feeds</h1>
        <p className="text-slate-400 mt-2">
          Real-time monitoring of leaked documents, surveillance activities, and resistance intelligence
        </p>
      </div>
      
      <LiveIntelligenceFeed />
    </motion.div>
  )
}

export default IntelligenceFeeds

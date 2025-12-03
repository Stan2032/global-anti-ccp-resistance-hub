import React from 'react'
import { FileText } from 'lucide-react'

const IntelligenceFeeds = () => {
  return (
    <div className="space-y-8">
      <div className="flex items-center">
        <FileText className="w-8 h-8 text-green-400 mr-4" />
        <div>
          <h1 className="text-3xl font-bold gradient-text">Intelligence Feeds</h1>
          <p className="text-slate-400 mt-2">Real-time access to leaked documents and underground intelligence</p>
        </div>
      </div>
      <div className="bg-slate-800 rounded-lg border border-slate-700 p-8 text-center">
        <FileText className="w-16 h-16 text-slate-600 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-white mb-2">Coming Soon</h2>
        <p className="text-slate-400">Secure access to leaked CCP documents and real-time intelligence feeds.</p>
      </div>
    </div>
  )
}

export default IntelligenceFeeds

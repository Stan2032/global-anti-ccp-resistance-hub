import React from 'react'
import { Heart } from 'lucide-react'

const TibetanFreedom = () => {
  return (
    <div className="space-y-8">
      <div className="flex items-center">
        <Heart className="w-8 h-8 text-red-400 mr-4" />
        <div>
          <h1 className="text-3xl font-bold gradient-text">TibetanFreedom</h1>
          <p className="text-slate-400 mt-2">Campaign details coming soon...</p>
        </div>
      </div>
      <div className="bg-slate-800 rounded-lg border border-slate-700 p-8 text-center">
        <Heart className="w-16 h-16 text-slate-600 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-white mb-2">Coming Soon</h2>
        <p className="text-slate-400">This campaign page is under development.</p>
      </div>
    </div>
  )
}

export default TibetanFreedom

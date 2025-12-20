import React from 'react'
import { Users } from 'lucide-react'

const ResistanceDirectory = () => {
  return (
    <div className="space-y-8">
      <div className="flex items-center">
        <Users className="w-8 h-8 text-blue-400 mr-4" />
        <div>
          <h1 className="text-3xl font-bold gradient-text">Resistance Directory</h1>
          <p className="text-slate-400 mt-2">
            Global database of resistance organizations fighting authoritarian oppression
          </p>
        </div>
      </div>
      
      <div className="bg-slate-800 rounded-lg border border-slate-700 p-8 text-center">
        <Users className="w-16 h-16 text-slate-600 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-white mb-2">Coming Soon</h2>
        <p className="text-slate-400">
          This comprehensive directory will feature detailed profiles of resistance organizations worldwide.
        </p>
      </div>
    </div>
  )
}

export default ResistanceDirectory

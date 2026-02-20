#!/bin/bash

# Create IntelligenceFeeds
cat > src/pages/IntelligenceFeeds.jsx << 'COMPONENT'
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
COMPONENT

# Create other pages with similar structure
for page in CampaignHubs CommunitySupport SecureComms EducationalResources SecurityCenter; do
  cat > src/pages/${page}.jsx << COMPONENT
import React from 'react'
import { Shield } from 'lucide-react'

const ${page} = () => {
  return (
    <div className="space-y-8">
      <div className="flex items-center">
        <Shield className="w-8 h-8 text-blue-400 mr-4" />
        <div>
          <h1 className="text-3xl font-bold gradient-text">${page}</h1>
          <p className="text-slate-400 mt-2">Coming soon...</p>
        </div>
      </div>
      <div className="bg-slate-800 rounded-lg border border-slate-700 p-8 text-center">
        <Shield className="w-16 h-16 text-slate-600 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-white mb-2">Coming Soon</h2>
        <p className="text-slate-400">This feature is under development.</p>
      </div>
    </div>
  )
}

export default ${page}
COMPONENT
done

# Create campaign pages
for campaign in FreeJimmyLai LondonEmbassy HongKongSupport UyghurRights TibetanFreedom; do
  cat > src/pages/campaigns/${campaign}.jsx << COMPONENT
import React from 'react'
import { Heart } from 'lucide-react'

const ${campaign} = () => {
  return (
    <div className="space-y-8">
      <div className="flex items-center">
        <Heart className="w-8 h-8 text-red-400 mr-4" />
        <div>
          <h1 className="text-3xl font-bold gradient-text">${campaign}</h1>
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

export default ${campaign}
COMPONENT
done

echo "All placeholder pages created!"

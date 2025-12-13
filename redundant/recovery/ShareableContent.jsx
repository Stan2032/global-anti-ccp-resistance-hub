import React, { useState, useRef } from 'react';
import { 
  Share2, Download, Copy, Twitter, Facebook, MessageCircle, 
  Instagram, Linkedin, RefreshCw, Zap, TrendingUp, Users,
  Eye, AlertTriangle, Shield, CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const ShareableContent = ({ userStats = null }) => {
  const [selectedTemplate, setSelectedTemplate] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedText, setCopiedText] = useState('');
  const canvasRef = useRef(null);

  const shockingFacts = [
    {
      title: "Your Digital Footprint",
      stat: userStats?.exposureCount || "2,847",
      description: "times CCP propaganda has analyzed your social media activity this year",
      color: "bg-red-500",
      icon: Eye,
      hashtags: "#CCPPropaganda #DigitalSurveillance #WakeUp"
    },
    {
      title: "Data Value",
      stat: userStats?.dataValue || "$47",
      description: "is what your personal data is worth to CCP propagandists",
      color: "bg-orange-500",
      icon: TrendingUp,
      hashtags: "#YourDataHasValue #CCPInfluence #DigitalRights"
    },
    {
      title: "Global Scale",
      stat: "1.4 billion",
      description: "fake accounts removed by Meta in 2023 - mostly CCP operations",
      color: "bg-purple-500",
      icon: Users,
      hashtags: "#FakeAccounts #CCPPropaganda #SocialMediaManipulation"
    },
    {
      title: "Manipulation Risk",
      stat: userStats?.riskScore || "73%",
      description: "chance you've been influenced by CCP propaganda without knowing it",
      color: "bg-yellow-500",
      icon: AlertTriangle,
      hashtags: "#PropagandaAwareness #CCPInfluence #MediaLiteracy"
    },
    {
      title: "Protection Level",
      stat: "12x",
      description: "more resistant to propaganda after completing this training",
      color: "bg-green-500",
      icon: Shield,
      hashtags: "#PropagandaResistance #MediaLiteracy #DigitalDefense"
    }
  ];

  const viralTemplates = [
    {
      type: "Shocking Statistic",
      template: "🚨 WAKE UP CALL: {stat} {description}\n\nThe CCP's propaganda machine is MASSIVE and it's targeting YOU.\n\nLearn to protect yourself: {url}\n\n{hashtags}",
      style: "urgent"
    },
    {
      type: "Personal Impact",
      template: "I just discovered that {stat} {description} 😱\n\nThis opened my eyes to how CCP propaganda works. Everyone needs to see this.\n\nCheck your own exposure: {url}\n\n{hashtags}",
      style: "personal"
    },
    {
      type: "Call to Action",
      template: "🔥 THREAD: Why everyone needs to understand CCP propaganda tactics\n\n{stat} {description}\n\nThis is just the beginning. Learn the full scope: {url}\n\nRT to spread awareness 🧵\n\n{hashtags}",
      style: "thread"
    },
    {
      type: "Educational",
      template: "📚 Did you know? {stat} {description}\n\nUnderstanding propaganda techniques is crucial for digital literacy in 2024.\n\nFree interactive training: {url}\n\n{hashtags} #Education",
      style: "educational"
    },
    {
      type: "Challenge",
      template: "🎯 CHALLENGE: Can you spot CCP propaganda?\n\nMost people can't. {stat} {description}\n\nTest yourself and challenge friends: {url}\n\nWho's brave enough to take this? 👇\n\n{hashtags}",
      style: "challenge"
    }
  ];

  const generateShareableText = (fact, template) => {
    const url = window.location.origin;
    return template.template
      .replace('{stat}', fact.stat)
      .replace('{description}', fact.description)
      .replace('{url}', url)
      .replace('{hashtags}', fact.hashtags);
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      setTimeout(() => setCopiedText(''), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const shareToSocial = (platform, text) => {
    const encodedText = encodeURIComponent(text);
    const url = window.location.origin;
    const encodedUrl = encodeURIComponent(url);
    
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodedText}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&summary=${encodedText}`,
      whatsapp: `https://wa.me/?text=${encodedText}`,
      telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`
    };
    
    window.open(urls[platform], '_blank', 'width=600,height=400');
  };

  const generateImage = async (fact, template) => {
    setIsGenerating(true);
    
    // Create a canvas for the shareable image
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = 1200;
    canvas.height = 630; // Optimal for social media
    
    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#1e40af');
    gradient.addColorStop(1, '#7c3aed');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add text
    ctx.fillStyle = 'white';
    ctx.font = 'bold 72px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(fact.stat, canvas.width / 2, 200);
    
    ctx.font = '36px Arial';
    ctx.fillText(fact.description, canvas.width / 2, 280);
    
    ctx.font = 'bold 24px Arial';
    ctx.fillText('Learn more at: ' + window.location.origin, canvas.width / 2, 500);
    
    // Convert to blob and download
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ccp-propaganda-fact-${Date.now()}.png`;
      a.click();
      URL.revokeObjectURL(url);
      setIsGenerating(false);
    });
  };

  const currentFact = shockingFacts[selectedTemplate % shockingFacts.length];
  const currentTemplate = viralTemplates[Math.floor(selectedTemplate / shockingFacts.length) % viralTemplates.length];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      
      {/* Header */}
      <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Share2 className="h-8 w-8 text-primary mr-3" />
            <CardTitle className="text-3xl font-bold">Viral Awareness Generator</CardTitle>
          </div>
          <CardDescription className="text-lg">
            Create shareable content to spread awareness about CCP propaganda tactics
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Template Selector */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {shockingFacts.map((fact, factIndex) => (
          viralTemplates.map((template, templateIndex) => {
            const index = factIndex * viralTemplates.length + templateIndex;
            const isSelected = selectedTemplate === index;
            
            return (
              <Card 
                key={index}
                className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
                  isSelected ? 'ring-2 ring-primary shadow-lg' : 'hover:shadow-md'
                }`}
                onClick={() => setSelectedTemplate(index)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Badge className={fact.color + ' text-white'}>
                      <fact.icon className="h-3 w-3 mr-1" />
                      {fact.title}
                    </Badge>
                    <Badge variant="outline">{template.type}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary mb-1">{fact.stat}</div>
                  <div className="text-sm text-muted-foreground mb-3">{fact.description}</div>
                  <div className="text-xs text-blue-600">{template.style} style</div>
                </CardContent>
              </Card>
            );
          })
        ))}
      </div>

      {/* Preview and Share */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Text Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageCircle className="h-5 w-5 mr-2" />
              Text Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-muted p-4 rounded-lg mb-4 min-h-[200px]">
              <pre className="whitespace-pre-wrap text-sm font-medium">
                {generateShareableText(currentFact, currentTemplate)}
              </pre>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => copyToClipboard(generateShareableText(currentFact, currentTemplate))}
                variant="outline"
                size="sm"
              >
                <Copy className="h-4 w-4 mr-2" />
                {copiedText === generateShareableText(currentFact, currentTemplate) ? 'Copied!' : 'Copy Text'}
              </Button>
              
              <Button
                onClick={() => shareToSocial('twitter', generateShareableText(currentFact, currentTemplate))}
                variant="outline"
                size="sm"
                className="bg-blue-500 text-white hover:bg-blue-600"
              >
                <Twitter className="h-4 w-4 mr-2" />
                Twitter
              </Button>
              
              <Button
                onClick={() => shareToSocial('facebook', generateShareableText(currentFact, currentTemplate))}
                variant="outline"
                size="sm"
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                <Facebook className="h-4 w-4 mr-2" />
                Facebook
              </Button>
              
              <Button
                onClick={() => shareToSocial('linkedin', generateShareableText(currentFact, currentTemplate))}
                variant="outline"
                size="sm"
                className="bg-blue-700 text-white hover:bg-blue-800"
              >
                <Linkedin className="h-4 w-4 mr-2" />
                LinkedIn
              </Button>
              
              <Button
                onClick={() => shareToSocial('whatsapp', generateShareableText(currentFact, currentTemplate))}
                variant="outline"
                size="sm"
                className="bg-green-500 text-white hover:bg-green-600"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                WhatsApp
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Image Generator */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Download className="h-5 w-5 mr-2" />
              Image Generator
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-8 rounded-lg text-white text-center mb-4">
              <div className="text-4xl font-bold mb-2">{currentFact.stat}</div>
              <div className="text-lg mb-4">{currentFact.description}</div>
              <div className="text-sm opacity-80">Learn more at: {window.location.origin}</div>
            </div>
            
            <Button
              onClick={() => generateImage(currentFact, currentTemplate)}
              disabled={isGenerating}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Download Image
                </>
              )}
            </Button>
            
            <canvas ref={canvasRef} style={{ display: 'none' }} />
          </CardContent>
        </Card>
      </div>

      {/* Viral Mechanics */}
      <Card className="border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
        <CardHeader>
          <CardTitle className="flex items-center text-green-700 dark:text-green-300">
            <Zap className="h-6 w-6 mr-2" />
            Maximize Your Impact
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">3x</div>
              <div className="text-sm text-muted-foreground">More engagement with personal stories</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">10x</div>
              <div className="text-sm text-muted-foreground">More shares with shocking statistics</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">50x</div>
              <div className="text-sm text-muted-foreground">More reach with visual content</div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-white/50 dark:bg-black/20 rounded-lg">
            <h4 className="font-semibold mb-2">💡 Pro Tips for Maximum Viral Impact:</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Post during peak hours (7-9 AM, 12-1 PM, 7-9 PM)</li>
              <li>• Use personal language ("I just discovered...")</li>
              <li>• Include a call to action ("RT to spread awareness")</li>
              <li>• Tag relevant accounts and use trending hashtags</li>
              <li>• Follow up with additional facts in replies</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ShareableContent;


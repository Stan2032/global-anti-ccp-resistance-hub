import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Eye, Users, Calendar, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Sample bot account data based on real Spamouflage characteristics
const accountData = [
  {
    id: 1,
    username: "sarah_chen_2023",
    displayName: "Sarah Chen",
    profileImage: "/api/placeholder/100/100",
    bio: "Love peace and harmony 🌸 Support China's development 🇨🇳",
    followers: 47,
    following: 1203,
    joinDate: "March 2023",
    tweets: 2847,
    isBot: true,
    redFlags: [
      "AI-generated profile picture with blurred edges",
      "Generic bio with nationalist slogans",
      "Very high tweet count for account age",
      "Low follower to following ratio",
      "Recently created account with high activity"
    ],
    recentTweets: [
      "Western media always spread lies about China! Truth will prevail! 🇨🇳",
      "Xinjiang is peaceful and prosperous. Don't believe fake news!",
      "China's COVID response was the best in the world. Facts speak louder than propaganda."
    ]
  },
  {
    id: 2,
    username: "mikejohnson_writer",
    displayName: "Mike Johnson",
    bio: "Freelance journalist covering tech and politics. Coffee enthusiast ☕",
    followers: 1247,
    following: 892,
    joinDate: "August 2019",
    tweets: 3421,
    isBot: false,
    redFlags: [],
    recentTweets: [
      "Just finished a great article on renewable energy trends. Link in bio!",
      "Anyone else think this weather is crazy? Climate change is real folks.",
      "Coffee shop recommendation: Blue Bottle in downtown. Amazing espresso!"
    ]
  },
  {
    id: 3,
    username: "freedom_truth_2024",
    displayName: "Truth Seeker",
    bio: "Exposing lies and spreading truth! 🔥 China strong! 💪",
    followers: 23,
    following: 2156,
    joinDate: "January 2024",
    tweets: 4892,
    isBot: true,
    redFlags: [
      "Username follows bot naming pattern",
      "Extremely high tweet count for new account",
      "Very low followers despite high activity",
      "Bio contains generic nationalist phrases",
      "Following far more accounts than followers"
    ],
    recentTweets: [
      "US military brought COVID to Wuhan! Wake up people!",
      "Hong Kong rioters are terrorists funded by CIA!",
      "Taiwan belongs to China! One China policy forever!"
    ]
  },
  {
    id: 4,
    username: "jenny_martinez",
    displayName: "Jenny Martinez",
    bio: "Mom of two, teacher, love hiking and reading 📚🥾",
    followers: 342,
    following: 456,
    joinDate: "May 2018",
    tweets: 1876,
    isBot: false,
    redFlags: [],
    recentTweets: [
      "Kids had a great day at the park today! Sometimes simple pleasures are the best.",
      "Finished reading 'Educated' by Tara Westover. Highly recommend!",
      "Planning our summer hiking trip. Any recommendations for family-friendly trails?"
    ]
  }
];

const SpotTheBot = () => {
  const [currentAccount, setCurrentAccount] = useState(0);
  const [score, setScore] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);
  const [showHints, setShowHints] = useState(false);

  const handleAnswer = (isBot) => {
    const correct = isBot === accountData[currentAccount].isBot;
    const newAnswer = {
      accountId: accountData[currentAccount].id,
      userAnswer: isBot,
      correct: correct,
      account: accountData[currentAccount]
    };
    
    setUserAnswers([...userAnswers, newAnswer]);
    
    if (correct) {
      setScore(score + 1);
    }
    
    setShowResult(true);
    
    setTimeout(() => {
      if (currentAccount < accountData.length - 1) {
        setCurrentAccount(currentAccount + 1);
        setShowResult(false);
        setShowHints(false);
      } else {
        setGameComplete(true);
      }
    }, 3000);
  };

  const resetGame = () => {
    setCurrentAccount(0);
    setScore(0);
    setGameComplete(false);
    setShowResult(false);
    setUserAnswers([]);
    setShowHints(false);
  };

  const getScoreMessage = () => {
    const percentage = (score / accountData.length) * 100;
    if (percentage >= 80) return "Excellent! You're a bot detection expert!";
    if (percentage >= 60) return "Good job! You're getting the hang of it.";
    if (percentage >= 40) return "Not bad, but there's room for improvement.";
    return "Keep practicing! Bot detection takes time to master.";
  };

  if (gameComplete) {
    return (
      <div className="bg-card p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold mb-4">Game Complete!</h3>
          <div className="text-4xl font-bold text-primary mb-2">
            {score}/{accountData.length}
          </div>
          <p className="text-lg mb-4">{getScoreMessage()}</p>
        </div>
        
        <div className="space-y-4 mb-6">
          <h4 className="text-xl font-semibold">Review Your Answers:</h4>
          {userAnswers.map((answer, index) => (
            <div key={index} className={`p-4 rounded-lg border ${answer.correct ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold">@{answer.account.username}</span>
                {answer.correct ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600" />
                )}
              </div>
              <p className="text-sm">
                You said: {answer.userAnswer ? 'Bot' : 'Human'} | 
                Correct answer: {answer.account.isBot ? 'Bot' : 'Human'}
              </p>
              {answer.account.isBot && answer.account.redFlags.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm font-medium">Red flags:</p>
                  <ul className="text-xs list-disc list-inside">
                    {answer.account.redFlags.map((flag, i) => (
                      <li key={i}>{flag}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="text-center">
          <Button onClick={resetGame} size="lg">
            Play Again
          </Button>
        </div>
      </div>
    );
  }

  const account = accountData[currentAccount];

  return (
    <div className="bg-card p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold">Spot the Bot Challenge</h3>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">
              Account {currentAccount + 1} of {accountData.length}
            </div>
            <div className="text-lg font-semibold">
              Score: {score}/{currentAccount + (showResult ? 1 : 0)}
            </div>
          </div>
        </div>
        <p className="text-muted-foreground">
          Analyze this Twitter/X profile and determine if it's a bot account used for propaganda.
        </p>
      </div>

      {showResult && (
        <div className={`mb-6 p-4 rounded-lg ${account.isBot === (userAnswers[userAnswers.length - 1]?.userAnswer) ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
          <div className="flex items-center mb-2">
            {account.isBot === (userAnswers[userAnswers.length - 1]?.userAnswer) ? (
              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
            ) : (
              <XCircle className="h-5 w-5 text-red-600 mr-2" />
            )}
            <span className="font-semibold">
              {account.isBot === (userAnswers[userAnswers.length - 1]?.userAnswer) ? 'Correct!' : 'Incorrect!'}
            </span>
          </div>
          <p>This account is {account.isBot ? 'a bot' : 'human'}.</p>
          {account.isBot && account.redFlags.length > 0 && (
            <div className="mt-2">
              <p className="font-medium">Red flags you should have noticed:</p>
              <ul className="list-disc list-inside text-sm">
                {account.redFlags.map((flag, index) => (
                  <li key={index}>{flag}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Profile Card */}
        <div className="border rounded-lg p-4">
          <div className="flex items-start space-x-3 mb-4">
            <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
              <Users className="h-6 w-6 text-gray-600" />
            </div>
            <div>
              <h4 className="font-bold">{account.displayName}</h4>
              <p className="text-muted-foreground text-sm">@{account.username}</p>
            </div>
          </div>
          <p className="text-sm mb-4">{account.bio}</p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">{account.followers}</span> Followers
            </div>
            <div>
              <span className="font-medium">{account.following}</span> Following
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              Joined {account.joinDate}
            </div>
            <div>
              <span className="font-medium">{account.tweets}</span> Tweets
            </div>
          </div>
        </div>

        {/* Recent Tweets */}
        <div className="border rounded-lg p-4">
          <h4 className="font-bold mb-3">Recent Tweets</h4>
          <div className="space-y-3">
            {account.recentTweets.map((tweet, index) => (
              <div key={index} className="text-sm p-3 bg-muted rounded">
                {tweet}
              </div>
            ))}
          </div>
        </div>
      </div>

      {!showResult && (
        <div className="space-y-4">
          <div className="flex justify-center space-x-4">
            <Button 
              onClick={() => handleAnswer(false)}
              variant="outline"
              size="lg"
              className="min-w-32"
            >
              Human Account
            </Button>
            <Button 
              onClick={() => handleAnswer(true)}
              variant="default"
              size="lg"
              className="min-w-32"
            >
              Bot Account
            </Button>
          </div>
          
          <div className="text-center">
            <Button 
              onClick={() => setShowHints(!showHints)}
              variant="ghost"
              size="sm"
            >
              <Eye className="h-4 w-4 mr-2" />
              {showHints ? 'Hide' : 'Show'} Hints
            </Button>
          </div>

          {showHints && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2 mt-0.5" />
                <div>
                  <h5 className="font-semibold text-yellow-800 mb-2">Look for these red flags:</h5>
                  <ul className="text-sm text-yellow-700 list-disc list-inside space-y-1">
                    <li>AI-generated profile pictures (blurred edges, perfect symmetry)</li>
                    <li>Generic usernames with numbers or underscores</li>
                    <li>Very high tweet count for account age</li>
                    <li>Low follower to following ratio</li>
                    <li>Nationalist slogans or generic political content</li>
                    <li>Recently created accounts with suspicious activity patterns</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SpotTheBot;


import React, { useState } from 'react';
import { ArrowRight, CheckCircle, XCircle, Clock, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Sample narrative evolution data based on real CCP propaganda campaigns
const narrativeCases = [
  {
    id: 1,
    title: "COVID-19 Origins Narrative Shift",
    description: "Track how the CCP's narrative about COVID-19 origins evolved from acknowledgment to deflection.",
    timeline: [
      {
        date: "December 2019",
        source: "Chinese Health Authorities",
        narrative: "Unknown pneumonia cases reported in Wuhan",
        stage: "initial",
        correct: true
      },
      {
        date: "January 2020",
        source: "WHO/Chinese Officials",
        narrative: "Novel coronavirus identified, likely animal origin",
        stage: "acknowledgment",
        correct: true
      },
      {
        date: "February 2020",
        source: "Chinese State Media",
        narrative: "Virus contained, China's response exemplary",
        stage: "defensive",
        correct: false
      },
      {
        date: "March 2020",
        source: "Chinese Foreign Ministry",
        narrative: "US military might have brought virus to Wuhan",
        stage: "deflection",
        correct: false
      },
      {
        date: "April 2020",
        source: "Chinese Propaganda Networks",
        narrative: "Virus originated in US military lab, spread globally",
        stage: "offensive",
        correct: false
      }
    ],
    correctOrder: [0, 1, 2, 3, 4],
    explanation: "This case shows the classic progression from initial acknowledgment to active disinformation. The CCP shifted from accepting the virus originated in China to promoting conspiracy theories blaming the US military."
  },
  {
    id: 2,
    title: "Xinjiang 'Vocational Training' Narrative",
    description: "Analyze how the CCP reframed detention camps as educational facilities.",
    timeline: [
      {
        date: "2017",
        source: "International Reports",
        narrative: "Mass detention facilities identified in Xinjiang",
        stage: "exposure",
        correct: true
      },
      {
        date: "2018",
        source: "Chinese Officials",
        narrative: "No such facilities exist, reports are fabricated",
        stage: "denial",
        correct: false
      },
      {
        date: "2019",
        source: "Chinese Government",
        narrative: "Facilities are vocational education centers",
        stage: "reframing",
        correct: false
      },
      {
        date: "2020",
        source: "Chinese State Media",
        narrative: "Graduates thankful for skills training and deradicalization",
        stage: "justification",
        correct: false
      },
      {
        date: "2021",
        source: "Chinese Propaganda",
        narrative: "Western criticism is anti-China bias and racism",
        stage: "deflection",
        correct: false
      }
    ],
    correctOrder: [0, 1, 2, 3, 4],
    explanation: "This demonstrates how the CCP moved from outright denial to reframing detention as education, then attacking critics as racist. The narrative shifted to make oppression appear beneficial."
  }
];

const NarrativeDetective = () => {
  const [currentCase, setCurrentCase] = useState(0);
  const [userOrder, setUserOrder] = useState([]);
  const [draggedItem, setDraggedItem] = useState(null);
  const [gameComplete, setGameComplete] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const caseData = narrativeCases[currentCase];

  const handleDragStart = (e, index) => {
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    if (draggedItem === null) return;

    const newOrder = [...userOrder];
    const draggedContent = newOrder[draggedItem];
    
    // Remove dragged item
    newOrder.splice(draggedItem, 1);
    
    // Insert at new position
    newOrder.splice(dropIndex, 0, draggedContent);
    
    setUserOrder(newOrder);
    setDraggedItem(null);
  };

  const initializeOrder = () => {
    // Shuffle the timeline items
    const shuffled = [...caseData.timeline].sort(() => Math.random() - 0.5);
    setUserOrder(shuffled);
  };

  const checkAnswer = () => {
    const correctOrder = caseData.correctOrder.map(i => caseData.timeline[i]);
    const isCorrect = userOrder.every((item, index) => 
      item.date === correctOrder[index].date && 
      item.narrative === correctOrder[index].narrative
    );
    
    if (isCorrect) {
      setScore(score + 1);
    }
    
    setShowResult(true);
  };

  const nextCase = () => {
    if (currentCase < narrativeCases.length - 1) {
      setCurrentCase(currentCase + 1);
      setShowResult(false);
      setUserOrder([]);
      initializeOrder();
    } else {
      setGameComplete(true);
    }
  };

  const resetGame = () => {
    setCurrentCase(0);
    setScore(0);
    setGameComplete(false);
    setShowResult(false);
    setUserOrder([]);
    initializeOrder();
  };

  React.useEffect(() => {
    initializeOrder();
  }, [currentCase]);

  if (gameComplete) {
    return (
      <div className="bg-card p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold mb-4">Investigation Complete!</h3>
          <div className="text-4xl font-bold text-primary mb-2">
            {score}/{narrativeCases.length}
          </div>
          <p className="text-lg mb-4">
            {score === narrativeCases.length 
              ? "Excellent detective work! You understand how propaganda narratives evolve."
              : score >= narrativeCases.length / 2
              ? "Good job! You're getting better at tracking narrative manipulation."
              : "Keep practicing! Narrative analysis takes time to master."
            }
          </p>
        </div>
        
        <div className="text-center">
          <Button onClick={resetGame} size="lg">
            Investigate Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card p-8 rounded-lg shadow-lg max-w-6xl mx-auto">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold">Narrative Detective</h3>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">
              Case {currentCase + 1} of {narrativeCases.length}
            </div>
            <div className="text-lg font-semibold">
              Score: {score}/{currentCase + (showResult ? 1 : 0)}
            </div>
          </div>
        </div>
        <div className="bg-muted p-4 rounded-lg mb-6">
          <h4 className="font-bold text-lg mb-2">{caseData.title}</h4>
          <p className="text-muted-foreground">{caseData.description}</p>
        </div>
      </div>

      {showResult ? (
        <div className="space-y-6">
          <div className={`p-4 rounded-lg border ${
            userOrder.every((item, index) => 
              item.date === caseData.timeline[index].date && 
              item.narrative === caseData.timeline[index].narrative
            ) ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-center mb-2">
              {userOrder.every((item, index) => 
                item.date === caseData.timeline[index].date && 
                item.narrative === caseData.timeline[index].narrative
              ) ? (
                <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600 mr-2" />
              )}
              <span className="font-semibold">
                {userOrder.every((item, index) => 
                  item.date === caseData.timeline[index].date && 
                  item.narrative === caseData.timeline[index].narrative
                ) ? 'Correct Timeline!' : 'Incorrect Order'}
              </span>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h5 className="font-semibold mb-2">Analysis:</h5>
            <p className="text-sm">{caseData.explanation}</p>
          </div>

          <div className="space-y-3">
            <h5 className="font-semibold">Correct Timeline:</h5>
            {caseData.timeline.map((item, index) => (
              <div key={index} className="flex items-center space-x-4 p-3 bg-background rounded border">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium text-sm">{item.date}</span>
                </div>
                <div className="flex-1">
                  <div className="text-sm text-muted-foreground">{item.source}</div>
                  <div className="text-sm">{item.narrative}</div>
                </div>
                <div className={`px-2 py-1 rounded text-xs ${
                  item.correct ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {item.correct ? 'Factual' : 'Propaganda'}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Button onClick={nextCase} size="lg">
              {currentCase < narrativeCases.length - 1 ? 'Next Case' : 'Complete Investigation'}
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start">
              <Target className="h-5 w-5 text-yellow-600 mr-2 mt-0.5" />
              <div>
                <h5 className="font-semibold text-yellow-800 mb-2">Your Mission:</h5>
                <p className="text-sm text-yellow-700">
                  Arrange the timeline events in chronological order to trace how the propaganda narrative evolved. 
                  Drag and drop the items to create the correct sequence.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h5 className="font-semibold">Timeline Events (drag to reorder):</h5>
            {userOrder.map((item, index) => (
              <div
                key={`${item.date}-${index}`}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
                className="flex items-center space-x-4 p-4 bg-background rounded border cursor-move hover:bg-muted transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{item.date}</span>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <div className="text-sm text-muted-foreground mb-1">{item.source}</div>
                  <div className="text-sm">{item.narrative}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Button onClick={checkAnswer} size="lg">
              Submit Timeline
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NarrativeDetective;


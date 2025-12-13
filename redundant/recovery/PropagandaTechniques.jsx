import React, { useState } from 'react';
import { CheckCircle, XCircle, Lightbulb, Target, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Propaganda techniques with real CCP examples
const propagandaTechniques = [
  {
    id: 1,
    name: "Whataboutism",
    definition: "Deflecting criticism by pointing to problems elsewhere instead of addressing the original issue.",
    example: "When criticized for human rights violations in Xinjiang, Chinese officials respond: 'What about police brutality in the United States? What about indigenous rights in Canada?'",
    category: "Deflection",
    difficulty: "Easy"
  },
  {
    id: 2,
    name: "False Equivalence",
    definition: "Presenting two unequal things as if they are equivalent to mislead the audience.",
    example: "Chinese state media claims: 'Both China and the US have different governance systems, both have their merits' - equating authoritarian rule with democracy.",
    category: "Logical Fallacy",
    difficulty: "Medium"
  },
  {
    id: 3,
    name: "Appeal to Nationalism",
    definition: "Using patriotic feelings to justify actions or silence criticism.",
    example: "'Criticizing China's COVID response is anti-China bias. True patriots support their country's efforts to protect public health.'",
    category: "Emotional Appeal",
    difficulty: "Easy"
  },
  {
    id: 4,
    name: "Strawman Argument",
    definition: "Misrepresenting someone's argument to make it easier to attack.",
    example: "When faced with criticism about press freedom, Chinese officials claim: 'Western countries want chaos and disorder in China through fake news.'",
    category: "Logical Fallacy",
    difficulty: "Medium"
  },
  {
    id: 5,
    name: "Bandwagon Appeal",
    definition: "Claiming something is right because many people believe it or do it.",
    example: "'More and more countries are supporting China's Belt and Road Initiative, showing the world recognizes China's positive contribution.'",
    category: "Social Pressure",
    difficulty: "Easy"
  },
  {
    id: 6,
    name: "Ad Hominem Attack",
    definition: "Attacking the person making an argument rather than addressing the argument itself.",
    example: "Instead of addressing human rights concerns, Chinese officials call critics 'anti-China forces' or 'separatists funded by foreign powers.'",
    category: "Personal Attack",
    difficulty: "Medium"
  },
  {
    id: 7,
    name: "False Dilemma",
    definition: "Presenting only two options when more exist, forcing a choice between extremes.",
    example: "'You either support China's development and prosperity, or you support chaos and poverty. There is no middle ground.'",
    category: "Logical Fallacy",
    difficulty: "Hard"
  },
  {
    id: 8,
    name: "Appeal to Authority",
    definition: "Using the opinion of an authority figure to support an argument, even when irrelevant.",
    example: "'Even Western scholars acknowledge China's economic miracle. Professor X from Harvard said China's growth model is impressive.'",
    category: "False Authority",
    difficulty: "Medium"
  },
  {
    id: 9,
    name: "Gaslighting",
    definition: "Making someone question their own perception of reality by denying obvious facts.",
    example: "Despite satellite evidence of detention facilities in Xinjiang, Chinese officials claim: 'These are vocational training centers. Your eyes are deceiving you.'",
    category: "Psychological Manipulation",
    difficulty: "Hard"
  },
  {
    id: 10,
    name: "Virtue Signaling",
    definition: "Making statements to demonstrate moral superiority without meaningful action.",
    example: "'China has always been committed to peace and development, unlike certain countries that wage wars around the world.'",
    category: "Moral Posturing",
    difficulty: "Medium"
  }
];

const multipleChoiceQuestions = [
  {
    id: 1,
    scenario: "A Chinese diplomat responds to criticism about Hong Kong by saying: 'What about the riots in France? What about police violence in the US? Why don't you criticize them instead?'",
    correctTechnique: "Whataboutism",
    options: ["Whataboutism", "False Equivalence", "Ad Hominem Attack", "Appeal to Nationalism"],
    explanation: "This is classic whataboutism - deflecting criticism by pointing to problems elsewhere instead of addressing the original concern about Hong Kong."
  },
  {
    id: 2,
    scenario: "Chinese state media claims: 'Western countries want to destroy China's success through lies and propaganda. Anyone who believes these lies is either naive or anti-China.'",
    correctTechnique: "False Dilemma",
    options: ["False Dilemma", "Strawman Argument", "Appeal to Authority", "Bandwagon Appeal"],
    explanation: "This presents a false dilemma - you're either naive/anti-China or you support China. It ignores the possibility of legitimate criticism based on facts."
  },
  {
    id: 3,
    scenario: "When asked about detention camps in Xinjiang, a Chinese official says: 'These are educational facilities. The people there are grateful for the job training and language skills they receive.'",
    correctTechnique: "Gaslighting",
    options: ["Gaslighting", "Virtue Signaling", "Appeal to Authority", "False Equivalence"],
    explanation: "This is gaslighting - denying the obvious reality of detention camps by reframing them as beneficial educational facilities, making observers question what they know to be true."
  }
];

const PropagandaTechniques = () => {
  const [gameMode, setGameMode] = useState('learn'); // 'learn', 'quiz', 'complete'
  const [currentTechnique, setCurrentTechnique] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
    const correct = answer === multipleChoiceQuestions[currentQuestion].correctTechnique;
    
    setUserAnswers([...userAnswers, {
      questionId: multipleChoiceQuestions[currentQuestion].id,
      userAnswer: answer,
      correct: correct,
      question: multipleChoiceQuestions[currentQuestion]
    }]);
    
    if (correct) {
      setScore(score + 1);
    }
    
    setShowAnswer(true);
  };

  const nextQuestion = () => {
    if (currentQuestion < multipleChoiceQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setShowAnswer(false);
      setSelectedAnswer(null);
    } else {
      setGameMode('complete');
    }
  };

  const nextTechnique = () => {
    if (currentTechnique < propagandaTechniques.length - 1) {
      setCurrentTechnique(currentTechnique + 1);
    } else {
      setGameMode('quiz');
    }
  };

  const resetGame = () => {
    setGameMode('learn');
    setCurrentTechnique(0);
    setCurrentQuestion(0);
    setScore(0);
    setShowAnswer(false);
    setSelectedAnswer(null);
    setUserAnswers([]);
  };

  if (gameMode === 'complete') {
    return (
      <div className="bg-card p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold mb-4">Training Complete!</h3>
          <div className="text-4xl font-bold text-primary mb-2">
            {score}/{multipleChoiceQuestions.length}
          </div>
          <p className="text-lg mb-4">
            {score === multipleChoiceQuestions.length 
              ? "Perfect! You're now a propaganda detection expert!"
              : score >= multipleChoiceQuestions.length * 0.7
              ? "Excellent work! You understand most propaganda techniques."
              : score >= multipleChoiceQuestions.length * 0.5
              ? "Good progress! Keep practicing to improve your skills."
              : "Keep studying! Propaganda recognition takes practice."
            }
          </p>
        </div>
        
        <div className="space-y-4 mb-6">
          <h4 className="text-xl font-semibold">Review Your Answers:</h4>
          {userAnswers.map((answer, index) => (
            <div key={index} className={`p-4 rounded-lg border ${answer.correct ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold">Question {index + 1}</span>
                {answer.correct ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600" />
                )}
              </div>
              <p className="text-sm mb-2">{answer.question.scenario}</p>
              <p className="text-sm">
                Your answer: <span className="font-medium">{answer.userAnswer}</span> | 
                Correct: <span className="font-medium">{answer.question.correctTechnique}</span>
              </p>
              {!answer.correct && (
                <p className="text-sm mt-2 text-muted-foreground">{answer.question.explanation}</p>
              )}
            </div>
          ))}
        </div>
        
        <div className="text-center">
          <Button onClick={resetGame} size="lg">
            <RefreshCw className="h-4 w-4 mr-2" />
            Start Over
          </Button>
        </div>
      </div>
    );
  }

  if (gameMode === 'quiz') {
    const question = multipleChoiceQuestions[currentQuestion];
    
    return (
      <div className="bg-card p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-bold">Technique Quiz</h3>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">
                Question {currentQuestion + 1} of {multipleChoiceQuestions.length}
              </div>
              <div className="text-lg font-semibold">
                Score: {score}/{currentQuestion + (showAnswer ? 1 : 0)}
              </div>
            </div>
          </div>
          <p className="text-muted-foreground">
            Read the scenario and identify which propaganda technique is being used.
          </p>
        </div>

        <div className="bg-muted p-6 rounded-lg mb-6">
          <h4 className="font-bold mb-3">Scenario:</h4>
          <p className="text-sm leading-relaxed">{question.scenario}</p>
        </div>

        {showAnswer && (
          <div className={`mb-6 p-4 rounded-lg ${selectedAnswer === question.correctTechnique ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <div className="flex items-center mb-2">
              {selectedAnswer === question.correctTechnique ? (
                <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600 mr-2" />
              )}
              <span className="font-semibold">
                {selectedAnswer === question.correctTechnique ? 'Correct!' : 'Incorrect!'}
              </span>
            </div>
            <p className="text-sm mb-2">
              <strong>Correct Answer:</strong> {question.correctTechnique}
            </p>
            <p className="text-sm">{question.explanation}</p>
          </div>
        )}

        {!showAnswer ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {question.options.map((option, index) => (
              <Button
                key={index}
                onClick={() => handleAnswerSelect(option)}
                variant="outline"
                className="h-auto p-4 text-left justify-start hover:bg-primary hover:text-primary-foreground"
              >
                {option}
              </Button>
            ))}
          </div>
        ) : (
          <div className="text-center">
            <Button onClick={nextQuestion} size="lg">
              {currentQuestion < multipleChoiceQuestions.length - 1 ? 'Next Question' : 'Complete Quiz'}
            </Button>
          </div>
        )}
      </div>
    );
  }

  // Learning mode
  const technique = propagandaTechniques[currentTechnique];
  
  return (
    <div className="bg-card p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold">Learn Propaganda Techniques</h3>
          <div className="text-sm text-muted-foreground">
            Technique {currentTechnique + 1} of {propagandaTechniques.length}
          </div>
        </div>
        <p className="text-muted-foreground">
          Study these propaganda techniques used in CCP messaging to recognize them in the wild.
        </p>
      </div>

      <div className="space-y-6">
        <div className="border-l-4 border-primary pl-6">
          <div className="flex items-center space-x-2 mb-2">
            <h4 className="text-2xl font-bold">{technique.name}</h4>
            <span className={`px-2 py-1 rounded text-xs ${
              technique.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
              technique.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {technique.difficulty}
            </span>
          </div>
          <div className="text-sm text-muted-foreground mb-2">
            Category: {technique.category}
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <Lightbulb className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
            <div>
              <h5 className="font-semibold text-blue-800 mb-2">Definition:</h5>
              <p className="text-sm text-blue-700">{technique.definition}</p>
            </div>
          </div>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start">
            <Target className="h-5 w-5 text-red-600 mr-2 mt-0.5" />
            <div>
              <h5 className="font-semibold text-red-800 mb-2">CCP Example:</h5>
              <p className="text-sm text-red-700 italic">"{technique.example}"</p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Button onClick={nextTechnique} size="lg">
            {currentTechnique < propagandaTechniques.length - 1 ? 'Next Technique' : 'Start Quiz'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PropagandaTechniques;


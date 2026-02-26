import React, { useState } from 'react';
import { Library, AlertOctagon, Mountain, Target, BookOpen, Trophy, Star, Sprout, Brain } from 'lucide-react';

const KnowledgeQuiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Topics', Icon: Library },
    { id: 'uyghur', name: 'Uyghur Crisis', Icon: AlertOctagon },
    { id: 'hongkong', name: 'Hong Kong', icon: '🇭🇰' },
    { id: 'tibet', name: 'Tibet', Icon: Mountain },
    { id: 'tactics', name: 'CCP Tactics', Icon: Target },
    { id: 'general', name: 'General', Icon: BookOpen },
  ];

  const allQuestions = [
    // Uyghur Questions
    {
      category: 'uyghur',
      question: 'Approximately how many Uyghurs are estimated to be detained in internment camps in Xinjiang?',
      options: ['100,000', '500,000', '1-3 million', '5 million'],
      correct: 2,
      explanation: 'Researchers estimate between 1 to 3 million Uyghurs and other Turkic Muslims have been detained in internment camps since 2017. This figure comes from multiple sources including Adrian Zenz, ASPI, and the Xinjiang Police Files.',
    },
    {
      category: 'uyghur',
      question: 'What year did the mass internment of Uyghurs in Xinjiang begin to escalate dramatically?',
      options: ['2014', '2017', '2019', '2020'],
      correct: 1,
      explanation: 'While persecution existed before, the mass internment campaign escalated dramatically in 2017 under Chen Quanguo, who was transferred from Tibet to implement similar hardline policies in Xinjiang.',
    },
    {
      category: 'uyghur',
      question: 'Which US law bans imports made with Uyghur forced labor?',
      options: ['Magnitsky Act', 'Hong Kong Human Rights Act', 'UFLPA', 'Taiwan Relations Act'],
      correct: 2,
      explanation: 'The Uyghur Forced Labor Prevention Act (UFLPA), signed in 2021, creates a rebuttable presumption that goods from Xinjiang are made with forced labor and bans their import into the United States.',
    },
    {
      category: 'uyghur',
      question: 'What does the Chinese government officially call the Xinjiang detention facilities?',
      options: ['Prisons', 'Vocational Education and Training Centers', 'Re-education Camps', 'Security Facilities'],
      correct: 1,
      explanation: 'The Chinese government euphemistically calls these facilities "Vocational Education and Training Centers," claiming they provide job training and Chinese language education to combat "extremism."',
    },
    
    // Hong Kong Questions
    {
      category: 'hongkong',
      question: 'When was the Hong Kong National Security Law imposed?',
      options: ['June 2019', 'November 2019', 'June 2020', 'July 2021'],
      correct: 2,
      explanation: 'The National Security Law was imposed on June 30, 2020, bypassing Hong Kong\'s legislature entirely. It was passed by Beijing\'s National People\'s Congress Standing Committee.',
    },
    {
      category: 'hongkong',
      question: 'How many pro-democracy activists were prosecuted in the "Hong Kong 47" case?',
      options: ['35', '47', '55', '100'],
      correct: 1,
      explanation: 'The Hong Kong 47 refers to 47 pro-democracy activists charged with "conspiracy to commit subversion" for organizing or participating in unofficial primary elections in 2020. 45 were convicted.',
    },
    {
      category: 'hongkong',
      question: 'What was the slogan of the 2019 Hong Kong protests?',
      options: ['Free Hong Kong', 'Five Demands, Not One Less', 'Democracy Now', 'Stand with Hong Kong'],
      correct: 1,
      explanation: '"Five Demands, Not One Less" (五大訴求，缺一不可) became the rallying cry of the 2019 protests. The demands included withdrawal of the extradition bill, an independent inquiry into police conduct, amnesty for protesters, and universal suffrage.',
    },
    {
      category: 'hongkong',
      question: 'Who is Jimmy Lai?',
      options: ['A pro-Beijing politician', 'Founder of Apple Daily newspaper', 'A protest leader', 'A human rights lawyer'],
      correct: 1,
      explanation: 'Jimmy Lai is the founder of Apple Daily, Hong Kong\'s largest pro-democracy newspaper. He has been imprisoned under the National Security Law and sentenced to 20 years. Apple Daily was forced to close in 2021.',
    },
    
    // Tibet Questions
    {
      category: 'tibet',
      question: 'In what year did China invade and occupy Tibet?',
      options: ['1949', '1950', '1959', '1965'],
      correct: 1,
      explanation: 'China invaded Tibet in 1950. The Dalai Lama fled to India in 1959 following a failed uprising. Tibet has been under Chinese occupation ever since.',
    },
    {
      category: 'tibet',
      question: 'Who is Gedhun Choekyi Nyima?',
      options: ['The Dalai Lama', 'The Panchen Lama recognized by the Dalai Lama', 'A Tibetan activist', 'A Chinese official'],
      correct: 1,
      explanation: 'Gedhun Choekyi Nyima was recognized as the 11th Panchen Lama by the Dalai Lama in 1995. He was abducted by Chinese authorities at age 6, just three days after his recognition, and has not been seen publicly since.',
    },
    {
      category: 'tibet',
      question: 'How many Tibetans have self-immolated since 2009 to protest Chinese rule?',
      options: ['About 50', 'About 100', 'About 160', 'About 250'],
      correct: 2,
      explanation: 'Since 2009, approximately 160 Tibetans have self-immolated in protest against Chinese rule and in support of the Dalai Lama\'s return. Most have died from their injuries.',
    },
    
    // CCP Tactics Questions
    {
      category: 'tactics',
      question: 'How many CCP overseas police stations have been identified worldwide?',
      options: ['About 30', 'About 50', 'Over 100', 'Over 200'],
      correct: 2,
      explanation: 'Safeguard Defenders has documented over 100 CCP overseas police stations in 53 countries. These stations are used to monitor, harass, and pressure Chinese nationals abroad to return to China.',
    },
    {
      category: 'tactics',
      question: 'What is the United Front Work Department (UFWD)?',
      options: ['China\'s military intelligence', 'CCP\'s influence operations agency', 'A human rights organization', 'A trade union'],
      correct: 1,
      explanation: 'The United Front Work Department is the CCP\'s agency responsible for influence operations abroad. It coordinates diaspora control, political influence, and co-optation of foreign elites.',
    },
    {
      category: 'tactics',
      question: 'What are Confucius Institutes?',
      options: ['Independent cultural centers', 'CCP-funded propaganda centers in universities', 'Language schools in China', 'Research institutes'],
      correct: 1,
      explanation: 'Confucius Institutes are CCP-funded centers placed in foreign universities. They have been criticized for spreading propaganda, censoring discussion of sensitive topics, and enabling surveillance of Chinese students abroad.',
    },
    {
      category: 'tactics',
      question: 'What is "Operation Fox Hunt"?',
      options: ['A wildlife protection program', 'CCP\'s program to repatriate dissidents abroad', 'A military exercise', 'An anti-corruption campaign'],
      correct: 1,
      explanation: 'Operation Fox Hunt is a CCP program to track down and pressure Chinese nationals abroad to return to China. Methods include threatening family members in China, surveillance, and harassment.',
    },
    
    // General Questions
    {
      category: 'general',
      question: 'Which country ranks #1 worldwide for jailing journalists?',
      options: ['Russia', 'Iran', 'China', 'North Korea'],
      correct: 2,
      explanation: 'China has been the world\'s worst jailer of journalists for several years, according to the Committee to Protect Journalists (CPJ). As of 2024, at least 44 journalists are imprisoned in China.',
    },
    {
      category: 'general',
      question: 'What is RSDL (Residential Surveillance at a Designated Location)?',
      options: ['A type of visa', 'A form of secret detention', 'A surveillance technology', 'A legal protection'],
      correct: 1,
      explanation: 'RSDL is a form of secret detention where individuals can be held for up to 6 months without access to lawyers or family. It is used against activists, lawyers, and dissidents.',
    },
    {
      category: 'general',
      question: 'What did the China Tribunal conclude about organ harvesting?',
      options: ['No evidence found', 'Isolated incidents', 'Forced organ harvesting has occurred on a substantial scale', 'Only voluntary donations'],
      correct: 2,
      explanation: 'The independent China Tribunal, chaired by Sir Geoffrey Nice QC, concluded in 2019 that forced organ harvesting has been committed "on a substantial scale" in China, with Falun Gong practitioners as the primary victims.',
    },
  ];

  const questions = selectedCategory === 'all' 
    ? allQuestions 
    : allQuestions.filter(q => q.category === selectedCategory);

  const handleAnswer = (answerIndex) => {
    setSelectedAnswer(answerIndex);
    setShowExplanation(true);
    if (answerIndex === questions[currentQuestion].correct) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setShowResult(true);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setQuizStarted(false);
  };

  const getScoreMessage = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage >= 90) return { Icon: Trophy, message: 'Expert! You have excellent knowledge of CCP human rights abuses.' };
    if (percentage >= 70) return { Icon: Star, message: 'Well done! You have good understanding of these issues.' };
    if (percentage >= 50) return { Icon: Library, message: 'Good start! Consider exploring our Education Center to learn more.' };
    return { Icon: Sprout, message: 'Keep learning! Visit our Education Center to deepen your understanding.' };
  };

  if (!quizStarted) {
    return (
      <div className="space-y-6">
        <div className="bg-[#0a0e14] border border-[#1c2a35] border-l-2 border-l-[#22d3ee] p-6">
          <div className="flex items-center mb-4">
            <Brain className="w-8 h-8 text-[#22d3ee] mr-3" />
            <div>
              <h2 className="text-2xl font-bold text-white">Knowledge Quiz</h2>
              <p className="text-slate-400">Test your understanding of CCP human rights abuses</p>
            </div>
          </div>
          <p className="text-sm text-slate-300 mb-4">
            This quiz covers topics including the Uyghur genocide, Hong Kong crackdown, Tibetan oppression, 
            and CCP tactics. Test your knowledge and learn important facts.
          </p>
          
          <div className="mb-4">
            <label className="block text-sm text-slate-400 mb-2">Select a topic:</label>
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center space-x-2 px-3 py-1.5 text-sm font-medium transition-colors ${
                    selectedCategory === cat.id
                      ? 'bg-[#22d3ee] text-[#0a0e14]'
                      : 'bg-[#111820] text-slate-300 hover:bg-[#111820]'
                  }`}
                >
                  {cat.Icon ? <cat.Icon className="w-4 h-4" /> : <span>{cat.icon}</span>}
                  <span>{cat.name}</span>
                </button>
              ))}
            </div>
          </div>
          
          <div className="text-sm text-slate-400 mb-4">
            {questions.length} questions • Multiple choice • Learn as you go
          </div>
          
          <button
            onClick={() => setQuizStarted(true)}
            className="w-full py-3 bg-[#22d3ee] hover:bg-[#22d3ee]/80 text-[#0a0e14] font-medium transition-colors"
          >
            Start Quiz
          </button>
        </div>
      </div>
    );
  }

  if (showResult) {
    const { Icon: ResultIcon, message } = getScoreMessage();
    return (
      <div className="space-y-6">
        <div className="bg-[#0a0e14] border border-[#1c2a35] border-l-2 border-l-[#22d3ee] p-6 text-center">
          <div className="mb-4 flex justify-center"><ResultIcon className="w-16 h-16 text-[#22d3ee]" /></div>
          <h2 className="text-2xl font-bold text-white mb-2">Quiz Complete!</h2>
          <p className="text-4xl font-bold text-[#22d3ee] mb-2">
            {score} / {questions.length}
          </p>
          <p className="text-slate-300 mb-6">{message}</p>
          
          <div className="flex justify-center space-x-4">
            <button
              onClick={restartQuiz}
              className="px-6 py-2 bg-[#22d3ee] hover:bg-[#22d3ee]/80 text-[#0a0e14] font-medium transition-colors"
            >
              Try Again
            </button>
            <a
              href="/education"
              className="px-6 py-2 bg-[#111820] hover:bg-[#1c2a35] text-white font-medium transition-colors"
            >
              Learn More
            </a>
          </div>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const categoryInfo = categories.find(c => c.id === question.category);

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="bg-[#111820]/50 p-4 border border-[#1c2a35]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-slate-400">
            Question {currentQuestion + 1} of {questions.length}
          </span>
          <span className="text-sm text-slate-400">
            Score: {score}
          </span>
        </div>
        <div className="w-full bg-[#111820] rounded-full h-2">
          <div 
            className="bg-[#22d3ee] h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="bg-[#111820]/50 p-6 border border-[#1c2a35]">
        <div className="flex items-center space-x-2 mb-4">
          {categoryInfo?.Icon ? <categoryInfo.Icon className="w-4 h-4 text-slate-300" /> : <span>{categoryInfo?.icon}</span>}
          <span className="text-xs px-2 py-0.5 bg-[#111820] rounded text-slate-300">
            {categoryInfo?.name}
          </span>
        </div>
        
        <h3 className="text-lg font-bold text-white mb-4">{question.question}</h3>
        
        <div className="space-y-2">
          {question.options.map((option, index) => {
            let buttonClass = 'bg-[#0a0e14] border-[#1c2a35] hover:border-[#22d3ee]';
            
            if (showExplanation) {
              if (index === question.correct) {
                buttonClass = 'bg-green-900/50 border-green-600';
              } else if (index === selectedAnswer && index !== question.correct) {
                buttonClass = 'bg-red-900/50 border-red-600';
              }
            }
            
            return (
              <button
                key={index}
                onClick={() => !showExplanation && handleAnswer(index)}
                disabled={showExplanation}
                className={`w-full text-left p-4 border transition-colors ${buttonClass} ${
                  showExplanation ? 'cursor-default' : 'cursor-pointer'
                }`}
              >
                <span className="text-white">{option}</span>
              </button>
            );
          })}
        </div>
        
        {/* Explanation */}
        {showExplanation && (
          <div className={`mt-4 p-4 ${
            selectedAnswer === question.correct 
              ? 'bg-green-900/30 border border-green-700/50' 
              : 'bg-red-900/30 border border-red-700/50'
          }`}>
            <p className="font-medium text-white mb-2">
              {selectedAnswer === question.correct ? '✓ Correct!' : '✗ Incorrect'}
            </p>
            <p className="text-sm text-slate-300">{question.explanation}</p>
          </div>
        )}
        
        {showExplanation && (
          <button
            onClick={nextQuestion}
            className="w-full mt-4 py-3 bg-[#22d3ee] hover:bg-[#22d3ee]/80 text-[#0a0e14] font-medium transition-colors"
          >
            {currentQuestion < questions.length - 1 ? 'Next Question →' : 'See Results'}
          </button>
        )}
      </div>
    </div>
  );
};

export default KnowledgeQuiz;

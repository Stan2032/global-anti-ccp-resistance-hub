import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import SecurityQuiz from '../components/SecurityQuiz';

describe('SecurityQuiz', () => {
  // --- Rendering ---

  it('renders the first question', () => {
    render(<SecurityQuiz />);
    expect(screen.getByText('Do you use a VPN when browsing the internet?')).toBeTruthy();
  });

  it('shows question counter and category', () => {
    render(<SecurityQuiz />);
    expect(screen.getByText('Question 1 of 10')).toBeTruthy();
    expect(screen.getByText('Network Security')).toBeTruthy();
  });

  it('renders all 4 options for first question', () => {
    render(<SecurityQuiz />);
    expect(screen.getByText('Always, with a reputable provider')).toBeTruthy();
    expect(screen.getByText('Sometimes, when accessing sensitive content')).toBeTruthy();
    expect(screen.getByText('Rarely or never')).toBeTruthy();
    expect(screen.getByText('I use a free VPN')).toBeTruthy();
  });

  it('shows privacy notice', () => {
    render(<SecurityQuiz />);
    expect(screen.getByText(/Your answers are not stored or transmitted/)).toBeTruthy();
  });

  // --- Navigation ---

  it('advances to question 2 when an answer is selected', () => {
    render(<SecurityQuiz />);
    fireEvent.click(screen.getByText('Always, with a reputable provider'));
    expect(screen.getByText('Question 2 of 10')).toBeTruthy();
    expect(screen.getByText('What messaging app do you primarily use for sensitive communications?')).toBeTruthy();
  });

  it('advances through multiple questions', () => {
    render(<SecurityQuiz />);
    // Answer first 3 questions
    fireEvent.click(screen.getByText('Always, with a reputable provider')); // Q1 → Q2
    fireEvent.click(screen.getByText('Signal with disappearing messages')); // Q2 → Q3
    fireEvent.click(screen.getByText('Password manager with unique passwords')); // Q3 → Q4
    expect(screen.getByText('Question 4 of 10')).toBeTruthy();
    expect(screen.getByText('Do you use two-factor authentication (2FA)?')).toBeTruthy();
  });

  // --- Scoring & Results ---

  const answerAllQuestions = (selectBest) => {
    render(<SecurityQuiz />);
    const bestAnswers = [
      'Always, with a reputable provider',          // Q1: 3 pts
      'Signal with disappearing messages',            // Q2: 3 pts
      'Password manager with unique passwords',       // Q3: 3 pts
      'Yes, with hardware key or authenticator app',  // Q4: 3 pts
      'ProtonMail or Tutanota',                       // Q5: 3 pts
      'Separate accounts with pseudonyms for activism', // Q6: 3 pts
      'Yes, regularly for sensitive topics',           // Q7: 3 pts
      'Encrypted storage (VeraCrypt, Cryptomator)',    // Q8: 3 pts
      'Yes, I regularly update my security knowledge', // Q9: 3 pts
      'Yes, with backup contacts and recovery plans',  // Q10: 3 pts
    ];
    const worstAnswers = [
      'Rarely or never',                     // Q1: 0 pts
      'WeChat, QQ, or Chinese apps',          // Q2: 0 pts
      'I use the same password for multiple accounts', // Q3: 0 pts
      'No, I dont use 2FA',                   // Q4: 0 pts
      'Chinese email services (QQ, 163, etc.)', // Q5: 0 pts
      'Public accounts with real name and photos', // Q6: 0 pts
      'No, I dont know how to use it',         // Q7: 0 pts
      'On my computer without encryption',     // Q8: 0 pts
      'I dont think I need security training', // Q9: 0 pts
      'No, I havent thought about it',         // Q10: 0 pts
    ];
    const answers = selectBest ? bestAnswers : worstAnswers;
    answers.forEach(answer => fireEvent.click(screen.getByText(answer)));
  };

  it('shows results after answering all 10 questions', () => {
    answerAllQuestions(true);
    expect(screen.getByText('Security Assessment Results')).toBeTruthy();
  });

  it('shows EXCELLENT for perfect score (30/30)', () => {
    answerAllQuestions(true);
    expect(screen.getByText('30')).toBeTruthy();
    expect(screen.getByText('/30')).toBeTruthy();
    expect(screen.getByText('EXCELLENT')).toBeTruthy();
    expect(screen.getByText('Your security practices are strong. Keep staying vigilant!')).toBeTruthy();
  });

  it('shows AT RISK for zero score (0/30)', () => {
    answerAllQuestions(false);
    expect(screen.getByText('AT RISK')).toBeTruthy();
    expect(screen.getByText(/Your security practices put you at significant risk/)).toBeTruthy();
  });

  // --- Recommendations ---

  it('shows personalized recommendations for low-scoring areas', () => {
    answerAllQuestions(false);
    expect(screen.getByText('Personalized Recommendations')).toBeTruthy();
    // All 10 recommendations should show since all scored 0
    expect(screen.getByText(/Use a reputable, paid VPN service/)).toBeTruthy();
    expect(screen.getByText(/Use Signal for all sensitive communications/)).toBeTruthy();
  });

  it('does not show recommendations for perfect score areas', () => {
    answerAllQuestions(true);
    // With perfect score, no recommendations should appear
    expect(screen.queryByText(/Use a reputable, paid VPN service/)).toBeFalsy();
  });

  // --- Security Resources ---

  it('shows security resource links on results page', () => {
    answerAllQuestions(true);
    expect(screen.getByText('Security Resources')).toBeTruthy();
    expect(screen.getByText('EFF Surveillance Self-Defense')).toBeTruthy();
    expect(screen.getByText('Front Line Defenders')).toBeTruthy();
    expect(screen.getByText('Access Now Digital Security Helpline')).toBeTruthy();
    expect(screen.getByText('Security in a Box')).toBeTruthy();
  });

  it('resource links open in new tab with noopener', () => {
    answerAllQuestions(true);
    const effLink = screen.getByText('EFF Surveillance Self-Defense').closest('a');
    expect(effLink.getAttribute('target')).toBe('_blank');
    expect(effLink.getAttribute('rel')).toContain('noopener');
    expect(effLink.getAttribute('href')).toBe('https://ssd.eff.org/');
  });

  // --- Reset ---

  it('retake button resets quiz to question 1', () => {
    answerAllQuestions(true);
    expect(screen.getByText('Security Assessment Results')).toBeTruthy();
    fireEvent.click(screen.getByText('Retake Assessment'));
    expect(screen.getByText('Question 1 of 10')).toBeTruthy();
    expect(screen.getByText('Do you use a VPN when browsing the internet?')).toBeTruthy();
  });
});

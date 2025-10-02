'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import MobileLayout from '@/components/MobileLayout';
import GlassCard from '@/components/GlassCard';
import Button from '@/components/Button';
import ProgressBar from '@/components/ProgressBar';
import WeatherIcon from '@/components/WeatherIcon';
import { questions } from '@/lib/questions';
import { UserAnswer } from '@/types';

export default function QuestionsPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<UserAnswer[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [textAnswer, setTextAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const currentQuestion = questions[currentStep];
  const isLastQuestion = currentStep === questions.length - 1;

  const handleOptionSelect = (optionValue: string) => {
    if (currentQuestion.type === 'single') {
      setSelectedOptions([optionValue]);
    } else if (currentQuestion.type === 'multiple') {
      setSelectedOptions((prev) =>
        prev.includes(optionValue)
          ? prev.filter((v) => v !== optionValue)
          : [...prev, optionValue]
      );
    }
  };

  const handleNext = async () => {
    // 현재 질문의 답변 저장
    const answer: UserAnswer = {
      questionId: currentQuestion.id,
      answer:
        currentQuestion.type === 'text'
          ? textAnswer
          : selectedOptions,
    };

    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);

    if (isLastQuestion) {
      // 마지막 질문이면 AI 분석 요청
      setIsLoading(true);
      try {
        const response = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ answers: newAnswers }),
        });

        if (!response.ok) throw new Error('분석 실패');

        const result = await response.json();
        
        // 결과와 답변을 sessionStorage에 저장
        sessionStorage.setItem('recommendationResult', JSON.stringify(result));
        sessionStorage.setItem('userAnswers', JSON.stringify(newAnswers));
        router.push('/result');
      } catch (error) {
        console.error('분석 오류:', error);
        alert('분석 중 오류가 발생했습니다. 다시 시도해주세요.');
        setIsLoading(false);
      }
    } else {
      // 다음 질문으로
      setCurrentStep((prev) => prev + 1);
      setSelectedOptions([]);
      setTextAnswer('');
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      setAnswers((prev) => prev.slice(0, -1));
      setSelectedOptions([]);
      setTextAnswer('');
    } else {
      router.push('/');
    }
  };

  const canProceed =
    currentQuestion.type === 'text'
      ? textAnswer.trim().length > 0
      : selectedOptions.length > 0;

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 relative z-10">
        <GlassCard className="text-center">
          <div className="mb-8">
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [1, 0.8, 1]
              }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="inline-block"
            >
              <WeatherIcon type="partly-cloudy" size="lg" animate={false} />
            </motion.div>
          </div>
          <h2 className="text-xl font-bold mb-3 text-white text-glow">
            당신의 마음을 분석하고 있습니다
          </h2>
          <p className="text-sm text-white/80 mb-6">
            잠시만 기다려주세요...
          </p>
          
          {/* 진행 바 */}
          <div className="w-full h-2 rounded-full overflow-hidden bg-white/20 mb-4">
            <motion.div
              className="h-full rounded-full"
              style={{
                background: 'linear-gradient(90deg, rgba(186, 230, 253, 1), rgba(147, 197, 253, 1), rgba(125, 211, 252, 1))',
              }}
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            />
          </div>
          
          {/* 점 애니메이션 */}
          <motion.div
            className="flex justify-center gap-2"
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2.5 h-2.5 bg-white rounded-full"
                animate={{ 
                  scale: [1, 1.3, 1], 
                  opacity: [0.4, 1, 0.4] 
                }}
                transition={{ 
                  duration: 1.2, 
                  repeat: Infinity, 
                  delay: i * 0.2,
                  ease: 'easeInOut'
                }}
              />
            ))}
          </motion.div>
        </GlassCard>
      </div>
    );
  }

  return (
    <MobileLayout>
      <div className="flex flex-col px-6 py-6">
        <div className="w-full max-w-md mx-auto">
        <ProgressBar current={currentStep + 1} total={questions.length} />

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <GlassCard className="mb-4">
              <div className="mb-3">
                <span
                  className="text-xs font-bold px-3 py-1.5 rounded-full inline-block"
                  style={{
                    background: 'linear-gradient(135deg, rgba(186, 230, 253, 0.9), rgba(147, 197, 253, 0.9))',
                    color: 'white',
                    boxShadow: '0 4px 15px rgba(147, 197, 253, 0.4)'
                  }}
                >
                  질문 {currentQuestion.step}
                </span>
              </div>

              <h2 className="text-lg font-bold mb-2 text-white text-glow whitespace-pre-line">
                {currentQuestion.title}
              </h2>

              <p className="text-xs mb-3 text-white/70">
                {currentQuestion.description}
              </p>

              {/* 선택형 질문 */}
              {currentQuestion.type !== 'text' && (
                <div className="space-y-2">
                  {currentQuestion.options?.map((option) => {
                    const isSelected = selectedOptions.includes(option.value);
                    return (
                      <motion.button
                        key={option.id}
                        onClick={() => handleOptionSelect(option.value)}
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        className={`w-full text-left p-3 rounded-xl transition-all duration-300 ${
                          isSelected
                            ? 'border-2'
                            : 'border-2'
                        }`}
                        style={{
                          borderColor: isSelected ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.2)',
                          background: isSelected
                            ? 'linear-gradient(135deg, rgba(186, 230, 253, 0.4), rgba(147, 197, 253, 0.4))'
                            : 'rgba(255, 255, 255, 0.15)',
                          boxShadow: isSelected 
                            ? '0 8px 32px rgba(147, 197, 253, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.5)'
                            : '0 4px 16px rgba(0, 0, 0, 0.1)',
                        }}
                      >
                        <p className="font-medium text-white text-sm">
                          {option.text}
                        </p>
                      </motion.button>
                    );
                  })}
                </div>
              )}

              {/* 텍스트 입력 질문 */}
              {currentQuestion.type === 'text' && (
                <textarea
                  value={textAnswer}
                  onChange={(e) => setTextAnswer(e.target.value)}
                  placeholder="자유롭게 적어주세요..."
                  rows={4}
                  className="w-full p-4 rounded-xl border-2 resize-none focus:outline-none transition-all text-white font-medium placeholder:text-white/50 text-sm"
                  style={{
                    borderColor: textAnswer ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.2)',
                    background: 'rgba(255, 255, 255, 0.15)',
                    boxShadow: textAnswer 
                      ? '0 8px 32px rgba(147, 197, 253, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.5)'
                      : '0 4px 16px rgba(0, 0, 0, 0.1)',
                  }}
                />
              )}
            </GlassCard>

            {/* 버튼 */}
            <div className="flex gap-4">
              <Button variant="secondary" onClick={handleBack} fullWidth>
                {currentStep === 0 ? '처음으로' : '이전'}
              </Button>
              <Button
                variant="primary"
                onClick={handleNext}
                disabled={!canProceed}
                fullWidth
              >
                {isLastQuestion ? '결과 보기' : '다음'}
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
        </div>
      </div>
    </MobileLayout>
  );
}


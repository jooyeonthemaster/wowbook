'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import GlassCard from '@/components/GlassCard';
import Button from '@/components/Button';

export default function LoginPage() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 구글 로그인
  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      await signInWithPopup(auth, googleProvider);
      router.push('/');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : '구글 로그인에 실패했습니다.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // 이메일 로그인/회원가입
  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isSignUp) {
        // 회원가입
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        // 로그인
        await signInWithEmailAndPassword(auth, email, password);
      }
      router.push('/');
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'code' in err) {
        const firebaseError = err as { code: string; message?: string };
        if (firebaseError.code === 'auth/email-already-in-use') {
          setError('이미 사용 중인 이메일입니다.');
        } else if (firebaseError.code === 'auth/weak-password') {
          setError('비밀번호는 최소 6자 이상이어야 합니다.');
        } else if (firebaseError.code === 'auth/user-not-found') {
          setError('등록되지 않은 이메일입니다.');
        } else if (firebaseError.code === 'auth/wrong-password') {
          setError('비밀번호가 일치하지 않습니다.');
        } else {
          setError(firebaseError.message || '로그인에 실패했습니다.');
        }
      } else {
        setError('로그인에 실패했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 pb-24 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="w-full max-w-md"
      >
        <GlassCard>
          {/* 탭 전환 */}
          <div className="flex gap-2 mb-6">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(false);
                setError('');
              }}
              className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
                !isSignUp
                  ? 'text-white shadow-lg'
                  : 'text-white/60 hover:text-white/90'
              }`}
              style={{
                background: !isSignUp
                  ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.6), rgba(168, 85, 247, 0.6))'
                  : 'rgba(255, 255, 255, 0.1)',
              }}
            >
              로그인
            </button>
            <button
              type="button"
              onClick={() => {
                setIsSignUp(true);
                setError('');
              }}
              className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
                isSignUp
                  ? 'text-white shadow-lg'
                  : 'text-white/60 hover:text-white/90'
              }`}
              style={{
                background: isSignUp
                  ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.6), rgba(168, 85, 247, 0.6))'
                  : 'rgba(255, 255, 255, 0.1)',
              }}
            >
              회원가입
            </button>
          </div>

          {/* 구글 로그인 버튼 */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full py-4 rounded-xl mb-6 font-semibold flex items-center justify-center gap-3 transition-all duration-300 border-2 border-white/30 hover:border-white/60 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              color: '#1f2937',
            }}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span>Google로 계속하기</span>
          </motion.button>

          {/* 구분선 */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 text-xs text-white/50" style={{ background: 'rgba(255, 255, 255, 0.1)' }}>
                또는 이메일로 계속
              </span>
            </div>
          </div>

          {/* 이메일 로그인 폼 */}
          <form onSubmit={handleEmailAuth} className="space-y-4">
            <div>
              <label className="block text-xs text-white/70 mb-2 ml-1">이메일</label>
              <input
                type="email"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3.5 rounded-xl border-2 focus:outline-none focus:border-white/60 transition-all text-white font-medium placeholder:text-white/40 text-sm"
                style={{
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                  background: 'rgba(255, 255, 255, 0.12)',
                }}
              />
            </div>

            <div>
              <label className="block text-xs text-white/70 mb-2 ml-1">비밀번호</label>
              <input
                type="password"
                placeholder="최소 6자 이상"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-3.5 rounded-xl border-2 focus:outline-none focus:border-white/60 transition-all text-white font-medium placeholder:text-white/40 text-sm"
                style={{
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                  background: 'rgba(255, 255, 255, 0.12)',
                }}
              />
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-200 text-center p-3 rounded-xl font-medium"
                style={{ background: 'rgba(239, 68, 68, 0.25)', border: '1px solid rgba(239, 68, 68, 0.4)' }}
              >
                ⚠️ {error}
              </motion.div>
            )}

            <Button
              type="submit"
              variant="primary"
              fullWidth
              disabled={loading}
            >
              {loading ? '처리 중...' : isSignUp ? '✨ 회원가입' : '🚀 로그인'}
            </Button>
          </form>
        </GlassCard>
      </motion.div>
    </div>
  );
}

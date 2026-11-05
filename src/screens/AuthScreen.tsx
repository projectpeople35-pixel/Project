import React, { useState } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail
} from 'firebase/auth';
import { auth, hasLiveFirebaseConfig } from '../services/firebase';
import {
  Sprout,
  Lock,
  Mail,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Cpu,
  ShieldCheck,
  Play
} from 'lucide-react';

interface AuthScreenProps {
  onBypassDemo: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onBypassDemo }) => {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [infoMsg, setInfoMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setInfoMsg(null);

    if (mode === 'register' && password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please verify.');
      return;
    }

    setLoading(true);

    try {
      if (!auth || !hasLiveFirebaseConfig) {
        // Simulation login if real Firebase config isn't supplied
        setTimeout(() => {
          onBypassDemo();
        }, 500);
        return;
      }

      if (mode === 'forgot') {
        await sendPasswordResetEmail(auth, email);
        setInfoMsg('Password reset link sent to your email inbox.');
      } else if (mode === 'register') {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      let msg = err.message || 'Authentication error';
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        msg = 'Invalid email or password.';
      } else if (err.code === 'auth/email-already-in-use') {
        msg = 'An account already exists with this email address.';
      } else if (err.code === 'auth/weak-password') {
        msg = 'Password should be at least 6 characters.';
      }
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f9f6] flex flex-col justify-center px-4 py-8 max-w-md mx-auto select-none">
      {/* Brand Header */}
      <div className="text-center mb-6">
        <div className="inline-block p-1 bg-white rounded-3xl shadow-lg ring-1 ring-emerald-500/20 mb-3">
          <img
            src="/src/assets/images/agrosmart_brand_logo_1793772055945.jpg"
            alt="AgroSmart"
            className="w-16 h-16 rounded-2xl object-cover"
          />
        </div>
        <h2 className="text-2xl font-extrabold text-[#1b4332] tracking-tight">
          AgroSmart
        </h2>
        <p className="text-xs text-slate-500 font-medium mt-0.5">
          Grow Smarter, Live Greener.
        </p>
      </div>

      {/* Main Auth Card */}
      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-6 space-y-4">
        {/* Tab switchers */}
        <div className="flex border-b border-slate-100 pb-1">
          <button
            type="button"
            className={`flex-1 pb-3 text-xs font-bold text-center border-b-2 transition ${
              mode === 'login'
                ? 'border-[#1b4332] text-[#1b4332]'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
            onClick={() => {
              setMode('login');
              setErrorMsg(null);
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`flex-1 pb-3 text-xs font-bold text-center border-b-2 transition ${
              mode === 'register'
                ? 'border-[#1b4332] text-[#1b4332]'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
            onClick={() => {
              setMode('register');
              setErrorMsg(null);
            }}
          >
            Register Device
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start space-x-2 text-xs text-rose-700">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {infoMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start space-x-2 text-xs text-emerald-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>{infoMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="agronomist@farm.com"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs focus:ring-2 focus:ring-[#1b4332] outline-none"
              />
            </div>
          </div>

          {mode !== 'forgot' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs focus:ring-2 focus:ring-[#1b4332] outline-none"
                />
              </div>
            </div>
          )}

          {mode === 'register' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs focus:ring-2 focus:ring-[#1b4332] outline-none"
                />
              </div>
            </div>
          )}

          {mode === 'login' && (
            <div className="text-right">
              <button
                type="button"
                onClick={() => setMode('forgot')}
                className="text-xs text-[#1b4332] font-semibold hover:underline"
              >
                Forgot Password?
              </button>
            </div>
          )}

          {mode === 'forgot' && (
            <div className="text-right">
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-xs text-[#1b4332] font-semibold hover:underline"
              >
                Back to Sign In
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1b4332] hover:bg-[#2d6a4f] text-white font-bold py-3 px-4 rounded-xl shadow-md transition flex items-center justify-center space-x-2 text-xs disabled:opacity-50 active:scale-95"
          >
            <span>
              {loading
                ? 'Connecting to Node...'
                : mode === 'forgot'
                ? 'Send Reset Link'
                : mode === 'register'
                ? 'Create AgroSmart Account'
                : 'Sign In to Dashboard'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* 1-Click Demo Mode Button */}
        <div className="pt-4 border-t border-slate-100 text-center">
          <p className="text-[11px] text-slate-400 mb-2 font-medium">
            No hardware or account right now?
          </p>
          <button
            type="button"
            onClick={onBypassDemo}
            className="w-full inline-flex items-center justify-center space-x-2 text-xs font-bold text-[#1b4332] bg-emerald-50 hover:bg-emerald-100/80 px-4 py-2.5 rounded-xl border border-emerald-200 shadow-sm transition active:scale-95"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Enter Interactive Simulation & Demo Mode</span>
          </button>
        </div>
      </div>
    </div>
  );
};

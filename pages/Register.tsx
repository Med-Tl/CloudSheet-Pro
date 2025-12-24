
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isEmailLimitError, setIsEmailLimitError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsEmailLimitError(false);
    setLoading(true);
    
    try {
      await register({ email, password });
      setIsSubmitted(true);
    } catch (err: any) {
      const msg = err.message || 'Failed to register';
      setError(msg);
      
      // Specifically catch the Supabase rate limit / SMTP error
      if (msg.toLowerCase().includes('confirmation email')) {
        setIsEmailLimitError(true);
      }
    } finally {
      setLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-10 border border-gray-100 text-center">
          <div className="bg-blue-100 p-5 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-8 shadow-inner">
            <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">Check your email</h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            We've sent a verification link to <br/>
            <span className="font-bold text-gray-900 break-all">{email}</span>. <br/>
            Please click the link in the email to activate your account.
          </p>
          <Button variant="primary" className="w-full py-3 shadow-lg shadow-blue-200" onClick={() => navigate('/login')}>
            Proceed to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="flex items-center gap-2 mb-8 justify-center">
          <div className="bg-blue-600 p-2 rounded-xl">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">CloudSheet <span className="text-blue-600">Pro</span></h1>
        </div>

        <h2 className="text-xl font-semibold mb-6 text-gray-800">Create Account</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {error && (
            <div className={`p-4 rounded-lg text-sm border ${
              isEmailLimitError ? 'bg-amber-50 border-amber-200 text-amber-800' : 'bg-red-50 border-red-200 text-red-600'
            }`}>
              <div className="font-bold flex items-center gap-2 mb-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {isEmailLimitError ? 'Supabase Email Limit Reached' : 'Registration Error'}
              </div>
              <p className="text-xs leading-relaxed">
                {isEmailLimitError 
                  ? "Supabase's default email provider allows only 3 emails per hour. To fix this: \n1. Wait 1 hour OR \n2. Go to Supabase Auth Settings and disable 'Confirm Email' for testing OR \n3. Set up a custom SMTP provider (Resend/SendGrid)."
                  : error}
              </p>
            </div>
          )}
          
          <Input 
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input 
            label="Password"
            type="password"
            placeholder="Must be 6+ chars"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="text-xs text-gray-500 bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-start gap-3">
            <svg className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>
              <strong className="text-blue-700 block mb-0.5">Verification Required</strong>
              We will send a secure link to your mailbox to verify your identity.
            </p>
          </div>

          <Button type="submit" isLoading={loading} className="w-full py-3 shadow-md shadow-blue-100">
            Create Account
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 font-medium hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;

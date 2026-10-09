import { useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

function VerificationBanner({ email }) {
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);

  const handleResend = async () => {
    setResending(true);
    try {
      await api.post('/auth/resend-verification');
      setResent(true);
      toast.success('Verification email sent! Check your inbox or console.');
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to resend. Try again.';
      toast.error(message);
    } finally {
      setResending(false);
    }
  };

  if (resent) {
    return (
      <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
        <span>✓</span>
        <p className="text-sm">
          Verification link sent to <span className="font-medium">{email}</span>. Check your inbox or server console.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg mb-6 flex items-center justify-between gap-4">
      <p className="text-sm">
        ⚠️ Your email is not verified.{' '}
        {email && <span className="font-medium">{email}</span>}
      </p>
      <button
        onClick={handleResend}
        disabled={resending}
        className="shrink-0 text-sm bg-yellow-100 border border-yellow-300 text-yellow-800 px-3 py-1 rounded-lg hover:bg-yellow-200 transition disabled:opacity-50"
      >
        {resending ? 'Sending...' : 'Resend Email'}
      </button>
    </div>
  );
}

export default VerificationBanner;
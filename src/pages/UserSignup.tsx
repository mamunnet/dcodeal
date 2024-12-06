import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../admin/context/AuthContext';
import { ArrowLeft } from 'lucide-react';

interface SignupForm {
  name: string;
  phone: string;
  email: string;
}

export default function UserSignup() {
  const [formData, setFormData] = useState<SignupForm>({
    name: '',
    phone: '',
    email: '',
  });
  const [otp, setOtp] = useState('');
  const [verificationId, setVerificationId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { loginWithPhone, verifyOTP, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      // Remove any non-digit characters from phone number
      const cleanPhone = formData.phone.replace(/\D/g, '');
      
      // Check if phone number is valid (10 digits for India)
      if (cleanPhone.length !== 10) {
        setError('Please enter a valid 10-digit phone number');
        return;
      }

      // Basic email validation
      if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
        setError('Please enter a valid email address');
        return;
      }

      // Basic name validation
      if (formData.name.trim().length < 3) {
        setError('Name must be at least 3 characters long');
        return;
      }

      // Format phone number to E.164 format for India (+91)
      const formattedPhone = `+91${cleanPhone}`;
      const result = await loginWithPhone(formattedPhone);
      setVerificationId(result.verificationId);

      // Save user data to localStorage for later use after OTP verification
      localStorage.setItem('pendingSignupData', JSON.stringify({
        name: formData.name.trim(),
        phone: formattedPhone,
        email: formData.email.trim(),
      }));
    } catch (error: any) {
      console.error('Phone verification error:', error);
      setError(error.message || 'Failed to send OTP. Please try again.');
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!verificationId) {
      setError('Please request OTP first');
      return;
    }

    try {
      await verifyOTP(verificationId, otp);
      
      // After successful verification, create user profile
      const pendingData = localStorage.getItem('pendingSignupData');
      if (pendingData) {
        // TODO: Save user profile data to your database
        localStorage.removeItem('pendingSignupData');
      }
      
      navigate('/profile');
    } catch (error) {
      console.error('OTP verification error:', error);
      setError('Invalid OTP. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto bg-white min-h-screen">
        {/* Header */}
        <header className="p-4 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1 rounded-full hover:bg-gray-100">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold">Sign Up</h1>
        </header>

        <div className="p-4">
          <div className="max-w-sm mx-auto space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Create Account
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Please fill in your details to create an account
              </p>
            </div>

            {!verificationId ? (
              <form onSubmit={handleSendOTP} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <div className="mt-1">
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <div className="mt-1">
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Enter your mobile number"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email (Optional)
                  </label>
                  <div className="mt-1">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Enter your email (optional)"
                    />
                  </div>
                </div>

                {error && (
                  <div className="rounded-md bg-red-50 p-4">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading || !formData.name || !formData.phone}
                  className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    (isLoading || !formData.name || !formData.phone) ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isLoading ? 'Sending OTP...' : 'Send OTP'}
                </button>

                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link to="/login" className="text-blue-600 hover:text-blue-500">
                      Login here
                    </Link>
                  </p>
                </div>
              </form>
            ) : (
              <form onSubmit={handleVerifyOTP} className="space-y-6">
                <div>
                  <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                    Enter OTP
                  </label>
                  <div className="mt-1">
                    <input
                      id="otp"
                      name="otp"
                      type="text"
                      required
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Enter OTP sent to your phone"
                    />
                  </div>
                </div>

                {error && (
                  <div className="rounded-md bg-red-50 p-4">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}

                <div className="space-y-4">
                  <button
                    type="submit"
                    disabled={isLoading || !otp}
                    className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                      (isLoading || !otp) ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {isLoading ? 'Verifying...' : 'Verify OTP'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setVerificationId(null)}
                    className="w-full text-sm text-blue-600 hover:text-blue-500"
                  >
                    Change Details
                  </button>
                </div>
              </form>
            )}

            <div id="recaptcha-container"></div>
          </div>
        </div>
      </div>
    </div>
  );
} 
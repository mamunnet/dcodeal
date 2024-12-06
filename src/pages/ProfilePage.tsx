import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AccountPage } from '../components/account/AccountPage';
import { userService } from '../lib/services/user';
import { Auth } from '../lib/auth';

export function ProfilePage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication
  useEffect(() => {
    const auth = Auth.getInstance();
    const user = auth.getCurrentUser();
    if (!user) {
      navigate('/login', { state: { from: '/profile' } });
    } else {
      setIsLoading(false);
    }
  }, [navigate]);

  const handleBack = () => {
    navigate(-1);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-sm">
          <p className="text-center text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return <AccountPage onBack={handleBack} />;
} 
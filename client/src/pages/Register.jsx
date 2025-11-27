import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    // Simulate registration - in real app, call your authentication API
    console.log('Register:', formData);
    navigate('/dashboard');
  };

  const handleGoogleSignUp = () => {
    // Simulate Google sign-up
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#4361ee] to-[#3f37c9] p-5">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2.5 mb-4 text-3xl font-bold text-[#4361ee]">
            <div className="bg-gradient-to-br from-[#4361ee] to-[#3f37c9] w-9 h-9 rounded-lg flex items-center justify-center text-white">
              <i className="fas fa-tasks"></i>
            </div>
            <span>TaskFlow</span>
          </div>
          <h2 className="text-2xl font-semibold mb-2 text-gray-800">Create Account</h2>
          <p className="text-gray-600 text-sm">Sign up to get started with TaskFlow</p>
        </div>

        <form onSubmit={handleSubmit}>
          <Input
            label="Full Name"
            type="text"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <Input
            label="Email Address"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />

          <Input
            label="Password"
            type="password"
            placeholder="Create a password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />

          <Input
            label="Confirm Password"
            type="password"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            required
          />

          <Button type="submit" className="w-full mb-5">
            Create Account
          </Button>
        </form>

        <div className="text-center relative my-5 text-gray-600 before:content-[''] before:absolute before:top-1/2 before:left-0 before:w-[45%] before:h-px before:bg-gray-200 after:content-[''] after:absolute after:top-1/2 after:right-0 after:w-[45%] after:h-px after:bg-gray-200">
          or continue with
        </div>

        <Button onClick={handleGoogleSignUp} variant="google" className="w-full">
          <i className="fab fa-google"></i> Sign up with Google
        </Button>

        <div className="text-center mt-5 text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-[#4361ee] no-underline font-medium hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;

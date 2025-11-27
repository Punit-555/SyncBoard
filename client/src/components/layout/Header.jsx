import { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';
import Drawer from '../ui/Drawer';

const Header = ({ onCreateTask }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <>
<header className="bg-white shadow-md sticky top-0 z-[100] m-4 rounded-[26px] border border-gray-200">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to="/dashboard" className="flex items-center gap-2.5 font-bold text-2xl text-[#4361ee] no-underline">
              <div className="bg-gradient-to-br from-[#4361ee] to-[#3f37c9] w-9 h-9 rounded-lg flex items-center justify-center text-white">
                <i className="fas fa-tasks"></i>
              </div>
              <span className="hidden sm:inline">TaskFlow</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex gap-5">
              <Link to="/dashboard" className="no-underline text-gray-600 font-medium hover:text-[#4361ee] transition-colors">
                Dashboard
              </Link>
              <Link to="/tasks" className="no-underline text-gray-600 font-medium hover:text-[#4361ee] transition-colors">
                My Tasks
              </Link>
              <Link to="/teams" className="no-underline text-gray-600 font-medium hover:text-[#4361ee] transition-colors">
                Teams
              </Link>
              <Link to="/calendar" className="no-underline text-gray-600 font-medium hover:text-[#4361ee] transition-colors">
                Calendar
              </Link>
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-4">
              <Button onClick={onCreateTask} variant="outline" className="hidden lg:flex">
                <i className="fas fa-plus"></i> New Task
              </Button>
              <Button onClick={onCreateTask} variant="outline" className="lg:hidden">
                <i className="fas fa-plus"></i>
              </Button>
              <div className="w-10 h-10 rounded-full bg-[#4895ef] flex items-center justify-center text-white font-semibold cursor-pointer hover:bg-[#4361ee] transition-colors">
                <span>JD</span>
              </div>
            </div>

            {/* Mobile Hamburger Menu */}
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
            >
              <i className="fas fa-bars text-xl text-gray-700"></i>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </>
  );
};

export default Header;

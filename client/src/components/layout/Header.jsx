import { useState } from 'react';
import { Link } from 'react-router-dom';
import Drawer from '../ui/Drawer';
import ProfileDropdown from '../ui/ProfileDropdown';
import ProfileEditModal from '../ui/ProfileEditModal';
import { useAuth } from '../../hooks/useAuth';

const Header = () => {
  const { user } = useAuth();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  return (
    <>
<header className="bg-white shadow-md sticky top-0 z-100 m-4 rounded-[26px] border border-gray-200">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to="/dashboard" className="flex items-center gap-2.5 font-bold text-2xl text-[#4361ee] no-underline">
              <div className="bg-linear-to-br from-[#4361ee] to-[#3f37c9] w-9 h-9 rounded-lg flex items-center justify-center text-white">
                <i className="fas fa-tasks"></i>
              </div>
              <span className="hidden sm:inline">SyncBoard</span>
            </Link>

            {/* Desktop User Info */}
            <div className="hidden md:flex items-center gap-4">
              <ProfileDropdown onEditProfile={() => setIsProfileModalOpen(true)} />
            </div>

            <button
              onClick={() => setIsDrawerOpen(true)}
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
            >
              <i className="fas fa-bars text-xl text-gray-700"></i>
            </button>
          </div>
        </div>
      </header>

      <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />

      <ProfileEditModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </>
  );
};

export default Header;

import { useState } from 'react';
import { Link } from 'react-router-dom';
import Drawer from '../ui/Drawer';
import ProfileDropdown from '../ui/ProfileDropdown';
import ProfileEditModal from '../ui/ProfileEditModal';
import NotificationBell from '../ui/NotificationBell';

const Header = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  return (
    <>
      <header className="bg-white border-b border-gray-100 shrink-0 z-40">
        <div className="px-6 py-3 flex justify-between items-center">
          {/* Logo — visible on mobile only (desktop shows in sidebar area) */}
          <Link
            to="/dashboard"
            className="flex items-center gap-2 font-bold text-xl text-[#4361ee] no-underline md:hidden"
          >
            <div className="bg-linear-to-br from-[#4361ee] to-[#3f37c9] w-8 h-8 rounded-lg flex items-center justify-center text-white">
              <i className="fas fa-tasks text-sm"></i>
            </div>
            <span>SyncBoard</span>
          </Link>

          {/* Spacer on desktop so right-side controls stay right */}
          <div className="hidden md:block" />

          {/* Right side */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-4">
              <NotificationBell />
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

      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onEditProfile={() => { setIsDrawerOpen(false); setIsProfileModalOpen(true); }}
      />

      <ProfileEditModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </>
  );
};

export default Header;

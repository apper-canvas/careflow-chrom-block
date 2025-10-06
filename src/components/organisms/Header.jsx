import { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import SearchBar from "@/components/molecules/SearchBar";

const Header = ({ onMenuClick }) => {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="flex items-center justify-between px-4 lg:px-8 py-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ApperIcon name="Menu" size={24} className="text-gray-600" />
          </button>
          
          <div className="hidden sm:block flex-1 max-w-md">
            <SearchBar placeholder="Search patients, appointments..." />
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative">
            <ApperIcon name="Bell" size={20} className="text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <ApperIcon name="Settings" size={20} className="text-gray-600" />
          </button>

          <div className="hidden lg:flex items-center space-x-3 pl-3 border-l border-gray-200">
            <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-full p-2">
              <ApperIcon name="User" className="w-5 h-5 text-white" />
            </div>
            <div className="hidden xl:block">
              <p className="text-sm font-semibold text-gray-900">Dr. Admin</p>
              <p className="text-xs text-gray-600">Administrator</p>
            </div>
          </div>
        </div>
      </div>

      <div className="sm:hidden px-4 pb-4">
        <SearchBar placeholder="Search patients..." />
      </div>
    </header>
  );
};

export default Header;
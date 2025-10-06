import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const MobileSidebar = ({ isOpen, onClose }) => {
  const navItems = [
    { path: "/dashboard", icon: "LayoutDashboard", label: "Dashboard" },
    { path: "/patients", icon: "Users", label: "Patients" },
    { path: "/appointments", icon: "Calendar", label: "Appointments" },
    { path: "/departments", icon: "Building2", label: "Departments" },
    { path: "/reports", icon: "FileText", label: "Reports" }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 bottom-0 w-64 bg-white z-50 lg:hidden shadow-2xl"
          >
            <div className="flex items-center justify-between px-6 py-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg p-2 shadow-lg">
                  <ApperIcon name="Activity" className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                    CareFlow
                  </h1>
                  <p className="text-xs text-gray-500">Hospital Management</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ApperIcon name="X" size={20} className="text-gray-600" />
              </button>
            </div>

            <nav className="px-4 py-6 space-y-1 overflow-y-auto h-[calc(100vh-200px)]">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-gradient-to-r from-primary-50 to-primary-100 text-primary-700 shadow-sm"
                        : "text-gray-700 hover:bg-gray-50"
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <ApperIcon 
                        name={item.icon} 
                        size={20}
                        className={cn(
                          "transition-colors",
                          isActive ? "text-primary-600" : "text-gray-500"
                        )}
                      />
                      <span>{item.label}</span>
                    </>
                  )}
                </NavLink>
              ))}
            </nav>

            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
              <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-full p-2">
                    <ApperIcon name="User" className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">Dr. Admin</p>
                    <p className="text-xs text-gray-600 truncate">admin@careflow.com</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileSidebar;
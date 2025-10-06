import { NavLink } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const DesktopSidebar = () => {
  const navItems = [
    { path: "/dashboard", icon: "LayoutDashboard", label: "Dashboard" },
    { path: "/patients", icon: "Users", label: "Patients" },
    { path: "/appointments", icon: "Calendar", label: "Appointments" },
    { path: "/departments", icon: "Building2", label: "Departments" },
    { path: "/reports", icon: "FileText", label: "Reports" }
  ];

  return (
    <aside className="hidden lg:flex lg:flex-col w-64 bg-white border-r border-gray-200 h-screen sticky top-0">
      <div className="flex items-center space-x-3 px-6 py-6 border-b border-gray-200">
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

      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
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

      <div className="p-4 border-t border-gray-200">
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
    </aside>
  );
};

export default DesktopSidebar;
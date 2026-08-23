
import { Link, useLocation } from "react-router-dom";

const Navigation = () => {
  const location = useLocation();
  
  const navItems = [
    { name: "Home", path: "/" },
    { name: "Login", path: "/login" },
    { name: "Lost an Item", path: "/lost-item" },
    { name: "Found an Item", path: "/found-item" },
    { name: "View All Lost Items", path: "/lost-items" },
    { name: "View All Found Items", path: "/found-items" },
    { name: "History", path: "/claim-history" },
    { name: "Contact Us", path: "/contact" },
   
  ];

  return (
    <nav className="bg-blue-600 text-white py-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`hover:text-blue-200 transition-colors ${
                location.pathname === item.path ? "text-blue-200 font-semibold" : ""
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;

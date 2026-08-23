
import Navigation from "./Navigation";
import BadgeDisplay from "./BadgeDisplay";

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  showHero?: boolean;
  userBadges?: string[];
}

const Layout = ({ children, title, showHero = false, userBadges = [] }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-600 text-white py-8 relative">
        {/* User badges in top-right corner */}
        {userBadges.length > 0 && (
          <div className="absolute top-4 right-4 z-10">
            <BadgeDisplay badges={userBadges} className="justify-end" />
          </div>
        )}
        
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to MGIT Lost and Found</h1>
          
          {/* MGIT Logo placeholder */}
          <div className="bg-white rounded-lg p-4 inline-block mb-6">
           {/* <div className="text-gray-800 font-bold text-lg">
              MAHATMA GANDHI<br />
              INSTITUTE OF TECHNOLOGY
            </div>
            <div className="text-orange-600 text-sm mt-1">
              AUTONOMOUS | Affiliated to JNTUH
            </div>*/}
            <img src="/src/components/download.png" alt="MGIT_Official_Logo" ></img>
          </div>
        </div>
        <Navigation />
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {title && (
          <div className="bg-blue-600 text-white text-center py-8">
            <h2 className="text-3xl font-bold">{title}</h2>
          </div>
        )}
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-blue-600 text-white text-center py-4 mt-8">
        <p>&copy; 2025 Lost and Found MGIT</p>
      </footer>
    </div>
  );
};

export default Layout;

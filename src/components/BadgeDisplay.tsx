
import { Badge } from "@/components/ui/badge";
import { Trophy, Star, Heart, Award, LucideIcon } from "lucide-react";

interface BadgeDisplayProps {
  badges: string[];
  className?: string;
}

interface BadgeConfig {
  icon: LucideIcon;
  color: string;
  description: string;
}

const BadgeDisplay = ({ badges, className = "" }: BadgeDisplayProps) => {
  const badgeConfig: Record<string, BadgeConfig> = {
    "Good Samaritan": { 
      icon: Heart, 
      color: "bg-red-100 text-red-800", 
      description: "Reported a found item" 
    },
    "Helper": { 
      icon: Star, 
      color: "bg-blue-100 text-blue-800", 
      description: "Helped multiple people" 
    },
    "Hero": { 
      icon: Trophy, 
      color: "bg-yellow-100 text-yellow-800", 
      description: "Reported 5+ found items" 
    },
    "Legend": { 
      icon: Award, 
      color: "bg-purple-100 text-purple-800", 
      description: "Reported 10+ found items" 
    }
  };

  if (badges.length === 0) return null;

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {badges.map((badgeName) => {
        const config = badgeConfig[badgeName];
        if (!config) return null;
        
        const IconComponent = config.icon;
        
        return (
          <Badge
            key={badgeName}
            className={`${config.color} flex items-center gap-1 px-2 py-1`}
            title={config.description}
          >
            <IconComponent className="w-3 h-3" />
            {badgeName}
          </Badge>
        );
      })}
    </div>
  );
};

export default BadgeDisplay;

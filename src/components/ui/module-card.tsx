import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronRight, LucideIcon } from "lucide-react";

interface ModuleCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  features: string[];
  userType: string;
  gradient: string;
  onClick?: () => void;
}

export function ModuleCard({ 
  title, 
  description, 
  icon: Icon, 
  features, 
  userType, 
  gradient,
  onClick 
}: ModuleCardProps) {
  return (
    <Card className="group relative overflow-hidden backdrop-blur-sm border-white/20 bg-white/10 hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-elegant cursor-pointer">
      <div className={`absolute inset-0 opacity-10 ${gradient}`} />
      
      <CardHeader className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl ${gradient} text-white`}>
            <Icon className="h-6 w-6" />
          </div>
          <Badge variant="secondary" className="text-xs">
            {userType}
          </Badge>
        </div>
        <CardTitle className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
          {title}
        </CardTitle>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {description}
        </p>
      </CardHeader>

      <CardContent className="relative">
        <div className="space-y-2 mb-6">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center text-sm text-muted-foreground">
              <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3" />
              {feature}
            </div>
          ))}
        </div>
        
        <Button 
          variant="ghost" 
          className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300"
          onClick={onClick}
        >
          Accéder au module
          <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </CardContent>
    </Card>
  );
}
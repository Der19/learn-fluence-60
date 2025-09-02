import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
  variant: "success" | "warning" | "info" | "primary";
}

const variantStyles = {
  success: "bg-success/10 text-success border-success/20",
  warning: "bg-warning/10 text-warning border-warning/20", 
  info: "bg-info/10 text-info border-info/20",
  primary: "bg-primary/10 text-primary border-primary/20"
};

const variantBg = {
  success: "bg-success",
  warning: "bg-warning",
  info: "bg-info", 
  primary: "bg-primary"
};

export function StatsCard({ title, value, change, icon: Icon, variant }: StatsCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">
              {title}
            </p>
            <p className="text-2xl font-bold text-foreground">
              {value}
            </p>
            <p className={`text-xs font-medium mt-1 ${variantStyles[variant]}`}>
              {change}
            </p>
          </div>
          <div className={`p-3 rounded-full ${variantBg[variant]}`}>
            <Icon className="h-5 w-5 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
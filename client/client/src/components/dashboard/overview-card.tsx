import { cn } from "@/lib/utils";
import { 
  DollarSign, 
  BarChart2,
  TrendingUp,
  TrendingDown,
  FileCog
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

type OverviewCardProps = {
  title: string;
  value: number;
  type: "budget" | "realization" | "remaining" | "document";
  changeValue?: number;
  changeText?: string;
  isPendingValue?: number;
  className?: string;
};

export function OverviewCard({
  title,
  value,
  type,
  changeValue,
  changeText,
  isPendingValue,
  className
}: OverviewCardProps) {
  const getIcon = () => {
    switch (type) {
      case "budget":
        return <DollarSign className="w-6 h-6 text-primary" />;
      case "realization":
        return <BarChart2 className="w-6 h-6 text-green-600" />;
      case "remaining":
        return <TrendingDown className="w-6 h-6 text-amber-500" />;
      case "document":
        return <FileCog className="w-6 h-6 text-purple-600" />;
      default:
        return <DollarSign className="w-6 h-6 text-primary" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case "budget":
        return "bg-blue-50";
      case "realization":
        return "bg-green-50";
      case "remaining":
        return "bg-amber-50";
      case "document":
        return "bg-purple-50";
      default:
        return "bg-blue-50";
    }
  };

  return (
    <Card className={cn("p-6 hover:shadow-md transition-shadow", className)}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-neutral-500">{title}</p>
          <p className="text-2xl font-semibold mt-1">
            {type === "document" 
              ? value.toLocaleString() 
              : formatCurrency(value)
            }
          </p>
          <p className="text-xs mt-1 flex items-center">
            {changeValue !== undefined && (
              <>
                {changeValue > 0 ? (
                  <TrendingUp className="w-3 h-3 mr-1 text-green-600" />
                ) : (
                  <TrendingDown className="w-3 h-3 mr-1 text-red-600" />
                )}
                <span className={changeValue > 0 ? "text-green-600" : "text-red-600"}>
                  {changeText}
                </span>
              </>
            )}
            {isPendingValue !== undefined && (
              <span className="text-red-600">
                {isPendingValue} menunggu persetujuan
              </span>
            )}
            {!changeValue && !isPendingValue && type === "realization" && (
              <span className="text-neutral-500">
                {((value / value) * 100).toFixed(1)}% dari total anggaran
              </span>
            )}
            {!changeValue && !isPendingValue && type === "remaining" && (
              <span className="text-neutral-500">
                {((value / value) * 100).toFixed(1)}% dari total anggaran
              </span>
            )}
          </p>
        </div>
        <div className={cn("p-2 rounded-full", getBgColor())}>
          {getIcon()}
        </div>
      </div>
    </Card>
  );
}

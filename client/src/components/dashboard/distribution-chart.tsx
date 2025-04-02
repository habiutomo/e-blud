import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

type DistributionChartProps = {
  data: Array<{
    name: string;
    percentage: number;
  }>;
  realizationPercentage: number;
};

export function DistributionChart({ data, realizationPercentage }: DistributionChartProps) {
  const COLORS = ["#0078D4", "#2B88D8", "#106EBE", "#A19F9D"];
  
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-neutral-200 shadow-sm rounded-md">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-primary">{`${payload[0].value}%`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="h-full">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Distribusi Anggaran</h2>
          <Button variant="link" className="text-primary p-0 h-auto">Detail</Button>
        </div>
        <div className="h-64 w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="percentage"
                nameKey="name"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              {/* Center text */}
              <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-2xl font-bold"
                fill="#323130"
              >
                {`${realizationPercentage.toFixed(1)}%`}
              </text>
              <text
                x="50%"
                y="58%"
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-xs"
                fill="#605E5C"
              >
                Realisasi
              </text>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          {data.map((item, index) => (
            <div key={index} className="flex items-center">
              <div 
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              ></div>
              <span className="text-xs">{item.name} ({item.percentage}%)</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

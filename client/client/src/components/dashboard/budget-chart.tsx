import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { formatCurrency } from "@/lib/utils";

type BudgetChartProps = {
  data: Array<{
    month: string;
    amount: number;
  }>;
};

export function BudgetChart({ data }: BudgetChartProps) {
  const [selectedYear, setSelectedYear] = useState("2025");

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-neutral-200 shadow-sm rounded-md">
          <p className="font-medium">{label}</p>
          <p className="text-primary">{formatCurrency(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="h-full">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Realisasi Anggaran</h2>
          <Select 
            defaultValue={selectedYear} 
            onValueChange={setSelectedYear}
          >
            <SelectTrigger className="w-36 h-8 text-sm">
              <SelectValue placeholder="Pilih Tahun" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2025">Tahun 2025</SelectItem>
              <SelectItem value="2024">Tahun 2024</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 5,
                right: 10,
                left: 20,
                bottom: 5,
              }}
            >
              <XAxis 
                dataKey="month" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#605E5C' }}
              />
              <YAxis 
                hide 
                tickFormatter={(value) => `${value / 1000000}M`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="amount" 
                fill="#0078D4" 
                barSize={20} 
                radius={[4, 4, 0, 0]}
                // Highlight current month
                fillOpacity={(entry) => {
                  const currentMonth = new Date().toLocaleString('en-US', { month: 'short' });
                  return entry.month === currentMonth ? 1 : 0.7;
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

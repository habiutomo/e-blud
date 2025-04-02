import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Clock, XCircle } from "lucide-react";
import { Transaction } from "@shared/schema";
import { cn, formatCurrency, formatDate } from "@/lib/utils";

interface RecentTransactionsProps {
  transactions: Transaction[];
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <div className="p-2 rounded-full bg-blue-50">
            <CheckCircle2 className="w-6 h-6 text-primary" />
          </div>
        );
      case "pending":
        return (
          <div className="p-2 rounded-full bg-yellow-50">
            <Clock className="w-6 h-6 text-amber-500" />
          </div>
        );
      case "rejected":
        return (
          <div className="p-2 rounded-full bg-red-50">
            <XCircle className="w-6 h-6 text-red-600" />
          </div>
        );
      default:
        return (
          <div className="p-2 rounded-full bg-blue-50">
            <CheckCircle2 className="w-6 h-6 text-primary" />
          </div>
        );
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "approved":
        return "text-green-600";
      case "pending":
        return "text-amber-500";
      case "rejected":
        return "text-red-600";
      default:
        return "text-green-600";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "approved":
        return "Disetujui";
      case "pending":
        return "Menunggu";
      case "rejected":
        return "Ditolak";
      default:
        return "Disetujui";
    }
  };

  return (
    <Card className="h-full">
      <div className="px-6 py-4 border-b border-neutral-200 flex justify-between items-center">
        <h2 className="text-lg font-semibold">Transaksi Terbaru</h2>
        <Button variant="link" className="text-primary p-0 h-auto">Lihat Semua</Button>
      </div>
      <div className="divide-y divide-neutral-200">
        {transactions.length === 0 ? (
          <div className="p-6 text-center text-neutral-500">
            Tidak ada transaksi terbaru
          </div>
        ) : (
          transactions.map((transaction) => (
            <div key={transaction.id} className="px-6 py-4 flex justify-between items-center">
              <div className="flex items-center">
                {getStatusIcon(transaction.status)}
                <div className="ml-4">
                  <p className="font-medium">{transaction.description}</p>
                  <p className="text-xs text-neutral-500">
                    {formatDate(transaction.transactionDate)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">{formatCurrency(transaction.amount)}</p>
                <p className={cn("text-xs", getStatusClass(transaction.status))}>
                  {getStatusText(transaction.status)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}

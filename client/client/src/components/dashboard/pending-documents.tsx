import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileCog } from "lucide-react";
import { Document } from "@shared/schema";
import { formatDate } from "@/lib/utils";

interface PendingDocumentsProps {
  documents: Document[];
}

export function PendingDocuments({ documents }: PendingDocumentsProps) {
  return (
    <Card className="h-full">
      <div className="px-6 py-4 border-b border-neutral-200 flex justify-between items-center">
        <h2 className="text-lg font-semibold">Dokumen Menunggu Persetujuan</h2>
        <Button variant="link" className="text-primary p-0 h-auto">Lihat Semua</Button>
      </div>
      <div className="divide-y divide-neutral-200">
        {documents.length === 0 ? (
          <div className="p-6 text-center text-neutral-500">
            Tidak ada dokumen yang menunggu persetujuan
          </div>
        ) : (
          documents.map((document) => (
            <div key={document.id} className="px-6 py-4 flex justify-between items-center">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-purple-50 mr-4">
                  <FileCog className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium">{document.title}</p>
                  <p className="text-xs text-neutral-500">
                    Diajukan: {document.submissionDate 
                      ? formatDate(document.submissionDate) 
                      : formatDate(document.createdAt)}
                  </p>
                </div>
              </div>
              <div>
                <Button size="sm" className="bg-primary text-white px-3 py-1 h-auto text-xs">
                  Review
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}

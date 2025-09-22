"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

type SubmissionActionButtonsProps = {
  submissionId: number;
  onApprove: () => Promise<void>;
  onReject: () => Promise<void>;
};

export default function SubmissionActionButtons({
  submissionId,
  onApprove,
  onReject,
}: SubmissionActionButtonsProps) {
  const [isPending, startTransition] = useTransition();

  const handleApprove = () => {
    startTransition(async () => {
      await onApprove();
    });
  };

  const handleReject = () => {
    startTransition(async () => {
      await onReject();
    });
  };

  return (
    <div className="flex gap-2">
      <Button
        onClick={handleApprove}
        disabled={isPending}
        size="sm"
        className="bg-green-500 hover:bg-green-600 border-2 border-black font-bold uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-200"
      >
        <Check className="h-4 w-4 mr-2" />
        {isPending ? "..." : "Approve"}
      </Button>
      <Button
        onClick={handleReject}
        disabled={isPending}
        size="sm"
        className="bg-red-500 hover:bg-red-600 text-white border-2 border-black font-bold uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-200"
      >
        <X className="h-4 w-4 mr-2" />
        {isPending ? "..." : "Reject"}
      </Button>
    </div>
  );
}

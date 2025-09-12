import * as React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface BrutalCardProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

const BrutalCard = React.forwardRef<HTMLDivElement, BrutalCardProps>(
  ({ className, ...props }, ref) => (
    <Card
      ref={ref}
      className={cn(
        "border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]",
        className,
      )}
      {...props}
    />
  ),
);
BrutalCard.displayName = "BrutalCard";

// Kita juga bisa export ulang sub-komponennya untuk kemudahan
export {
  BrutalCard,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
};

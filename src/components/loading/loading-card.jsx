// shadcn component
import { Card } from "@/components/ui/card";

export default function LoadingCard() {
  return (
    <div className="card_section flex gap-x-5">
      <Card
        className={
          "min-w-[360px] min-h-[230px] lg:max-w-[400px] bg-[#e0e0e0] animate-pulse"
        }
      ></Card>
      <Card
        className={
          "min-w-[360px] min-h-[230px] lg:max-w-[400px] bg-[#e0e0e0] animate-pulse"
        }
      ></Card>
      <Card
        className={
          "min-w-[360px] min-h-[230px] lg:max-w-[400px] bg-[#e0e0e0] animate-pulse"
        }
      ></Card>
      <Card
        className={
          "min-w-[360px] min-h-[230px] lg:max-w-[400px] bg-[#e0e0e0] animate-pulse"
        }
      ></Card>
    </div>
  );
}

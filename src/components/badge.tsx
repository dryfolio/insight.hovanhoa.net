import { cn } from "@/lib/utils";

export default function Badge({
  label,
  className,
}: {
  label: string;
  className: string;
}) {
  // This is temporary, and will replace this with a more dynamic solution
  const getColor = (label: string) => {
    switch (label) {
      case "Web Development":
        return "bg-sky-100 text-sky-800 border-sky-200";
      case "General Programming":
        return "bg-green-100 text-green-800 border-green-200";
      case "Web3":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "JavaScript":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
    }
  };

  const color = getColor(label);
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border",
        color,
        className
      )}
    >
      <svg
        className={cn("h-2 w-2 mr-1.5", color)}
        fill="currentColor"
        viewBox="0 0 8 8"
      >
        <circle cx="4" cy="4" r="3" />
      </svg>
      {label}
    </span>
  );
}

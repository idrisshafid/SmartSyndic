import { User } from "lucide-react";

interface OwnerFigureProps {
  firstName?: string;
  lastName?: string;
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
  status?: "active" | "inactive";
  showStatus?: boolean;
  className?: string;
  onClick?: () => void;
}

const sizeMap = {
  sm: {
    container: "h-12 w-12",
    text: "text-sm",
    icon: 18,
    ring: "ring-2",
  },
  md: {
    container: "h-16 w-16",
    text: "text-lg",
    icon: 24,
    ring: "ring-2",
  },
  lg: {
    container: "h-20 w-20",
    text: "text-2xl",
    icon: 30,
    ring: "ring-3",
  },
  xl: {
    container: "h-28 w-28",
    text: "text-3xl",
    icon: 40,
    ring: "ring-4",
  },
  "2xl": {
    container: "h-40 w-40",
    text: "text-5xl",
    icon: 56,
    ring: "ring-4",
  },
};

const statusColors = {
  active: "bg-green-500 ring-2 ring-white",
  inactive: "bg-slate-400 ring-2 ring-white",
};

export default function OwnerFigure({
  firstName = "",
  lastName = "",
  size = "md",
  status = "active",
  showStatus = true,
  className = "",
  onClick,
}: OwnerFigureProps) {
  const initials = `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase() || "?";
  const sizeConfig = sizeMap[size];
  const fullName = `${firstName} ${lastName}`.trim() || "Owner";

  const hasName = firstName || lastName;

  return (
    <div
      className={`
        relative inline-flex flex-col items-center gap-2
        ${onClick ? "cursor-pointer" : ""}
        ${className}
      `}
      onClick={onClick}
    >
      {/* Avatar Container */}
      <div
            className={`
      relative flex items-center justify-center
      rounded-full bg-gradient-to-br from-orange-400 to-orange-600
      shadow-lg shadow-orange-200/50
      transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-orange-300/50
      ${sizeConfig.container}
      ${sizeConfig.ring} ring-orange-100/50
    `}
      >
        {hasName ? (
          <span className={`font-bold text-white ${sizeConfig.text}`}>
            {initials}
          </span>
        ) : (
          <User size={sizeConfig.icon} className="text-white/80" strokeWidth={1.5} />
        )}

        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-t from-black/10 to-transparent" />

        {/* Status Indicator */}
        {showStatus && (
          <div
            className={`
              absolute -bottom-0.5 -right-0.5
              h-4 w-4 rounded-full
              ${statusColors[status]}
              transition-all duration-300
              group-hover:scale-110
            `}
          >
            <div className="absolute inset-0 rounded-full bg-white/20 animate-pulse" />
          </div>
        )}
      </div>

      {/* Name Label (optional) */}
      {size === "xl" || size === "2xl" ? (
        <div className="text-center">
          <p className="pt-2 text-3xl font-semibold ">{fullName}</p>
          <p className="pt-2 text-xm capitalize pb-1">{status}</p>
        </div>
      ) : null}
    </div>
  );
}
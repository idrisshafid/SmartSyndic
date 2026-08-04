import type { ButtonHTMLAttributes, ReactNode,
} from "react";

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  loading?: boolean;
}

export default function Button({
  children , loading = false  , disabled, className = "",
  ...props   }  :  ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`
        w-full
        h-12
        rounded-xl
        bg-orange-500
        hover:bg-orange-600
        active:scale-[0.98]
        text-white
        font-semibold
        text-sm
        shadow-lg
        shadow-orange-500/20
        transition-all
        duration-200
        disabled:opacity-50
        disabled:cursor-not-allowed
        flex
        items-center
        justify-center
        gap-2         ${className}`}        >

      {loading ? (
        <>
          <div className="w-5 h-5 border-2 border-white border-t-transparent
           rounded-full animate-spin" />
          Signing in...    </>   ) : ( children)   }
 
    </button>
  
);
}
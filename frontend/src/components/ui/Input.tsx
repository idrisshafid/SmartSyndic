import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";

interface InputProps
  extends InputHTMLAttributes<HTMLInputElement> {
  label: string  ;   error?: string;                                }

const Input = forwardRef<HTMLInputElement, InputProps>    (  
  
    ({ label  , error  ,  className = "" ,   ...props    } , ref
  ) => {
    return (

      <div className="space-y-2">

        <label   className="block w-full text-left text-sm font-semibold ">
          {label}
        </label>

        <input
          ref={ref}
          {...props}
          className={`
            w-full
            h-12
            rounded-xl
            border
            border-slate-300
            px-4
            
            
            outline-none
            transition-all
            duration-200
            focus:border-orange-500
            focus:ring-4
            focus:ring-orange-100    
            ${   error
                ? "border-red-500 focus:ring-red-100"
                : ""     }

            ${className}           `}       />

        {error && (
  <p className="text-sm text-red-500 mt-1">
    {error}
  </p>    )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
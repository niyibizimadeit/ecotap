"use client";

import { cn } from "@/lib/utils";
import { forwardRef, useId } from "react";

// ── Base field wrapper ────────────────────────────────────────────────────────

interface FieldWrapperProps {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  htmlFor?: string;
  errorId?: string;
  children: React.ReactNode;
  className?: string;
}

export function FieldWrapper({ label, error, hint, required, htmlFor, errorId, children, className }: FieldWrapperProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && (
        <label htmlFor={htmlFor} className="text-sm font-medium text-ink-mid">
          {label}
          {required && <span className="text-red-500 ml-0.5" aria-hidden="true">*</span>}
        </label>
      )}
      {children}
      {error && <p id={errorId} className="text-xs text-red-600" role="alert">{error}</p>}
      {hint && !error && <p className="text-xs text-ink-light">{hint}</p>}
    </div>
  );
}

// ── Input ─────────────────────────────────────────────────────────────────────

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
  wrapperClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leftElement, rightElement, wrapperClassName, className, required, id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const errorId = `${inputId}-error`;

    return (
      <FieldWrapper label={label} error={error} hint={hint} required={required} htmlFor={inputId} errorId={errorId} className={wrapperClassName}>
        <div className="relative flex items-center">
          {leftElement && (
            <div className="absolute left-3 text-ink-light pointer-events-none">{leftElement}</div>
          )}
          <input
            ref={ref}
            id={inputId}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : undefined}
            aria-required={required}
            className={cn(
              "w-full h-10 bg-cream border border-cream-dark rounded-xl px-3 text-sm text-ink placeholder:text-ink-light/60",
              "transition-all duration-150",
              "focus:outline-none focus:border-emerald-bright focus:ring-2 focus:ring-emerald-bright/20",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              error && "border-red-400 focus:border-red-400 focus:ring-red-200",
              leftElement && "pl-9",
              rightElement && "pr-9",
              className
            )}
            required={required}
            {...props}
          />
          {rightElement && (
            <div className="absolute right-3 text-ink-light">{rightElement}</div>
          )}
        </div>
      </FieldWrapper>
    );
  }
);
Input.displayName = "Input";

// ── Textarea ──────────────────────────────────────────────────────────────────

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  wrapperClassName?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, wrapperClassName, className, required, id, ...props }, ref) => {
    const generatedId = useId();
    const textareaId = id ?? generatedId;
    const errorId = `${textareaId}-error`;

    return (
      <FieldWrapper label={label} error={error} hint={hint} required={required} htmlFor={textareaId} errorId={errorId} className={wrapperClassName}>
        <textarea
          ref={ref}
          id={textareaId}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          aria-required={required}
          className={cn(
            "w-full bg-cream border border-cream-dark rounded-xl px-3 py-2.5 text-sm text-ink placeholder:text-ink-light/60",
            "transition-all duration-150 resize-none min-h-[100px]",
            "focus:outline-none focus:border-emerald-bright focus:ring-2 focus:ring-emerald-bright/20",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            error && "border-red-400 focus:border-red-400 focus:ring-red-200",
            className
          )}
          required={required}
          {...props}
        />
      </FieldWrapper>
    );
  }
);
Textarea.displayName = "Textarea";

// ── Select ────────────────────────────────────────────────────────────────────

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  placeholder?: string;
  options: { value: string; label: string }[];
  wrapperClassName?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, hint, placeholder, options, wrapperClassName, className, required, id, ...props }, ref) => {
    const generatedId = useId();
    const selectId = id ?? generatedId;
    const errorId = `${selectId}-error`;

    return (
      <FieldWrapper label={label} error={error} hint={hint} required={required} htmlFor={selectId} errorId={errorId} className={wrapperClassName}>
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : undefined}
            aria-required={required}
            className={cn(
              "w-full h-10 bg-cream border border-cream-dark rounded-xl px-3 pr-8 text-sm text-ink appearance-none",
              "transition-all duration-150",
              "focus:outline-none focus:border-emerald-bright focus:ring-2 focus:ring-emerald-bright/20",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              error && "border-red-400 focus:border-red-400 focus:ring-red-200",
              className
            )}
            required={required}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>{placeholder}</option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-ink-light" aria-hidden="true">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </FieldWrapper>
    );
  }
);
Select.displayName = "Select";

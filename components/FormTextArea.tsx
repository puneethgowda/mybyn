import { useId } from "react";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface FormTextAreaProps {
  label?: string;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  name?: string;
  ariaInvalid?: boolean;
  onChange: (value: string) => void;
  className?: string;
}

export default function FormTextArea({
  label,
  placeholder,
  value,
  defaultValue,
  error,
  required = false,
  disabled = false,
  name,
  ariaInvalid = !!error,
  onChange,
  className,
}: FormTextAreaProps) {
  const id = useId();

  return (
    <div className={className ? className : "*:not-first:mt-2"}>
      {label && (
        <Label className="text-muted-foreground mb-1" htmlFor={id}>
          {label}
        </Label>
      )}
      <Textarea
        aria-invalid={ariaInvalid}
        className={error ? "aria-invalid" : ""}
        defaultValue={defaultValue}
        disabled={disabled}
        id={id}
        name={name}
        placeholder={placeholder}
        required={required}
        value={value}
        onChange={e => onChange(e.target.value)}
      />
      {error && (
        <p
          aria-live="polite"
          className="text-destructive mt-2 text-xs"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}

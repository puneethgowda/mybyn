import { useId } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FormInputProps {
  label?: string;
  type?: string;
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

export default function FormInput({
  label = "Input",
  type = "text",
  placeholder = "",
  value,
  defaultValue,
  error,
  required = false,
  disabled = false,
  name,
  ariaInvalid = !!error,
  onChange,
  className,
}: FormInputProps) {
  const id = useId();

  return (
    <div className={className}>
      {label && (
        <Label className="text-muted-foreground mb-1" htmlFor={id}>
          {label}
        </Label>
      )}
      <Input
        aria-invalid={ariaInvalid}
        className={error ? "peer aria-invalid" : "peer"}
        defaultValue={defaultValue}
        disabled={disabled}
        id={id}
        name={name}
        placeholder={placeholder}
        required={required}
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
      />
      {error && (
        <p
          aria-live="polite"
          className="peer-aria-invalid:text-destructive mt-2 text-xs"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}

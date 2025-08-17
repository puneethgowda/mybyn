"use client";

import { RiRefreshLine } from "@remixicon/react";
import { useEffect } from "react";

import { useSliderWithInput } from "@/hooks/use-slider-with-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface SliderControlProps {
  className?: string;
  minValue: number;
  maxValue: number;
  initialValue: [number];
  defaultValue: [number];
  step: number;
  label: string;
  onChange: (value: number[]) => void;
}

export default function SliderControl({
  className,
  minValue,
  maxValue,
  initialValue,
  defaultValue,
  step,
  label,
  onChange,
}: SliderControlProps) {
  const {
    sliderValue,
    inputValues,
    validateAndUpdateValue,
    handleInputChange,
    handleSliderChange,
    resetToDefault,
    showReset,
  } = useSliderWithInput({ minValue, maxValue, initialValue, defaultValue });

  useEffect(() => {
    onChange(sliderValue);
  }, [sliderValue]);

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between gap-2">
        <Label className="font-normal">{label}</Label>
        <div className="flex items-center gap-1">
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  aria-label="Reset"
                  className={cn(
                    "size-7 transition-all text-muted-foreground/70 hover:text-foreground hover:bg-transparent",
                    showReset ? "opacity-100" : "opacity-0 pointer-events-none",
                  )}
                  size="icon"
                  variant="ghost"
                  onClick={resetToDefault}
                >
                  <RiRefreshLine aria-hidden="true" size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="dark px-2 py-1 text-xs">
                Reset to default
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Input
            aria-label="Enter value"
            className="h-6 w-11 px-1 py-0 border-none tabular-nums text-right bg-transparent shadow-none focus:bg-background"
            inputMode="decimal"
            type="text"
            value={inputValues[0]}
            onBlur={() => validateAndUpdateValue(inputValues[0] ?? "", 0)}
            onChange={(e) => handleInputChange(e, 0)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                validateAndUpdateValue(inputValues[0] ?? "", 0);
              }
            }}
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Slider
          aria-label={label}
          className="grow [&>*:first-child]:bg-black/10"
          defaultValue={[25, 75]}
          max={maxValue}
          min={minValue}
          step={step}
          value={sliderValue}
          onValueChange={handleSliderChange}
        />
      </div>
    </div>
  );
}

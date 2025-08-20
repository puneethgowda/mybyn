"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface SliderControlProps {
  minValue: number;
  maxValue: number;
  step: number;
  onChange: (value: number[]) => void;
}

export default function PriceSlider({
  minValue,
  maxValue,
  step,
  onChange,
}: SliderControlProps) {
  const min_price = minValue;
  const max_price = maxValue;
  const [value, setValue] = useState([min_price, max_price]);

  useEffect(() => {
    setValue([min_price, max_price]);
  }, [min_price, max_price]);

  const formatPrice = (price: number) => {
    return price === max_price
      ? `₹${price.toLocaleString()}+`
      : `₹${price.toLocaleString()}`;
  };

  return (
    <div className="*:not-first:mt-3">
      <Label className="tabular-nums font-normal">
        From {formatPrice(value[0])} to {formatPrice(value[1])}
      </Label>
      <div className="flex items-center gap-4">
        <Slider
          aria-label="Price range slider"
          max={max_price}
          min={min_price}
          step={step}
          value={value}
          onValueChange={setValue}
        />
        <Button variant="outline" onClick={() => onChange(value)}>
          Go
        </Button>
      </div>
    </div>
  );
}

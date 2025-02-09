interface NumberInputProps {
  value: number;
  onChange: (value: number) => void;
  max?: number;
  min?: number;
  step?: number;
  className?: string;
  title?: string;
}

export function NumberInput({
  value,
  onChange,
  max = 255,
  min = 0,
  step = 1,
  className,
  title,
}: NumberInputProps) {
  return (
    <input
      type="number"
      value={Math.round(value)}
      max={max}
      min={min}
      step={step}
      onChange={(e) => onChange(Number(e.target.value))}
      className={`rounded-xl border-none px-4 py-2 ${className}`}
      title={title}
    />
  );
}

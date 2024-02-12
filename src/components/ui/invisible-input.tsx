import { InputHTMLAttributes, useEffect, useRef, useState } from 'react';

import { cn } from '@/util/style.util';

interface IProps extends InputHTMLAttributes<HTMLInputElement> {
  value: string;
}

const InvisibleInput = ({ value, placeholder, className, style, ...props }: IProps) => {
  const spanRef = useRef<HTMLSpanElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [width, setWidth] = useState(0);

  useEffect(() => {
    const input = inputRef.current;
    const span = spanRef.current;

    if (!input || !span) return;

    const computedStyle = getComputedStyle(input);
    const paddingX = parseFloat(computedStyle.paddingLeft) + parseFloat(computedStyle.paddingRight);

    setWidth(span.offsetWidth + paddingX + 10);
  }, [value]);

  return (
    <div className="font-mono text-base">
      <span ref={spanRef} className="absolute top-0 opacity-0">
        {value === '' && placeholder ? placeholder : value}
      </span>

      <input
        ref={inputRef}
        className={cn(
          'px-2 py-1 -mx-2 -my-1',
          'border border-transparent hover:border-neutral-800 focus:border-neutral-700 rounded',
          'text-left',
          'transition-colors duration-3O0',
          'appearance-none bg-transparent outline-none',
          className,
        )}
        style={{
          ...style,
          width: `${width}px`,
        }}
        {...{ ...props, value, placeholder }}
      />
    </div>
  );
};

export default InvisibleInput;

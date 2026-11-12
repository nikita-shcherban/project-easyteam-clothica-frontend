'use client';
import { useEffect, useRef, useState } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { useDebouncedCallback } from 'use-debounce';
import { PRICE_MAX } from '@/lib/hooks/useGoodsFilters';
import s from './PriceFilter.module.css';

interface Props {
  min?: number;
  max?: number;
  onChange: (min?: number, max?: number) => void;
}

export default function PriceFilter({ min, max, onChange }: Props) {
  const [range, setRange] = useState<[number, number]>([
    min ?? 0,
    max ?? PRICE_MAX,
  ]);
  const pushed = useRef(range.join());

  // синхронізація з URL (скидання, перехід за посиланням), але не під час перетягування
  useEffect(() => {
    const next: [number, number] = [min ?? 0, max ?? PRICE_MAX];
    if (next.join() !== pushed.current) {
      pushed.current = next.join();
      setRange(next);
    }
  }, [min, max]);

  // запит лише після паузи, а не під час руху повзунка
  const push = useDebouncedCallback((v: [number, number]) => {
    pushed.current = v.join();
    onChange(v[0] > 0 ? v[0] : undefined, v[1] < PRICE_MAX ? v[1] : undefined);
  }, 500);

  return (
    <div>
      <div className={s.slider}>
        <Slider
          range
          min={0}
          max={PRICE_MAX}
          step={50}
          allowCross={false}
          value={range}
          onChange={(v) => {
            const r = v as [number, number];
            setRange(r);
            push(r);
          }}
        />
      </div>
      <div className={s.values}>
        <span>{range[0]}</span>
        <span>{range[1]}</span>
      </div>
    </div>
  );
}

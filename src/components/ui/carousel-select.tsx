'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface CarouselSelectProps {
  options: {
    label: string;
    value: string;
  }[];
  value?: string;
  onChange: (item: string) => void;
}

export default function CarouselSelect({
  options,
  value,
  onChange
}: CarouselSelectProps) {
  let valueIndex = 0;
  if (value) {
    const findIndex = options.findIndex((item) => item.value === value);
    valueIndex = findIndex > -1 ? findIndex : 0;
  }

  const [activeIndex, setActiveIndex] = useState<number>(valueIndex);
  return (
    <div className="py-1">
      <Swiper
        slidesPerView={1}
        spaceBetween={12}
        centerInsufficientSlides={true}
        className="w-full"
        initialSlide={activeIndex}
        onSlideChange={(swiper) => {
          const slide = swiper.activeIndex;
          setActiveIndex(slide);
          const item = options[slide];
          onChange(item.value);
        }}
        navigation
        modules={[Navigation]}
      >
        {options.map((item, index) => (
          <SwiperSlide key={item.value}>
            <div className="w-full flex items-center justify-center">
              <span
                className={cn(
                  'text-xs px-5 py-1 rounded-md transition-all ease-linear delay-300 cursor-pointer',
                  {
                    'bg-card': index === activeIndex
                  }
                )}
              >
                {item.label}
              </span>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

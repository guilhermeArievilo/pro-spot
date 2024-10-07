'use client';

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import CardItem from '../ui/card-item';
import { Item } from '@/application/entities';

interface SlideItemsProps {
  items: Item[];
}

export default function SlideItems({ items }: SlideItemsProps) {
  return (
    <Swiper
      spaceBetween={16}
      slidesPerView={items[0].type === 'banner' ? 1.2 : 2.2}
      slidesOffsetBefore={16}
      slidesOffsetAfter={16}
      centerInsufficientSlides={items[0].type === 'banner' ? true : false}
      className="w-full"
    >
      {items.map(({ id, title, subtitle, type, image, link }) => (
        <SwiperSlide key={id} className="">
          <CardItem
            title={title}
            subtitle={subtitle}
            type={type}
            image={image}
            link={link}
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

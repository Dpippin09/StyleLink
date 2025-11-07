'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface CarouselImage {
  src: string;
  alt: string;
  title: string;
  description: string;
}

const carouselImages: CarouselImage[] = [
  {
    src: "/hero-fashion.jpg.png",
    alt: "Stylish woman in orange sunglasses and oversized white shirt",
    title: "Style Intelligence",
    description: "Where fashion meets technology"
  },
  {
    src: "/man-beige-coat.jpg.png",
    alt: "Stylish man in beige coat - luxury menswear inspiration",
    title: "Luxury Essentials",
    description: "Timeless pieces for the modern gentleman"
  },
  {
    src: "/woman-cardigan.jpg.png",
    alt: "Elegant woman in cardigan and camisole - sophisticated style",
    title: "Effortless Elegance",
    description: "Sophisticated styles for every occasion"
  }
];

interface HeroCarouselProps {
  autoPlay?: boolean;
  interval?: number;
}

export default function HeroCarousel({ autoPlay = true, interval = 5000 }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Auto-rotation effect
  useEffect(() => {
    if (!autoPlay) return;

    const timer = setInterval(() => {
      const next = currentIndex === carouselImages.length - 1 ? 0 : currentIndex + 1;
      setNextIndex(next);
      setIsTransitioning(true);
      
      // After transition completes, update current index
      setTimeout(() => {
        setCurrentIndex(next);
        setIsTransitioning(false);
      }, 1200);
    }, interval);

    return () => clearInterval(timer);
  }, [autoPlay, interval, currentIndex]);

  const goToSlide = (index: number) => {
    if (index === currentIndex || isTransitioning) return;
    
    setNextIndex(index);
    setIsTransitioning(true);
    
    setTimeout(() => {
      setCurrentIndex(index);
      setIsTransitioning(false);
    }, 1200);
  };

  const currentImage = carouselImages[currentIndex];
  const nextImage = carouselImages[nextIndex];

  return (
    <div className="relative">
      <div className="aspect-[3/4] rounded-lg overflow-hidden relative">
        {/* Current Image Layer */}
        <div className="absolute inset-0">
          <Image
            src={currentImage.src}
            alt={currentImage.alt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
            priority
          />
        </div>
        
        {/* Next Image Layer - for smooth crossfade */}
        {isTransitioning && (
          <div className={`absolute inset-0 transition-opacity duration-1200 ease-in-out ${
            isTransitioning ? 'opacity-100' : 'opacity-0'
          }`}>
            <Image
              src={nextImage.src}
              alt={nextImage.alt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
            />
          </div>
        )}
        
        {/* Elegant overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
        
        {/* Stylish overlay text with smooth animation */}
        <div className={`absolute bottom-6 left-6 right-6 transition-all duration-700 ease-out ${
          isTransitioning ? 'opacity-0 translate-y-6 scale-95' : 'opacity-100 translate-y-0 scale-100'
        }`}>
          <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg">
            <h3 className="text-lg font-bold text-primary mb-1">
              {currentImage.title}
            </h3>
            <p className="text-sm text-muted-foreground">
              {currentImage.description}
            </p>
          </div>
        </div>
        
        {/* Next overlay text that appears during transition */}
        {isTransitioning && (
          <div className={`absolute bottom-6 left-6 right-6 transition-all duration-700 ease-out delay-300 ${
            isTransitioning ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-6 scale-95'
          }`}>
            <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg">
              <h3 className="text-lg font-bold text-primary mb-1">
                {nextImage.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {nextImage.description}
              </p>
            </div>
          </div>
        )}
        
        {/* Floating accent dots with enhanced animation */}
        <div className={`absolute top-6 right-6 w-3 h-3 rounded-full bg-white/40 transition-all duration-500 ${
          isTransitioning ? 'animate-ping' : 'animate-pulse'
        }`}></div>
        <div 
          className={`absolute top-1/3 left-6 w-2 h-2 rounded-full bg-white/30 transition-all duration-500 ${
            isTransitioning ? 'animate-ping' : 'animate-pulse'
          }`}
          style={{animationDelay: `${currentIndex * 0.3}s`}}
        ></div>
        
        {/* Carousel Indicators */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
          <div className="flex space-x-2">
            {carouselImages.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                disabled={isTransitioning}
                className={`h-2 rounded-full transition-all duration-500 ease-out ${
                  index === currentIndex 
                    ? 'bg-white w-8 shadow-lg' 
                    : index === nextIndex && isTransitioning
                    ? 'bg-white/80 w-6'
                    : 'bg-white/50 w-2 hover:bg-white/75 hover:w-4'
                } ${isTransitioning ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
        
        {/* Enhanced Progress Bar */}
        {autoPlay && !isTransitioning && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 rounded-b-lg">
            <div 
              className="h-full bg-gradient-to-r from-white/50 to-white/70 rounded-b-lg transition-all ease-linear"
              style={{
                width: '100%',
                animation: `progress ${interval}ms linear infinite`
              }}
            />
          </div>
        )}
      </div>
      
      <style jsx>{`
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        .duration-1200 {
          transition-duration: 1200ms;
        }
      `}</style>
    </div>
  );
}

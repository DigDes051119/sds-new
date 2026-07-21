import React, { useState } from 'react'
import { transformTo2K } from '../../supabaseClient'

const ERROR_IMG_SRC =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg=='

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  priority?: boolean;
}

export function ImageWithFallback(props: ImageProps) {
  const [didError, setDidError] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  const handleError = () => {
    setDidError(true)
  }

  const { src: rawSrc, alt, style, className, priority, loading, ...rest } = props;
  const src = transformTo2K(rawSrc || '');

  const finalLoading = loading ?? "eager";
  const fetchPriority = priority ? "high" : undefined;

  const isAbsolute = className?.includes('absolute');
  const hasObjectContain = className?.includes('object-contain');
  const hasHAuto = className?.includes('h-auto');
  const objectFitClass = hasObjectContain ? 'object-contain' : 'object-cover';

  const wrapperClass = `${isAbsolute ? 'absolute' : 'relative'} overflow-hidden ${
    className
      ?.replace(/\babsolute\b/g, '')
      ?.replace(/\binset-0\b/g, '')
      ?.replace(/\bobject-cover\b/g, '')
      ?.replace(/\bobject-contain\b/g, '')
      ?? ''
  }`;

  const finalStyle: React.CSSProperties = {
    ...style,
    ...(isAbsolute ? {
      top: '-1.5px',
      left: '-1.5px',
      right: '-1.5px',
      bottom: '-1.5px',
      width: 'calc(100% + 3px)',
      height: 'calc(100% + 3px)',
    } : {})
  };

  return didError ? (
    <div
      className={`inline-block bg-gray-100 text-center align-middle ${className ?? ''}`}
      style={style}
    >
      <div className="flex items-center justify-center w-full h-full">
        <img 
          src={ERROR_IMG_SRC} 
          alt="Error loading image" 
          decoding="async"
          loading="lazy"
          {...rest} 
          data-original-url={rawSrc} 
         />
      </div>
    </div>
  ) : (
    <div className={wrapperClass} style={finalStyle}>
      {/* Pulse Skeleton Screen Placeholder */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-[#eeeee9] animate-pulse rounded-[inherit] z-10" />
      )}
      
      <img 
        src={src} 
        alt={alt} 
        className={`${hasHAuto ? 'w-full h-auto block' : 'w-full h-full'} ${objectFitClass} transition-opacity duration-500 ease-out ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        decoding="async"
        loading={finalLoading}
        {...(fetchPriority ? { fetchPriority } : {})}
        {...rest} 
        onLoad={() => setIsLoaded(true)}
        onError={handleError} 
      />
    </div>
  )
}

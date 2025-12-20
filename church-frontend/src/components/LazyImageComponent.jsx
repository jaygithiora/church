import React, { useState } from 'react';

const LazyImageComponent = ({ src, placeholder, alt, style, ...props }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div style={{ position: 'relative', ...style }}>
      {!loaded && (
        <img
          src={placeholder}
          alt="placeholder"
          style={{
            //position: 'absolute',
            //top: 0,
            //left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      )}
      <img
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        style={{
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.3s ease-in-out',
          width: '100%',
          height: '100%',
          objectFit: 'cover'
        }}
        {...props}
      />
    </div>
  );
};

export default LazyImageComponent;

import React, { useEffect, useState } from 'react';

// Mobile Detection Hook
export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
      const isSmallScreen = window.innerWidth <= 768;
      setIsMobile(isMobileDevice || isSmallScreen);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
};

// Touch Handler Hook
export const useTouchHandler = (onTouch) => {
  const handleTouchStart = (e) => {
    e.preventDefault();
    if (onTouch) onTouch(e);
  };

  return { onTouchStart: handleTouchStart };
};

// Mobile-Optimized Button Component
export const MobileButton = ({ 
  children, 
  onClick, 
  className = '', 
  disabled = false,
  variant = 'primary',
  size = 'medium',
  ...props 
}) => {
  const baseClasses = 'mobile-btn';
  const variantClasses = {
    primary: 'mobile-btn-primary',
    secondary: 'mobile-btn-secondary',
    outline: 'mobile-btn-outline'
  };
  const sizeClasses = {
    small: 'mobile-btn-small',
    medium: 'mobile-btn-medium',
    large: 'mobile-btn-large'
  };

  const handleClick = (e) => {
    if (!disabled && onClick) {
      // Add haptic feedback for supported devices
      if (navigator.vibrate) {
        navigator.vibrate(10);
      }
      onClick(e);
    }
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      onClick={handleClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

// Mobile-Optimized Input Component
export const MobileInput = ({ 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  className = '',
  autoComplete = 'off',
  ...props 
}) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`mobile-input ${className}`}
      autoComplete={autoComplete}
      autoCapitalize="none"
      autoCorrect="off"
      spellCheck="false"
      {...props}
    />
  );
};

// Mobile-Optimized Modal Component
export const MobileModal = ({ 
  isOpen, 
  onClose, 
  children, 
  title,
  className = '' 
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="mobile-modal-overlay" onClick={onClose}>
      <div 
        className={`mobile-modal-content ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="mobile-modal-header">
            <h3>{title}</h3>
            <button 
              className="mobile-modal-close"
              onClick={onClose}
              aria-label="Close modal"
            >
              ×
            </button>
          </div>
        )}
        <div className="mobile-modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};

// Mobile-Optimized Card Component
export const MobileCard = ({ 
  children, 
  onClick, 
  className = '',
  hoverable = false,
  ...props 
}) => {
  const handleClick = (e) => {
    if (onClick) {
      // Add haptic feedback
      if (navigator.vibrate) {
        navigator.vibrate(5);
      }
      onClick(e);
    }
  };

  return (
    <div
      className={`mobile-card ${hoverable ? 'mobile-card-hoverable' : ''} ${className}`}
      onClick={handleClick}
      {...props}
    >
      {children}
    </div>
  );
};

// Mobile-Optimized Loading Component
export const MobileLoading = ({ message = 'Loading...' }) => {
  return (
    <div className="mobile-loading">
      <div className="mobile-spinner"></div>
      <p>{message}</p>
    </div>
  );
};

// Mobile-Optimized Toast Component
export const MobileToast = ({ 
  message, 
  type = 'info', 
  isVisible, 
  onClose,
  duration = 3000 
}) => {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  return (
    <div className={`mobile-toast mobile-toast-${type}`}>
      <span>{message}</span>
      <button 
        className="mobile-toast-close"
        onClick={onClose}
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
  );
};

// Mobile-Optimized Swipe Handler
export const useSwipeHandler = (onSwipeLeft, onSwipeRight, threshold = 50) => {
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > threshold;
    const isRightSwipe = distance < -threshold;

    if (isLeftSwipe && onSwipeLeft) {
      onSwipeLeft();
    }
    if (isRightSwipe && onSwipeRight) {
      onSwipeRight();
    }
  };

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd
  };
};

// Mobile-Optimized Image Component
export const MobileImage = ({ 
  src, 
  alt, 
  className = '',
  lazy = true,
  placeholder = '/api/placeholder/300/200',
  ...props 
}) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div className={`mobile-image-container ${className}`}>
      {!loaded && !error && (
        <div className="mobile-image-placeholder">
          <div className="mobile-image-skeleton"></div>
        </div>
      )}
      <img
        src={error ? placeholder : src}
        alt={alt}
        className={`mobile-image ${loaded ? 'mobile-image-loaded' : ''}`}
        loading={lazy ? 'lazy' : 'eager'}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        {...props}
      />
    </div>
  );
};

// Mobile Device Info Hook
export const useMobileDeviceInfo = () => {
  const [deviceInfo, setDeviceInfo] = useState({
    isIOS: false,
    isAndroid: false,
    isSafari: false,
    isChrome: false,
    hasNotch: false,
    orientation: 'portrait'
  });

  useEffect(() => {
    const userAgent = navigator.userAgent;
    const isIOS = /iPad|iPhone|iPod/.test(userAgent);
    const isAndroid = /Android/.test(userAgent);
    const isSafari = /Safari/.test(userAgent) && !/Chrome/.test(userAgent);
    const isChrome = /Chrome/.test(userAgent);
    const hasNotch = window.screen && window.screen.height / window.screen.width > 2;

    const updateOrientation = () => {
      setDeviceInfo(prev => ({
        ...prev,
        orientation: window.innerHeight > window.innerWidth ? 'portrait' : 'landscape'
      }));
    };

    setDeviceInfo({
      isIOS,
      isAndroid,
      isSafari,
      isChrome,
      hasNotch,
      orientation: window.innerHeight > window.innerWidth ? 'portrait' : 'landscape'
    });

    window.addEventListener('orientationchange', updateOrientation);
    window.addEventListener('resize', updateOrientation);

    return () => {
      window.removeEventListener('orientationchange', updateOrientation);
      window.removeEventListener('resize', updateOrientation);
    };
  }, []);

  return deviceInfo;
};

export default {
  useIsMobile,
  useTouchHandler,
  MobileButton,
  MobileInput,
  MobileModal,
  MobileCard,
  MobileLoading,
  MobileToast,
  useSwipeHandler,
  MobileImage,
  useMobileDeviceInfo
};
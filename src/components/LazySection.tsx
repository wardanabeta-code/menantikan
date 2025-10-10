import React, { Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import type { ComponentType } from 'react';

interface LazySectionProps {
  component: () => Promise<{ default: ComponentType<any> }>;
  fallback?: React.ReactNode;
  props?: any;
  className?: string;
}

// Fallback component for loading sections
const SectionSkeleton: React.FC = () => (
  <motion.div
    className="animate-pulse bg-gray-200 rounded-lg h-64 w-full"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <div className="flex items-center justify-center h-full">
      <div className="text-gray-400">Loading section...</div>
    </div>
  </motion.div>
);

// Error boundary for section loading errors
class SectionErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback?: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Section loading error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">Failed to load section</p>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

// Lazy section wrapper with intersection observer for performance
const LazySection: React.FC<LazySectionProps> = ({
  component,
  fallback = <SectionSkeleton />,
  props = {},
  className = ''
}) => {
  const [isIntersecting, setIsIntersecting] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '100px', // Load sections 100px before they come into view
        threshold: 0.1
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  // Only create the lazy component when needed
  const LazyComponent = React.useMemo(() => {
    return isIntersecting ? lazy(component) : null;
  }, [component, isIntersecting]);

  return (
    <div ref={ref} className={className}>
      <SectionErrorBoundary>
        {isIntersecting && LazyComponent ? (
          <Suspense fallback={fallback}>
            <LazyComponent {...props} />
          </Suspense>
        ) : (
          fallback
        )}
      </SectionErrorBoundary>
    </div>
  );
};

export default LazySection;

// Utility function to create lazy section loaders
export const createLazySection = (componentPath: string) => {
  return () => import(componentPath);
};

// Pre-defined lazy section loaders
export const lazyLoaders = {
  hero: () => import('./sections/HeroSection'),
  story: () => import('./sections/StorySection'),
  'wishes-messages': () => import('./sections/WishesMessagesSection'),
  gallery: () => import('./sections/GallerySection'),
  // Deprecated sections - mapped to the new unified section
  rsvp: () => import('./sections/WishesMessagesSection'),
  guestbook: () => import('./sections/WishesMessagesSection')
};
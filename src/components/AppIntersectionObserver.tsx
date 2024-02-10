import React, { useRef, useEffect } from "react";

export type AppIntersectionObserverProps = React.PropsWithChildren<{
  onIntersect?(): void;
}>;

const AppIntersectionObserver = ({
  children,
  onIntersect,
}: AppIntersectionObserverProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (entry.isIntersecting && onIntersect) {
        onIntersect();
      }
    });
    const element = ref.current as Element;
    observer.observe(element);
    return () => observer.unobserve(element);
  }, [onIntersect]);

  return <div ref={ref}>{children}</div>;
};

export default AppIntersectionObserver;

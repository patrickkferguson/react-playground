import { useEffect, useRef } from "react";

export function usePrevious<Type>(value: Type | null): Type | null | undefined {
  const ref = useRef<Type | null>();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}
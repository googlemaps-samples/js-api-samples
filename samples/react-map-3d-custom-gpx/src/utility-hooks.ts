import {
  DependencyList,
  EffectCallback,
  Ref,
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react';
import isDeepEqual from 'fast-deep-equal';

export function useCallbackRef<T>() {
  const [el, setEl] = useState<T | null>(null);
  const ref = useCallback((value: T) => setEl(value), [setEl]);

  return [el, ref as Ref<T>] as const;
}

export function useDeepCompareEffect(
  effect: EffectCallback,
  deps: DependencyList
) {
  const ref = useRef<DependencyList | undefined>(undefined);

  if (!ref.current || !isDeepEqual(deps, ref.current)) {
    ref.current = deps;
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(effect, ref.current);
}

export function useDebouncedEffect(
  effect: EffectCallback,
  timeout: number,
  deps: DependencyList
) {
  const timerRef = useRef<any>(0);

  useEffect(
    () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = 0;
      }

      timerRef.current = setTimeout(() => effect(), timeout);
      return () => clearTimeout(timerRef.current);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [timeout, ...deps]
  );
}

export const getFormattedTime = (point: Element, forMarker: boolean = false) => {
  const timeElement = point.querySelector('time');
  if (timeElement && timeElement.textContent) {
    const date = new Date(timeElement.textContent);
    if (forMarker) {
      const time = date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      });
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      return `${time}\n${month}/${day}/${year}`;
    }
    return date.toLocaleString();
  }
  return null;
};

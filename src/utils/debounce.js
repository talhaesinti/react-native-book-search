/** Debounce yardımcıları (leading/trailing ve iptal desteği) */

/** @returns {Function} iptal/flush/pending metodları olan debounced fonksiyon */
export function debounce(func, delay, options = {}) {
  const { leading = false, trailing = true } = options;
  
  let timeoutId;
  let lastCallTime;
  let lastInvokeTime = 0;
  let lastArgs;
  let lastThis;
  let result;

  function invokeFunc(time) {
    const args = lastArgs;
    const thisArg = lastThis;

    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }

  function leadingEdge(time) {
    lastInvokeTime = time;
    timeoutId = setTimeout(timerExpired, delay);
    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time) {
    const timeSinceLastCall = time - lastCallTime;
    const timeSinceLastInvoke = time - lastInvokeTime;
    const timeWaiting = delay - timeSinceLastCall;

    return timeWaiting;
  }

  function shouldInvoke(time) {
    const timeSinceLastCall = time - lastCallTime;
    const timeSinceLastInvoke = time - lastInvokeTime;
    return (lastCallTime === undefined || (timeSinceLastCall >= delay) ||
            (timeSinceLastCall < 0) || (timeSinceLastInvoke >= delay));
  }

  function timerExpired() {
    const time = Date.now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    timeoutId = setTimeout(timerExpired, remainingWait(time));
  }

  function trailingEdge(time) {
    timeoutId = undefined;
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return result;
  }

  function cancel() {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timeoutId = undefined;
  }

  function flush() {
    return timeoutId === undefined ? result : trailingEdge(Date.now());
  }

  function pending() {
    return timeoutId !== undefined;
  }

  function debounced(...args) {
    const time = Date.now();
    const isInvoking = shouldInvoke(time);

    lastArgs = args;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timeoutId === undefined) {
        return leadingEdge(lastCallTime);
      }
    }
    if (timeoutId === undefined) {
      timeoutId = setTimeout(timerExpired, delay);
    }
    return result;
  }

  debounced.cancel = cancel;
  debounced.flush = flush;
  debounced.pending = pending;
  
  return debounced;
}

// React için hook sarmalayıcı
import { useMemo, useRef, useEffect } from 'react';

export function useDebouncedCallback(fn, delay, deps = [], options = {}) {
  const fnRef = useRef(fn);
  useEffect(() => {
    fnRef.current = fn;
  }, [fn]);

  const debounced = useMemo(() => {
    const wrapped = (...args) => fnRef.current(...args);
    return debounce(wrapped, delay, options);
  // Etkin seçeneklere göre memoize
  }, [delay, options.leading, options.trailing, ...deps]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (debounced && typeof debounced.cancel === 'function') {
        debounced.cancel();
      }
    };
  }, [debounced]);

  const controls = useMemo(() => ({
    cancel: () => debounced?.cancel?.(),
    flush: () => debounced?.flush?.(),
    pending: () => debounced?.pending?.() || false,
  }), [debounced]);

  return [debounced, controls];
}

/**
 * Simple debounce for basic use cases
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
export function simpleDebounce(func, delay) {
  let timeoutId;
  
  return function debounced(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

/**
 * Throttle function - limits execution to once per interval
 * @param {Function} func - Function to throttle
 * @param {number} interval - Interval in milliseconds
 * @returns {Function} Throttled function
 */
export function throttle(func, interval) {
  let lastExecution = 0;
  
  return function throttled(...args) {
    const now = Date.now();
    
    if (now - lastExecution >= interval) {
      lastExecution = now;
      return func.apply(this, args);
    }
  };
}

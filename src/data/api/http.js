/** Axios tabanlı HTTP istemcisi (timeout, retry, özel hatalar) */

const DEFAULT_TIMEOUT = 10000; // 10 seconds
const DEFAULT_RETRY_COUNT = 3;
const RETRY_DELAY = 1000; // 1 second

import axios from 'axios';

/**
 * Custom error classes for better error handling
 */
export class HttpError extends Error {
  constructor(message, status, statusText, url) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
    this.statusText = statusText;
    this.url = url;
  }
}

export class NetworkError extends Error {
  constructor(message, originalError) {
    super(message);
    this.name = 'NetworkError';
    this.originalError = originalError;
  }
}

export class TimeoutError extends Error {
  constructor(message, timeout) {
    super(message);
    this.name = 'TimeoutError';
    this.timeout = timeout;
  }
}

/** Retry beklemesi */
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

function isRetryableError(error) {
  // Axios timeout
  if (error?.code === 'ECONNABORTED') return true;
  // Network
  if (error?.isAxiosError && !error.response) return true;
  // 5xx
  if (error?.response?.status >= 500 && error?.response?.status < 600) return true;
  return false;
}

/** HTTP GET (hata yönetimi + retry) */
export async function httpGet(url, options = {}) {
  const {
    timeout = DEFAULT_TIMEOUT,
    retries = DEFAULT_RETRY_COUNT,
    headers = {},
    signal,
    ...fetchOptions
  } = options;

  let lastError;

  for (let attempt = 1; attempt <= retries + 1; attempt++) {
    try {
      const response = await axios.request({
        url,
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          ...headers,
        },
        signal,
        timeout,
        ...fetchOptions,
      });

      return response.data;

    } catch (error) {
      lastError = error;

      // Don't retry if externally aborted
      if (signal?.aborted) {
        throw error;
      }

      // Axios hatasını domain hatasına çevir
      if (error?.response) {
        const { status, statusText } = error.response;
        lastError = new HttpError(`HTTP ${status}: ${statusText}`, status, statusText, url);
      } else if (error?.code === 'ECONNABORTED') {
        lastError = new TimeoutError(`Request timed out after ${timeout}ms`, timeout);
      } else if (error?.isAxiosError) {
        lastError = new NetworkError(error.message, error);
      }

      // Son deneme veya retry edilemeyen hata
      if (attempt === retries + 1 || !isRetryableError(error)) {
        throw lastError;
      }

      // Exponential backoff
      const delay = RETRY_DELAY * Math.pow(2, attempt - 1);
      await sleep(delay);
    }
  }

  throw lastError;
}

/** HTTP POST */
export async function httpPost(url, data, options = {}) {
  const { timeout = DEFAULT_TIMEOUT, headers = {}, signal, ...rest } = options;
  const response = await axios.request({
    url,
    method: 'POST',
    data,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...headers,
    },
    timeout,
    signal,
    ...rest,
  });
  return response.data;
}

/** İptal edilebilir istek sarmalayıcı */
export function createCancellableRequest(requestFn) {
  const controller = new AbortController();
  
  const promise = requestFn({ signal: controller.signal });
  
  return {
    promise,
    cancel: () => controller.abort(),
  };
}

// Geriye dönük uyum
export const httpRequest = httpGet;

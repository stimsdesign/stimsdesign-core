/**
 * Application Logging Utility
 * 
 * Centralized logging that respects the ENABLE_DEBUG_LOGGING environment variable.
 * Silences logs in production if the flag is not set to 'TRUE', keeping the console clean.
 */

// We check both import.meta.env (for Astro/Vite context) and process.env (for Node CLI scripts)
const getIsDebugEnabled = (): boolean => {
  try {
    // Check Astro/Vite environment
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.ENABLE_DEBUG_LOGGING) {
      return import.meta.env.ENABLE_DEBUG_LOGGING === 'TRUE';
    }
    // Check Node environment
    if (typeof process !== 'undefined' && process.env && process.env.ENABLE_DEBUG_LOGGING) {
      return process.env.ENABLE_DEBUG_LOGGING === 'TRUE';
    }
  } catch (e) {
    // Fallback if environment access fails
  }
  return false;
};

export const logger = {
  /**
   * General information logging. Silenced if debug is off.
   */
  info: (...args: any[]) => {
    if (getIsDebugEnabled()) {
      console.info(...args);
    }
  },
  /**
   * Standard output logging. Silenced if debug is off.
   */
  log: (...args: any[]) => {
    if (getIsDebugEnabled()) {
      console.log(...args);
    }
  },
  /**
   * Warning logging. Silenced if debug is off.
   */
  warn: (...args: any[]) => {
    if (getIsDebugEnabled()) {
      console.warn(...args);
    }
  },
  /**
   * Error logging. WE ALWAYS LOG ERRORS regardless of the debug flag
   * to ensure server issues are caught in production logs.
   */
  error: (...args: any[]) => {
    console.error(...args);
  },
  /**
   * Success logging with a checkmark. Silenced if debug is off.
   */
  success: (...args: any[]) => {
    if (getIsDebugEnabled()) {
      console.log('✅', ...args);
    }
  }
};

/**
 * Utility functions for formatting data in the inspector
 */

/**
 * Safely converts any value to a string for rendering in React components
 * This prevents "Objects are not valid as a React child" errors
 * @param value - The value to convert to string
 * @returns A safe string representation of the value
 */
export const safeString = (value: any): string => {
  if (value === null || value === undefined) {
    return '';
  }

  if (typeof value === 'string') {
    return value;
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }

  if (typeof value === 'object') {
    // Handle arrays
    if (Array.isArray(value)) {
      try {
        return JSON.stringify(value);
      } catch {
        return '[Array]';
      }
    }

    // Handle objects
    try {
      return JSON.stringify(value);
    } catch {
      return '[Object]';
    }
  }

  // Fallback for any other type
  try {
    return String(value);
  } catch {
    return '[Unable to convert to string]';
  }
};

/**
 * Formats any data type into a readable string with proper JSON formatting
 * @param data - The data to format
 * @returns Object with formatted text and whether it should be displayed as code
 */
export const formatData = (data: any): { text: string; isCode: boolean } => {
  if (data === null || data === undefined) {
    return { text: 'null', isCode: true };
  }

  if (typeof data === 'string') {
    // Try to parse as JSON first
    try {
      const parsed = JSON.parse(data);
      return { text: JSON.stringify(parsed, null, 2), isCode: true };
    } catch {
      // If it's not valid JSON, return as plain string
      return { text: data, isCode: false };
    }
  }

  if (typeof data === 'object') {
    return { text: JSON.stringify(data, null, 2), isCode: true };
  }

  return { text: String(data), isCode: false };
};

/**
 * Formats data specifically for copy operations (always returns string)
 * @param data - The data to format for copying
 * @returns Formatted string ready for clipboard
 */
export const formatDataForCopy = (data: any): string => {
  if (data === null || data === undefined) {
    return 'null';
  }

  if (typeof data === 'string') {
    // Try to parse as JSON first
    try {
      const parsed = JSON.parse(data);
      return JSON.stringify(parsed, null, 2);
    } catch {
      // If it's not valid JSON, return as plain string
      return data;
    }
  }

  if (typeof data === 'object') {
    return JSON.stringify(data, null, 2);
  }

  return String(data);
};

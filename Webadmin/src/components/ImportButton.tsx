/**
 * Import Utilities
 * Hỗ trợ import dữ liệu từ CSV và JSON
 */

export interface ImportResult<T> {
  success: boolean;
  data: T[];
  errors: string[];
  rowCount: number;
}

export interface ImportOptions {
  required?: string[];
  dateFields?: string[];
  numberFields?: string[];
  booleanFields?: string[];
  skipFirstRow?: boolean;
}

/**
 * Parse CSV content to array of objects
 */
export const parseCSV = <T extends Record<string, any>>(
  csvContent: string,
  options: ImportOptions = {}
): ImportResult<T> => {
  const errors: string[] = [];
  const data: T[] = [];
  
  try {
    const lines = csvContent.trim().split('\n');
    
    if (lines.length === 0) {
      return {
        success: false,
        data: [],
        errors: ['File is empty'],
        rowCount: 0
      };
    }

    // Parse headers
    const headers = parseCSVLine(lines[0]);
    
    if (headers.length === 0) {
      return {
        success: false,
        data: [],
        errors: ['No headers found'],
        rowCount: 0
      };
    }

    // Validate required fields
    if (options.required) {
      const missingFields = options.required.filter(
        field => !headers.includes(field)
      );
      if (missingFields.length > 0) {
        errors.push(`Missing required fields: ${missingFields.join(', ')}`);
      }
    }

    // Parse data rows
    const startIndex = options.skipFirstRow ? 2 : 1;
    
    for (let i = startIndex; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue; // Skip empty lines

      try {
        const values = parseCSVLine(line);
        
        if (values.length !== headers.length) {
          errors.push(`Row ${i + 1}: Column count mismatch`);
          continue;
        }

        const row: any = {};
        
        headers.forEach((header, index) => {
          let value: any = values[index];

          // Convert data types
          if (options.numberFields?.includes(header)) {
            value = parseFloat(value);
            if (isNaN(value)) {
              errors.push(`Row ${i + 1}: Invalid number in column "${header}"`);
            }
          } else if (options.dateFields?.includes(header)) {
            const date = new Date(value);
            if (isNaN(date.getTime())) {
              errors.push(`Row ${i + 1}: Invalid date in column "${header}"`);
            } else {
              value = date;
            }
          } else if (options.booleanFields?.includes(header)) {
            value = value.toLowerCase() === 'true' || value === '1' || value.toLowerCase() === 'yes';
          }

          row[header] = value;
        });

        data.push(row as T);
      } catch (error) {
        errors.push(`Row ${i + 1}: ${error instanceof Error ? error.message : 'Parse error'}`);
      }
    }

    return {
      success: errors.length === 0,
      data,
      errors,
      rowCount: data.length
    };
  } catch (error) {
    return {
      success: false,
      data: [],
      errors: [error instanceof Error ? error.message : 'Unknown error'],
      rowCount: 0
    };
  }
};

/**
 * Parse JSON content to array of objects
 */
export const parseJSON = <T extends Record<string, any>>(
  jsonContent: string,
  options: ImportOptions = {}
): ImportResult<T> => {
  const errors: string[] = [];
  
  try {
    const parsed = JSON.parse(jsonContent);
    
    if (!Array.isArray(parsed)) {
      return {
        success: false,
        data: [],
        errors: ['JSON must be an array of objects'],
        rowCount: 0
      };
    }

    // Validate required fields
    if (options.required && parsed.length > 0) {
      const firstItem = parsed[0];
      const missingFields = options.required.filter(
        field => !(field in firstItem)
      );
      if (missingFields.length > 0) {
        errors.push(`Missing required fields: ${missingFields.join(', ')}`);
      }
    }

    // Convert data types if needed
    const data = parsed.map((item, index) => {
      const row: any = { ...item };

      if (options.dateFields) {
        options.dateFields.forEach(field => {
          if (field in row) {
            row[field] = new Date(row[field]);
          }
        });
      }

      if (options.numberFields) {
        options.numberFields.forEach(field => {
          if (field in row) {
            row[field] = parseFloat(row[field]);
          }
        });
      }

      return row as T;
    });

    return {
      success: errors.length === 0,
      data,
      errors,
      rowCount: data.length
    };
  } catch (error) {
    return {
      success: false,
      data: [],
      errors: [error instanceof Error ? error.message : 'Invalid JSON format'],
      rowCount: 0
    };
  }
};

/**
 * Read file and return content
 */
export const readFile = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const content = e.target?.result as string;
      resolve(content);
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsText(file);
  });
};

/**
 * Import CSV file
 */
export const importFromCSV = async <T extends Record<string, any>>(
  file: File,
  options: ImportOptions = {}
): Promise<ImportResult<T>> => {
  try {
    const content = await readFile(file);
    return parseCSV<T>(content, options);
  } catch (error) {
    return {
      success: false,
      data: [],
      errors: [error instanceof Error ? error.message : 'Failed to import CSV'],
      rowCount: 0
    };
  }
};

/**
 * Import JSON file
 */
export const importFromJSON = async <T extends Record<string, any>>(
  file: File,
  options: ImportOptions = {}
): Promise<ImportResult<T>> => {
  try {
    const content = await readFile(file);
    return parseJSON<T>(content, options);
  } catch (error) {
    return {
      success: false,
      data: [],
      errors: [error instanceof Error ? error.message : 'Failed to import JSON'],
      rowCount: 0
    };
  }
};

/**
 * Helper function to parse CSV line (handles quoted values)
 */
const parseCSVLine = (line: string): string[] => {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote
        current += '"';
        i++; // Skip next quote
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      // End of field
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  // Add last field
  result.push(current.trim());

  return result;
};

/**
 * Validate import data
 */
export const validateImportData = <T extends Record<string, any>>(
  data: T[],
  requiredFields: string[]
): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (data.length === 0) {
    errors.push('No data to import');
  }

  data.forEach((row, index) => {
    requiredFields.forEach(field => {
      if (!(field in row) || row[field] === null || row[field] === undefined || row[field] === '') {
        errors.push(`Row ${index + 1}: Missing required field "${field}"`);
      }
    });
  });

  return {
    valid: errors.length === 0,
    errors
  };
};

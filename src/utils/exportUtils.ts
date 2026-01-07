/**
 * Export Utilities
 * Hỗ trợ export dữ liệu ra CSV và JSON
 */

export interface ExportOptions {
  filename?: string;
  columns?: string[];
  dateFormat?: string;
}

/**
 * Export data to CSV format
 */
export const exportToCSV = <T extends Record<string, any>>(
  data: T[],
  options: ExportOptions = {}
): void => {
  if (!data || data.length === 0) {
    console.warn('No data to export');
    return;
  }

  const { filename = 'export', columns } = options;

  // Get headers
  const headers = columns || Object.keys(data[0]);
  
  // Create CSV content
  const csvContent = [
    // Headers
    headers.join(','),
    // Rows
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        // Handle special cases
        if (value === null || value === undefined) return '';
        if (typeof value === 'string' && value.includes(',')) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        if (value instanceof Date) {
          return value.toLocaleDateString('vi-VN');
        }
        return String(value);
      }).join(',')
    )
  ].join('\n');

  // Add BOM for UTF-8 Excel compatibility
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
  
  // Trigger download
  downloadBlob(blob, `${filename}_${getTimestamp()}.csv`);
};

/**
 * Export data to JSON format
 */
export const exportToJSON = <T extends Record<string, any>>(
  data: T[],
  options: ExportOptions = {}
): void => {
  if (!data || data.length === 0) {
    console.warn('No data to export');
    return;
  }

  const { filename = 'export' } = options;
  
  const jsonContent = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json' });
  
  downloadBlob(blob, `${filename}_${getTimestamp()}.json`);
};

/**
 * Export table data (user-friendly format)
 */
export const exportTableToCSV = (
  data: any[],
  columnMapping: Record<string, string>, // key: dataKey, value: displayName
  filename: string = 'table_export'
): void => {
  if (!data || data.length === 0) {
    console.warn('No data to export');
    return;
  }

  // Get headers with display names
  const headers = Object.values(columnMapping);
  const keys = Object.keys(columnMapping);
  
  // Create CSV content
  const csvContent = [
    // Headers
    headers.join(','),
    // Rows
    ...data.map(row => 
      keys.map(key => {
        const value = row[key];
        // Handle special cases
        if (value === null || value === undefined) return '';
        if (typeof value === 'boolean') return value ? 'Yes' : 'No';
        if (typeof value === 'number') {
          // Format numbers with thousand separators
          return value.toLocaleString('vi-VN');
        }
        if (typeof value === 'string' && value.includes(',')) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        if (value instanceof Date) {
          return value.toLocaleDateString('vi-VN');
        }
        return String(value);
      }).join(',')
    )
  ].join('\n');

  // Add BOM for UTF-8 Excel compatibility
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
  
  downloadBlob(blob, `${filename}_${getTimestamp()}.csv`);
};

/**
 * Helper function to download blob
 */
const downloadBlob = (blob: Blob, filename: string): void => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

/**
 * Get timestamp string for filename
 */
const getTimestamp = (): string => {
  const now = new Date();
  return now.toISOString().replace(/[:.]/g, '-').slice(0, -5);
};

/**
 * Format currency for export
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};

/**
 * Format date for export
 */
export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

/**
 * Format datetime for export
 */
export const formatDateTime = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

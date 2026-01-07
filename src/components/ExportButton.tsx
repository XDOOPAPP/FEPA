import React from 'react';
import { Button, Dropdown, MenuProps } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { exportToCSV, exportToJSON, exportTableToCSV } from '../utils/exportUtils';

interface ExportButtonProps {
  data: any[];
  filename?: string;
  columnMapping?: Record<string, string>;
  type?: 'icon' | 'button' | 'menu';
  disabled?: boolean;
}

/**
 * Reusable Export Button Component
 * Supports CSV and JSON export
 */
const ExportButton: React.FC<ExportButtonProps> = ({
  data,
  filename = 'export',
  columnMapping,
  type = 'menu',
  disabled = false
}) => {
  const handleExportCSV = () => {
    if (columnMapping) {
      exportTableToCSV(data, columnMapping, filename);
    } else {
      exportToCSV(data, { filename });
    }
  };

  const handleExportJSON = () => {
    exportToJSON(data, { filename });
  };

  // Dropdown menu items
  const menuItems: MenuProps['items'] = [
    {
      key: 'csv',
      label: 'Export as CSV',
      onClick: handleExportCSV,
    },
    {
      key: 'json',
      label: 'Export as JSON',
      onClick: handleExportJSON,
    },
  ];

  if (type === 'icon') {
    return (
      <Dropdown menu={{ items: menuItems }} disabled={disabled || data.length === 0}>
        <Button icon={<DownloadOutlined />} />
      </Dropdown>
    );
  }

  if (type === 'button') {
    return (
      <Button
        icon={<DownloadOutlined />}
        onClick={handleExportCSV}
        disabled={disabled || data.length === 0}
      >
        Export
      </Button>
    );
  }

  // Default: dropdown menu
  return (
    <Dropdown menu={{ items: menuItems }} disabled={disabled || data.length === 0}>
      <Button icon={<DownloadOutlined />}>
        Export
      </Button>
    </Dropdown>
  );
};

export default ExportButton;

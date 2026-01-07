import React, { useState, useRef } from 'react';
import { Button, Upload, Modal, Table, Alert, message } from 'antd';
import { UploadOutlined, DownloadOutlined } from '@ant-design/icons';
import { importFromCSV, importFromJSON, ImportResult, ImportOptions } from '../utils/importUtils';

interface ImportButtonProps {
  onImport: (data: any[]) => void;
  accept?: string;
  options?: ImportOptions;
  columnMapping?: Record<string, string>;
  previewEnabled?: boolean;
  type?: 'icon' | 'button';
  disabled?: boolean;
}

/**
 * Reusable Import Button Component
 * Supports CSV and JSON import with preview
 */
const ImportButton: React.FC<ImportButtonProps> = ({
  onImport,
  accept = '.csv,.json',
  options = {},
  columnMapping = {},
  previewEnabled = true,
  type = 'button',
  disabled = false
}) => {
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult<any> | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    try {
      let result: ImportResult<any>;

      if (file.name.endsWith('.csv')) {
        result = await importFromCSV(file, options);
      } else if (file.name.endsWith('.json')) {
        result = await importFromJSON(file, options);
      } else {
        message.error('Unsupported file format. Please use CSV or JSON.');
        return false;
      }

      setImportResult(result);

      if (!result.success) {
        Modal.error({
          title: 'Import Failed',
          content: (
            <div>
              <p>Failed to import file. Please check the errors below:</p>
              <ul>
                {result.errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          ),
        });
        return false;
      }

      if (result.errors.length > 0) {
        message.warning(`Import completed with ${result.errors.length} warnings`);
      }

      if (previewEnabled) {
        setPreviewData(result.data);
        setPreviewVisible(true);
      } else {
        onImport(result.data);
        message.success(`Successfully imported ${result.rowCount} records`);
      }

      return false; // Prevent auto upload
    } catch (error) {
      message.error('Failed to read file');
      return false;
    }
  };

  const handleConfirmImport = () => {
    if (previewData.length > 0) {
      onImport(previewData);
      message.success(`Successfully imported ${previewData.length} records`);
      setPreviewVisible(false);
      setPreviewData([]);
      setImportResult(null);
    }
  };

  const handleCancelImport = () => {
    setPreviewVisible(false);
    setPreviewData([]);
    setImportResult(null);
  };

  // Generate table columns from data
  const getPreviewColumns = () => {
    if (previewData.length === 0) return [];

    const keys = Object.keys(previewData[0]);
    return keys.map(key => ({
      title: columnMapping[key] || key,
      dataIndex: key,
      key,
      ellipsis: true,
      render: (value: any) => {
        if (value instanceof Date) {
          return value.toLocaleDateString('vi-VN');
        }
        if (typeof value === 'boolean') {
          return value ? 'Yes' : 'No';
        }
        return String(value);
      }
    }));
  };

  const uploadProps = {
    accept,
    beforeUpload: handleFileSelect,
    showUploadList: false,
    disabled
  };

  return (
    <>
      {type === 'icon' ? (
        <Upload {...uploadProps}>
          <Button icon={<UploadOutlined />} disabled={disabled} />
        </Upload>
      ) : (
        <Upload {...uploadProps}>
          <Button icon={<UploadOutlined />} disabled={disabled}>
            Import
          </Button>
        </Upload>
      )}

      <Modal
        title="Import Preview"
        open={previewVisible}
        onOk={handleConfirmImport}
        onCancel={handleCancelImport}
        width={800}
        okText="Confirm Import"
        cancelText="Cancel"
      >
        {importResult && (
          <div style={{ marginBottom: 16 }}>
            {importResult.errors.length > 0 && (
              <Alert
                message="Warnings"
                description={
                  <ul style={{ marginBottom: 0 }}>
                    {importResult.errors.slice(0, 5).map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                    {importResult.errors.length > 5 && (
                      <li>... and {importResult.errors.length - 5} more warnings</li>
                    )}
                  </ul>
                }
                type="warning"
                showIcon
                style={{ marginBottom: 8 }}
              />
            )}
            <Alert
              message={`Found ${importResult.rowCount} records`}
              type="info"
              showIcon
            />
          </div>
        )}

        <Table
          dataSource={previewData.slice(0, 10)}
          columns={getPreviewColumns()}
          pagination={false}
          scroll={{ x: true }}
          size="small"
          rowKey={(record, index) => index?.toString() || '0'}
        />

        {previewData.length > 10 && (
          <div style={{ marginTop: 8, textAlign: 'center', color: '#666' }}>
            Showing first 10 of {previewData.length} records
          </div>
        )}
      </Modal>
    </>
  );
};

export default ImportButton;

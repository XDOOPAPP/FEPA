import React from 'react';
import { Button, Space, Popconfirm, Typography } from 'antd';
import {
  DeleteOutlined,
  ExportOutlined,
  CloseOutlined,
  CheckCircleOutlined,
  StopOutlined,
} from '@ant-design/icons';

const { Text } = Typography;

export interface BulkAction {
  key: string;
  label: string;
  icon?: React.ReactNode;
  danger?: boolean;
  confirm?: boolean;
  confirmTitle?: string;
  onClick: () => void;
}

export interface BulkActionsBarProps {
  selectedCount: number;
  onClearSelection: () => void;
  actions?: BulkAction[];
  loading?: boolean;
}

/**
 * Bulk Actions Bar component
 * Hiển thị thanh action khi có items được chọn
 * 
 * @example
 * <BulkActionsBar
 *   selectedCount={selectedIds.size}
 *   onClearSelection={deselectAll}
 *   actions={[
 *     { key: 'delete', label: 'Xóa', icon: <DeleteOutlined />, danger: true, confirm: true, onClick: handleBulkDelete },
 *     { key: 'export', label: 'Export', icon: <ExportOutlined />, onClick: handleBulkExport },
 *   ]}
 * />
 */
export const BulkActionsBar: React.FC<BulkActionsBarProps> = ({
  selectedCount,
  onClearSelection,
  actions = [],
  loading = false,
}) => {
  if (selectedCount === 0) return null;

  const renderAction = (action: BulkAction) => {
    const button = (
      <Button
        key={action.key}
        icon={action.icon}
        danger={action.danger}
        loading={loading}
        onClick={action.onClick}
      >
        {action.label}
      </Button>
    );

    if (action.confirm) {
      return (
        <Popconfirm
          key={action.key}
          title={action.confirmTitle || `Bạn có chắc chắn muốn ${action.label.toLowerCase()} ${selectedCount} items?`}
          onConfirm={action.onClick}
          okText="Có"
          cancelText="Không"
          okButtonProps={{ danger: action.danger }}
        >
          <Button
            icon={action.icon}
            danger={action.danger}
            loading={loading}
          >
            {action.label}
          </Button>
        </Popconfirm>
      );
    }

    return button;
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 24,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1000,
        background: '#fff',
        padding: '12px 24px',
        borderRadius: 8,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        display: 'flex',
        alignItems: 'center',
        gap: 16,
      }}
    >
      <CheckCircleOutlined style={{ color: '#1890ff', fontSize: 20 }} />
      <Text strong>
        Đã chọn {selectedCount} {selectedCount === 1 ? 'item' : 'items'}
      </Text>
      
      <Space>
        {actions.map(renderAction)}
        
        <Button
          icon={<CloseOutlined />}
          onClick={onClearSelection}
          disabled={loading}
        >
          Bỏ chọn
        </Button>
      </Space>
    </div>
  );
};

// Predefined common actions
export const commonBulkActions = {
  delete: (onDelete: () => void): BulkAction => ({
    key: 'delete',
    label: 'Xóa',
    icon: <DeleteOutlined />,
    danger: true,
    confirm: true,
    confirmTitle: 'Bạn có chắc chắn muốn xóa các items đã chọn?',
    onClick: onDelete,
  }),
  
  export: (onExport: () => void): BulkAction => ({
    key: 'export',
    label: 'Export',
    icon: <ExportOutlined />,
    onClick: onExport,
  }),
  
  activate: (onActivate: () => void): BulkAction => ({
    key: 'activate',
    label: 'Kích hoạt',
    icon: <CheckCircleOutlined />,
    onClick: onActivate,
  }),
  
  deactivate: (onDeactivate: () => void): BulkAction => ({
    key: 'deactivate',
    label: 'Vô hiệu hóa',
    icon: <StopOutlined />,
    onClick: onDeactivate,
  }),
};

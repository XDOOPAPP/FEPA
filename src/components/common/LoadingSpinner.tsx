import React from 'react';
import { Spin } from 'antd';

export interface LoadingSpinnerProps {
  size?: 'small' | 'default' | 'large';
  tip?: string;
  spinning?: boolean;
  children?: React.ReactNode;
}

/**
 * Loading Spinner Component
 * Có thể dùng standalone hoặc wrap around content
 * 
 * @example
 * // Standalone
 * <LoadingSpinner size="large" tip="Đang tải..." />
 * 
 * // Wrap content
 * <LoadingSpinner spinning={loading}>
 *   <div>Content here</div>
 * </LoadingSpinner>
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'default',
  tip,
  spinning = true,
  children,
}) => {
  if (children) {
    return (
      <Spin size={size} tip={tip} spinning={spinning}>
        {children}
      </Spin>
    );
  }

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      padding: '40px 0'
    }}>
      <Spin size={size} tip={tip} />
    </div>
  );
};

export default LoadingSpinner;

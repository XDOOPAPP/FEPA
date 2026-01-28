import React from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

export interface LoadingOverlayProps {
  loading?: boolean;
  tip?: string;
  fullscreen?: boolean;
  children?: React.ReactNode;
}

/**
 * Loading Overlay Component
 * Full screen or positioned overlay with blur effect
 * 
 * @example
 * <LoadingOverlay loading={isLoading} tip="Đang xử lý...">
 *   <div>Your content</div>
 * </LoadingOverlay>
 * 
 * // Fullscreen
 * <LoadingOverlay loading={true} fullscreen tip="Đang tải dữ liệu..." />
 */
export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  loading = false,
  tip = 'Đang tải...',
  fullscreen = false,
  children,
}) => {
  if (!loading && !fullscreen) {
    return <>{children}</>;
  }

  const overlayStyle: React.CSSProperties = fullscreen
    ? {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(4px)',
      }
    : {
        position: 'relative',
      };

  const spinnerContainerStyle: React.CSSProperties = fullscreen
    ? {}
    : {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 10,
        display: loading ? 'block' : 'none',
      };

  const contentStyle: React.CSSProperties = !fullscreen && loading
    ? {
        opacity: 0.4,
        pointerEvents: 'none',
        userSelect: 'none',
      }
    : {};

  if (fullscreen) {
    return loading ? (
      <div style={overlayStyle}>
        <Spin
          size="large"
          tip={tip}
          indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />}
        />
      </div>
    ) : null;
  }

  return (
    <div style={overlayStyle}>
      {loading && (
        <div style={spinnerContainerStyle}>
          <Spin
            size="large"
            tip={tip}
            indicator={<LoadingOutlined style={{ fontSize: 32 }} spin />}
          />
        </div>
      )}
      <div style={contentStyle}>{children}</div>
    </div>
  );
};

export default LoadingOverlay;

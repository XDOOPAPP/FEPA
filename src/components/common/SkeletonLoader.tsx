import React from 'react';
import { Skeleton, Card } from 'antd';

export interface SkeletonLoaderProps {
  type?: 'text' | 'card' | 'table' | 'form' | 'list';
  rows?: number;
  active?: boolean;
  loading?: boolean;
  children?: React.ReactNode;
}

/**
 * Skeleton Loader Component
 * Different skeleton types for various content
 * 
 * @example
 * <SkeletonLoader type="table" rows={5} loading={isLoading}>
 *   <Table dataSource={data} />
 * </SkeletonLoader>
 */
export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  type = 'text',
  rows = 3,
  active = true,
  loading = true,
  children,
}) => {
  if (!loading) {
    return <>{children}</>;
  }

  switch (type) {
    case 'card':
      return (
        <Card>
          <Skeleton active={active} avatar paragraph={{ rows: 4 }} />
        </Card>
      );

    case 'table':
      return (
        <div style={{ padding: '20px' }}>
          {Array.from({ length: rows }).map((_, index) => (
            <Skeleton
              key={index}
              active={active}
              paragraph={{ rows: 0 }}
              style={{ marginBottom: '16px' }}
            />
          ))}
        </div>
      );

    case 'form':
      return (
        <div style={{ padding: '20px' }}>
          <Skeleton.Input active={active} style={{ width: '100%', marginBottom: '16px' }} />
          <Skeleton.Input active={active} style={{ width: '100%', marginBottom: '16px' }} />
          <Skeleton.Input active={active} style={{ width: '100%', marginBottom: '16px' }} />
          <Skeleton.Button active={active} style={{ width: '100px', marginTop: '16px' }} />
        </div>
      );

    case 'list':
      return (
        <div>
          {Array.from({ length: rows }).map((_, index) => (
            <Card key={index} style={{ marginBottom: '16px' }}>
              <Skeleton active={active} avatar paragraph={{ rows: 2 }} />
            </Card>
          ))}
        </div>
      );

    case 'text':
    default:
      return <Skeleton active={active} paragraph={{ rows }} />;
  }
};

/**
 * Skeleton variants for common use cases
 */
export const SkeletonTable: React.FC<{ rows?: number; loading?: boolean; children?: React.ReactNode }> = ({
  rows = 5,
  loading = true,
  children,
}) => (
  <SkeletonLoader type="table" rows={rows} loading={loading}>
    {children}
  </SkeletonLoader>
);

export const SkeletonCard: React.FC<{ loading?: boolean; children?: React.ReactNode }> = ({
  loading = true,
  children,
}) => (
  <SkeletonLoader type="card" loading={loading}>
    {children}
  </SkeletonLoader>
);

export const SkeletonForm: React.FC<{ loading?: boolean; children?: React.ReactNode }> = ({
  loading = true,
  children,
}) => (
  <SkeletonLoader type="form" loading={loading}>
    {children}
  </SkeletonLoader>
);

export const SkeletonList: React.FC<{ rows?: number; loading?: boolean; children?: React.ReactNode }> = ({
  rows = 3,
  loading = true,
  children,
}) => (
  <SkeletonLoader type="list" rows={rows} loading={loading}>
    {children}
  </SkeletonLoader>
);

export default SkeletonLoader;

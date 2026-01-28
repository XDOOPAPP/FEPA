import { useEffect, useState } from 'react'
import { Card, Descriptions, Tag, Button, Space, Alert } from 'antd'
import { CheckCircleOutlined, CloseCircleOutlined, InfoCircleOutlined, ReloadOutlined } from '@ant-design/icons'
import { validateAdminToken, getUserFromToken, isTokenExpired, debugToken } from '../../utils/authUtils'

interface TokenInfo {
  exists: boolean
  expired: boolean
  isAdmin: boolean
  userId?: string
  email?: string
  role?: string
  expiresAt?: string
  issuedAt?: string
}

/**
 * Component hiển thị trạng thái authentication/authorization cho debugging
 * Chỉ nên sử dụng trong development hoặc admin panel
 */
export const AuthDebugPanel: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null)
  const [validationResult, setValidationResult] = useState<ReturnType<typeof validateAdminToken> | null>(null)

  const loadTokenInfo = () => {
    const validation = validateAdminToken()
    setValidationResult(validation)

    const user = getUserFromToken()
    const token = localStorage.getItem('accessToken')

    setTokenInfo({
      exists: !!token,
      expired: token ? isTokenExpired(token) : true,
      isAdmin: validation.valid,
      userId: user?.userId,
      email: user?.email,
      role: user?.role,
      expiresAt: user?.exp ? new Date(user.exp * 1000).toISOString() : undefined,
      issuedAt: user?.iat ? new Date(user.iat * 1000).toISOString() : undefined,
    })
  }

  useEffect(() => {
    loadTokenInfo()
  }, [])

  if (!tokenInfo) return null

  if (compact) {
    return (
      <Alert
        message={
          <Space>
            <span>Token:</span>
            {validationResult?.valid ? (
              <Tag icon={<CheckCircleOutlined />} color="success">Valid Admin</Tag>
            ) : (
              <Tag icon={<CloseCircleOutlined />} color="error">
                {!tokenInfo.exists ? 'Missing' : tokenInfo.expired ? 'Expired' : !tokenInfo.isAdmin ? 'Not Admin' : 'Invalid'}
              </Tag>
            )}
          </Space>
        }
        type={validationResult?.valid ? 'success' : 'error'}
        showIcon
        closable
      />
    )
  }

  return (
    <Card
      title={
        <Space>
          <InfoCircleOutlined />
          <span>Authentication Status</span>
          {validationResult?.valid ? (
            <Tag icon={<CheckCircleOutlined />} color="success">Valid</Tag>
          ) : (
            <Tag icon={<CloseCircleOutlined />} color="error">Invalid</Tag>
          )}
        </Space>
      }
      extra={
        <Space>
          <Button icon={<ReloadOutlined />} size="small" onClick={loadTokenInfo}>
            Refresh
          </Button>
          <Button size="small" onClick={debugToken}>
            Console Log
          </Button>
        </Space>
      }
      size="small"
    >
      {validationResult && !validationResult.valid && (
        <Alert
          message="Authentication Error"
          description={validationResult.error}
          type="error"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}

      <Descriptions bordered size="small" column={1}>
        <Descriptions.Item label="Token Exists">
          {tokenInfo.exists ? (
            <Tag color="success">Yes</Tag>
          ) : (
            <Tag color="error">No</Tag>
          )}
        </Descriptions.Item>

        {tokenInfo.exists && (
          <>
            <Descriptions.Item label="Token Status">
              {tokenInfo.expired ? (
                <Tag color="error">Expired</Tag>
              ) : (
                <Tag color="success">Active</Tag>
              )}
            </Descriptions.Item>

            <Descriptions.Item label="User ID">
              <code>{tokenInfo.userId || 'N/A'}</code>
            </Descriptions.Item>

            <Descriptions.Item label="Email">
              {tokenInfo.email || 'N/A'}
            </Descriptions.Item>

            <Descriptions.Item label="Role">
              <Tag color={tokenInfo.isAdmin ? 'blue' : 'default'}>
                {tokenInfo.role || 'N/A'}
              </Tag>
            </Descriptions.Item>

            <Descriptions.Item label="Admin Access">
              {tokenInfo.isAdmin ? (
                <Tag icon={<CheckCircleOutlined />} color="success">Yes</Tag>
              ) : (
                <Tag icon={<CloseCircleOutlined />} color="error">No</Tag>
              )}
            </Descriptions.Item>

            {tokenInfo.issuedAt && (
              <Descriptions.Item label="Issued At">
                {new Date(tokenInfo.issuedAt).toLocaleString()}
              </Descriptions.Item>
            )}

            {tokenInfo.expiresAt && (
              <Descriptions.Item label="Expires At">
                {new Date(tokenInfo.expiresAt).toLocaleString()}
              </Descriptions.Item>
            )}
          </>
        )}
      </Descriptions>

      {!validationResult?.valid && (
        <Alert
          message="Troubleshooting Steps"
          description={
            <ul style={{ paddingLeft: 20, margin: 0 }}>
              <li>Check if you're logged in with an admin account</li>
              <li>Try logging out and logging back in</li>
              <li>Check browser console for detailed error messages</li>
              <li>Verify backend is running and accessible</li>
            </ul>
          }
          type="info"
          showIcon
          style={{ marginTop: 16 }}
        />
      )}
    </Card>
  )
}

export default AuthDebugPanel

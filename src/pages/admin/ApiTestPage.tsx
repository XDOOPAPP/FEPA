import React, { useState } from 'react'
import { Card, Button, Space, Typography, Alert, Descriptions, Tag } from 'antd'
import { apiDebug } from '../utils/apiDebug'
import { API_CONFIG } from '../config/api.config'

const { Title, Text, Paragraph } = Typography

/**
 * API Test Page - Debug API connectivity
 * Access via: /admin/api-test
 */
const ApiTestPage: React.FC = () => {
  const [testResults, setTestResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const addResult = (result: any) => {
    setTestResults(prev => [result, ...prev])
  }

  const handleTestConnection = async () => {
    setLoading(true)
    addResult({ type: 'info', message: 'Testing basic connection...' })
    
    try {
      await apiDebug.testConnection()
      addResult({ type: 'success', message: '✅ Connection successful!' })
    } catch (error: any) {
      addResult({ 
        type: 'error', 
        message: `❌ Connection failed: ${error.message}`,
        details: error.response?.data 
      })
    } finally {
      setLoading(false)
    }
  }

  const handleTestAuth = async () => {
    setLoading(true)
    addResult({ type: 'info', message: 'Testing authenticated endpoint...' })
    
    try {
      await apiDebug.testAuth()
      addResult({ type: 'success', message: '✅ Authentication successful!' })
    } catch (error: any) {
      addResult({ 
        type: 'error', 
        message: `❌ Authentication failed: ${error.message}`,
        details: error.response?.data 
      })
    } finally {
      setLoading(false)
    }
  }

  const handleTestAll = async () => {
    setLoading(true)
    addResult({ type: 'info', message: 'Testing all dashboard endpoints...' })
    
    try {
      await apiDebug.testDashboardEndpoints()
      addResult({ type: 'success', message: '✅ All tests completed! Check console for details.' })
    } catch (error: any) {
      addResult({ 
        type: 'error', 
        message: `❌ Tests failed: ${error.message}` 
      })
    } finally {
      setLoading(false)
    }
  }

  const getCurrentConfig = () => {
    const token = localStorage.getItem('accessToken')
    const refreshToken = localStorage.getItem('refreshToken')
    const user = sessionStorage.getItem('user')
    
    let userId = 'N/A'
    if (token) {
      try {
        const base64Url = token.split('.')[1]
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split('')
            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        )
        const decoded = JSON.parse(jsonPayload)
        userId = decoded.userId || decoded.sub || decoded.id || 'N/A'
      } catch (err) {
        userId = 'Invalid token'
      }
    }

    return {
      baseUrl: API_CONFIG.BASE_URL,
      socketUrl: API_CONFIG.SOCKET_URL,
      hasToken: !!token,
      hasRefreshToken: !!refreshToken,
      hasUser: !!user,
      userId,
      tokenPreview: token ? `${token.substring(0, 30)}...` : 'N/A'
    }
  }

  const config = getCurrentConfig()

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>🔍 API Testing & Debugging</Title>
      <Paragraph>
        Trang này giúp bạn kiểm tra kết nối API và debug các vấn đề.
        Tất cả kết quả test cũng được log ra browser console (F12).
      </Paragraph>

      {/* Current Configuration */}
      <Card title="⚙️ Current Configuration" style={{ marginBottom: 24 }}>
        <Descriptions bordered column={2}>
          <Descriptions.Item label="API Base URL">
            <Text code>{config.baseUrl}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="Socket URL">
            <Text code>{config.socketUrl}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="Access Token">
            {config.hasToken ? (
              <Tag color="success">Present</Tag>
            ) : (
              <Tag color="error">Missing</Tag>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Refresh Token">
            {config.hasRefreshToken ? (
              <Tag color="success">Present</Tag>
            ) : (
              <Tag color="error">Missing</Tag>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="User Session">
            {config.hasUser ? (
              <Tag color="success">Present</Tag>
            ) : (
              <Tag color="error">Missing</Tag>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="User ID (from token)">
            <Text code>{config.userId}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="Token Preview" span={2}>
            <Text code style={{ fontSize: 12 }}>{config.tokenPreview}</Text>
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* Test Actions */}
      <Card title="🧪 Run Tests" style={{ marginBottom: 24 }}>
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Alert
            message="Test Instructions"
            description="Click the buttons below to test different aspects of API connectivity. Results will appear below and in the browser console."
            type="info"
            showIcon
          />
          
          <Space wrap>
            <Button 
              type="primary" 
              onClick={handleTestConnection}
              loading={loading}
            >
              1. Test Basic Connection
            </Button>
            <Button 
              type="primary" 
              onClick={handleTestAuth}
              loading={loading}
              disabled={!config.hasToken}
            >
              2. Test Authentication
            </Button>
            <Button 
              type="primary" 
              onClick={handleTestAll}
              loading={loading}
              disabled={!config.hasToken}
            >
              3. Test All Endpoints
            </Button>
            <Button 
              onClick={() => {
                setTestResults([])
                console.clear()
              }}
            >
              Clear Results
            </Button>
            <Button 
              onClick={() => {
                apiDebug.printConfig()
                addResult({ type: 'info', message: 'Configuration printed to console' })
              }}
            >
              Print Config
            </Button>
          </Space>

          {!config.hasToken && (
            <Alert
              message="No Access Token"
              description="You need to login first to test authenticated endpoints."
              type="warning"
              showIcon
            />
          )}
        </Space>
      </Card>

      {/* Test Results */}
      {testResults.length > 0 && (
        <Card title="📊 Test Results" style={{ marginBottom: 24 }}>
          <Space direction="vertical" size="small" style={{ width: '100%' }}>
            {testResults.map((result, index) => (
              <Alert
                key={index}
                message={result.message}
                description={result.details && (
                  <pre style={{ fontSize: 12, maxHeight: 200, overflow: 'auto' }}>
                    {JSON.stringify(result.details, null, 2)}
                  </pre>
                )}
                type={result.type}
                showIcon
              />
            ))}
          </Space>
        </Card>
      )}

      {/* Troubleshooting */}
      <Card title="🆘 Troubleshooting">
        <Space direction="vertical" size="middle">
          <div>
            <Title level={5}>Common Issues:</Title>
            <ul>
              <li>
                <strong>Connection Failed:</strong> Backend không chạy hoặc Base URL sai
              </li>
              <li>
                <strong>401 Unauthorized:</strong> Token invalid/expired hoặc thiếu x-user-id header
              </li>
              <li>
                <strong>CORS Error:</strong> Backend chưa config CORS cho origin của frontend
              </li>
              <li>
                <strong>Network Error:</strong> Không kết nối được tới server - check firewall/network
              </li>
            </ul>
          </div>

          <div>
            <Title level={5}>Quick Fixes:</Title>
            <Space wrap>
              <Button 
                onClick={() => {
                  localStorage.clear()
                  sessionStorage.clear()
                  addResult({ type: 'warning', message: 'All storage cleared. Please login again.' })
                }}
                danger
              >
                Clear All Storage
              </Button>
              <Button 
                onClick={() => {
                  window.location.reload()
                }}
              >
                Hard Refresh
              </Button>
              <Button 
                onClick={() => {
                  window.location.href = '/login'
                }}
              >
                Go to Login
              </Button>
            </Space>
          </div>
        </Space>
      </Card>
    </div>
  )
}

export default ApiTestPage

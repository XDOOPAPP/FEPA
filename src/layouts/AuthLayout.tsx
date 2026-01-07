import React from 'react'
import { Layout, Row, Col } from 'antd'
import './AuthLayout.css'

const { Content } = Layout

interface AuthLayoutProps {
  children: React.ReactNode
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <Layout className="auth-layout" style={{ minHeight: '100vh' }}>
      <Content>
        <Row justify="center" align="middle" style={{ minHeight: '100vh' }}>
          <Col xs={24} sm={20} md={16} lg={12} xl={8}>
            <div className="auth-container">
              {children}
            </div>
          </Col>
        </Row>
      </Content>
    </Layout>
  )
}

export default AuthLayout

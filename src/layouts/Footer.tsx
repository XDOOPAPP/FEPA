import React from 'react'
import { Layout } from 'antd'

const { Footer: AntFooter } = Layout

const Footer: React.FC = () => {
  return (
    <AntFooter style={{ textAlign: 'center', background: '#f5f5f5' }}>
      <div>
        <p style={{ marginBottom: '8px' }}>FEPA - Financial Expense Planning Application</p>
        <p style={{ marginBottom: '0', color: '#999', fontSize: '12px' }}>
          ©2024 All Rights Reserved. Built with React + Ant Design
        </p>
      </div>
    </AntFooter>
  )
}

export default Footer

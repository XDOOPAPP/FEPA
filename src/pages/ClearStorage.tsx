import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Result } from 'antd'

const ClearStorage = () => {
  const navigate = useNavigate()

  useEffect(() => {
    // Clear all storage
    localStorage.clear()
    sessionStorage.clear()
    
    // Clear all cookies
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/")
    })
  }, [])

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: '#f0f2f5'
    }}>
      <Result
        status="success"
        title="Đã xóa toàn bộ dữ liệu!"
        subTitle="LocalStorage và SessionStorage đã được xóa sạch."
        extra={[
          <Button type="primary" key="login" onClick={() => navigate('/login')}>
            Đến trang Login
          </Button>,
          <Button key="reload" onClick={() => window.location.href = '/'}>
            Reload trang chủ
          </Button>,
        ]}
      />
    </div>
  )
}

export default ClearStorage

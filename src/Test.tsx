import React from 'react'

const TestPage: React.FC = () => {
  return (
    <div style={{ padding: '50px', textAlign: 'center', fontSize: '24px' }}>
      <h1>✅ React đang chạy!</h1>
      <p>Nếu bạn thấy dòng này, tức là React render thành công</p>
      <button onClick={() => window.location.href = '/login'}>
        Go to Login Page
      </button>
    </div>
  )
}

export default TestPage

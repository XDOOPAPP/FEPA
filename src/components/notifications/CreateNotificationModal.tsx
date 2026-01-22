import React, { useState } from 'react'
import { Button, Form, Input, Radio, Select, Typography, message as antdMessage } from 'antd'
import { CloseOutlined } from '@ant-design/icons'
import notificationAPI from '../../services/api/notificationAPI'
import './CreateNotificationModal.css'

const { TextArea } = Input
const { Title } = Typography

interface Props {
  visible: boolean
  onClose: () => void
  onSuccess?: () => void
}

const notificationTypes = [
  { value: 'INFO', label: 'Thông tin chung' },
  { value: 'SYSTEM_MAINTENANCE', label: 'Bảo trì hệ thống' },
  { value: 'FEATURE_UPDATE', label: 'Cập nhật tính năng' },
  { value: 'URGENT', label: 'Khẩn cấp' },
  { value: 'ANNOUNCEMENT', label: 'Thông báo quan trọng' },
]

const CreateNotificationModal: React.FC<Props> = ({ visible, onClose, onSuccess }) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [titleLength, setTitleLength] = useState(0)
  const [messageLength, setMessageLength] = useState(0)

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true)
      
      await notificationAPI.createNotification({
        title: values.title,
        message: values.message,
        type: values.type || 'INFO',
        target: values.target,
      })

      antdMessage.success('Thông báo đã được gửi thành công!')
      form.resetFields()
      setTitleLength(0)
      setMessageLength(0)
      onSuccess?.()
      onClose()
    } catch (error: any) {
      console.error('Failed to create notification:', error)
      antdMessage.error(error?.message || 'Gửi thông báo thất bại. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  if (!visible) return null

  return (
    <div className="create-notification-modal" onClick={onClose}>
      <div className="create-notification-modal__content" onClick={(e) => e.stopPropagation()}>
        <div className="create-notification-modal__header">
          <Title level={4} style={{ margin: 0 }}>
            Tạo Thông Báo Mới
          </Title>
          <Button
            type="text"
            icon={<CloseOutlined />}
            onClick={onClose}
            disabled={loading}
          />
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ type: 'INFO', target: 'ALL' }}
        >
          <Form.Item
            label="Tiêu đề"
            name="title"
            rules={[
              { required: true, message: 'Vui lòng nhập tiêu đề' },
              { min: 5, message: 'Tiêu đề phải có ít nhất 5 ký tự' },
              { max: 100, message: 'Tiêu đề không được quá 100 ký tự' },
            ]}
          >
            <Input
              placeholder="Thông báo bảo trì hệ thống"
              maxLength={100}
              onChange={(e) => setTitleLength(e.target.value.length)}
            />
          </Form.Item>
          <div className="create-notification-modal__char-count">{titleLength}/100</div>

          <Form.Item
            label="Nội dung"
            name="message"
            rules={[
              { required: true, message: 'Vui lòng nhập nội dung' },
              { min: 10, message: 'Nội dung phải có ít nhất 10 ký tự' },
              { max: 500, message: 'Nội dung không được quá 500 ký tự' },
            ]}
          >
            <TextArea
              placeholder="Hệ thống sẽ bảo trì từ 22h-24h hôm nay. Vui lòng lưu công việc."
              rows={4}
              maxLength={500}
              onChange={(e) => setMessageLength(e.target.value.length)}
            />
          </Form.Item>
          <div className="create-notification-modal__char-count">{messageLength}/500</div>

          <Form.Item label="Loại thông báo" name="type">
            <Select options={notificationTypes} />
          </Form.Item>

          <Form.Item
            label="Gửi đến"
            name="target"
            rules={[{ required: true, message: 'Vui lòng chọn đối tượng nhận' }]}
          >
            <Radio.Group>
              <Radio value="ALL">Tất cả người dùng (ALL)</Radio>
              <Radio value="ADMINS">Chỉ Admin (ADMINS)</Radio>
            </Radio.Group>
          </Form.Item>

          <div className="create-notification-modal__footer">
            <Button onClick={onClose} disabled={loading}>
              Hủy
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              Gửi Thông Báo
            </Button>
          </div>
        </Form>
      </div>
    </div>
  )
}

export default CreateNotificationModal

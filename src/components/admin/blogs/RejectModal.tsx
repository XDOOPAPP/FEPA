import React, { useState } from 'react'
import { Modal, Form, Input, Button, Spin, message } from 'antd'
import type { Blog } from '../../../types/blog'
import './BlogModals.css'

interface RejectModalProps {
  visible: boolean
  blog: Blog
  loading?: boolean
  onConfirm: (reason: string) => void
  onCancel: () => void
}

const RejectModal: React.FC<RejectModalProps> = ({
  visible,
  blog,
  loading = false,
  onConfirm,
  onCancel,
}) => {
  const [form] = Form.useForm()

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      if (!values.reason || values.reason.trim() === '') {
        message.error('Vui lòng nhập lý do từ chối')
        return
      }
      onConfirm(values.reason)
      form.resetFields()
    } catch (error) {
      console.error('Form validation failed:', error)
    }
  }

  const handleCancel = () => {
    form.resetFields()
    onCancel()
  }

  return (
    <Modal
      title="Từ chối bài viết"
      open={visible}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel} disabled={loading}>
          Hủy
        </Button>,
        <Button key="submit" type="primary" danger onClick={handleSubmit} loading={loading}>
          Từ chối
        </Button>,
      ]}
      className="reject-modal"
    >
      <Spin spinning={loading}>
        <div className="modal-content">
          <div className="blog-info">
            <p>
              <strong>Tiêu đề:</strong> {blog.title}
            </p>
            <p>
              <strong>Tác giả:</strong> {blog.author?.name || 'N/A'}
            </p>
            <p className="status-message warning">⚠️ Bài viết sẽ bị từ chối</p>
          </div>

          <Form form={form} layout="vertical">
            <Form.Item
              name="reason"
              label="Lý do từ chối"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập lý do từ chối',
                },
                {
                  max: 500,
                  message: 'Lý do không được vượt quá 500 ký tự',
                },
                {
                  min: 10,
                  message: 'Lý do phải có ít nhất 10 ký tự',
                },
              ]}
            >
              <Input.TextArea
                placeholder="Nhập lý do từ chối bài viết..."
                rows={5}
                disabled={loading}
              />
            </Form.Item>
          </Form>
        </div>
      </Spin>
    </Modal>
  )
}

export default RejectModal

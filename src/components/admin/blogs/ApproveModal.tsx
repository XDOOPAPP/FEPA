import React, { useState } from 'react'
import { Modal, Form, Input, Button, Spin } from 'antd'
import type { Blog } from '../../../types/blog'
import './BlogModals.css'

interface ApproveModalProps {
  visible: boolean
  blog: Blog
  loading?: boolean
  onConfirm: (note?: string) => void
  onCancel: () => void
}

const ApproveModal: React.FC<ApproveModalProps> = ({
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
      onConfirm(values.note || undefined)
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
      title="Phê duyệt bài viết"
      open={visible}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel} disabled={loading}>
          Hủy
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit} loading={loading}>
          Phê duyệt
        </Button>,
      ]}
      className="approve-modal"
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
            <p className="status-message">✅ Bài viết sẽ được xuất bản</p>
          </div>

          <Form form={form} layout="vertical">
            <Form.Item
              name="note"
              label="Ghi chú (tùy chọn)"
              rules={[
                {
                  max: 500,
                  message: 'Ghi chú không được vượt quá 500 ký tự',
                },
              ]}
            >
              <Input.TextArea
                placeholder="Nhập ghi chú cho tác giả..."
                rows={4}
                disabled={loading}
              />
            </Form.Item>
          </Form>
        </div>
      </Spin>
    </Modal>
  )
}

export default ApproveModal

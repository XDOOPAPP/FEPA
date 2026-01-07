import React, { useMemo } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: number;
  readOnly?: boolean;
  theme?: 'snow' | 'bubble';
}

/**
 * Rich Text Editor Component using React Quill
 * 
 * @example
 * const [content, setContent] = useState('');
 * 
 * <RichTextEditor
 *   value={content}
 *   onChange={setContent}
 *   placeholder="Nhập nội dung bài viết..."
 *   height={400}
 * />
 */
export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Nhập nội dung...',
  height = 300,
  readOnly = false,
  theme = 'snow',
}) => {
  // Quill modules configuration
  const modules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ font: [] }],
        [{ size: ['small', false, 'large', 'huge'] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ color: [] }, { background: [] }],
        [{ script: 'sub' }, { script: 'super' }],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ indent: '-1' }, { indent: '+1' }],
        [{ direction: 'rtl' }],
        [{ align: [] }],
        ['blockquote', 'code-block'],
        ['link', 'image', 'video'],
        ['clean'],
      ],
      clipboard: {
        matchVisual: false,
      },
    }),
    []
  );

  // Quill formats
  const formats = [
    'header',
    'font',
    'size',
    'bold',
    'italic',
    'underline',
    'strike',
    'color',
    'background',
    'script',
    'list',
    'bullet',
    'indent',
    'direction',
    'align',
    'blockquote',
    'code-block',
    'link',
    'image',
    'video',
  ];

  return (
    <div className="rich-text-editor-wrapper">
      <ReactQuill
        theme={theme}
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        readOnly={readOnly}
        style={{
          height: `${height}px`,
          marginBottom: '42px', // Space for toolbar
        }}
      />
      
      <style>{`
        .rich-text-editor-wrapper .quill {
          background: white;
          border-radius: 4px;
        }
        
        .rich-text-editor-wrapper .ql-container {
          font-size: 14px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        }
        
        .rich-text-editor-wrapper .ql-editor {
          min-height: ${height}px;
          max-height: ${height + 200}px;
          overflow-y: auto;
        }
        
        .rich-text-editor-wrapper .ql-editor.ql-blank::before {
          color: #bfbfbf;
          font-style: normal;
        }
        
        /* Toolbar styling */
        .rich-text-editor-wrapper .ql-toolbar {
          border-top-left-radius: 4px;
          border-top-right-radius: 4px;
          background: #fafafa;
        }
        
        .rich-text-editor-wrapper .ql-container {
          border-bottom-left-radius: 4px;
          border-bottom-right-radius: 4px;
        }
        
        /* Custom scrollbar */
        .rich-text-editor-wrapper .ql-editor::-webkit-scrollbar {
          width: 8px;
        }
        
        .rich-text-editor-wrapper .ql-editor::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }
        
        .rich-text-editor-wrapper .ql-editor::-webkit-scrollbar-thumb {
          background: #bfbfbf;
          border-radius: 4px;
        }
        
        .rich-text-editor-wrapper .ql-editor::-webkit-scrollbar-thumb:hover {
          background: #8c8c8c;
        }
        
        /* Read-only mode */
        .rich-text-editor-wrapper .ql-container.ql-disabled .ql-editor {
          background: #f5f5f5;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;

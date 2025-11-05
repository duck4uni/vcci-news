import { FC, JSX } from 'react';
import htmlParse, { DOMNode, Element, Text } from 'html-react-parser';
import { AppEditorContentProps } from './AppEditorContent.type';
import './AppEditorContent.css';

const AppEditorContent: FC<AppEditorContentProps> = ({ value = '', className = '' }) => {
  const transform = (node: DOMNode): JSX.Element | string | undefined | null => {

    // 1. Xử lý Text Node
    if (node instanceof Text) {
      return node.data;
    }

    if (!(node instanceof Element)) return undefined;

    const tagName = node.tagName.toLowerCase();

    // ✅ FIX LỖI: Ép kiểu (as DOMNode) để Type 'ChildNode' khớp với 'DOMNode'
    const children = node.children
      ? node.children.map(child => transform(child as DOMNode))
      : [];

    // --- LOGIC XỬ LÝ THEO YÊU CẦU ---

    // 2. ✅ Xóa thẻ <img>
    if (tagName === 'img') {
      return <></>;
    }

    // 3. ✅ Xóa thẻ <a> nhưng giữ lại nội dung
    if (tagName === 'a') {
      // Trả về children đã được xử lý (làm phẳng thẻ <a>)
      return <>{children}</>;
    }

    // 4. ✅ Xử lý thẻ <strong>
    if (tagName === 'strong') {
      return (
        <strong className="custom-strong">
          {children}
        </strong>
      );
    }

    // 5. ✅ Render các thẻ HTML khác (Fallback)
    // Trả về undefined để thư viện tự động render các thẻ còn lại (p, div, br,...)
    return undefined;
  };

  return (
    <div className="jodit-container app-editor-container">
      <div className={`jodit-wysiwyg ${className}`}>{htmlParse(value, { replace: transform })}</div>
    </div>
  );
};

export default AppEditorContent;
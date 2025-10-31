import { FC, JSX } from 'react';
import htmlParse, { DOMNode, Element, Text } from 'html-react-parser';
import { AppEditorContentProps } from './AppEditorContent.type';
import './AppEditorContent.css';

const AppEditorContent: FC<AppEditorContentProps> = ({ value = '', className = '' }) => {
  const transform = (node: DOMNode): JSX.Element | null => {
    if (node instanceof Element && node.tagName === 'strong') {
      return (
        <strong className="custom-strong">
          {node.children && Array.isArray(node.children)
            ? node.children.map((child, index) => {
              if (typeof child === 'string') {
                return child;
              } else if (child instanceof Text) {
                return child.data;
              }
              return null;
            })
            : null}
        </strong>
      );
    }
    return null;
  };

  return (
    <div className="jodit-container app-editor-container">
      <div className={`jodit-wysiwyg ${className}`}>{htmlParse(value, { replace: transform })}</div>
    </div>
  );
};

export default AppEditorContent;

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";
import type { ComponentPropsWithoutRef } from 'react';

type CodeProps = ComponentPropsWithoutRef<'code'> & {
  inline?: boolean;
  node?: any;
};

const CodeBlock = ({ 
  children, 
  className, 
  inline = false,
  ...props 
}: CodeProps) => {
  if (inline) {
    return <code className={className} {...props}>{children}</code>;
  }

  const match = /language-(\w+)/.exec(className || '');
  const language = match?.[1] || 'text';
  
  return (
    <SyntaxHighlighter
      style={docco}
      language={language}
      PreTag="div"
      customStyle={{
        fontSize: '24px',           // Bigger text
        maxHeight: '400px',         // Max height before scroll
        overflowY: 'auto',          // Vertical scroll
        overflowX: 'auto',          // Horizontal scroll for long lines
        borderRadius: '8px',        // Optional: rounded corners
        padding: '16px',            // Optional: more padding
        margin: '8px 0',            // Optional: spacing
        backgroundColor: '#494949ff',
      }}
    >
      {String(children).replace(/\n$/, '')}
    </SyntaxHighlighter>
  );
};

export default CodeBlock;
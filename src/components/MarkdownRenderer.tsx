import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/cjs/styles/prism';

type MarkdownRendererProps = {
  children: string;
};

export function MarkdownRenderer({ children: markdown }: MarkdownRendererProps) {
  return (
    <Markdown
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeKatex]}
      components={{
        code({ node, inline, className, children, ...props }: any) {
          const match = /language-(\w+)/.exec(className || '');

          return !inline && match ? (
            <SyntaxHighlighter style={dracula} PreTag="div" language={match[1]} 
            customStyle={{
                fontSize: '24px',        // Bigger text
                lineHeight: '1.5',       // Better spacing
                padding: '16px',         // More padding
                borderRadius: '8px',     // Rounded corners
                maxHeight: '400px',      // Limit height
                overflowY: 'auto',       // Vertical scroll if needed
                overflowX: 'auto',       // Horizontal scroll for long lines
              }}
              {...props}>
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          ) : (
            <code className={className} {...props}>
              {children}
            </code>
          );
        },
        p({ children, ...props }) {
          return (
            <p style={{ 
              lineHeight: '3', 
              margin: '0.8em 0',
              minHeight: '2.5em'  // Ensure enough space for complex math
            }} {...props}>
              {children}
            </p>
          );
        },
      }}
    >
      {markdown}
    </Markdown>
  );
}

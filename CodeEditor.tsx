import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Editor from '@monaco-editor/react';
import { useTheme } from '../theme/ThemeContext';

const defaultCode = `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`;

const EditorContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #1e1e2e;
  height: 500px;
  overflow: hidden;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 1200px;
  margin: 1rem auto;
`;

const EditorHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1.25rem;
  background-color: #13141f;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
`;

const EditorTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #fff;
  font-size: 1.1rem;
  font-weight: 500;

  svg {
    width: 20px;
    height: 20px;
    opacity: 0.8;
  }
`;

const EditorDescription = styled.div`
  color: #8b8b8b;
  font-size: 0.9rem;
  margin-top: 0.25rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.75rem;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary'; isLoading?: boolean }>`
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: none;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: ${props => props.isLoading ? 'wait' : 'pointer'};
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;
  opacity: ${props => props.isLoading ? 0.7 : 1};

  background-color: ${props => props.variant === 'primary' ? '#7c4dff' : '#2a2a3a'};
  color: ${props => props.variant === 'primary' ? '#fff' : '#9494a1'};

  &:hover {
    background-color: ${props => props.variant === 'primary' ? '#6c3fff' : '#35354a'};
    color: #fff;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const EditorWrapper = styled.div`
  flex: 1;
  overflow: hidden;
  background-color: #13141f;

  .monaco-editor {
    padding: 1rem 0;
  }
`;

const OutputContainer = styled.div`
  background-color: #13141f;
  border-top: 1px solid #2d2d3d;
  color: #fff;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
`;

const OutputHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1.5rem;
  border-bottom: 1px solid #2d2d3d;
`;

const OutputTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #9494a1;
  font-size: 0.9rem;

  svg {
    width: 18px;
    height: 18px;
    opacity: 0.7;
  }
`;

const OutputContent = styled.pre`
  margin: 0;
  padding: 1rem 1.5rem;
  color: #fff;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 0.9rem;
  max-height: 200px;
  overflow-y: auto;
`;

const CodeEditor: React.FC = () => {
  const { isDarkMode } = useTheme();
  const [code, setCode] = useState<string>(defaultCode);
  const [output, setOutput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const saved = localStorage.getItem('savedCode');
    if (saved) {
      setCode(saved);
    }
  }, []);

  const handleRunCode = async () => {
    setIsLoading(true);
    setOutput('Compiling and running...');
    try {
      const response = await fetch('http://localhost:8001/api/run-java', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      const data = await response.json();
      if (data.success) {
        setOutput(data.output || '(No output)');
      } else {
        setOutput(`Error:\n${data.output}`);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setOutput(`Failed to connect to the server: ${message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setCode(defaultCode);
    setOutput('');
  };

  const handleClear = () => {
    setOutput('');
  };

  const handleSave = () => {
    localStorage.setItem('savedCode', code);
    alert('Code saved to localStorage!');
  };

  return (
    <EditorContainer>
      <EditorHeader>
        <div>
          <EditorTitle>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 3h18v18H3V3zm16 16V5H5v14h14zM7 7h10v2H7V7zm0 4h10v2H7v-2zm0 4h7v2H7v-2z"/>
            </svg>
            Interactive Code Editor
          </EditorTitle>
          <EditorDescription>
            Write, compile, and run Java code in real-time
          </EditorDescription>
        </div>
        <ButtonGroup>
          <Button onClick={handleRunCode} variant="primary" isLoading={isLoading}>
            {isLoading ? (
              <>
                <svg viewBox="0 0 24 24" fill="currentColor" className="animate-spin">
                  <path d="M12 4V2A10 10 0 0 0 2 12h2a8 8 0 0 1 8-8z"/>
                </svg>
                Running...
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z"/>
                </svg>
                Run Code
              </>
            )}
          </Button>
          <Button onClick={handleReset}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12z"/>
            </svg>
            Reset
          </Button>
          <Button onClick={handleSave}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M17 3H7c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H7V5h10v14z"/>
            </svg>
            Save
          </Button>
        </ButtonGroup>
      </EditorHeader>

      <EditorWrapper>
        <Editor
          height="300px"
          defaultLanguage="java"
          value={code}
          onChange={(value: string | undefined) => setCode(value || '')}
          theme={isDarkMode ? 'vs-dark' : 'light'}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 4,
            wordWrap: 'on',
            padding: { top: 12, bottom: 12 },
            fontFamily: "'Consolas', 'Monaco', monospace",
            renderLineHighlight: 'all',
            contextmenu: false,
            overviewRulerBorder: false,
            hideCursorInOverviewRuler: true,
            lineHeight: 21,
            renderWhitespace: 'none',
            scrollbar: {
              vertical: 'hidden',
              horizontal: 'hidden'
            }
          }}
        />
      </EditorWrapper>

      <OutputContainer>
        <OutputHeader>
          <OutputTitle>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8h16v10z"/>
            </svg>
            Output
          </OutputTitle>
          <Button onClick={handleClear}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/>
            </svg>
            Clear
          </Button>
        </OutputHeader>
        <OutputContent>{output}</OutputContent>
      </OutputContainer>
    </EditorContainer>
  );
};

export default CodeEditor;
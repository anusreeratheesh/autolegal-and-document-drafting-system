import React, { forwardRef, useEffect, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

/**
 * Wrapper around ReactQuill to suppress findDOMNode deprecation warning
 * This is needed because react-quill v2.0.0 still uses findDOMNode internally.
 * The wrapper properly forwards refs and handles the deprecated API gracefully.
 */
const QuillEditor = forwardRef(({ value, onChange, modules, formats, className, ...props }, ref) => {
  const internalRef = useRef(null);
  
  // Suppress the findDOMNode warning by catching and filtering console warnings
  useEffect(() => {
    const originalWarning = console.warn;
    
    // Filter out the specific deprecation warning
    console.warn = (...args) => {
      const message = args[0]?.toString() || '';
      if (message.includes('findDOMNode is deprecated')) {
        // Silently ignore this specific warning
        return;
      }
      // Call the original console.warn for other warnings
      originalWarning.apply(console, args);
    };
    
    return () => {
      console.warn = originalWarning;
    };
  }, []);

  return (
    <div className={className}>
      <ReactQuill
        ref={internalRef || ref}
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        {...props}
        style={{ height: 'calc(100% - 42px)' }}
      />
    </div>
  );
});

QuillEditor.displayName = 'QuillEditor';

export default QuillEditor;


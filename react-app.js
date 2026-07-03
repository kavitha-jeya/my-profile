const ReactDemo = () => {
    const [count, setCount] = React.useState(0);

    return (
        <div style={{ 
            padding: '1.5rem', 
            background: 'rgba(255, 255, 255, 0.05)', 
            backdropFilter: 'blur(10px)',
            borderRadius: '16px', 
            border: '1px solid rgba(255, 255, 255, 0.1)',
            maxWidth: '400px',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)'
        }}>
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.3rem', color: 'var(--color-primary)' }}>
                ⚛️ Hello from React!
            </h3>
            <p style={{ margin: '0 0 1rem 0', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                This interactive component is built with React JSX and is running directly in your browser. No Node.js or Vite required!
            </p>
            <button 
                className="btn btn-primary" 
                onClick={() => setCount(c => c + 1)}
                style={{ padding: '0.6rem 1.2rem', fontSize: '0.95rem', cursor: 'pointer' }}
            >
                Clicked {count} times
            </button>
        </div>
    );
};

// Mount the React component to the DOM
const rootNode = document.getElementById('react-demo-root');
if (rootNode) {
    const root = ReactDOM.createRoot(rootNode);
    root.render(<ReactDemo />);
}

export default function App() {
  return (
    <main
      style={{
        minHeight: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        background: '#0b0d0f',
        color: '#f5f5f4',
        fontFamily:
          'system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        textAlign: 'center',
      }}
    >
      <p
        style={{
          margin: 0,
          fontSize: 'clamp(1.25rem, 4vw, 1.75rem)',
          fontWeight: 500,
          letterSpacing: '-0.01em',
        }}
      >
        This domain has already been reserved
      </p>
    </main>
  );
}

import "./styles/Loading.css";

function Loading({ label = "Loading" }) {
  return (
    <main className="loading-screen" aria-live="polite" aria-busy="true">
      <div className="loading-content" role="status">
        <span className="loading-spinner" aria-hidden="true" />
        <span>{label}</span>
      </div>
    </main>
  );
}

export default Loading;

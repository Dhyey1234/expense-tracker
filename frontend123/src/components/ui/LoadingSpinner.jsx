function LoadingSpinner({ label = "Loading" }) {
  return (
    <div className="loading-state" role="status" aria-label={label}>
      <span className="spinner" />
    </div>
  );
}

export default LoadingSpinner;

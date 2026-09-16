function StatCard({ label, value, hero = false, icon: Icon }) {
  return (
    <div className={`stat-card ${hero ? "stat-card-hero" : ""}`}>
      <div className="stat-card-top">
        <span className="stat-card-label">{label}</span>
        {Icon && <Icon size={hero ? 20 : 16} strokeWidth={1.75} />}
      </div>
      <span className="stat-card-value">{value}</span>
    </div>
  );
}

export default StatCard;

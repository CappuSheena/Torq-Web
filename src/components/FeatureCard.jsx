function FeatureCard({ title, description, icon: Icon }) {
  return (
    <div className="rounded-[20px] border border-white/10 bg-surface p-4 shadow-flat">
      <div className="w-fit rounded-2xl border border-white/10 bg-page/70 p-3 text-text">
        <Icon size={22} />
      </div>
      <h2 className="font-display mt-4 text-lg font-medium text-text">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
    </div>
  );
}

export default FeatureCard;

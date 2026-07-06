function FeatureCard({ title, description, icon: Icon, image, imageAlt, featured = false }) {
  if (featured) {
    return (
      <div className="rounded-[20px] border border-accent/50 bg-surface/80 p-6 shadow-flat transition-all sm:col-span-2 sm:grid sm:grid-cols-2 sm:items-center sm:gap-8">
        <div>
          <div className="w-fit rounded-2xl border border-accent/30 bg-accent/10 p-3 text-accent">
            <Icon size={28} />
          </div>
          <h2 className="font-display mt-4 text-2xl font-medium text-accent">{title}</h2>
          <p className="mt-2 max-w-md text-base leading-6 text-muted">{description}</p>
        </div>

        {image ? (
          <div className="mt-6 overflow-hidden rounded-2xl border border-accent/30 sm:mt-0">
            <img src={image} alt={imageAlt || ''} className="h-full w-full object-cover" />
          </div>
        ) : (
          <div className="mt-6 flex min-h-[160px] items-center justify-center rounded-2xl border border-dashed border-accent/30 text-xs text-accent/80 sm:mt-0">
            Screenshot coming soon
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-[20px] border border-accent/50 bg-surface p-4 shadow-flat transition-all">
      <div className="w-fit rounded-2xl border border-accent/30 bg-accent/10 p-3 text-accent">
        <Icon size={28} />
      </div>
      <h2 className="font-display mt-4 text-2xl font-medium text-accent">{title}</h2>
      <p className="mt-2 max-w-md text-base leading-6 text-muted">{description}</p>
    </div>
  );
}

export default FeatureCard;
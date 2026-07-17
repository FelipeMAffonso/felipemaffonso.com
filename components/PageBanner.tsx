export function PageBanner({ title }: { title: string }) {
  return (
    <div className="page-banner" id="page-banner">
      <div className="page-banner-title">
        <h1 className="enter">{title}</h1>
      </div>
    </div>
  );
}

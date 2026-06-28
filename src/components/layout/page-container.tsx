interface PageContainerProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function PageContainer({
  title,
  description,
  children,
}: PageContainerProps) {
  return (
    <div className="hm-page">
      <div className="hm-page-header">
        <h1>{title}</h1>
        {description && (
          <p>{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}

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
    <div className="container mx-auto py-8 px-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{title}</h1>
        {description && (
          <p className="text-muted-foreground mt-2">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}

interface PageContainerProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function PageContainer({
  children,
}: PageContainerProps) {
  return <div className="hm-page">{children}</div>;
}

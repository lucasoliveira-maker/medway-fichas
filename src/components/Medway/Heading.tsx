interface HeadingProps {
  level: 1 | 2 | 3;
  children: React.ReactNode;
  className?: string;
}

export function Heading({ level, children, className = '' }: HeadingProps) {
  const baseClasses = 'font-montserrat leading-tight';

  const levelClasses = {
    1: 'text-h1 text-medway-dark',
    2: 'text-h2 text-medway-dark',
    3: 'text-h3 text-medway-secondary',
  };

  const Tag = `h${level}` as const;

  return (
    <Tag className={`${baseClasses} ${levelClasses[level]} ${className}`}>
      {children}
    </Tag>
  );
}

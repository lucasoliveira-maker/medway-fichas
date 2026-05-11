interface ListBulletsProps {
  items: string[];
  className?: string;
}

export function ListBullets({ items, className = '' }: ListBulletsProps) {
  return (
    <ul className={`list-none pl-0 space-y-2 ${className}`}>
      {items.map((item, idx) => (
        <li key={idx} className="flex items-start">
          <span className="text-medway-primary font-bold mr-3 mt-0.5">•</span>
          <span className="text-body text-medway-text flex-1">{item}</span>
        </li>
      ))}
    </ul>
  );
}

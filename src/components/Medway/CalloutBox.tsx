interface CalloutBoxProps {
  tipo: 'info' | 'aviso' | 'critico';
  titulo?: string;
  children: React.ReactNode;
  className?: string;
}

export function CalloutBox({ tipo, titulo, children, className = '' }: CalloutBoxProps) {
  const styles = {
    info: {
      bg: 'bg-medway-light',
      border: 'border-l-4 border-medway-primary',
      textColor: 'text-medway-text',
    },
    aviso: {
      bg: 'bg-yellow-50',
      border: 'border-l-4 border-medway-warning',
      textColor: 'text-medway-text',
    },
    critico: {
      bg: 'bg-red-50',
      border: 'border-l-4 border-medway-error',
      textColor: 'text-medway-text',
    },
  };

  const style = styles[tipo];

  return (
    <div className={`${style.bg} ${style.border} ${style.textColor} p-6 rounded-md shadow-medway ${className}`}>
      {titulo && (
        <h4 className="font-montserrat font-semibold text-medway-dark mb-2">{titulo}</h4>
      )}
      <div className="text-body">{children}</div>
    </div>
  );
}

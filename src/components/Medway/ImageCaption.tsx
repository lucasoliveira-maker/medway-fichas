interface ImageCaptionProps {
  src: string;
  alt: string;
  legenda: string;
  className?: string;
}

export function ImageCaption({ src, alt, legenda, className = '' }: ImageCaptionProps) {
  return (
    <figure className={`text-center ${className}`}>
      <img
        src={src}
        alt={alt}
        className="max-w-full h-auto rounded-sm border border-gray-300 mx-auto"
      />
      {legenda && (
        <figcaption className="text-sm text-medway-gray mt-3 font-montserrat">
          {legenda}
        </figcaption>
      )}
    </figure>
  );
}

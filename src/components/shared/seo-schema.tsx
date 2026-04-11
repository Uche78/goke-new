interface SeoSchemaProps {
  schema: object;
}

export function SeoSchema({ schema }: SeoSchemaProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

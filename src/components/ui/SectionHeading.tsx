interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  align?: "left" | "center";
}

export default function SectionHeading({
  title,
  subtitle,
  align = "left",
}: SectionHeadingProps) {
  const alignment = align === "center" ? "text-center" : "text-left";

  return (
    <div className={`space-y-3 ${alignment}`}>
      <h2 className="text-4xl font-bold tracking-tight">{title}</h2>
      <div className="mt-4 flex justify-center">
        <div className="h-1 w-16 rounded-full bg-blue-500" />
      </div>

      {subtitle && (
        <p className="mx-auto max-w-2xl text-slate-400 mb-6">{subtitle}</p>
      )}
    </div>
  );
}

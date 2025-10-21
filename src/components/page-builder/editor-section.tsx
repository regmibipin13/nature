interface EditorSectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

export const EditorSection = ({
  title,
  icon,
  children,
}: EditorSectionProps) => (
  <div className="bg-white/5 rounded-lg p-4 mb-4 border border-white/10">
    <div className="flex items-center text-white/80 mb-3">
      {icon}
      <h3 className="font-semibold ml-2">{title}</h3>
    </div>
    <div className="space-y-3">{children}</div>
  </div>
);

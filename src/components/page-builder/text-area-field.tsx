interface TextAreaFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  rows?: number;
}

export const TextAreaField = ({
  label,
  name,
  value,
  onChange,
  rows = 3,
}: TextAreaFieldProps) => (
  <div>
    <label className="text-xs text-white/60 block mb-1">{label}</label>
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      rows={rows}
      className="w-full bg-slate-800/60 border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
    />
  </div>
);

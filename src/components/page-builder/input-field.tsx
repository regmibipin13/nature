interface InputFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

export const InputField = ({
  label,
  name,
  value,
  onChange,
  placeholder,
}: InputFieldProps) => (
  <div>
    <label className="text-xs text-white/60 block mb-1">{label}</label>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full bg-slate-800/60 border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
    />
  </div>
);

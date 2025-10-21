interface AccordionIconProps {
  open: boolean;
}

export const AccordionIcon = ({ open }: AccordionIconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`h-6 w-6 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d={open ? "M5 12h14" : "M12 4.5v15m7.5-7.5h-15"}
    />
  </svg>
);

interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onClick: () => void;
}

export const AccordionItem = ({
  title,
  children,
  isOpen,
  onClick,
}: AccordionItemProps) => (
  <div className="border-b border-gray-200 py-6">
    <button
      onClick={onClick}
      className="w-full flex justify-between items-center text-left focus:outline-none"
    >
      <h3 className="text-sm font-semibold tracking-widest text-gray-800">
        {title}
      </h3>
      <div className="text-gray-500">
        <AccordionIcon open={isOpen} />
      </div>
    </button>
    <div
      className={`grid transition-all duration-500 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
    >
      <div className="overflow-hidden">
        <div className="pt-4 text-gray-600 text-sm leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  </div>
);

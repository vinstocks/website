import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Check, Pencil, X } from "lucide-react";

interface EditableCellProps {
  value: number;
  onSave: (value: number) => void;
  prefix?: string;
  placeholder?: string;
}

const EditableCell = ({ value, onSave, prefix = "", placeholder = "Enter value" }: EditableCellProps) => {
  const [editing, setEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value.toString());

  const handleSave = () => {
    const num = parseFloat(inputValue);
    if (!isNaN(num) && num >= 0) {
      onSave(num);
    }
    setEditing(false);
  };

  const handleCancel = () => {
    setInputValue(value.toString());
    setEditing(false);
  };

  if (editing) {
    return (
      <div className="flex items-center gap-1">
        <Input
          type="number"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSave();
            if (e.key === "Escape") handleCancel();
          }}
          className="h-7 w-24 text-sm text-right"
          autoFocus
        />
        <button onClick={handleSave} className="p-1 text-success hover:bg-success/10 rounded">
          <Check className="w-3.5 h-3.5" />
        </button>
        <button onClick={handleCancel} className="p-1 text-destructive hover:bg-destructive/10 rounded">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setEditing(true)}
      className="group flex items-center gap-1.5 text-right hover:bg-muted/50 rounded px-1.5 py-0.5 -mx-1.5 transition-colors"
    >
      <span className="text-sm">
        {value === 0 ? (
          <span className="text-muted-foreground italic text-xs">{placeholder}</span>
        ) : (
          `${prefix}${value.toLocaleString("en-IN")}`
        )}
      </span>
      <Pencil className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
  );
};

export default EditableCell;

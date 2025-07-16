import { useState } from "react";
import type {KeyboardEvent} from "react";

type CreatableMultiSelectProps = {
  options: string[];
  value: string; 
  onChange: (val: string) => void;
  placeholder?: string;
};

export function CreatableMultiSelect({ options, value, onChange, placeholder }: CreatableMultiSelectProps) {
  const [inputValue, setInputValue] = useState("");
  const selected = value ? value.split(",").map(s => s.trim()).filter(Boolean) : [];

  const addSkill = (skill: string) => {
    const skillTrimmed = skill.trim();
    if (skillTrimmed && !selected.includes(skillTrimmed)) {
      const newSelected = [...selected, skillTrimmed];
      onChange(newSelected.join(", "));
    }
    setInputValue("");
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addSkill(inputValue);
    }
    if (e.key === "Backspace" && !inputValue && selected.length) {
      
      const newSelected = selected.slice(0, selected.length - 1);
      onChange(newSelected.join(", "));
    }
  };

  const removeSkill = (skillToRemove: string) => {
    const newSelected = selected.filter(skill => skill !== skillToRemove);
    onChange(newSelected.join(", "));
  };

  const filteredOptions = options.filter(opt => !selected.includes(opt));

  return (
    <div className="border rounded p-2 flex flex-wrap gap-1 items-center min-h-[3rem] cursor-text" onClick={() => {}}>
      {selected.map(skill => (
        <div key={skill} className="bg-sky-100 text-sky-700 dark:bg-sky-800 dark:text-sky-100 px-2 py-1 rounded-full flex items-center gap-1">
          {skill}
          <button
            type="button"
            onClick={() => removeSkill(skill)}
            className="text-red-500 hover:text-red-700"
            aria-label={`Remove ${skill}`}
          >
            ×
          </button>
        </div>
      ))}

      <input
        type="text"
        className="flex-grow border-none focus:ring-0 outline-none min-w-[120px]"
        placeholder={placeholder || "Type or select skills"}
        value={inputValue}
        onChange={e => setInputValue(e.target.value)}
        onKeyDown={onKeyDown}
        list="skills-options"
      />

      <datalist id="skills-options">
        {filteredOptions.map(opt => (
          <option key={opt} value={opt} />
        ))}
      </datalist>
    </div>
  );
}

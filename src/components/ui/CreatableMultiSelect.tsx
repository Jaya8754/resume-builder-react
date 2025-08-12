import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent, ChangeEvent, MouseEvent } from "react";
import FormErrorMessage from "@/Schema/FormErrorMessage";

type CreatableMultiSelectProps = {
  options: string[];
  value: string;
  onChange: (val: string) => void;
  onBlur?: () => void
  placeholder?: string;
  error?:string;
};

export function CreatableMultiSelect({
  options,
  value,
  onChange,
  onBlur,
  placeholder = "Type or select a skill",
  error
}: CreatableMultiSelectProps) {
  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const removeSkill = (skillToRemove: string) => {
    const newSelected = selected.filter(skill => skill !== skillToRemove);
    onChange(newSelected.join(", "));
  };

  const filteredOptions = options.filter(
    opt => !selected.includes(opt) && opt.toLowerCase().includes(inputValue.toLowerCase())
  );

  const handleOptionClick = (e: MouseEvent<HTMLDivElement>, skill: string) => {
    e.preventDefault();
    addSkill(skill);
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <div
        className="border rounded p-2 flex flex-wrap gap-1 items-center min-h-[3rem] cursor-text"
        onClick={() => setIsFocused(true)}
      >
        {selected.map(skill => (
          <div
            key={skill}
            className="bg-sky-100 text-sky-700 dark:bg-sky-800 dark:text-sky-100 px-2 py-1 rounded-full flex items-center gap-1"
          >
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
          placeholder={placeholder}
          value={inputValue}
          onChange={onInputChange}
          onKeyDown={onKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={onBlur}
        />
      </div>

      {isFocused && filteredOptions.length > 0 && (
        <div
          className="absolute z-10 mt-1 w-full max-h-60 overflow-y-auto bg-white dark:bg-gray-800 border rounded shadow"
        >
          {filteredOptions.map(opt => (
            <div
              key={opt}
              onClick={e => handleOptionClick(e, opt)}
              className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
            >
              {opt}
            </div>
          ))}
        </div>
      )}
      <FormErrorMessage message={error} />
    </div>
  );
}

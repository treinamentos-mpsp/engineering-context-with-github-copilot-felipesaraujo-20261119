"use client";

import { useId, useState } from "react";

type TagAutocompleteProps = {
  availableTags: readonly string[];
  label: string;
  value: string;
  onChange: (value: string) => void;
};

export function TagAutocomplete({ availableTags, label, value, onChange }: TagAutocompleteProps) {
  const inputId = useId();
  const listboxId = `${inputId}-listbox`;
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const commaIndex = value.lastIndexOf(",");
  const currentToken = value.slice(commaIndex + 1).trim();
  const selectedTags = value
    .slice(0, commaIndex < 0 ? 0 : commaIndex)
    .split(",")
    .map((tag) => tag.trim().toLocaleLowerCase())
    .filter(Boolean);
  const suggestions = currentToken
    ? availableTags.filter((tag) => {
        const normalizedTag = tag.toLocaleLowerCase();
        return normalizedTag.startsWith(currentToken.toLocaleLowerCase()) && !selectedTags.includes(normalizedTag);
      })
    : [];
  const showListbox = isOpen && suggestions.length > 0;

  function selectTag(tag: string) {
    const prefix = commaIndex >= 0 ? value.slice(0, commaIndex + 1).trimEnd() : "";
    onChange(prefix ? `${prefix} ${tag}` : tag);
    setIsOpen(false);
    setActiveIndex(null);
  }

  return (
    <div className="tag-autocomplete">
      <input
        aria-controls={showListbox ? listboxId : undefined}
        aria-expanded={showListbox}
        aria-label={label}
        autoComplete="off"
        id={inputId}
        name="tags"
        onBlur={() => {
          setIsOpen(false);
          setActiveIndex(null);
        }}
        onChange={(event) => {
          onChange(event.target.value);
          setIsOpen(true);
          setActiveIndex(null);
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" && suggestions.length > 0) {
            event.preventDefault();
            setIsOpen(true);
            setActiveIndex((current) => current === null ? 0 : (current + 1) % suggestions.length);
          } else if (event.key === "ArrowUp" && suggestions.length > 0) {
            event.preventDefault();
            setIsOpen(true);
            setActiveIndex((current) => current === null ? suggestions.length - 1 : (current - 1 + suggestions.length) % suggestions.length);
          } else if (event.key === "Enter" && showListbox && activeIndex !== null) {
            event.preventDefault();
            selectTag(suggestions[activeIndex]);
          } else if (event.key === "Escape" && showListbox) {
            event.preventDefault();
            setIsOpen(false);
            setActiveIndex(null);
          } else if (event.key === "Tab") {
            setIsOpen(false);
            setActiveIndex(null);
          }
        }}
        placeholder="wedding, portrait, outdoor..."
        role="combobox"
        aria-activedescendant={showListbox && activeIndex !== null ? `${listboxId}-option-${activeIndex}` : undefined}
        type="text"
        value={value}
      />
      {showListbox ? (
        <ul className="tag-suggestions" id={listboxId} role="listbox">
          {suggestions.map((tag, index) => (
            <li
              aria-selected={index === activeIndex}
              id={`${listboxId}-option-${index}`}
              key={tag}
              onClick={() => selectTag(tag)}
              onMouseDown={(event) => event.preventDefault()}
              role="option"
            >
              {tag}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
"use client";

import { useState } from "react";
import { TagAutocomplete } from "@/components/upload/TagAutocomplete";

type UploadTagsFieldProps = {
  availableTags: readonly string[];
};

export function UploadTagsField({ availableTags }: UploadTagsFieldProps) {
  const [value, setValue] = useState("");
  const label = "Tags separadas por vírgula";

  return (
    <label className="full-field">
      {label}
      <TagAutocomplete
        availableTags={availableTags}
        label={label}
        onChange={setValue}
        value={value}
      />
      <small>Use termos consistentes para melhorar a busca na galeria.</small>
    </label>
  );
}
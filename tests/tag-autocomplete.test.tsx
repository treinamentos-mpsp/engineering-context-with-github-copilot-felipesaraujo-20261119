import { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { TagAutocomplete } from "@/components/upload/TagAutocomplete";

const tags = ["portrait", "wedding", "wildlife"];

function ControlledAutocomplete() {
  const [value, setValue] = useState("");

  return (
    <TagAutocomplete
      availableTags={tags}
      label="Tags separadas por vírgula"
      onChange={setValue}
      value={value}
    />
  );
}

describe("TagAutocomplete", () => {
  it("filters case-insensitively and selects wildlife while preserving previous tags", async () => {
    const user = userEvent.setup();
    render(<ControlledAutocomplete />);
    const input = screen.getByRole("combobox", { name: "Tags separadas por vírgula" });

    await user.type(input, "portrait, WI");

    await user.click(screen.getByRole("option", { name: "wildlife" }));

    expect(input).toHaveValue("portrait, wildlife");
    expect(input).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("does not suggest a tag that is already selected", async () => {
    const user = userEvent.setup();
    render(<ControlledAutocomplete />);
    const input = screen.getByRole("combobox");

    await user.type(input, "wedding, wed");

    expect(screen.queryByRole("option", { name: "wedding" })).not.toBeInTheDocument();
  });

  it("closes the list when typing produces no matching suggestions", async () => {
    const user = userEvent.setup();
    render(<ControlledAutocomplete />);
    const input = screen.getByRole("combobox");

    await user.type(input, "w");
    expect(screen.getByRole("listbox")).toBeVisible();
    expect(screen.getAllByRole("option")).toHaveLength(2);

    await user.type(input, "zzz");

    expect(input).toHaveValue("wzzz");
    expect(input).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryAllByRole("option")).toHaveLength(0);
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });
});
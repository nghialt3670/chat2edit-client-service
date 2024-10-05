import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function EditorSelect({
  onSelect,
}: {
  onSelect: (value: "image-editor" | "sheet-editor") => void;
}) {
  return (
    <Select onValueChange={onSelect} defaultValue="image-editor">
      <SelectTrigger className="w-32">
        <SelectValue placeholder="Image editor" />
      </SelectTrigger>
      <SelectContent className="max-w-xl">
        <SelectItem value="image-editor">
          <span className="truncate">Image editor</span>
        </SelectItem>
        <SelectItem value="tabular-editor">
          <span className="truncate">Tabular editor</span>
        </SelectItem>
      </SelectContent>
    </Select>
  );
}

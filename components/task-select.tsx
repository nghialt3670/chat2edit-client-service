import { useRouter } from "next/navigation";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ChatTask from "@/lib/types/chat-task";
import Chat from "@/lib/types/chat";

export function TaskSelect({
  onChange,
}: {
  onChange: (task: ChatTask) => void;
}) {
  return (
    <Select onValueChange={onChange} defaultValue={ChatTask.ImageEditing}>
      <SelectTrigger className="max-w-40">
        <SelectValue placeholder="Chat history" />
      </SelectTrigger>
      <SelectContent className="w-full">
        <SelectItem value={ChatTask.ImageEditing}>
          <span className="truncate">Image editing</span>
        </SelectItem>
        {/* <SelectItem value="tabular-editor">
          <span className="truncate">Tabular editor</span>
        </SelectItem> */}
      </SelectContent>
    </Select>
  );
}

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
import Chat from "@/lib/types/chat";

export function ChatSelect({ chats }: { chats: Chat[] }) {
  const router = useRouter();

  const groupedChats: Record<string, Chat[]> = {};
  chats.forEach((chat) => {
    const date = format(new Date(chat.updatedAt), "yyyy-MM-dd");
    if (!groupedChats[date]) groupedChats[date] = [];
    groupedChats[date].push({
      id: chat.id,
      title: chat.title,
      updatedAt: chat.updatedAt,
    });
  });

  return (
    <Select onValueChange={(chatId) => router.push(`/chat/${chatId}`)}>
      <SelectTrigger className="max-w-40">
        <SelectValue placeholder="Chat history" />
      </SelectTrigger>
      <SelectContent className="max-w-xl">
        {Object.keys(groupedChats).map((date) => (
          <SelectGroup key={date}>
            <SelectLabel className="flex justify-center items-center">
              <span className="text-xs">{date}</span>
            </SelectLabel>
            {groupedChats[date].map((chat) => (
              <SelectItem
                key={chat.id}
                className="text-nowrap w-full pr-10 overflow-hidden hover:cursor-pointer"
                value={chat.id}
              >
                <div className="flex items-center w-60 text-nowrap overflow-hidden">
                  <span className="truncate">{chat.title}</span>
                </div>
              </SelectItem>
            ))}
          </SelectGroup>
        ))}
      </SelectContent>
    </Select>
  );
}

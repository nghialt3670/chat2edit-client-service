import {
  ComponentProps,
  createContext,
  PropsWithChildren,
  useContext,
} from "react";
import ReactMarkdown from "react-markdown";
import { AlertTitle } from "@mui/material";
import { AlertCircle } from "lucide-react";
import { Message as IMessage } from "@/schemas/message.schema";
import { Alert, AlertDescription } from "../../../components/ui/alert";
import { Skeleton } from "../../../components/ui/skeleton";
import { Button } from "../../../components/ui/button";
import { cn } from "@/lib/utils";

const MessageContext = createContext<IMessage | undefined>(undefined);

function useMessage() {
  const message = useContext(MessageContext);

  if (!message)
    throw new Error("useMessage must be used within a MessageContext");

  return message;
}

export default function Message({
  children,
  message,
}: PropsWithChildren & { message: IMessage }) {
  return (
    <MessageContext.Provider value={message}>
      {children}
    </MessageContext.Provider>
  );
}

Message.Text = function MessageText({ className }: ComponentProps<"div">) {
  const message = useMessage();

  return (
    <ReactMarkdown className={cn("w-fit rounded-md py-2 px-3", className)}>
      {message.text}
    </ReactMarkdown>
  );
};

Message.Attachments = function MessageAttachments({
  children,
  className,
}: PropsWithChildren & ComponentProps<"div">) {
  return <div className={className}>{children}</div>;
};

Message.Error = function MessageError() {
  return (
    <Alert variant="destructive">
      <AlertCircle className="size-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        Something went wrong while processing your request.
      </AlertDescription>
      <div>
        <Button className="p-2" variant="outline">
          Try Again
        </Button>
      </div>
    </Alert>
  );
};

Message.Responding = function MessageResponding() {
  return (
    <div className="w-full space-y-3">
      <Skeleton className="w-full h-4 rounded" />
      <Skeleton className="w-full h-4 rounded" />
      <Skeleton className="w-full h-4 rounded" />
    </div>
  );
};

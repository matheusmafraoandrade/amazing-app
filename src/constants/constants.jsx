import {
  ChatBubbleIcon,
  FileIcon,
  LinkBreak2Icon,
  MagicWandIcon,
  PlusCircledIcon,
  RocketIcon,
} from "@radix-ui/react-icons";

export const routeOptions = [
  {
    route: "/inserir",
    name: "Inserir arquivo",
    icon: <PlusCircledIcon />,
  },
  {
    route: "/chat",
    name: "Chat",
    icon: <ChatBubbleIcon />,
  },
  {
    route: "/arquivos",
    name: "Meus arquivos",
    icon: <FileIcon />,
  },
];

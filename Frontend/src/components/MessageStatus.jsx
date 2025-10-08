import { Check, CheckCheck } from "lucide-react";

export default function MessageStatus({ status }) {
  if (status === "sent") return <Check size={14} className="text-gray-400" />;
  if (status === "received") return <CheckCheck size={14} className="text-gray-400" />;
  if (status === "read") return <CheckCheck size={14} className="text-blue-500" />;
  return null;
}

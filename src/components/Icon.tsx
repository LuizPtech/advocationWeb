import {
  Book,
  Briefcase,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  Gavel,
  Heart,
  Home,
  MessageSquare,
  Phone,
  Scale,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Users,
  type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  scale: Scale,
  users: Users,
  shield: ShieldCheck,
  briefcase: Briefcase,
  "shopping-bag": ShoppingBag,
  home: Home,
  book: Book,
  gavel: Gavel,
  "file-text": FileText,
  heart: Heart,
  message: MessageSquare,
  calendar: Calendar,
  check: CheckCircle2,
  phone: Phone,
  clock: Clock,
  sparkles: Sparkles,
};

export function Icon({
  name,
  size = 24,
  className,
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  const Component = ICONS[name] || Scale;
  return <Component size={size} className={className} />;
}

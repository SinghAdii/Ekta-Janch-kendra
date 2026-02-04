import {
  LayoutDashboard,
  Calendar,
  Wallet,
  Truck,
} from "lucide-react";

export const employeeSidebarItems = [
  {
    label: "Dashboard",
    icon: <LayoutDashboard size={18} />,
    href: "/employee-portal",
  },
  {
    label: "My Attendance",
    icon: <Calendar size={18} />,
    href: "/employee-portal/attendance",
  },
  {
    label: "My Salary",
    icon: <Wallet size={18} />,
    href: "/employee-portal/salary",
  },
  {
    label: "My Collections",
    icon: <Truck size={18} />,
    href: "/employee-portal/collections",
  },
];

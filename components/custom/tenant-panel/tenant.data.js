import {
  ShoppingCart,
  Wallet,
  Users,
  TestTube,
  Stethoscope,
  LayoutDashboard,
  FileUp,
  Truck,
  FlaskConical,
  Microscope,
  ClipboardList,
  UserPlus,
  CalendarClock,
  Upload,
} from "lucide-react";

export const sidebarItems = [
  {
    label: "Dashboard",
    icon: <LayoutDashboard size={18} />,
    href: "/tenant-panel",
  },
  {
    label: "Orders Management",
    icon: <ShoppingCart size={18} />,
    children: [
      {
        label: "Dashboard",
        href: "/tenant-panel/orders",
      },
      {
        label: "All Orders",
        href: "/tenant-panel/orders/all",
      },
      {
        label: "Home Collection",
        href: "/tenant-panel/orders/home-collection",
      },
      {
        label: "Online Tests",
        href: "/tenant-panel/orders/online-tests",
      },
      {
        label: "Online Packages",
        href: "/tenant-panel/orders/online-packages",
      },
      {
        label: "Slot Bookings",
        href: "/tenant-panel/orders/slot-booking",
      },
      {
        label: "Walk-in Orders",
        href: "/tenant-panel/orders/walk-in",
      },
    ],
  },
  {
    label: "Lab Management",
    icon: <FlaskConical size={18} />,
    children: [
      {
        label: "Lab Processing",
        href: "/tenant-panel/lab-management/processing",
      },
      {
        label: "Schedule Pickup",
        href: "/tenant-panel/lab-management/schedule-pickup",
      },
      {
        label: "Walk-in Registration",
        href: "/tenant-panel/lab-management/walk-in",
      },
      {
        label: "Collection Management",
        href: "/tenant-panel/lab-management/collection",
      },
      {
        label: "Slot Booking Management",
        href: "/tenant-panel/lab-management/slot-booking",
      },
      {
        label: "Upload Reports",
        href: "/tenant-panel/lab-management/upload-reports",
      },
    ],
  },
  {
    label: "Financial Management",
    icon: <Wallet size={18} />,
    children: [
      {
        label: "Expenses",
        href: "/tenant-panel/financial/expenses",
      },
    ],
  },
  {
    label: "Catalog Management",
    icon: <TestTube size={18} />,
    children: [
      {
        label: "Manage Tests",
        href: "/tenant-panel/manage-tests",
      },
      {
        label: "Manage Packages",
        href: "/tenant-panel/manage-packages",
      },
    ],
  },
  {
    label: "Doctor Collaboration",
    icon: <Stethoscope size={18} />,
    href: "/tenant-panel/manage-doctors",
  },
  {
    label: "Employee Management",
    icon: <Users size={18} />,
    children: [
      {
        label: "Manage Employees",
        href: "/tenant-panel/employee-management/manage-employees",
      },
      {
        label: "Attendance",
        href: "/tenant-panel/employee-management/attendance-management",
      },
      {
        label: "Salary",
        href: "/tenant-panel/employee-management/salary-management",
      },
      {
        label: "Manage Admins",
        href: "/tenant-panel/users",
      },
    ],
  },
];

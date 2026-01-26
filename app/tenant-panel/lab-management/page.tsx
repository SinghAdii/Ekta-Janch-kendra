import { redirect } from "next/navigation";

export default function LabManagement() {
  // Redirect to the default lab management page
  redirect("/tenant-panel/lab-management/processing");
}

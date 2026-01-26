import { redirect } from "next/navigation";

// Redirect to the lab-management processing page (correct location)
export default function LabTestManagement() {
  redirect("/tenant-panel/lab-management/processing");
}

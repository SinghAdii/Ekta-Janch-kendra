import { redirect } from "next/navigation";

// Redirect to the lab-management upload-reports page (correct location)
export default function UploadReports() {
  redirect("/tenant-panel/lab-management/upload-reports");
}

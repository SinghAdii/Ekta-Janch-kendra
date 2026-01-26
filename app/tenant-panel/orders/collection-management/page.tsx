import { redirect } from "next/navigation";

// Redirect to the lab-management collection page (correct location)
export default function CollectionManagement() {
  redirect("/tenant-panel/lab-management/collection");
}

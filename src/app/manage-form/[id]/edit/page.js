import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import CreateCollectionButton from "@/components/CreateCollectionButton";

export default async function ManageFormPage() {
  const session = await getServerSession(authOptions);
  return (
    <div className="py-10 w-full">
      <div className="flex w-full justify-between">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Manage your form
        </h1>
        <CreateCollectionButton />
      </div>
      <div></div>
    </div>
  );
}
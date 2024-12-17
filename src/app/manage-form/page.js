import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import CreateCollectionButton from "@/components/CreateCollectionButton";

export default async function ManageFormPage() {
  const session = await getServerSession(authOptions);
  let collectionsR = await fetch("http://localhost:3000/api/collection");
  let collections = await collectionsR.json();
  return (
    <div className="py-10 w-full">
      <div className="flex w-full justify-between">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Manage your form
        </h1>
        <CreateCollectionButton />
      </div>
      <div>
        {
          collections.map(({ _id, label, questions }) => (
            <div key={_id} className="mb-6">
              <h2 className="text-2xl font-bold">{label}</h2>
              <ul className="ml-3 mt-2 list-disc">
                {questions.map((question) => (
                  <li key={question._id}>
                    <strong>Header:</strong> {question.question_header} <br />
                    <strong>Type:</strong> {question.question_type} <br />
                    <strong>Required:</strong> {question.question_required ? "Yes" : "No"} <br />
                    {/* <strong>Answers:</strong> {question.question_answer.join(", ")} */}
                  </li>
                ))}
              </ul>
            </div>
          ))
        }
      </div>
    </div>
  );
}
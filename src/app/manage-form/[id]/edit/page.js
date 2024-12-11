// app/collections/[id]/edit/page.js

import CollectionEditor from "@/components/ui/CollectionEditor"; // Adjust the path to point to the correct location

export default async function EditCollection({ params }) {
  const { id } = await params;

  return (
    <CollectionEditor id={id}/>
  );
}
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CollectionEditor({id}){
    const [label, setLabel] = useState("");
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const response = await fetch(`/api/collection/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ label }),
        });
    
        if (response.ok) {
          router.push("/collections"); // Redirect to collections list after saving
        } else {
          console.error("Failed to update collection");
        }
      };
      return (
        <div>
          <h1>Edit Collection</h1>
          <form onSubmit={handleSubmit}>
            <label>
              Label:
              <input
                type="text"
                name="label"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                required
              />
            </label>
            <button type="submit">Save</button>
          </form>
        </div>
      );
}
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import schema from "@/lib/schema";
import { useForm } from "react-hook-form";

export default function CollectionEditor({id}){
    const [existingData, setExistingData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
      } = useForm({
        resolver: zodResolver(schema), // Use Zod for validation
      });

    useEffect(()=>{
        const fetchData = async () => {
            try {
              const response = await fetch(`/api/collection/${id}`);
              if (!response.ok) {
                throw new Error("Failed to fetch data");
              }
              const {collection} = await response.json();
              setExistingData(collection);
              // Set default values in the form
              Object.entries(collection).forEach(([key, value]) => {
                setValue(key, value);
              });
              setLoading(false);
            } catch (err) {
              setError(err.message);
              setLoading(false);
            }
          };
      
          fetchData();
    },[id, setValue])
    const onSubmit = async (e) => {
        e.preventDefault();
    
        const response = await fetch(`/api/collection/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ label }),
        });
    
        if (response.ok) {
        //   router.push("/manage-form"); // Redirect to collections list after saving
        } else {
          console.error("Failed to update collection");
        }
      };
      if (loading) return <p>Loading...</p>;
      if (error) return <p>Error: {error}</p>;
      return (
        <div>
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Edit Collection</h1>
          <form onSubmit={handleSubmit} className="flex flex-col w-full p-3">
            {/* Label */}
            <div>
            <label htmlFor="label">Label</label>
            <input id="label" {...register("label")} />
            {errors.label && <p className="error">{errors.label.message}</p>}
            </div>

            {/* Questions */}
            <div>
            <label>Questions</label>
            <ul>
                {(existingData.questions??[]).map((_, index) => (
                <li key={index}>
                    <div>
                    <label htmlFor={`questions.${index}.question_header`}>
                        Question Header
                    </label>
                    <input
                        id={`questions.${index}.question_header`}
                        {...register(`questions.${index}.question_header`)}
                    />
                    {errors.questions?.[index]?.question_header && (
                        <p className="error">
                        {errors.questions[index].question_header.message}
                        </p>
                    )}
                    </div>

                    <div>
                    <label htmlFor={`questions.${index}.question_type`}>
                        Question Type
                    </label>
                    <select
                        id={`questions.${index}.question_type`}
                        {...register(`questions.${index}.question_type`)}
                    >
                        <option value="type1">Type 1</option>
                        <option value="type2">Type 2</option>
                        <option value="type3">Type 3</option>
                    </select>
                    {errors.questions?.[index]?.question_type && (
                        <p className="error">
                        {errors.questions[index].question_type.message}
                        </p>
                    )}
                    </div>

                    <div>
                    <label htmlFor={`questions.${index}.question_required`}>
                        Question Required
                    </label>
                    <input
                        type="checkbox"
                        id={`questions.${index}.question_required`}
                        {...register(`questions.${index}.question_required`)}
                    />
                    </div>

                    <div>
                    <label htmlFor={`questions.${index}.question_answer`}>
                        Question Answer
                    </label>
                    <input
                        id={`questions.${index}.question_answer`}
                        {...register(`questions.${index}.question_answer.0`)}
                    />
                    {errors.questions?.[index]?.question_answer && (
                        <p className="error">
                        {errors.questions[index].question_answer.message}
                        </p>
                    )}
                    </div>
                </li>
                ))}
            </ul>
            </div>

            <button type="submit">Save</button>
          </form>
        </div>
      );
}
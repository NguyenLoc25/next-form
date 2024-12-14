"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import schema from "@/lib/schema";
import { useFieldArray, useForm } from "react-hook-form";
import { Button } from "./ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { question_type } from "@/models/utils";
import "./collectionEditor.scss"
import { Delete, Plus, Trash } from "lucide-react";

export default function CollectionEditor({id}){
    const [existingData, setExistingData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const form = useForm({
        resolver: zodResolver(schema), // Use Zod for validation
      });
    const { fields, append, remove } = useFieldArray({
        control:form.control,
        name: "questions", // This tells useFieldArray to work with the questions field
    });
    
    useEffect(()=>{
        const fetchData = async () => {
            try {
              const response = await fetch(`/api/collection/${id}`);
              console.log("Fetching collection data:", response); // Console log response

              if (!response.ok) {
                // Kiểm tra phản hồi không phải là JSON
                const contentType = response.headers.get("content-type");
                console.log("Content-Type:", contentType);
                if (!contentType || !contentType.includes("application/json")) {
                  throw new Error(`Unexpected content type: ${contentType}`);
                }
            
                const errorDetails = await response.json();  // Lỗi JSON
                console.error("Error details:", errorDetails);  // Lỗi JSON
                throw new Error(`Failed to update collection: ${errorDetails.message}`);
              }
              const {collection} = await response.json();
              setExistingData(collection);
              // Set default values in the form
              form.setValue("label", collection.label);
              collection.questions.forEach((question) => {
                append(question); // Append each question to the form
              });
              setLoading(false);
            } catch (err) {
              setError(err.message);
              setLoading(false);
            }
          };
      
          fetchData();
    },[id, form.setValue, append])
    const onSubmit = async (data) => {
    
        const response = await fetch(`/api/collection/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
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
        <div className="m-auto">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Edit Collection</h1>
          <Form {...form}>
            <form onSubmit={form.handleSubmit} className="flex flex-col w-full p-3 gap-3">
                {/* Label */}
                <FormField
                    control={form.control}
                    name="label"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Label</FormLabel>
                        <FormControl>
                            <Input placeholder="YOUR LABEL" {...field} />
                        </FormControl>
                        <FormDescription>
                            This is your public display name.
                        </FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Questions */}
                <div className="flex flex-col w-full gap-5">
                    <div className="flex justify-between">
                        <label>Questions</label>
                        <Button type="button" onClick={()=>append({question_header: "new question",
                        question_type:0,
                        question_required:false,
                        question_answer: []})}><Plus/> New</Button>
                    </div>
                {fields.map((item, index) => (
                    <div key={item.id} className="question-field">
                        <div className="flex justify-between">
                            <h3>Question {index + 1}</h3>
                            {/* Remove Question Button */}
                            <Button className="bg-red-700 hover:bg-red-500" type="button" onClick={() => remove(index)}>
                                <Trash/>
                            </Button>
                        </div>
                    <FormField name={`questions.${index}.question_header`} control={form.control}
                    render={({field})=><FormItem>
                    <Label htmlFor={`questions.${index}.question_header`}>Question Header</Label>
                    <FormControl>
                        <Input
                        id={`questions.${index}.question_header`}
                        {...field}
                        />
                    </FormControl>
                    </FormItem>}/>

                    <FormField name={`questions.${index}.question_type`}
                        control={form.control}
                        render={({field})=><FormItem>
                        <Label htmlFor={`questions.${index}.question_type`}>Question Type</Label>
                        
                            <Select
                            id={`questions.${index}.question_type`}
                            {...field}
                            onValueChange={field.onChange} defaultValue={field.value}
                            >
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a Question type" />
                                </SelectTrigger>

                                </FormControl>
                                <SelectContent>
                                    {question_type.map(q=> <SelectItem key={q} value={q}>{q}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        
                        </FormItem>}
                    />

                    <FormField name={`questions.${index}.question_required`}
                    control={form.control}
                    render={({field})=><FormItem>
                    <Label htmlFor={`questions.${index}.question_required`}>Required</Label>
                    <FormControl>
                        <Checkbox
                        id={`questions.${index}.question_required`}
                        {...field}
                        />
                    </FormControl>
                    </FormItem>}/>

                    <FormField name={`questions.${index}.question_answer`}
                    control={form.control}
                    render={({field})=><FormItem>
                    <Label htmlFor={`questions.${index}.question_answer`}>Question Answer</Label>
                    <FormControl>
                        <Input
                        id={`questions.${index}.question_answer`}
                        {...field}
                        />
                    </FormControl>
                    </FormItem>}/>
                    </div>
                ))}
                </div>

                <button type="submit">Save</button>
            </form>
        </Form>
        </div>
      );
}
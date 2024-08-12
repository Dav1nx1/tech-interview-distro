
'use client'

import Link from "next/link";
import { Button } from "./ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "./ui/card";
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from './ui/select'
import { useCallback, useEffect, useState } from "react";
import { useRouter } from 'next/navigation'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { defaultCols } from "@/app/page";

export interface ModalParams {
  task?: string;
}

interface TaskInfo {
  // Define the structure of the task info object
  // Example:
  id: number;
  name: string;
  title: string;
  description: string;
  // Add more properties as needed
}

async function getTaskData(task: string) {
  const res = await fetch(`http://localhost:8000/tasks/${task}`)
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.
  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch data')
  }
 
  return res.json()
}

async function getUsers() {
  const res = await fetch(`http://localhost:8000/users/`)
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.
  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch data')
  }
 
  return res.json()
}

export default function Modal({ task }: ModalParams) {
  const [loading, setLoading] = useState<boolean>(true);
  const [taskInfo, setTaskInfo] = useState<any>();
  const [users, setUsers] = useState<any>([]);
  const router = useRouter()

  const formSchema = z.object({
    title: z.string().min(10).max(30),
    description: z.string().min(10).max(200),
    id: z.string(),
    owner_id: z.string(),
    status: z.string()
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      id: "",
      owner_id: "",
      status: ""
    },
  });

  const { reset, handleSubmit, control, formState: { isSubmitting } } = form;

  const fetchTaskData = useCallback(async (task: string | undefined) => {
    try {
      if (task) {
        const data = await getTaskData(task);
        reset({
          title: data.title,
          description: data.description,
          id: data.id,
          owner_id: data.owner_id,
          status: data.status
        });
        setTaskInfo(data)
      }
    } catch (error) {
      console.error('Error fetching task data:', error);
    } finally {
      setLoading(false);
    }
  }, [reset]);

  const getUserList  = useCallback(async () => {
    try {
      const data = await getUsers();
      console.log(data)
      setUsers(data)
    } catch (error) {
      console.error('Error fetching task data:', error);
    } finally {
      setLoading(false);
    }
  }, [])

  useEffect(() => {
    fetchTaskData(task);
    getUserList()
  }, [task, fetchTaskData]);

  useEffect(() => {
    getUserList()
  }, []);

  const updateTask = async (taskId: any, updatedTask: any) => {
    try {
      const response = await fetch(`http://localhost:8000/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTask),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update task: ${response.statusText}`);
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating task:', error);
      throw error; // Optionally, rethrow the error for further handling
    }
  };

  const createTask = async (newTask: { id: string; title: string; description: string; }) => {
    try {
      const task = { ...newTask, status: 'todo' }
      const response = await fetch('http://localhost:8000/tasks/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(task),
      });
  
      if (!response.ok) {
        throw new Error(`Failed to create task: ${response.statusText}`);
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error; // Optionally, rethrow the error for further handling
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
    if (values.id) {
      await updateTask(values.id, values)
        .then(data => {
          console.log('Task updated successfully:', data)
          window.location.assign('/')
        })
        .catch(error => console.error('Error:', error));
    } else {
      await createTask(values)
      .then(data => {
        console.log('Task Created successfully:', data)
        window.location.assign('/')
      })
      .catch(error => console.error('Error:', error));
    }
    // Handle form submission logic
  };

  const handleDelete = async () => {
    const res = await fetch(`http://localhost:8000/tasks/${taskInfo.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        // Include any other headers if necessary
      },
      cache: 'no-store'
    });
    
    if (res.ok) {
      console.log('Task deleted successfully');
      window.location.reload()
    } else {
      console.error('Failed to delete task', await res.text());
    }
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      { !loading && (
        <Card className="w-[550px]">
        <CardHeader>
          <CardTitle>Create project</CardTitle>
          <CardDescription>Deploy your new project in one-click.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Title of the task" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                </div>

                <div className="flex flex-col space-y-1.5">

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Tell us a little bit about yourself"
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />


                </div>
                <div className="flex flex-col space-y-1.5">
                  <FormField
                    control={form.control}
                    name="owner_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Owner</FormLabel>
                        <Select
                          {...field} // Spread the field props to connect the Select component to the form state
                          value={field.value} // Set the value from the form state or taskInfo.owner_id
                          onValueChange={(value) => field.onChange(value)} // Update the form state when the value changes
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a verified email to display" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {users?.map((element: { id: string; email: string }) => (
                              <SelectItem key={element.id} value={element.id}>
                                {element.email}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        {...field} // Spread the field props to connect the Select component to the form state
                        value={field.value} // Set the value from the form state or taskInfo.owner_id
                        onValueChange={(value) => field.onChange(value)} // Update the form state when the value changes
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a verified email to display" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {defaultCols?.map((element: { id: string; title: string }) => (
                            <SelectItem key={element.id} value={element.id}>
                              {element.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                </div>
              </div>
              <Button variant={`outline`} className="mt-6">
                <Link href="/">
                  Close
                </Link>
              </Button>
              <Button className="ml-2" type="submit" disabled={isSubmitting}>Save</Button>
              <Button className="ml-2" variant={`destructive`} onClick={() => handleDelete()}>Delete</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      )  }
    </div>
  );
}

function setTask(data: any) {
  throw new Error("Function not implemented.");
}

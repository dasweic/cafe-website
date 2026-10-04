"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, Trash2, Loader2, User as UserIcon } from "lucide-react";
import { api } from "@/lib/api";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Validation Schema
const staffSchema = z.object({
  name: z.string().min(1, "Name is required"),
  designation: z.string().min(1, "Designation is required"),
  bio: z.string().optional(),
  image_url: z.string().optional(),
});

type StaffFormValues = z.infer<typeof staffSchema>;

interface StaffMember {
  id: number;
  name: string;
  designation: string;
  bio: string | null;
  image_url: string | null;
}

export default function StaffPage() {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<StaffFormValues>({
    resolver: zodResolver(staffSchema),
  });

  const watchImageUrl = watch("image_url");

  const fetchStaff = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/staff/");
      setStaff(response.data);
    } catch (error) {
      console.error("Failed to fetch staff", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      
      const res = await api.post("/upload/image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      setValue("image_url", res.data.url);
    } catch (error) {
      console.error("Upload failed", error);
      alert("Failed to upload image.");
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (data: StaffFormValues) => {
    try {
      await api.post("/staff/", data);
      setIsDialogOpen(false);
      reset();
      fetchStaff();
    } catch (error) {
      console.error("Failed to add staff", error);
      alert("Failed to add staff member.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to remove this staff member?")) return;
    try {
      await api.delete(`/staff/${id}`);
      fetchStaff();
    } catch (error) {
      console.error("Failed to delete", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-800">Staff & Team</h2>
        
        {/* Button is safely outside the Dialog to avoid hydration issues */}
        <Button 
          onClick={() => setIsDialogOpen(true)}
          className="bg-cafe-primary hover:bg-cafe-primary/90 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Staff Member
        </Button>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[500px] bg-white">
            <DialogHeader>
              <DialogTitle>Add New Team Member</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input placeholder="e.g., Rahul Sharma" {...register("name")} />
                  {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Designation</Label>
                  <Input placeholder="e.g., Head Barista" {...register("designation")} />
                  {errors.designation && <p className="text-sm text-red-500">{errors.designation.message}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Short Bio (Optional)</Label>
                <Textarea placeholder="A little bit about them..." {...register("bio")} />
              </div>

              <div className="space-y-2 border p-4 rounded-md bg-gray-50">
                <Label>Profile Picture (Optional)</Label>
                <div className="flex items-center gap-4 mt-2">
                  {watchImageUrl ? (
                    <img src={watchImageUrl} alt="Preview" className="w-16 h-16 object-cover rounded-full border" />
                  ) : (
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-gray-400">
                      <UserIcon className="w-8 h-8" />
                    </div>
                  )}
                  <div className="flex-1">
                    <Input type="file" accept="image/*" onChange={handleImageUpload} disabled={isUploading} />
                    {isUploading && (
                      <p className="text-sm text-blue-500 mt-1 flex items-center">
                        <Loader2 className="w-3 h-3 mr-1 animate-spin" /> Uploading...
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <Button type="submit" className="bg-cafe-primary hover:bg-cafe-primary/90 text-white" disabled={isSubmitting || isUploading}>
                  {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                  Save Member
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/50">
              <TableHead>Profile</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Designation</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto text-gray-400" />
                </TableCell>
              </TableRow>
            ) : staff.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center text-gray-500">
                  No staff members found. Click "Add Staff Member" to add your team.
                </TableCell>
              </TableRow>
            ) : (
              staff.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    {member.image_url ? (
                      <img src={member.image_url} alt={member.name} className="w-10 h-10 rounded-full object-cover bg-gray-100" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                        <UserIcon className="w-5 h-5 text-gray-400" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{member.name}</TableCell>
                  <TableCell className="text-gray-600">{member.designation}</TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleDelete(member.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
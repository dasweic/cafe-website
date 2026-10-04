"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, Trash2, Loader2, Image as ImageIcon } from "lucide-react";
import { api } from "@/lib/api";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const gallerySchema = z.object({
  caption: z.string().optional(),
  category: z.string().min(1, { message: "Category is required" }).default("Interior"),
  image_url: z.string().min(1, { message: "Please upload an image first" }),
});

type GalleryFormValues = z.infer<typeof gallerySchema>;

interface GalleryImage {
  id: number;
  image_url: string;
  caption: string | null;
  category: string;
}

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
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
  } = useForm<GalleryFormValues>({
    resolver: zodResolver(gallerySchema),
    defaultValues: {
      category: "Interior",
    }
  });

  const watchImageUrl = watch("image_url");

  const fetchGallery = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/gallery/");
      setImages(response.data);
    } catch (error) {
      console.error("Failed to fetch gallery", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
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
      
      setValue("image_url", res.data.url, { shouldValidate: true });
    } catch (error) {
      console.error("Upload failed", error);
      alert("Image upload failed. Ensure Cloudinary is configured in backend.");
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (data: GalleryFormValues) => {
    try {
      await api.post("/gallery/", data);
      setIsDialogOpen(false);
      reset();
      fetchGallery();
    } catch (error) {
      console.error("Failed to add image", error);
      alert("Failed to add image to gallery.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this image?")) return;
    try {
      await api.delete(`/gallery/${id}`);
      fetchGallery();
    } catch (error) {
      console.error("Failed to delete", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-800">Gallery Management</h2>
        
        {/* Hydration error se bachne ke liye Button Dialog ke bahar hai */}
        <Button 
          onClick={() => setIsDialogOpen(true)}
          className="bg-cafe-primary hover:bg-cafe-primary/90 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Image
        </Button>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[425px] bg-white">
            <DialogHeader>
              <DialogTitle>Upload New Image</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
              
              <div className="space-y-2 border p-4 rounded-md bg-gray-50">
                <Label>Image File *</Label>
                <div className="flex flex-col gap-3 mt-2">
                  {watchImageUrl ? (
                    <img src={watchImageUrl} alt="Preview" className="w-full h-40 object-cover rounded-md border" />
                  ) : (
                    <div className="w-full h-40 bg-gray-200 rounded-md flex flex-col items-center justify-center text-gray-400">
                      <ImageIcon className="w-10 h-10 mb-2" />
                      <span className="text-sm">No image selected</span>
                    </div>
                  )}
                  
                  <Input type="file" accept="image/*" onChange={handleImageUpload} disabled={isUploading} />
                  {isUploading && (
                    <p className="text-sm text-blue-500 flex items-center">
                      <Loader2 className="w-3 h-3 mr-1 animate-spin" /> Uploading to Cloudinary...
                    </p>
                  )}
                  {errors.image_url && <p className="text-sm text-red-500">{errors.image_url.message}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Caption (Optional)</Label>
                <Input placeholder="e.g., Cozy corner seating" {...register("caption")} />
              </div>

              <div className="space-y-2">
                <Label>Category Tag</Label>
                <Input placeholder="e.g., Interior, Food, Events" {...register("category")} />
                <p className="text-xs text-gray-500">Used for filtering images on the website.</p>
                {errors.category && <p className="text-sm text-red-500">{errors.category.message}</p>}
              </div>

              <div className="pt-4 flex justify-end">
                <Button type="submit" className="bg-cafe-primary hover:bg-cafe-primary/90 text-white" disabled={isSubmitting || isUploading}>
                  {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                  Save Image
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Image Grid Display */}
      {isLoading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="w-8 h-8 animate-spin text-cafe-primary" />
        </div>
      ) : images.length === 0 ? (
        <div className="text-center p-12 bg-white rounded-lg border border-gray-200 text-gray-500">
          No images found. Click "Add Image" to upload some.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {images.map((img) => (
            <div key={img.id} className="group relative bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden flex flex-col">
              <div className="aspect-square w-full overflow-hidden bg-gray-100">
                <img 
                  src={img.image_url} 
                  alt={img.caption || "Gallery image"} 
                  className="w-full h-full object-cover transition-transform group-hover:scale-105" 
                />
              </div>
              <div className="p-3 flex justify-between items-start flex-1">
                <div>
                  <span className="inline-block px-2 py-1 bg-gray-100 text-xs font-medium text-gray-600 rounded-md mb-1">
                    {img.category}
                  </span>
                  {img.caption && <p className="text-sm text-gray-800 line-clamp-2">{img.caption}</p>}
                </div>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => handleDelete(img.id)}
                  className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50 -mr-1"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, Trash2, Loader2, Image as ImageIcon, Check, X, Star } from "lucide-react";
import { api } from "@/lib/api";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

const menuItemSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  price: z.coerce.number().min(0, "Price must be a positive number"),
  category_id: z.coerce.number().min(1, "Please select a category"),
  is_available: z.boolean().default(true),
  is_featured: z.boolean().default(false),
  image_url: z.string().optional(),
});

type MenuItemFormValues = z.infer<typeof menuItemSchema>;

interface Category {
  id: number;
  name: string;
}

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  is_available: boolean;
  is_featured: boolean;
  image_url: string;
  category_id: number;
  category: Category;
}

export default function MenuManagementPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<MenuItemFormValues>({
    resolver: zodResolver(menuItemSchema),
    defaultValues: {
      is_available: true,
      is_featured: false,
      category_id: 0, // Helps prevent the uncontrolled input warning
    }
  });

  const watchImageUrl = watch("image_url");

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [itemsRes, catRes] = await Promise.all([
        api.get("/menu-items/"),
        api.get("/categories/")
      ]);
      setItems(itemsRes.data);
      setCategories(catRes.data);
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
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
      alert("Failed to upload image. (If you haven't added Cloudinary API keys to your backend .env yet, this is expected!)");
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (data: MenuItemFormValues) => {
    try {
      await api.post("/menu-items/", data);
      setIsDialogOpen(false);
      reset();
      fetchData();
    } catch (error) {
      console.error("Failed to create menu item", error);
      alert("Failed to create menu item.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this menu item?")) return;
    try {
      await api.delete(`/menu-items/${id}`);
      fetchData();
    } catch (error) {
      console.error("Failed to delete", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-800">Menu Items</h2>
        
        {/* FIX: Button is placed outside the Dialog entirely to prevent HTML nesting errors */}
        <Button 
          onClick={() => setIsDialogOpen(true)}
          className="bg-cafe-primary hover:bg-cafe-primary/90 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Menu Item
        </Button>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[600px] bg-white max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Menu Item</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input placeholder="e.g., Cappuccino" {...register("name")} />
                  {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Price (₹)</Label>
                  <Input type="number" step="0.01" placeholder="149" {...register("price")} />
                  {errors.price && <p className="text-sm text-red-500">{errors.price.message}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Category</Label>
                <Controller
                  name="category_id"
                  control={control}
                  render={({ field }) => (
                    // FIX: Ensure value is explicitly a string or empty string to fix the React warning
                    <Select onValueChange={field.onChange} value={field.value ? field.value.toString() : ""}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id.toString()}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.category_id && <p className="text-sm text-red-500">{errors.category_id.message}</p>}
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea placeholder="Brief description of the dish..." {...register("description")} />
              </div>

              <div className="space-y-2 border p-4 rounded-md bg-gray-50">
                <Label>Image Upload (Optional)</Label>
                <div className="flex items-center gap-4 mt-2">
                  {watchImageUrl ? (
                    <img src={watchImageUrl} alt="Preview" className="w-16 h-16 object-cover rounded-md border" />
                  ) : (
                    <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center text-gray-400">
                      <ImageIcon className="w-8 h-8" />
                    </div>
                  )}
                  <div className="flex-1">
                    <Input type="file" accept="image/*" onChange={handleImageUpload} disabled={isUploading} />
                    {isUploading && <p className="text-sm text-blue-500 mt-1 flex items-center"><Loader2 className="w-3 h-3 mr-1 animate-spin" /> Uploading to Cloudinary...</p>}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border p-4 rounded-md">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Available</Label>
                    <p className="text-xs text-gray-500">Show on website</p>
                  </div>
                  <Controller
                    name="is_available"
                    control={control}
                    render={({ field }) => (
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    )}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Featured</Label>
                    <p className="text-xs text-gray-500">Show in Best Sellers</p>
                  </div>
                  <Controller
                    name="is_featured"
                    control={control}
                    render={({ field }) => (
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    )}
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <Button type="submit" className="bg-cafe-primary hover:bg-cafe-primary/90 text-white" disabled={isSubmitting || isUploading}>
                  {(isSubmitting) ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                  Save Menu Item
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
              <TableHead>Item</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center">Featured</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto text-gray-400" />
                </TableCell>
              </TableRow>
            ) : items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-gray-500">
                  No menu items found. Click "Add Menu Item" to create one.
                </TableCell>
              </TableRow>
            ) : (
              items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {item.image_url ? (
                        <img src={item.image_url} alt={item.name} className="w-10 h-10 rounded-md object-cover bg-gray-100" />
                      ) : (
                        <div className="w-10 h-10 rounded-md bg-gray-100 flex items-center justify-center">
                          <ImageIcon className="w-5 h-5 text-gray-400" />
                        </div>
                      )}
                      <div className="font-medium">{item.name}</div>
                    </div>
                  </TableCell>
                  <TableCell>{item.category?.name}</TableCell>
                  <TableCell>₹{item.price}</TableCell>
                  <TableCell className="text-center">
                    {item.is_available ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        <Check className="w-3 h-3 mr-1" /> Available
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                        <X className="w-3 h-3 mr-1" /> Hidden
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {item.is_featured && <Star className="w-4 h-4 text-amber-400 fill-amber-400 mx-auto" />}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleDelete(item.id)}
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
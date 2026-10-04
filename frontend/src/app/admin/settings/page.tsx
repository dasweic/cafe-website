"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Save } from "lucide-react";
import { api } from "@/lib/api";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Validation schema for all settings
const settingsSchema = z.object({
  cafe_name: z.string().min(1, "Cafe name is required"),
  tagline: z.string().optional(),
  about_text: z.string().optional(),
  
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  whatsapp: z.string().optional(),
  google_maps_url: z.string().url("Invalid URL").optional().or(z.literal("")),
  
  // Flattened Social Links
  instagram: z.string().url("Invalid URL").optional().or(z.literal("")),
  facebook: z.string().url("Invalid URL").optional().or(z.literal("")),
  
  // Flattened Opening Hours
  monday: z.string().optional(),
  tuesday: z.string().optional(),
  wednesday: z.string().optional(),
  thursday: z.string().optional(),
  friday: z.string().optional(),
  saturday: z.string().optional(),
  sunday: z.string().optional(),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
  });

  // Fetch data and map nested JSON to flat form fields
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await api.get("/settings/");
        const data = response.data;
        
        // Flatten the data for react-hook-form
        reset({
          cafe_name: data.cafe_name || "",
          tagline: data.tagline || "",
          about_text: data.about_text || "",
          address: data.address || "",
          phone: data.phone || "",
          email: data.email || "",
          whatsapp: data.whatsapp || "",
          google_maps_url: data.google_maps_url || "",
          
          instagram: data.social_links?.instagram || "",
          facebook: data.social_links?.facebook || "",
          
          monday: data.opening_hours?.Monday || "",
          tuesday: data.opening_hours?.Tuesday || "",
          wednesday: data.opening_hours?.Wednesday || "",
          thursday: data.opening_hours?.Thursday || "",
          friday: data.opening_hours?.Friday || "",
          saturday: data.opening_hours?.Saturday || "",
          sunday: data.opening_hours?.Sunday || "",
        });
      } catch (error) {
        console.error("Failed to fetch settings", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, [reset]);

  // Re-nest data before sending to the backend
  const onSubmit = async (data: SettingsFormValues) => {
    try {
      setIsSaving(true);
      
      const payload = {
        cafe_name: data.cafe_name,
        tagline: data.tagline,
        about_text: data.about_text,
        address: data.address,
        phone: data.phone,
        email: data.email,
        whatsapp: data.whatsapp,
        google_maps_url: data.google_maps_url,
        
        // Pack back into JSON objects
        social_links: {
          instagram: data.instagram,
          facebook: data.facebook,
        },
        opening_hours: {
          Monday: data.monday,
          Tuesday: data.tuesday,
          Wednesday: data.wednesday,
          Thursday: data.thursday,
          Friday: data.friday,
          Saturday: data.saturday,
          Sunday: data.sunday,
        }
      };

      await api.put("/settings/", payload);
      alert("Settings saved successfully!");
    } catch (error) {
      console.error("Failed to save settings", error);
      alert("Failed to save settings.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-cafe-primary animate-spin" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-4xl pb-10">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-800">Global Settings</h2>
        <Button 
          type="submit" 
          disabled={isSaving}
          className="bg-cafe-primary hover:bg-cafe-primary/90 text-white"
        >
          {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* General Info */}
        <Card className="border-gray-200 shadow-sm md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg text-cafe-primary">General Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Cafe Name *</Label>
              <Input placeholder="Brew & Bean" {...register("cafe_name")} />
              {errors.cafe_name && <p className="text-sm text-red-500">{errors.cafe_name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Tagline</Label>
              <Input placeholder="Fresh coffee. Great food." {...register("tagline")} />
            </div>
            <div className="space-y-2">
              <Label>About Us (Footer Text)</Label>
              <Textarea 
                placeholder="Write a short description about the cafe..." 
                className="h-24"
                {...register("about_text")} 
              />
            </div>
          </CardContent>
        </Card>

        {/* Contact Info */}
        <Card className="border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg text-cafe-primary">Contact Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Phone Number</Label>
              <Input placeholder="+91 9876543210" {...register("phone")} />
            </div>
            <div className="space-y-2">
              <Label>WhatsApp Number</Label>
              <Input placeholder="+91 9876543210" {...register("whatsapp")} />
            </div>
            <div className="space-y-2">
              <Label>Email Address</Label>
              <Input type="email" placeholder="hello@brewandbean.com" {...register("email")} />
              {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Physical Address</Label>
              <Textarea placeholder="123 Cafe Street, City" {...register("address")} />
            </div>
          </CardContent>
        </Card>

        {/* Digital Links */}
        <div className="space-y-6">
          <Card className="border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg text-cafe-primary">Social Media & Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Instagram URL</Label>
                <Input placeholder="https://instagram.com/yourcafe" {...register("instagram")} />
                {errors.instagram && <p className="text-sm text-red-500">{errors.instagram.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>Facebook URL</Label>
                <Input placeholder="https://facebook.com/yourcafe" {...register("facebook")} />
                {errors.facebook && <p className="text-sm text-red-500">{errors.facebook.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>Google Maps URL</Label>
                <Input placeholder="https://maps.google.com/..." {...register("google_maps_url")} />
                {errors.google_maps_url && <p className="text-sm text-red-500">{errors.google_maps_url.message}</p>}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Opening Hours */}
        <Card className="border-gray-200 shadow-sm md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg text-cafe-primary">Opening Hours</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Monday</Label>
              <Input placeholder="9:00 AM - 10:00 PM" {...register("monday")} />
            </div>
            <div className="space-y-2">
              <Label>Tuesday</Label>
              <Input placeholder="9:00 AM - 10:00 PM" {...register("tuesday")} />
            </div>
            <div className="space-y-2">
              <Label>Wednesday</Label>
              <Input placeholder="9:00 AM - 10:00 PM" {...register("wednesday")} />
            </div>
            <div className="space-y-2">
              <Label>Thursday</Label>
              <Input placeholder="9:00 AM - 10:00 PM" {...register("thursday")} />
            </div>
            <div className="space-y-2">
              <Label>Friday</Label>
              <Input placeholder="9:00 AM - 11:00 PM" {...register("friday")} />
            </div>
            <div className="space-y-2">
              <Label>Saturday</Label>
              <Input placeholder="9:00 AM - 11:00 PM" {...register("saturday")} />
            </div>
            <div className="space-y-2">
              <Label>Sunday</Label>
              <Input placeholder="10:00 AM - 10:00 PM" {...register("sunday")} />
            </div>
          </CardContent>
        </Card>

      </div>
    </form>
  );
}
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Coffee, Tags, Image as ImageIcon, Users, Loader2 } from "lucide-react";
import { api } from "@/lib/api";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    menuItems: 0,
    categories: 0,
    gallery: 0,
    staff: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch all endpoints concurrently to get the total counts quickly
        const [menuRes, catRes, galRes, staffRes] = await Promise.all([
          api.get("/menu-items/"),
          api.get("/categories/"),
          api.get("/gallery/"),
          api.get("/staff/")
        ]);
        
        setStats({
          menuItems: menuRes.data.length,
          categories: catRes.data.length,
          gallery: galRes.data.length,
          staff: staffRes.data.length
        });
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    { title: "Total Menu Items", value: stats.menuItems, icon: Coffee, color: "text-amber-600", bg: "bg-amber-100" },
    { title: "Total Categories", value: stats.categories, icon: Tags, color: "text-blue-600", bg: "bg-blue-100" },
    { title: "Gallery Images", value: stats.gallery, icon: ImageIcon, color: "text-emerald-600", bg: "bg-emerald-100" },
    { title: "Staff Members", value: stats.staff, icon: Users, color: "text-purple-600", bg: "bg-purple-100" },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-cafe-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="border-gray-200 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium text-gray-500">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-md ${stat.bg}`}>
                  <Icon className={`w-4 h-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-800">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
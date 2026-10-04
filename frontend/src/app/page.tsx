"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Loader2, MapPin, Phone, Mail, Clock, Coffee } from "lucide-react";

// Types
interface Settings {
  cafe_name: string;
  tagline: string;
  about_text: string;
  address: string;
  phone: string;
  email: string;
  opening_hours: Record<string, string>;
  social_links: Record<string, string>;
}

interface Category {
  id: number;
  name: string;
  description: string;
}

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category_id: number;
  is_available: boolean;
  is_featured: boolean;
  image_url: string;
}

interface GalleryImage {
  id: number;
  image_url: string;
  caption: string;
  category: string;
}

export default function HomePage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPublicData = async () => {
      try {
        const [setRes, catRes, menuRes, galRes] = await Promise.all([
          api.get("/settings/"),
          api.get("/categories/"),
          api.get("/menu-items/"),
          api.get("/gallery/")
        ]);

        setSettings(setRes.data);
        setCategories(catRes.data);
        setMenuItems(menuRes.data);
        setGallery(galRes.data);
      } catch (error) {
        console.error("Failed to fetch public data", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPublicData();
  }, []);

  if (isLoading || !settings) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cafe-background">
        <Loader2 className="w-10 h-10 text-cafe-primary animate-spin" />
      </div>
    );
  }

  // Group available menu items by category
  const menuByCategory = categories.map(category => ({
    ...category,
    items: menuItems.filter(item => item.category_id === category.id && item.is_available)
  })).filter(category => category.items.length > 0); // Only show categories that have items

  return (
    <div className="min-h-screen bg-cafe-background text-cafe-text selection:bg-cafe-secondary selection:text-cafe-primary">
      
      {/* NAVIGATION */}
      <nav className="sticky top-0 z-50 bg-cafe-background/90 backdrop-blur-md border-b border-cafe-secondary/30">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Coffee className="w-8 h-8 text-cafe-primary" />
            <span className="font-serif font-bold text-2xl text-cafe-primary tracking-tight">
              {settings.cafe_name}
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 font-medium text-sm tracking-wide">
            <a href="#menu" className="hover:text-cafe-accent transition-colors">MENU</a>
            <a href="#gallery" className="hover:text-cafe-accent transition-colors">GALLERY</a>
            <a href="#visit" className="hover:text-cafe-accent transition-colors">VISIT US</a>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <header className="relative pt-32 pb-40 px-6 text-center overflow-hidden flex flex-col items-center justify-center min-h-[70vh]">
        
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 bg-[url('/bg.jpg')] bg-cover bg-center bg-no-repeat -z-20"></div>
        {/* Halka sa white overlay taaki dark text clear padhne mein aaye */}
        <div className="absolute inset-0 bg-cafe-background/70 -z-10"></div>

        <div className="max-w-3xl mx-auto space-y-6">
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-cafe-primary leading-tight">
            {settings.tagline || `Welcome to ${settings.cafe_name}`}
          </h1>
          <p className="text-lg md:text-xl text-cafe-primary/90 max-w-2xl mx-auto leading-relaxed font-medium">
            {settings.about_text || "Experience the perfect blend of rich flavors, warm ambiance, and exceptional service."}
          </p>
          <div className="pt-8">
            <a 
              href="#menu" 
              className="inline-block px-8 py-4 bg-cafe-primary text-white rounded-full font-medium transition-transform hover:scale-105 shadow-lg shadow-cafe-primary/20"
            >
              Explore Our Menu
            </a>
          </div>
        </div>
      </header>

      {/* MENU SECTION */}
      <section id="menu" className="py-24 px-6 max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-serif font-bold text-cafe-primary mb-4">Our Menu</h2>
          <div className="w-24 h-1 bg-cafe-accent mx-auto rounded-full"></div>
        </div>

        {menuByCategory.length === 0 ? (
          <p className="text-center text-gray-500 italic">Menu is currently being updated. Check back soon!</p>
        ) : (
          <div className="space-y-16">
            {menuByCategory.map((category) => (
              <div key={category.id} className="space-y-8">
                <div>
                  <h3 className="text-3xl font-serif text-cafe-primary border-b border-cafe-secondary/50 pb-2 inline-block">
                    {category.name}
                  </h3>
                  {category.description && (
                    <p className="text-cafe-text/70 mt-2">{category.description}</p>
                  )}
                </div>
                
                <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
                  {category.items.map((item) => (
                    <div key={item.id} className="flex gap-4 items-start group">
                      {item.image_url ? (
                        <img src={item.image_url} alt={item.name} className="w-20 h-20 object-cover rounded-lg shadow-sm" />
                      ) : null}
                      <div className="flex-1">
                        <div className="flex justify-between items-baseline border-b border-dotted border-gray-300 mb-2">
                          <h4 className="font-bold text-lg text-cafe-text group-hover:text-cafe-accent transition-colors">
                            {item.name} {item.is_featured && "⭐"}
                          </h4>
                          <span className="font-semibold text-lg text-cafe-primary bg-cafe-background pl-2">
                            ₹{item.price}
                          </span>
                        </div>
                        {item.description && (
                          <p className="text-sm text-cafe-text/70 leading-snug">{item.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* GALLERY SECTION */}
      {gallery.length > 0 && (
        <section id="gallery" className="py-24 bg-white px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-serif font-bold text-cafe-primary mb-4">Gallery</h2>
              <div className="w-24 h-1 bg-cafe-accent mx-auto rounded-full"></div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {gallery.map((img) => (
                <div key={img.id} className="group relative aspect-square overflow-hidden rounded-xl bg-gray-100">
                  <img 
                    src={img.image_url} 
                    alt={img.caption || "Cafe Gallery"} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {img.caption && (
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                      <p className="text-white text-sm font-medium">{img.caption}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FOOTER SECTION */}
      <footer id="visit" className="bg-cafe-primary text-cafe-secondary py-16 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-12">
          
          <div className="space-y-4">
            <h3 className="text-2xl font-serif text-white font-bold">{settings.cafe_name}</h3>
            <p className="text-cafe-secondary/80 leading-relaxed max-w-xs">
              {settings.about_text || "Thank you for visiting us. We hope to see you again!"}
            </p>
            
            <div className="flex gap-4 pt-4">
              {/* Using direct inline SVGs for social icons to fix the Lucide missing icon error */}
              {settings.social_links?.instagram && (
                <a href={settings.social_links.instagram} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-cafe-accent hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                </a>
              )}
              {settings.social_links?.facebook && (
                <a href={settings.social_links.facebook} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-cafe-accent hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                </a>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-bold text-white uppercase tracking-wider">Contact Us</h4>
            <div className="space-y-3">
              {settings.address && (
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-cafe-accent shrink-0 mt-0.5" />
                  <span>{settings.address}</span>
                </div>
              )}
              {settings.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-cafe-accent shrink-0" />
                  <span>{settings.phone}</span>
                </div>
              )}
              {settings.email && (
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-cafe-accent shrink-0" />
                  <span>{settings.email}</span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-bold text-white uppercase tracking-wider">Opening Hours</h4>
            <ul className="space-y-2">
              {Object.entries(settings.opening_hours || {}).map(([day, hours]) => (
                hours ? (
                  <li key={day} className="flex justify-between border-b border-white/10 pb-1">
                    <span className="capitalize">{day}</span>
                    <span>{hours}</span>
                  </li>
                ) : null
              ))}
            </ul>
          </div>

        </div>
        
        <div className="max-w-6xl mx-auto border-t border-white/10 mt-16 pt-8 text-center text-sm text-cafe-secondary/60">
          © {new Date().getFullYear()} {settings.cafe_name}. All rights reserved. <br/>
          <a href="/admin/login" className="hover:text-cafe-accent transition-colors mt-2 inline-block">Admin Login</a>
        </div>
      </footer>

    </div>
  );
}
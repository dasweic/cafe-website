"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Loader2, MapPin, Phone, Mail, Coffee } from "lucide-react";

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
  })).filter(category => category.items.length > 0);

  return (
    <div className="relative min-h-screen text-cafe-text selection:bg-cafe-primary selection:text-white font-sans overflow-hidden">
      
      {/* FIXED BACKGROUND IMAGE WITH OVERLAY */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-black/20 z-10" /> {/* Subtle dark overlay for better text contrast */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/bg.jpg')" }}
        />
      </div>

      {/* FOREGROUND CONTENT */}
      <div className="relative z-20">
        
        {/* PREMIUM GLASS NAVIGATION */}
        <nav className="sticky top-0 z-50 bg-white/40 backdrop-blur-xl border-b border-white/50 shadow-sm">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-cafe-primary rounded-lg shadow-lg">
                <Coffee className="w-6 h-6 text-white" />
              </div>
              <span className="font-serif font-bold text-2xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cafe-primary to-amber-900">
                {settings.cafe_name}
              </span>
            </div>
            <div className="hidden md:flex items-center gap-10 font-medium text-sm tracking-widest text-cafe-primary">
              <a href="#menu" className="hover:text-cafe-accent transition-colors">MENU</a>
              <a href="#gallery" className="hover:text-cafe-accent transition-colors">GALLERY</a>
              <a href="#visit" className="hover:text-cafe-accent transition-colors">VISIT US</a>
            </div>
          </div>
        </nav>

        {/* HERO SECTION */}
        {/* HERO SECTION */}
      <header 
        className="relative pt-32 pb-40 px-6 text-center overflow-hidden flex flex-col items-center justify-center min-h-[70vh] bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/bg.jpg')" }}
      >
        {/* Dark overlay taaki text easily padhne me aaye (Aap iski opacity bg-black/40 ko change kar sakte hain) */}
        <div className="absolute inset-0 bg-black/40 z-0"></div>
        
        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-white drop-shadow-lg leading-tight">
            {settings.tagline || `Welcome to ${settings.cafe_name}`}
          </h1>
          <p className="text-lg md:text-xl text-white/90 drop-shadow-md max-w-2xl mx-auto leading-relaxed">
            {settings.about_text || "Experience the perfect blend of rich flavors, warm ambiance, and exceptional service."}
          </p>
          <div className="pt-8">
            <a 
              href="#menu" 
              className="inline-block px-8 py-4 bg-cafe-primary text-white rounded-full font-medium transition-transform hover:scale-105 shadow-lg"
            >
              Explore Our Menu
            </a>
          </div>
        </div>
      </header>

        {/* MENU SECTION */}
        <section id="menu" className="py-24 px-6 max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-sm font-bold tracking-[0.3em] text-white/90 uppercase drop-shadow-md">Taste the Excellence</span>
            <h2 className="text-5xl md:text-6xl font-serif font-extrabold text-white mt-2 drop-shadow-lg tracking-tight">Our Menu</h2>
            <div className="w-24 h-1.5 bg-cafe-accent mx-auto rounded-full mt-6 shadow-lg"></div>
          </div>

          {menuByCategory.length === 0 ? (
            <p className="text-center text-white/90 italic text-lg backdrop-blur-sm p-4 rounded-xl">Menu is currently being updated. Check back soon!</p>
          ) : (
            <div className="space-y-12">
              {menuByCategory.map((category) => (
                <div key={category.id} className="p-8 md:p-12 rounded-[2rem] bg-white/40 backdrop-blur-xl border border-white/50 shadow-2xl">
                  <div className="mb-10 text-center">
                    <h3 className="text-4xl font-serif font-bold text-cafe-primary">
                      {category.name}
                    </h3>
                    {category.description && (
                      <p className="text-cafe-primary/70 mt-3 font-medium tracking-wide">{category.description}</p>
                    )}
                  </div>
                  
                  <div className="grid lg:grid-cols-2 gap-x-16 gap-y-10">
                    {category.items.map((item) => (
                      <div key={item.id} className="flex gap-6 items-start group">
                        {item.image_url ? (
                          <div className="w-24 h-24 shrink-0 overflow-hidden rounded-2xl shadow-md border border-white/40">
                            <img src={item.image_url} alt={item.name} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" />
                          </div>
                        ) : null}
                        <div className="flex-1 pt-1">
                          <div className="flex justify-between items-baseline border-b border-cafe-primary/20 pb-2 mb-3">
                            <h4 className="font-bold text-xl text-cafe-primary group-hover:text-cafe-accent transition-colors tracking-tight">
                              {item.name} {item.is_featured && <span className="text-amber-500 text-sm ml-1 align-top">★</span>}
                            </h4>
                            <span className="font-black text-xl text-cafe-primary pl-4">
                              ₹{item.price}
                            </span>
                          </div>
                          {item.description && (
                            <p className="text-sm font-medium text-cafe-primary/70 leading-relaxed">{item.description}</p>
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
          <section id="gallery" className="py-24 px-6 relative">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16 p-6 rounded-3xl bg-white/20 backdrop-blur-md border border-white/30 inline-block mx-auto left-1/2 relative -translate-x-1/2">
                <h2 className="text-4xl md:text-5xl font-serif font-bold text-cafe-primary tracking-tight">Moments & Memories</h2>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {gallery.map((img) => (
                  <div key={img.id} className="group relative aspect-[4/5] overflow-hidden rounded-[2rem] shadow-xl border-4 border-white/40 bg-white/20 backdrop-blur-sm">
                    <img 
                      src={img.image_url} 
                      alt={img.caption || "Cafe Gallery"} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    {img.caption && (
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                        <p className="text-white text-lg font-medium tracking-wide">{img.caption}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* FOOTER SECTION */}
        <footer id="visit" className="bg-black/80 backdrop-blur-2xl border-t border-white/10 text-white/90 py-20 px-6 mt-12 relative z-20">
          <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-16">
            
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Coffee className="w-8 h-8 text-cafe-accent" />
                <h3 className="text-3xl font-serif font-bold tracking-tight text-white">{settings.cafe_name}</h3>
              </div>
              <p className="text-white/60 leading-relaxed font-light text-lg">
                {settings.about_text || "Thank you for visiting us. We hope to see you again!"}
              </p>
              
              <div className="flex gap-4 pt-2">
                {settings.social_links?.instagram && (
                  <a href={settings.social_links.instagram} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-cafe-accent hover:border-cafe-accent transition-all hover:scale-110">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                  </a>
                )}
                {settings.social_links?.facebook && (
                  <a href={settings.social_links.facebook} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-cafe-accent hover:border-cafe-accent transition-all hover:scale-110">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                  </a>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <h4 className="text-sm font-black text-cafe-accent uppercase tracking-[0.2em]">Contact & Location</h4>
              <div className="space-y-4">
                {settings.address && (
                  <div className="flex items-start gap-4">
                    <MapPin className="w-6 h-6 text-white/40 shrink-0" />
                    <span className="font-light tracking-wide">{settings.address}</span>
                  </div>
                )}
                {settings.phone && (
                  <div className="flex items-center gap-4">
                    <Phone className="w-6 h-6 text-white/40 shrink-0" />
                    <span className="font-light tracking-wide">{settings.phone}</span>
                  </div>
                )}
                {settings.email && (
                  <div className="flex items-center gap-4">
                    <Mail className="w-6 h-6 text-white/40 shrink-0" />
                    <span className="font-light tracking-wide">{settings.email}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <h4 className="text-sm font-black text-cafe-accent uppercase tracking-[0.2em]">Opening Hours</h4>
              <ul className="space-y-3">
                {Object.entries(settings.opening_hours || {}).map(([day, hours]) => (
                  hours ? (
                    <li key={day} className="flex justify-between border-b border-white/10 pb-2 font-light">
                      <span className="capitalize tracking-wide">{day}</span>
                      <span className="text-white/80">{hours}</span>
                    </li>
                  ) : null
                ))}
              </ul>
            </div>

          </div>
          
          <div className="max-w-6xl mx-auto border-t border-white/10 mt-16 pt-8 text-center text-sm text-white/40 font-light tracking-widest">
            © {new Date().getFullYear()} {settings.cafe_name}. DESIGNED WITH ELEGANCE. <br/>
            <a href="/admin/login" className="hover:text-cafe-accent transition-colors mt-4 inline-block font-medium">ADMIN PORTAL</a>
          </div>
        </footer>

      </div>
    </div>
  );
}
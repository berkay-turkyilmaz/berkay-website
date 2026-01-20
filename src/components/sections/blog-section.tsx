// src/components/sections/blog-section.tsx

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import Link from "next/link"; // 1. ÖNEMLİ: Link bileşenini ekledik

// 2. ÖNEMLİ: Verilerimize 'slug' ekledik
const blogs = [
  { 
    title: "Tailwind v4 Devrimi", 
    slug: "tailwind-v4-devrimi", 
    date: "18 Jan 2026", 
    cat: "Frontend" 
  },
  { 
    title: "n8n ile Workflow", 
    slug: "n8n-ile-workflow", 
    date: "15 Jan 2026", 
    cat: "Automation" 
  }
];

export function BlogSection() {
  return (
    <section id="blog" className="space-y-8">
      <h2 className="text-2xl font-bold border-l-4 border-primary pl-4 uppercase tracking-tighter">
        Bloglar
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {blogs.map((post) => (
          // 3. ÖNEMLİ: Her kartı bir Link ile sarıyoruz. 
          // href içindeki yapıya dikkat: /blog/ yazıp yanına slug'ı ekliyoruz.
          <Link href={`/blog/${post.slug}`} key={post.slug} className="block group">
            <Card className="hover:border-primary transition-all cursor-pointer border shadow-none hover:shadow-md h-full">
              <CardHeader className="p-4">
                <Badge className="w-fit mb-2 group-hover:bg-primary transition-colors">
                  {post.cat}
                </Badge>
                <CardTitle className="text-lg group-hover:text-primary transition-colors">
                  {post.title}
                </CardTitle>
                <div className="flex items-center text-xs text-muted-foreground gap-1 pt-2">
                  <Calendar className="h-3 w-3" /> {post.date}
                </div>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
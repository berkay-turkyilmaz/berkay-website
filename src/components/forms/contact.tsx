"use client"

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner"; // Bildirim için
import { Loader2, Send } from "lucide-react"; // İkonlar

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      // n8n Webhook URL'ini buraya koyuyoruz
      const response = await fetch("http://localhost:5678/webhook-test/contact-form", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" }
      });

      if (response.ok) {
        toast.success("Mesajınız başarıyla iletildi!", {
          description: "En kısa sürede size dönüş yapacağım.",
        });
        setIsSuccess(true);
        reset(); // Formu temizle
      } else {
        throw new Error();
      }
    } catch (error) {
      toast.error("Bir hata oluştu.", {
        description: "Lütfen daha sonra tekrar deneyin veya direkt e-posta atın.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center p-10 border-2 border-dashed rounded-2xl bg-primary/5 space-y-4 animate-in zoom-in-95 duration-500">
        <div className="h-12 w-12 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto shadow-lg shadow-green-500/20">
          <Send className="h-6 w-6" />
        </div>
        <h3 className="text-2xl font-bold italic">Teşekkürler Berkay!</h3>
        <p className="text-muted-foreground">Mesajın n8n otomasyonuma ulaştı. Kahvemi yudumlarken okuyacağım.</p>
        <Button variant="outline" onClick={() => setIsSuccess(false)}>Yeni Mesaj Gönder</Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-card p-8 rounded-2xl border shadow-sm">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight italic uppercase">Bana Ulaşın</h2>
        <p className="text-sm text-muted-foreground">Fikirlerinizi duymak için sabırsızlanıyorum.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input {...register("name", { required: true })} placeholder="Adınız" className="bg-muted/50 rounded-l border" />
        <Input {...register("email", { required: true })} type="email" placeholder="E-posta Adresiniz" className="bg-muted/50 rounded-l border" />
      </div>

      <Textarea {...register("message", { required: true })} placeholder="Mesajınız..." className="min-h-[150px] bg-muted/50 rounded-l border" />

      <Button disabled={isSubmitting} type="submit" className="w-full group h-12 text-md font-bold uppercase tracking-widest">
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Gönderiliyor...
          </>
        ) : (
          <>
            Mesajı Gönder <Send className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </>
        )}
      </Button>
    </form>
  );
}
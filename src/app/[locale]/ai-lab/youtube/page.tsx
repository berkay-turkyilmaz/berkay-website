export default function YoutubePage() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
      <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mb-4 text-3xl shadow-sm">
        ▶️
      </div>
      <h1 className="text-2xl font-bold text-foreground mb-2">YouTube Analiz</h1>
      <p className="text-muted-foreground max-w-md">
        Bu araç şu anda geliştirme aşamasındadır (BETA). <br />
        Çok yakında video özetleme ve analiz özellikleri eklenecektir.
      </p>
    </div>
  );
}
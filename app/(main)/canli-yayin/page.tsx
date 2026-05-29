"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Radio, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { LiveStream } from "@/types";

export default function LivePage() {
  const [streams, setStreams] = useState<LiveStream[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/live")
      .then(r => r.json())
      .then(d => { if (d.success) setStreams(d.data); })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-3 w-3 bg-red-500 rounded-full animate-pulse" />
          <h1 className="text-3xl md:text-4xl font-bold text-white">Canlı Yayın</h1>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 text-wado-500 animate-spin" /></div>
        ) : streams.length === 0 ? (
          <div className="text-center py-20">
            <Radio className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-xl text-muted-foreground">Şu an canlı yayın bulunmuyor</p>
            <p className="text-sm text-muted-foreground/60 mt-2">Daha sonra tekrar kontrol edin</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {streams.filter(s => s.isLive).map((stream, i) => (
              <motion.div key={stream.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <div className="glass-dark rounded-2xl overflow-hidden">
                  <div className="relative aspect-video bg-black">
                    {stream.thumbnailUrl ? (
                      <img src={stream.thumbnailUrl} alt={stream.title} className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full flex items-center justify-center">
                        <Radio className="h-20 w-20 text-muted-foreground/30" />
                      </div>
                    )}
                    <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-red-600 rounded-full text-white text-sm font-medium">
                      <span className="h-2 w-2 bg-white rounded-full animate-pulse" />
                      CANLI
                    </div>
                    <div className="absolute inset-x-0 bottom-0 p-6 hero-gradient">
                      <h2 className="text-2xl font-bold text-white">{stream.title}</h2>
                      {stream.description && <p className="text-gray-300 mt-1">{stream.description}</p>}
                    </div>
                  </div>
                  <div className="p-4 flex items-center gap-3">
                    <a href={stream.streamUrl || "#"} target="_blank">
                      <Button className="bg-wado-600 hover:bg-wado-700"><Radio className="h-4 w-4 mr-2" />İzlemeye Başla</Button>
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

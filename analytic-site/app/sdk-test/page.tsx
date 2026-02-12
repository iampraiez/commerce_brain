"use client";

import { useState, useCallback } from "react";
import { useNexus } from "./use-nexus";
import UserDemoCard from "./components/UserDemoCard";
import ProductDemoCard from "./components/ProductDemoCard";
import CheckoutDemoCard from "./components/CheckoutDemoCard";
import OrderDemoCard from "./components/OrderDemoCard";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Rocket, 
  Activity, 
  Hash, 
  Upload, 
  History, 
  Zap,
  Info,
  ShieldCheck,
  AlertCircle
} from "lucide-react";

interface EventLog {
  id: string;
  type: string;
  timestamp: number;
}

export default function SdkTestPage() {
  const { isInitialized, sessionId, flush } = useNexus();
  const [events, setEvents] = useState<EventLog[]>([]);

  const addEvent = useCallback((type: string) => {
    const event: EventLog = {
      id: `${Date.now()}-${Math.random()}`,
      type,
      timestamp: Date.now(),
    };
    setEvents((prev) => [event, ...prev].slice(0, 20));
  }, []);

  return (
    <div className="min-h-screen bg-background p-6 md:p-12 space-y-12">
      {/* Header Section */}
      <section className="max-w-4xl mx-auto text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary animate-in fade-in slide-in-from-top-4 duration-1000">
          <Rocket className="w-4 h-4" />
          <span className="text-xs font-bold tracking-widest uppercase">Nexus SDK Build</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter bg-gradient-to-b from-foreground to-foreground/50 bg-clip-text text-transparent">
          Interactive Event Sandbox
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
          Test and validate your Nexus SDK implementation in real-time. 
          Monitor event buffering, session persistence, and data schema integrity.
        </p>
      </section>

      {/* Control Panel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {/* Status Card */}
        <Card className="lg:col-span-1 border-border/50 bg-card/40 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500 shadow-amber-500/20" />
              SDK INITIALIZATION
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between p-3 rounded-lg bg-background/40 border border-border/50">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${isInitialized ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`} />
                <span className="text-xs font-medium text-muted-foreground">Status</span>
              </div>
              <Badge variant={isInitialized ? "secondary" : "outline"} className={isInitialized ? "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/10" : ""}>
                {isInitialized ? (
                  <span className="flex items-center gap-1.5"><ShieldCheck className="w-3 h-3" /> Active</span>
                ) : (
                  <span className="flex items-center gap-1.5"><AlertCircle className="w-3 h-3" /> Offline</span>
                )}
              </Badge>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                <Hash className="w-3 h-3" /> Session Fingerprint
              </div>
              <div className="p-3 rounded-lg bg-background/60 font-mono text-[10px] break-all border border-border/50 text-foreground/80">
                {sessionId || "Waiting for signal..."}
              </div>
            </div>

            <Button 
              onClick={flush} 
              className="w-full bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20"
            >
              <Upload className="mr-2 h-4 w-4" />
              Flush Buffer
            </Button>

            <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 flex gap-3">
              <Info className="w-5 h-5 text-primary shrink-0" />
              <p className="text-[10px] leading-relaxed text-muted-foreground">
                <span className="font-bold text-primary">Pro Tip:</span> Events are batched (size: 5) and flushed every 3s. Manual flush overrides this.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Live Feed Card */}
        <Card className="lg:col-span-2 border-border/50 bg-card/40 backdrop-blur-xl flex flex-col h-[400px]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <History className="w-4 h-4 text-primary" />
                LIVE EVENT STREAM
              </CardTitle>
              <CardDescription className="text-[10px]">Recent telemetry data being processed</CardDescription>
            </div>
            {events.length > 0 && (
              <Badge variant="outline" className="text-[10px] border-primary/30 text-primary">
                {events.length} CAPTURED
              </Badge>
            )}
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden pt-4">
            <ScrollArea className="h-full pr-4">
              {events.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-4 py-12">
                  <div className="p-4 rounded-full bg-secondary/50">
                    <Activity className="w-8 h-8 text-muted-foreground/30" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">No telemetry signals found</p>
                    <p className="text-xs text-muted-foreground/50">Interact with the cards below to generate activity</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  {events.map((event, i) => (
                    <div 
                      key={event.id} 
                      className="p-3 rounded-lg bg-background/40 border border-border/50 flex items-center justify-between animate-in fade-in slide-in-from-right-4"
                      style={{ animationDelay: `${i * 50}ms` }}
                    >
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-primary tracking-tight">{event.type}</span>
                        <span className="text-[9px] text-muted-foreground tabular-nums">
                          {new Date(event.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/40 shadow-[0_0_8px_rgba(var(--primary),0.5)]" />
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      <Separator className="max-w-7xl mx-auto bg-border/50" />

      {/* Event Cards Section */}
      <section className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col items-center gap-2 text-center">
          <h2 className="text-2xl font-bold tracking-tight">Event Generation Modules</h2>
          <p className="text-muted-foreground text-sm">Select a module to simulate specific user behavior patterns.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <UserDemoCard onEventTracked={() => addEvent("user_auth")} />
          <ProductDemoCard onEventTracked={() => addEvent("product_telemetry")} />
          <CheckoutDemoCard onEventTracked={() => addEvent("checkout_flow")} />
          <OrderDemoCard onEventTracked={() => addEvent("order_lifecycle")} />
        </div>
      </section>

      {/* Documentation Footer */}
      <footer className="max-w-xl mx-auto text-center pt-12 pb-24 space-y-6">
        <div className="p-6 rounded-2xl bg-secondary/30 border border-border/50 space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Need to dive deeper? Explore the comprehensive documentation 
            to understand advanced tracking capabilities, server-side events, 
            and data enrichment APIs.
          </p>
          <Button variant="link" className="text-primary font-bold">
            VIEW FULL DOCUMENTATION →
          </Button>
        </div>
        <p className="text-[10px] text-muted-foreground/40 font-mono tracking-tighter">
          NEXUS ANALYTICS SDK v1.2.3 • ENGINE: NEXT.JS 16 • MODE: SANDBOX
        </p>
      </footer>
    </div>
  );
}

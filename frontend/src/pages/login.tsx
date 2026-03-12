import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, Github } from "lucide-react";
import { motion } from "framer-motion";

export default function Login() {
  return (
    <div className="min-h-screen flex bg-background">
      {/* Left side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-md space-y-8"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Sparkles className="text-white w-5 h-5" />
            </div>
            <h1 className="font-display font-bold text-2xl tracking-tight text-foreground">AI Meeting Assistant</h1>
          </div>

          <div>
            <h2 className="text-4xl font-bold tracking-tight mb-2">Welcome back</h2>
            <p className="text-muted-foreground text-lg">Enter your details to access your meeting intelligence.</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none text-foreground" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                className="flex h-12 w-full rounded-xl border-2 border-border bg-transparent px-4 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/10 placeholder:text-muted-foreground"
                placeholder="name@company.com"
                type="email"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium leading-none text-foreground" htmlFor="password">
                  Password
                </label>
                <a href="#" className="text-sm font-medium text-primary hover:underline">Forgot password?</a>
              </div>
              <input
                id="password"
                className="flex h-12 w-full rounded-xl border-2 border-border bg-transparent px-4 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/10 placeholder:text-muted-foreground"
                placeholder="••••••••"
                type="password"
              />
            </div>

            <Link href="/dashboard" className="block mt-6">
              <Button size="lg" variant="gradient" className="w-full group">
                Sign In
                <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-4 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="h-12 w-full">
              <Github className="mr-2 h-5 w-5" />
              GitHub
            </Button>
            <Button variant="outline" className="h-12 w-full">
              <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Google
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Right side - Visual */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden bg-slate-900">
        <img 
          src={`${import.meta.env.BASE_URL}images/login-bg.png`} 
          alt="Abstract mesh" 
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-12 text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="glass-panel p-8 rounded-3xl max-w-lg"
          >
            <h3 className="font-display text-2xl font-bold mb-4">Turn conversations into action</h3>
            <p className="text-slate-200 leading-relaxed mb-6">
              Automatically extract key decisions, assign tasks, and push them to your team's workflow in seconds. Stop taking notes, start taking action.
            </p>
            <div className="flex gap-2">
              <div className="w-2 h-2 rounded-full bg-white"></div>
              <div className="w-2 h-2 rounded-full bg-white/30"></div>
              <div className="w-2 h-2 rounded-full bg-white/30"></div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

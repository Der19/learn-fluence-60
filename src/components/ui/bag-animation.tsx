import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface BagAnimationProps {
  onSubmit: (e: React.FormEvent) => void;
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  error: string | null;
  examples: Array<{ email: string; password: string; role: string }>;
}

export function BagAnimation({ 
  onSubmit, 
  email, 
  setEmail, 
  password, 
  setPassword, 
  error, 
  examples 
}: BagAnimationProps) {
  const [animationPhase, setAnimationPhase] = useState<'walking' | 'throwing' | 'opening' | 'form'>('walking');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setAnimationPhase('throwing');
    }, 2000);

    const timer2 = setTimeout(() => {
      setAnimationPhase('opening');
    }, 3500);

    const timer3 = setTimeout(() => {
      setAnimationPhase('form');
      setShowForm(true);
    }, 5000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-secondary overflow-hidden">
      {/* Personnage qui marche */}
      <div className={`absolute bottom-20 left-0 transition-all duration-2000 ease-out ${
        animationPhase === 'walking' ? 'translate-x-0' : 
        animationPhase === 'throwing' ? 'translate-x-[60%]' : 
        'translate-x-[60%]'
      }`}>
        <div className="relative">
          {/* Corps du personnage */}
          <div className="w-16 h-20 bg-blue-600 rounded-full relative animate-walk">
            {/* Tête */}
            <div className="w-8 h-8 bg-yellow-300 rounded-full absolute -top-2 left-1/2 transform -translate-x-1/2"></div>
            {/* Bras */}
            <div className={`w-3 h-8 bg-yellow-300 rounded-full absolute top-2 -right-1 transition-transform duration-500 ${
              animationPhase === 'throwing' ? 'rotate-45' : ''
            }`}></div>
            <div className="w-3 h-8 bg-yellow-300 rounded-full absolute top-2 -left-1"></div>
            {/* Jambes */}
            <div className={`w-3 h-6 bg-blue-800 rounded-full absolute bottom-0 left-2 animate-leg-left`}></div>
            <div className={`w-3 h-6 bg-blue-800 rounded-full absolute bottom-0 right-2 animate-leg-right`}></div>
          </div>
          
          {/* Sac */}
          <div className={`absolute top-4 -right-2 w-8 h-10 bg-brown-600 rounded-lg transition-all duration-1000 ${
            animationPhase === 'throwing' ? 'animate-bag-throw' : 
            animationPhase === 'opening' ? 'animate-bag-land' : ''
          }`}>
            {/* Fermeture du sac */}
            <div className="w-full h-1 bg-brown-800 absolute top-0"></div>
            {/* Poignée */}
            <div className="w-1 h-4 bg-brown-800 absolute -top-2 left-1/2 transform -translate-x-1/2"></div>
          </div>
        </div>
      </div>

      {/* Sac qui s'ouvre au centre */}
      <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 ${
        animationPhase === 'opening' || animationPhase === 'form' ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
      }`}>
        <div className="relative">
          {/* Sac ouvert - plus grand */}
          <div className="w-80 h-96 bg-gradient-to-b from-amber-600 to-amber-800 rounded-lg relative animate-bag-open">
            {/* Intérieur du sac */}
            <div className="absolute inset-4 bg-amber-200 rounded-md"></div>
            {/* Contenu du sac (formulaire) */}
            <div className={`absolute inset-6 transition-all duration-1000 ${
              showForm ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
              <Card className="shadow-lg h-full">
                <CardContent className="p-6 h-full flex flex-col">
                  <h1 className="text-2xl font-bold mb-2 text-center">Connexion</h1>
                  <p className="text-muted-foreground mb-6 text-center">Accédez à votre espace.</p>

                  {error && (
                    <Alert variant="destructive" className="mb-4">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <form onSubmit={onSubmit} className="space-y-4 flex-1">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="ex: admin@edu.local"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Mot de passe</Label>
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full bg-gradient-primary">
                      Se connecter
                    </Button>
                  </form>

                  <div className="mt-6">
                    <p className="text-sm text-muted-foreground mb-2">Comptes de démonstration:</p>
                    <div className="space-y-2">
                      {examples.map((u) => (
                        <div key={u.email} className="flex items-center justify-between text-sm p-2 bg-muted/50 rounded">
                          <span className="font-medium">{u.role === "student" ? "Apprenant" : u.role}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">{u.email} / {u.password}</span>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => { setEmail(u.email); setPassword(u.password); }}
                            >
                              Remplir
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Particules magiques */}
      <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none ${
        animationPhase === 'opening' ? 'opacity-100' : 'opacity-0'
      }`}>
        <div className="animate-sparkle-1">✨</div>
        <div className="animate-sparkle-2">⭐</div>
        <div className="animate-sparkle-3">✨</div>
        <div className="animate-sparkle-4">⭐</div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Navbar } from "@/components/navigation/navbar";
import { login, getCurrentUser, getDefaultCredentials } from "@/lib/auth";
import { Alert, AlertDescription } from "@/components/ui/alert";
import ASCIIText from "@/components/ui/ascii-text";

export default function Login() {
  const navigate = useNavigate();
  const existing = getCurrentUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (existing) {
    return <Navigate to="/" replace />;
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const res = login(email.trim(), password);
    if (!res) {
      setError("Identifiants invalides.");
      return;
    }
    navigate(res.redirectPath, { replace: true });
  };

  const examples = getDefaultCredentials();

  return (
    <div className="min-h-screen bg-gradient-secondary relative overflow-hidden">
      {/* Multiple ASCII Text Backgrounds */}
      <div className="absolute inset-0">
        {/* Grand LOGIN central */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px]">
          <ASCIIText 
            text="LOGIN" 
            asciiFontSize={12}
            textFontSize={200}
            textColor="#fdf9f3"
            planeBaseHeight={12}
            enableWaves={true}
          />
        </div>
        
        {/* LOGIN en haut à gauche */}
        <div className="absolute top-20 left-10 w-[300px] h-[300px]">
          <ASCIIText 
            text="LOGIN" 
            asciiFontSize={8}
            textFontSize={120}
            textColor="#e2e8f0"
            planeBaseHeight={8}
            enableWaves={true}
          />
        </div>
        
        {/* LOGIN en haut à droite */}
        <div className="absolute top-32 right-16 w-[250px] h-[250px]">
          <ASCIIText 
            text="LOGIN" 
            asciiFontSize={6}
            textFontSize={90}
            textColor="#cbd5e1"
            planeBaseHeight={6}
            enableWaves={true}
          />
        </div>
        
        {/* LOGIN en bas à gauche */}
        <div className="absolute bottom-32 left-20 w-[220px] h-[220px]">
          <ASCIIText 
            text="LOGIN" 
            asciiFontSize={6}
            textFontSize={80}
            textColor="#94a3b8"
            planeBaseHeight={6}
            enableWaves={true}
          />
        </div>
        
        {/* LOGIN en bas à droite */}
        <div className="absolute bottom-20 right-10 w-[280px] h-[280px]">
          <ASCIIText 
            text="LOGIN" 
            asciiFontSize={8}
            textFontSize={100}
            textColor="#a1a1aa"
            planeBaseHeight={8}
            enableWaves={true}
          />
        </div>
        
        {/* LOGIN au centre gauche */}
        <div className="absolute top-1/2 left-8 transform -translate-y-1/2 w-[200px] h-[200px]">
          <ASCIIText 
            text="LOGIN" 
            asciiFontSize={5}
            textFontSize={70}
            textColor="#d1d5db"
            planeBaseHeight={5}
            enableWaves={true}
          />
        </div>
        
        {/* LOGIN au centre droit */}
        <div className="absolute top-1/2 right-8 transform -translate-y-1/2 w-[200px] h-[200px]">
          <ASCIIText 
            text="LOGIN" 
            asciiFontSize={5}
            textFontSize={70}
            textColor="#d1d5db"
            planeBaseHeight={5}
            enableWaves={true}
          />
        </div>
        
        {/* LOGIN en haut centre */}
        <div className="absolute top-16 left-1/2 transform -translate-x-1/2 w-[180px] h-[180px]">
          <ASCIIText 
            text="LOGIN" 
            asciiFontSize={5}
            textFontSize={60}
            textColor="#e5e7eb"
            planeBaseHeight={5}
            enableWaves={true}
          />
        </div>
        
        {/* LOGIN en bas centre */}
        <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 w-[180px] h-[180px]">
          <ASCIIText 
            text="LOGIN" 
            asciiFontSize={5}
            textFontSize={60}
            textColor="#e5e7eb"
            planeBaseHeight={5}
            enableWaves={true}
          />
        </div>
        
        {/* LOGIN supplémentaires pour remplir */}
        <div className="absolute top-1/4 left-1/4 w-[150px] h-[150px]">
          <ASCIIText 
            text="LOGIN" 
            asciiFontSize={4}
            textFontSize={50}
            textColor="#f3f4f6"
            planeBaseHeight={4}
            enableWaves={true}
          />
        </div>
        
        <div className="absolute top-1/4 right-1/4 w-[150px] h-[150px]">
          <ASCIIText 
            text="LOGIN" 
            asciiFontSize={4}
            textFontSize={50}
            textColor="#f3f4f6"
            planeBaseHeight={4}
            enableWaves={true}
          />
        </div>
        
        <div className="absolute bottom-1/4 left-1/4 w-[150px] h-[150px]">
          <ASCIIText 
            text="LOGIN" 
            asciiFontSize={4}
            textFontSize={50}
            textColor="#f3f4f6"
            planeBaseHeight={4}
            enableWaves={true}
          />
        </div>
        
        <div className="absolute bottom-1/4 right-1/4 w-[150px] h-[150px]">
          <ASCIIText 
            text="LOGIN" 
            asciiFontSize={4}
            textFontSize={50}
            textColor="#f3f4f6"
            planeBaseHeight={4}
            enableWaves={true}
          />
        </div>
      </div>
      
      <Navbar />
      <main className="container mx-auto px-4 py-10 max-w-lg relative z-10">
        <Card className="shadow-lg bg-white/90 backdrop-blur-sm">
          <CardContent className="p-8">
            <h1 className="text-2xl font-bold mb-2">Connexion</h1>
            <p className="text-muted-foreground mb-6">Accédez à votre espace.</p>

            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={onSubmit} className="space-y-4">
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

              <Button type="submit" className="w-full bg-gradient-primary">Se connecter</Button>
            </form>

            <div className="mt-6">
              <p className="text-sm text-muted-foreground mb-2">Comptes de démonstration:</p>
              <div className="space-y-2">
                {examples.map((u) => (
                  <div key={u.email} className="flex items-center justify-between text-sm p-2 bg-muted/50 rounded">
                    <span className="font-medium">{u.role === "student" ? "Apprenant" : u.role === "formateur" ? "Formateur" : u.role === "client" ? "Client" : u.role === "admin" ? "Admin" : u.role}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">{u.email} / {u.password}</span>
                      <Button size="sm" variant="outline" onClick={() => { setEmail(u.email); setPassword(u.password); }}>
                        Remplir
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}





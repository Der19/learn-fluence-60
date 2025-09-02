import { Navbar } from "@/components/navigation/navbar";
import { StatsCard } from "@/components/dashboard/stats-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Trophy, Clock, CreditCard, Play, Star } from "lucide-react";

export default function StudentDashboard() {
  return (
    <div className="min-h-screen bg-gradient-secondary">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Module Exploitation
          </h1>
          <p className="text-muted-foreground">
            Espace apprenant - Mes formations et progression
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Formations Actives"
            value="6"
            change="2 en cours"
            icon={BookOpen}
            variant="primary"
          />
          <StatsCard
            title="Crédits Restants"
            value="127"
            change="Expire dans 45j"
            icon={CreditCard}
            variant="warning"
          />
          <StatsCard
            title="Heures Étudiées"
            value="48h"
            change="+8h cette semaine"
            icon={Clock}
            variant="info"
          />
          <StatsCard
            title="Certifications"
            value="3"
            change="2 en progression"
            icon={Trophy}
            variant="success"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Mes Formations */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2 text-primary" />
                  Mes Formations en Cours
                </div>
                <Button size="sm" variant="outline">
                  Voir Toutes
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-semibold">Développement Web Avancé</h4>
                      <p className="text-sm text-muted-foreground">Prof. Martin Dubois</p>
                    </div>
                    <Badge className="bg-gradient-primary">En cours</Badge>
                  </div>
                  <div className="flex items-center space-x-4 mb-3">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Play className="h-4 w-4 mr-1" />
                      8/12 modules
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 mr-1" />
                      24h restantes
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Star className="h-4 w-4 mr-1 text-warning fill-current" />
                      4.8/5
                    </div>
                  </div>
                  <div className="space-y-2 mb-3">
                    <div className="flex justify-between text-sm">
                      <span>Progression</span>
                      <span>67%</span>
                    </div>
                    <Progress value={67} className="h-2" />
                  </div>
                  <Button className="w-full bg-gradient-primary">
                    Continuer le Cours
                  </Button>
                </div>

                <div className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-semibold">Base de Données MySQL</h4>
                      <p className="text-sm text-muted-foreground">Prof. Sarah Johnson</p>
                    </div>
                    <Badge variant="secondary">Pause</Badge>
                  </div>
                  <div className="flex items-center space-x-4 mb-3">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Play className="h-4 w-4 mr-1" />
                      3/8 modules
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 mr-1" />
                      16h restantes
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Star className="h-4 w-4 mr-1 text-warning fill-current" />
                      4.6/5
                    </div>
                  </div>
                  <div className="space-y-2 mb-3">
                    <div className="flex justify-between text-sm">
                      <span>Progression</span>
                      <span>38%</span>
                    </div>
                    <Progress value={38} className="h-2" />
                  </div>
                  <Button variant="outline" className="w-full">
                    Reprendre le Cours
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quiz Disponibles */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Trophy className="h-5 w-5 mr-2 text-success" />
                  Quiz Disponibles
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-success/10 border border-success/20 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-sm">Examen JS</p>
                      <Badge variant="outline" className="text-xs">Exercice</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      Durée: 45min • 20 questions
                    </p>
                    <Button size="sm" className="w-full bg-gradient-accent">
                      Commencer
                    </Button>
                  </div>
                  
                  <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-sm">Projet BDD</p>
                      <Badge variant="outline" className="text-xs">Devoir</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      À rendre avant: 15/02
                    </p>
                    <Button size="sm" variant="outline" className="w-full">
                      Voir Consignes
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Mes Résultats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="h-5 w-5 mr-2 text-warning" />
                  Derniers Résultats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">QCM React</p>
                      <p className="text-xs text-muted-foreground">Il y a 2 jours</p>
                    </div>
                    <Badge className="bg-success">18/20</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">TP Node.js</p>
                      <p className="text-xs text-muted-foreground">Il y a 1 semaine</p>
                    </div>
                    <Badge className="bg-success">16/20</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">Projet HTML/CSS</p>
                      <p className="text-xs text-muted-foreground">Il y a 2 semaines</p>
                    </div>
                    <Badge className="bg-warning">14/20</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
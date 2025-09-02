import { Navbar } from "@/components/navigation/navbar";
import { StatsCard } from "@/components/dashboard/stats-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Users, ClipboardCheck, Award, Play, MessageSquare } from "lucide-react";

export default function TeacherDashboard() {
  return (
    <div className="min-h-screen bg-gradient-secondary">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Module Configuration
          </h1>
          <p className="text-muted-foreground">
            Espace enseignant - Gestion des cours et évaluations
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Mes Cours"
            value="24"
            change="3 en préparation"
            icon={BookOpen}
            variant="primary"
          />
          <StatsCard
            title="Apprenants Actifs"
            value="189"
            change="+15 ce mois"
            icon={Users}
            variant="success"
          />
          <StatsCard
            title="Quiz en Cours"
            value="8"
            change="2 à corriger"
            icon={ClipboardCheck}
            variant="warning"
          />
          <StatsCard
            title="Certifications"
            value="45"
            change="+12 délivrées"
            icon={Award}
            variant="success"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Mes Cours */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2 text-primary" />
                  Mes Formations
                </div>
                <Button size="sm" className="bg-gradient-primary">
                  Nouveau Cours
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-semibold">Développement Web Avancé</h4>
                      <p className="text-sm text-muted-foreground">UV: PROG-301</p>
                    </div>
                    <Badge variant="secondary">Publié</Badge>
                  </div>
                  <div className="flex items-center space-x-4 mb-3">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Users className="h-4 w-4 mr-1" />
                      42 apprenants
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Play className="h-4 w-4 mr-1" />
                      12 modules
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progression moyenne</span>
                      <span>78%</span>
                    </div>
                    <Progress value={78} className="h-2" />
                  </div>
                </div>

                <div className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-semibold">Base de Données</h4>
                      <p className="text-sm text-muted-foreground">UV: BDD-201</p>
                    </div>
                    <Badge variant="outline">En préparation</Badge>
                  </div>
                  <div className="flex items-center space-x-4 mb-3">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Users className="h-4 w-4 mr-1" />
                      28 apprenants
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Play className="h-4 w-4 mr-1" />
                      8 modules
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progression moyenne</span>
                      <span>45%</span>
                    </div>
                    <Progress value={45} className="h-2" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions Rapides */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ClipboardCheck className="h-5 w-5 mr-2 text-warning" />
                  Quiz à Corriger
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-warning/10 border border-warning/20 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">Devoir JS Avancé</p>
                      <p className="text-xs text-muted-foreground">12 copies</p>
                    </div>
                    <Button size="sm" variant="outline">
                      Corriger
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-info/10 border border-info/20 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">QCM React</p>
                      <p className="text-xs text-muted-foreground">8 copies</p>
                    </div>
                    <Button size="sm" variant="outline">
                      Corriger
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2 text-info" />
                  Forum & Messages
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="font-medium text-sm mb-1">
                      Nouvelle question
                    </p>
                    <p className="text-xs text-muted-foreground">
                      "Comment implémenter les hooks ?"
                    </p>
                    <Button size="sm" variant="ghost" className="mt-2 p-0 h-auto">
                      Répondre →
                    </Button>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="font-medium text-sm mb-1">
                      Discussion active
                    </p>
                    <p className="text-xs text-muted-foreground">
                      "Projet final - conseils"
                    </p>
                    <Button size="sm" variant="ghost" className="mt-2 p-0 h-auto">
                      Voir →
                    </Button>
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
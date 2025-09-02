import { Navbar } from "@/components/navigation/navbar";
import { StatsCard } from "@/components/dashboard/stats-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, School, BookOpen, CreditCard, TrendingUp, AlertCircle } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gradient-secondary">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Module Paramétrage
          </h1>
          <p className="text-muted-foreground">
            Tableau de bord administrateur - Gestion globale de la plateforme
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Clients Actifs"
            value="1,248"
            change="+12% ce mois"
            icon={Users}
            variant="success"
          />
          <StatsCard
            title="Écoles Partenaires"
            value="87"
            change="+3 nouvelles"
            icon={School}
            variant="info"
          />
          <StatsCard
            title="Formations Actives"
            value="342"
            change="+18 publiées"
            icon={BookOpen}
            variant="primary"
          />
          <StatsCard
            title="CA ce mois"
            value="145k€"
            change="+25% vs dernier mois"
            icon={CreditCard}
            variant="success"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Gestion des Tables */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-primary" />
                Gestion des Tables de Référence
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <span className="font-medium">Fonctions</span>
                    <Badge variant="secondary">12 actives</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <span className="font-medium">Statuts Contenu</span>
                    <Badge variant="secondary">5 types</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <span className="font-medium">Profils</span>
                    <Badge variant="secondary">8 profils</Badge>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <span className="font-medium">Thèmes</span>
                    <Badge variant="secondary">24 thèmes</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <span className="font-medium">Types Quiz</span>
                    <Badge variant="secondary">2 types</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <span className="font-medium">Modes Paiement</span>
                    <Badge variant="secondary">3 modes</Badge>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex space-x-3">
                <Button className="bg-gradient-primary">
                  Modifier Tables
                </Button>
                <Button variant="outline">
                  Exporter Config
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Alertes et Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertCircle className="h-5 w-5 mr-2 text-warning" />
                Alertes Système
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg">
                  <div className="flex items-center mb-2">
                    <div className="w-2 h-2 bg-warning rounded-full mr-2" />
                    <span className="font-medium text-sm">Maintenance</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Mise à jour prévue ce soir à 22h
                  </p>
                </div>
                
                <div className="p-3 bg-success/10 border border-success/20 rounded-lg">
                  <div className="flex items-center mb-2">
                    <div className="w-2 h-2 bg-success rounded-full mr-2" />
                    <span className="font-medium text-sm">Sauvegarde</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Backup automatique réussi
                  </p>
                </div>
                
                <div className="p-3 bg-info/10 border border-info/20 rounded-lg">
                  <div className="flex items-center mb-2">
                    <div className="w-2 h-2 bg-info rounded-full mr-2" />
                    <span className="font-medium text-sm">Nouveau client</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    École Supérieure inscrite
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
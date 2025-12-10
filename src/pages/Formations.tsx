import { Navbar } from "@/components/navigation/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell, TableCaption } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useMemo, useState } from "react";
import { formations, themes, sousThemes } from "@/lib/adminData";
import { getCurrentUser } from "@/lib/auth";
import { toast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BookOpen } from "lucide-react";

// Structure de données pour les cours par formation
const formationCours: Record<string, Array<{ code: string; titre: string; description: string; duree: string }>> = {
  "F-001": [
    { code: "C-001", titre: "Introduction à React", description: "Découvrez les bases de React et la création de composants", duree: "2h" },
    { code: "C-002", titre: "Les Hooks React", description: "Maîtrisez useState, useEffect et les hooks personnalisés", duree: "3h" },
    { code: "C-003", titre: "Routing avec React Router", description: "Apprenez à gérer la navigation dans votre application", duree: "2h30" },
  ],
  "F-002": [
    { code: "C-004", titre: "Introduction à Node.js", description: "Découvrez Node.js et son écosystème", duree: "2h" },
    { code: "C-005", titre: "Express.js - Les bases", description: "Créez votre première API REST avec Express", duree: "3h" },
    { code: "C-006", titre: "Middleware et authentification", description: "Gérez les middlewares et l'authentification JWT", duree: "2h30" },
  ],
  "F-003": [
    { code: "C-007", titre: "SQL - Les fondamentaux", description: "Apprenez les bases du langage SQL", duree: "2h" },
    { code: "C-008", titre: "Requêtes avancées", description: "Maîtrisez les JOIN, GROUP BY et sous-requêtes", duree: "3h" },
    { code: "C-009", titre: "Optimisation des performances", description: "Optimisez vos requêtes SQL pour de meilleures performances", duree: "2h30" },
  ],
  "F-004": [
    { code: "C-010", titre: "Principes de l'UX", description: "Découvrez les fondamentaux de l'expérience utilisateur", duree: "2h" },
    { code: "C-011", titre: "Recherche utilisateur", description: "Apprenez à mener des entretiens et des tests utilisateurs", duree: "3h" },
    { code: "C-012", titre: "Prototypage et wireframes", description: "Créez des prototypes efficaces avec Figma", duree: "2h30" },
  ],
};

export default function Formations() {
  const [search, setSearch] = useState("");
  const [theme, setTheme] = useState<string>("all");
  const [sousTheme, setSousTheme] = useState<string>("all");
  const [niveau, setNiveau] = useState<string>("all");
  const [type, setType] = useState<string>("all");

  const user = getCurrentUser();

  const [rows, setRows] = useState<any[]>(() => formations.map(f => ({ ...f })));
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<any>({ id: "", titre: "", themeCode: "", sousThemeCode: "", niveau: 1, type: "gratuite", resume: "" });
  const [coursDialogOpen, setCoursDialogOpen] = useState(false);
  const [selectedFormation, setSelectedFormation] = useState<any>(null);

  const sousThemesOptions = useMemo(() => sousThemes.filter(st => theme === "all" || st.themeCode === theme), [theme]);

  const filtered = useMemo(() => {
    return rows.filter(f => {
      if (search && !f.titre.toLowerCase().includes(search.toLowerCase())) return false;
      if (theme !== "all" && f.themeCode !== theme) return false;
      if (sousTheme !== "all" && f.sousThemeCode !== sousTheme) return false;
      if (niveau !== "all" && String((f as any).niveau ?? (f as any).priorite) !== niveau) return false;
      if (type !== "all" && f.type !== type) return false;
      return true;
    });
  }, [rows, search, theme, sousTheme, niveau, type]);

  const onAddClick = () => {
    if (user?.role === "admin" || user?.role === "formateur") {
      setOpen(true);
    } else {
      toast({ title: "Action réservée", description: "Cette action est réservée à l'admin et au formateur." });
    }
  };

  const saveFormation = () => {
    if (!draft.titre.trim() || !draft.themeCode) return;
    const id = draft.id?.trim() || `F-${String(rows.length + 1).padStart(3, "0")}`;
    const next = { ...draft, id };
    setRows(prev => [...prev, next]);
    // Créer au moins 3 cours par défaut pour la nouvelle formation
    if (!formationCours[id]) {
      formationCours[id] = [
        { code: `C-${String(Object.keys(formationCours).length * 3 + 1).padStart(3, "0")}`, titre: "Cours 1", description: "Description du cours 1", duree: "2h" },
        { code: `C-${String(Object.keys(formationCours).length * 3 + 2).padStart(3, "0")}`, titre: "Cours 2", description: "Description du cours 2", duree: "2h" },
        { code: `C-${String(Object.keys(formationCours).length * 3 + 3).padStart(3, "0")}`, titre: "Cours 3", description: "Description du cours 3", duree: "2h" },
      ];
    }
    setOpen(false);
    setDraft({ id: "", titre: "", themeCode: "", sousThemeCode: "", niveau: 1, type: "gratuite", resume: "" });
  };

  const openCoursDialog = (formation: any) => {
    setSelectedFormation(formation);
    setCoursDialogOpen(true);
  };

  const getFormationCours = (formationId: string) => {
    return formationCours[formationId] || [];
  };

  return (
    <div className="min-h-screen bg-gradient-secondary">
      <Navbar />
      <main className="container mx-auto px-4 py-8 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Toutes les formations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
              <Input placeholder="Rechercher par titre" value={search} onChange={(e)=>setSearch(e.target.value)} />
              <Select value={theme} onValueChange={(v)=>{ setTheme(v); setSousTheme("all"); }}>
                <SelectTrigger><SelectValue placeholder="Filtrer par Thème" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  {themes.map(t => (
                    <SelectItem key={t.code} value={t.code}>{t.libelle}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sousTheme} onValueChange={setSousTheme}>
                <SelectTrigger><SelectValue placeholder="Filtrer par Sous thème" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  {sousThemesOptions.map(st => (
                    <SelectItem key={st.code} value={st.code}>{st.libelle}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={niveau} onValueChange={setNiveau}>
                <SelectTrigger><SelectValue placeholder="Niveau" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="1">Débutant</SelectItem>
                  <SelectItem value="2">Intermédiaire</SelectItem>
                  <SelectItem value="3">Avancé</SelectItem>
                </SelectContent>
              </Select>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger><SelectValue placeholder="Type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="gratuite">Gratuite</SelectItem>
                  <SelectItem value="payante">Payante</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex justify-end">
                <Button className="bg-gradient-primary" onClick={onAddClick}>Ajouter</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-0 bg-gradient-to-r from-sky-600 to-blue-600 text-white rounded">
            <CardTitle>Liste des cours</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Titre</TableHead>
                  <TableHead>Thème</TableHead>
                  <TableHead>Sous thème</TableHead>
                  <TableHead>Niveau</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(f => (
                  <TableRow key={f.id}>
                    <TableCell className="font-medium">{f.titre}</TableCell>
                    <TableCell>{themes.find(t => t.code === f.themeCode)?.libelle ?? f.themeCode}</TableCell>
                    <TableCell>{sousThemes.find(st => st.code === f.sousThemeCode)?.libelle ?? f.sousThemeCode ?? "-"}</TableCell>
                    <TableCell>{((f as any).niveau ?? (f as any).priorite) === 1 ? "Débutant" : ((f as any).niveau ?? (f as any).priorite) === 2 ? "Intermédiaire" : "Avancé"}</TableCell>
                    <TableCell className="capitalize">{f.type}</TableCell>
                    <TableCell>
                      <div className="flex gap-2 items-center">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openCoursDialog(f)}
                        >
                          <BookOpen className="h-4 w-4 mr-1" />
                          Voir les cours
                        </Button>
                        {f.type === 'payante' && (
                          <Button
                            size="sm"
                            className="bg-gradient-primary"
                            onClick={() => {
                              if (user?.role !== 'student') {
                                toast({ title: "Action réservée", description: "Cette action est réservée aux apprenants." });
                                return;
                              }
                              toast({ title: "Achat", description: "Redirection vers le paiement (démo)." });
                            }}
                          >
                            Acheter la formation
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableCaption>Total: {filtered.length}</TableCaption>
            </Table>
          </CardContent>
        </Card>

        {/* Dialog pour afficher les cours d'une formation */}
        <Dialog open={coursDialogOpen} onOpenChange={setCoursDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                Cours de la formation : {selectedFormation?.titre}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              {selectedFormation && getFormationCours(selectedFormation.id).length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {getFormationCours(selectedFormation.id).map((cours, index) => (
                    <Card key={cours.code}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-sm font-medium text-muted-foreground">Cours {index + 1}</span>
                              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">{cours.duree}</span>
                            </div>
                            <h4 className="font-semibold text-lg mb-1">{cours.titre}</h4>
                            <p className="text-sm text-muted-foreground">{cours.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  Aucun cours disponible pour cette formation.
                </p>
              )}
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nouvelle formation</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input placeholder="Titre" value={draft.titre} onChange={(e)=>setDraft((p:any)=>({ ...p, titre: e.target.value }))} />
              <Select value={draft.themeCode} onValueChange={(v)=>{ setDraft((p:any)=>({ ...p, themeCode: v })); }}>
                <SelectTrigger><SelectValue placeholder="Thème" /></SelectTrigger>
                <SelectContent>
                  {themes.map(t => (<SelectItem key={t.code} value={t.code}>{t.libelle}</SelectItem>))}
                </SelectContent>
              </Select>
              <Select value={draft.sousThemeCode} onValueChange={(v)=>setDraft((p:any)=>({ ...p, sousThemeCode: v }))}>
                <SelectTrigger><SelectValue placeholder="Sous thème" /></SelectTrigger>
                <SelectContent>
                  {sousThemes.filter(st => !draft.themeCode || st.themeCode === draft.themeCode).map(st => (<SelectItem key={st.code} value={st.code}>{st.libelle}</SelectItem>))}
                </SelectContent>
              </Select>
              <Select value={String(draft.niveau)} onValueChange={(v)=>setDraft((p:any)=>({ ...p, niveau: Number(v)||1 }))}>
                <SelectTrigger><SelectValue placeholder="Niveau" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Débutant</SelectItem>
                  <SelectItem value="2">Intermédiaire</SelectItem>
                  <SelectItem value="3">Avancé</SelectItem>
                </SelectContent>
              </Select>
              <Select value={draft.type} onValueChange={(v)=>setDraft((p:any)=>({ ...p, type: v }))}>
                <SelectTrigger><SelectValue placeholder="Type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="gratuite">Gratuite</SelectItem>
                  <SelectItem value="payante">Payante</SelectItem>
                </SelectContent>
              </Select>
              <Input className="md:col-span-2" placeholder="Résumé" value={draft.resume} onChange={(e)=>setDraft((p:any)=>({ ...p, resume: e.target.value }))} />
            </div>
            <div className="flex justify-end gap-2 mt-3">
              <Button variant="outline" onClick={()=>setOpen(false)}>Annuler</Button>
              <Button className="bg-gradient-primary" onClick={saveFormation}>Enregistrer</Button>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}





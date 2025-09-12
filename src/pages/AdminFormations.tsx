import { Navbar } from "@/components/navigation/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell, TableCaption } from "@/components/ui/table";
import { useMemo, useState } from "react";
import { formations as initialFormations, themes } from "@/lib/adminData";
import { sousThemes } from "@/lib/adminData";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function AdminFormations() {
  const [search, setSearch] = useState("");
  const [theme, setTheme] = useState<string>("all");
  const [sousTheme, setSousTheme] = useState<string>("all");
  const [niveau, setNiveau] = useState<string>("all");
  const [type, setType] = useState<string>("all");

  const [rows, setRows] = useState<any[]>(() => initialFormations.map(f => ({ ...f })));
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<any>({ id: "", titre: "", themeCode: "", sousThemeCode: "", niveau: 1, type: "gratuite", resume: "" });

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

  const saveFormation = () => {
    if (!draft.titre.trim() || !draft.themeCode) return;
    const id = draft.id?.trim() || `F-${String(rows.length + 1).padStart(3, "0")}`;
    const next = { ...draft, id };
    setRows(prev => [...prev, next]);
    setOpen(false);
    setDraft({ id: "", titre: "", themeCode: "", sousThemeCode: "", niveau: 1, type: "gratuite", resume: "" });
  };

  return (
    <div className="min-h-screen bg-gradient-secondary">
      <Navbar />
      <main className="container mx-auto px-4 py-8 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Formations proposées</CardTitle>
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
                <Button className="bg-gradient-primary" onClick={()=>setOpen(true)}>Ajouter</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-0 bg-gradient-to-r from-sky-600 to-blue-600 text-white rounded">
            <CardTitle>Liste des formations</CardTitle>
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
                  </TableRow>
                ))}
              </TableBody>
              <TableCaption>Total: {filtered.length}</TableCaption>
            </Table>
          </CardContent>
        </Card>

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



import { Navbar } from "@/components/navigation/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { useMemo, useState, useEffect } from "react";
import { uvs, cours, modulesCours } from "@/lib/adminData";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const LS_KEY = "teacher:modules";

type CourseRow = { id: string; uvCode: string; titre: string; nbModules: number };

type StoredModule = { id: string; code: string; libelle: string; coursCode: string; ordre?: number; description?: string; presentationEcrite?: string; lienTeaserModule?: string; lienPlaylistModule?: string };

export default function TeacherCourses() {
  const navigate = useNavigate();
  const [rows, setRows] = useState<CourseRow[]>(() =>
    cours.map(c => ({ id: c.code, uvCode: c.uvCode, titre: c.libelle, nbModules: modulesCours.filter(m => m.coursCode === c.code).length }))
  );
  const [filter, setFilter] = useState("");
  const displayed = useMemo(() => rows.filter(r => !filter || r.titre.toLowerCase().includes(filter.toLowerCase()) || r.uvCode.toLowerCase().includes(filter.toLowerCase())), [rows, filter]);

  // Load persisted modules to update counts
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) return;
      const stored: StoredModule[] = JSON.parse(raw);
      setRows(prev => prev.map(r => ({ ...r, nbModules: stored.filter(m => m.coursCode === r.id).length })));
    } catch {}
  }, []);

  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<CourseRow>({ id: "", uvCode: "", titre: "", nbModules: 0 });

  const openAdd = () => setOpen(true);
  const saveCourse = () => {
    if (!draft.uvCode || !draft.titre.trim()) return;
    setRows(prev => [...prev, { ...draft, id: crypto.randomUUID(), titre: draft.titre.trim(), nbModules: Number(draft.nbModules)||0 }]);
    setDraft({ id: "", uvCode: "", titre: "", nbModules: 0 });
    setOpen(false);
  };

  const remove = (id: string) => setRows(prev => prev.filter(r => r.id !== id));

  // Voir dialog state
  const [viewOpen, setViewOpen] = useState(false);
  const [viewData, setViewData] = useState<any | null>(null);
  const onView = (row: CourseRow) => {
    const found = cours.find(c => c.code === row.id);
    setViewData({
      code: found?.code ?? row.id,
      libelle: found?.libelle ?? row.titre,
      description: found?.description ?? "-",
      presentationEcrite: found?.presentationEcrite ?? "-",
      lienTeaserCours: found?.lienTeaserCours ?? "-",
      lienPlaylistCours: found?.lienPlaylistCours ?? "-",
      uvCode: found?.uvCode ?? row.uvCode,
      enseignant: found?.enseignant ?? "-",
      coefficient: found?.coefficient ?? "-",
      ordre: found?.ordre ?? "-",
    });
    setViewOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-secondary">
      <Navbar />
      <main className="container mx-auto px-4 py-8 space-y-6">
        <Card>
          <CardHeader className="border-0 bg-gradient-to-r from-sky-600 to-blue-600 text-white rounded">
            <CardTitle>Gestion des cours (par UV et modules)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-end mt-4">
              <Input placeholder="Filtrer (UV/Titre)" className="w-64" value={filter} onChange={(e)=>setFilter(e.target.value)} />
            </div>
            <div className="flex justify-end mt-4">
              <Button className="bg-gradient-primary" onClick={openAdd}>Ajouter</Button>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>UV</TableHead>
                  <TableHead>Titre</TableHead>
                  <TableHead>Modules</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayed.map(r => (
                  <TableRow key={r.id}>
                    <TableCell>{r.uvCode}</TableCell>
                    <TableCell>{r.titre}</TableCell>
                    <TableCell>{r.nbModules}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={()=>onView(r)}>Voir</Button>
                        <Button size="sm" onClick={()=>navigate(`/teacher/courses/${r.id}/modules`, { state: { course: r } })}>Modules</Button>
                        <Button size="sm" variant="destructive" onClick={()=>remove(r.id)}>Supprimer</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nouveau cours</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-sm font-medium">Sélectionner une UV</label>
                <Select value={draft.uvCode} onValueChange={(v)=>setDraft(prev=>({ ...prev, uvCode: v }))}>
                  <SelectTrigger className="w-full"><SelectValue placeholder="Sélectionner une UV" /></SelectTrigger>
                  <SelectContent>
                    {uvs.map(u => (<SelectItem key={u.code} value={u.code}>{u.code} - {u.libelle}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Titre du cours</label>
                <Input placeholder="Titre du cours" value={draft.titre} onChange={(e)=>setDraft(prev=>({ ...prev, titre: e.target.value }))} />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Nombre de modules</label>
                <Input type="number" placeholder="Nombre de modules" value={draft.nbModules} onChange={(e)=>setDraft(prev=>({ ...prev, nbModules: Number(e.target.value)||0 }))} />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={()=>setOpen(false)}>Annuler</Button>
                <Button className="bg-gradient-primary" onClick={saveCourse}>Enregistrer</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={viewOpen} onOpenChange={setViewOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Détails du cours</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div><strong>Code:</strong> {viewData?.code}</div>
              <div><strong>Libellé:</strong> {viewData?.libelle}</div>
              <div className="md:col-span-2"><strong>Description:</strong> {viewData?.description}</div>
              <div className="md:col-span-2"><strong>Présentation écrite:</strong> {viewData?.presentationEcrite}</div>
              <div className="md:col-span-2"><strong>Lien teaser Cours:</strong> {viewData?.lienTeaserCours}</div>
              <div className="md:col-span-2"><strong>Lien playlist Cours:</strong> {viewData?.lienPlaylistCours}</div>
              <div><strong>UV:</strong> {viewData?.uvCode}</div>
              <div><strong>Formateur:</strong> {viewData?.enseignant}</div>
              <div><strong>Coefficient:</strong> {viewData?.coefficient}</div>
              <div><strong>Ordre:</strong> {viewData?.ordre}</div>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}



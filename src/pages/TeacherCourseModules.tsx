import { Navbar } from "@/components/navigation/navbar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useMemo, useState, useEffect } from "react";

const LS_KEY = "teacher:modules";

type ModuleRow = { id: string; code: string; libelle: string; description?: string; presentationEcrite?: string; lienTeaserModule?: string; lienPlaylistModule?: string; coursCode?: string; ordre?: number };

export default function TeacherCourseModules() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation() as any;
  const course = location.state?.course as { id: string; uvCode: string; titre: string } | undefined;
  const coursCode = course?.id || id || "";
  const [rows, setRows] = useState<ModuleRow[]>([]);
  const [draft, setDraft] = useState<ModuleRow>({ id: "", code: "", libelle: "", description: "", presentationEcrite: "", lienTeaserModule: "", lienPlaylistModule: "", ordre: 1 });
  const [editing, setEditing] = useState<ModuleRow | null>(null);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) return;
      const stored: ModuleRow[] = JSON.parse(raw);
      setRows(stored.filter(m => m.coursCode === coursCode));
    } catch {}
  }, [coursCode]);

  const persist = (list: ModuleRow[]) => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      const all: ModuleRow[] = raw ? JSON.parse(raw) : [];
      const others = all.filter(m => m.coursCode !== coursCode);
      localStorage.setItem(LS_KEY, JSON.stringify([...others, ...list]));
    } catch {}
  };

  const displayed = useMemo(() => rows.filter(r => !filter || r.code.toLowerCase().includes(filter.toLowerCase()) || r.libelle.toLowerCase().includes(filter.toLowerCase())), [rows, filter]);

  const add = () => {
    if (!draft.code.trim() || !draft.libelle.trim()) return;
    const next = { ...draft, id: crypto.randomUUID(), code: draft.code.trim(), libelle: draft.libelle.trim(), coursCode };
    const list = [...rows, next];
    setRows(list);
    persist(list);
    setDraft({ id: "", code: "", libelle: "", description: "", presentationEcrite: "", lienTeaserModule: "", lienPlaylistModule: "", ordre: 1 });
  };
  const remove = (mid: string) => {
    const list = rows.filter(r => r.id !== mid);
    setRows(list);
    persist(list);
  };
  const saveEdit = () => {
    if (!editing) return;
    const list = rows.map(r => r.id === editing.id ? { ...editing } : r);
    setRows(list);
    persist(list);
    setEditing(null);
  };

  return (
    <div className="min-h-screen bg-gradient-secondary">
      <Navbar />
      <main className="container mx-auto px-4 py-8 space-y-6">
        <Card>
          <CardHeader className="border-0 bg-gradient-to-r from-sky-600 to-blue-600 text-white rounded">
            <CardTitle>Modules du cours {course?.titre || id}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
              <Input placeholder="Code module" value={draft.code} onChange={(e)=>setDraft(prev=>({ ...prev, code: e.target.value }))} />
              <Input placeholder="Libellé module" value={draft.libelle} onChange={(e)=>setDraft(prev=>({ ...prev, libelle: e.target.value }))} />
              <Input className="md:col-span-2" placeholder="Description" value={draft.description||""} onChange={(e)=>setDraft(prev=>({ ...prev, description: e.target.value }))} />
              <Input className="md:col-span-2" placeholder="Présentation écrite" value={draft.presentationEcrite||""} onChange={(e)=>setDraft(prev=>({ ...prev, presentationEcrite: e.target.value }))} />
              <Input placeholder="Lien teaser" value={draft.lienTeaserModule||""} onChange={(e)=>setDraft(prev=>({ ...prev, lienTeaserModule: e.target.value }))} />
              <Input placeholder="Lien playlist" value={draft.lienPlaylistModule||""} onChange={(e)=>setDraft(prev=>({ ...prev, lienPlaylistModule: e.target.value }))} />
              <Input type="number" placeholder="Ordre" value={draft.ordre||0} onChange={(e)=>setDraft(prev=>({ ...prev, ordre: Number(e.target.value)||0 }))} />
              <div className="flex justify-end"><Button className="bg-gradient-primary" onClick={add}>Ajouter</Button></div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={()=>navigate(-1)}>Retour</Button>
              <Input placeholder="Filtrer (code/libellé)" className="w-64" value={filter} onChange={(e)=>setFilter(e.target.value)} />
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Libellé</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayed.map(m => (
                  <TableRow key={m.id}>
                    <TableCell>{m.code}</TableCell>
                    <TableCell>{m.libelle}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={()=>setEditing(m)}>Modifier</Button>
                        <Button size="sm" variant="destructive" onClick={()=>remove(m.id)}>Supprimer</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {editing && (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 bg-white/60 p-3 rounded">
                <Input placeholder="Code module" value={editing.code} onChange={(e)=>setEditing(prev=>({ ...prev!, code: e.target.value }))} />
                <Input placeholder="Libellé module" value={editing.libelle} onChange={(e)=>setEditing(prev=>({ ...prev!, libelle: e.target.value }))} />
                <Input className="md:col-span-2" placeholder="Description" value={editing.description||""} onChange={(e)=>setEditing(prev=>({ ...prev!, description: e.target.value }))} />
                <Input className="md:col-span-2" placeholder="Présentation écrite" value={editing.presentationEcrite||""} onChange={(e)=>setEditing(prev=>({ ...prev!, presentationEcrite: e.target.value }))} />
                <Input placeholder="Lien teaser" value={editing.lienTeaserModule||""} onChange={(e)=>setEditing(prev=>({ ...prev!, lienTeaserModule: e.target.value }))} />
                <Input placeholder="Lien playlist" value={editing.lienPlaylistModule||""} onChange={(e)=>setEditing(prev=>({ ...prev!, lienPlaylistModule: e.target.value }))} />
                <Input type="number" placeholder="Ordre" value={editing.ordre||0} onChange={(e)=>setEditing(prev=>({ ...prev!, ordre: Number(e.target.value)||0 }))} />
                <div className="flex justify-end gap-2 md:col-span-2">
                  <Button variant="outline" onClick={()=>setEditing(null)}>Annuler</Button>
                  <Button className="bg-gradient-primary" onClick={saveEdit}>Enregistrer</Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}



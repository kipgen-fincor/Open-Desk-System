import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { supabase, type OfficeHoliday } from "@/lib/supabase";
import { formatDateLong } from "@/lib/date-utils";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/holidays")({
  component: HolidaysAdmin,
});

function HolidaysAdmin() {
  const qc = useQueryClient();
  const [date, setDate] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  const { data: holidays = [] } = useQuery({
    queryKey: ["admin-holidays"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("office_holidays")
        .select("*")
        .order("holiday_date", { ascending: true });
      if (error) throw error;
      return data as OfficeHoliday[];
    },
  });

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const trimmed = name.trim();
    const { error } = await supabase.from("office_holidays").insert({
      holiday_date: date,
      holiday_name: trimmed,
      description: trimmed,
    });
    setBusy(false);
    if (error) toast.error(error.message);
    else {
      toast.success("Holiday added");
      setDate(""); setName("");
      qc.invalidateQueries({ queryKey: ["admin-holidays"] });
    }
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("office_holidays").delete().eq("id", id);
    if (error) toast.error(error.message);
    else qc.invalidateQueries({ queryKey: ["admin-holidays"] });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
      <Card className="p-5">
        <h2 className="mb-4 text-base font-semibold">Add holiday</h2>
        <form onSubmit={create} className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="hd">Date</Label>
            <Input id="hd" type="date" required value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="hn">Name</Label>
            <Input id="hn" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Republic Day" />
          </div>
          <Button type="submit" className="w-full" disabled={busy}>
            {busy ? "Adding…" : "Add holiday"}
          </Button>
        </form>
      </Card>

      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {holidays.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-sm text-muted-foreground">
                  No holidays set.
                </TableCell>
              </TableRow>
            ) : holidays.map((h) => (
              <TableRow key={h.id}>
                <TableCell className="font-medium">{formatDateLong(h.holiday_date)}</TableCell>
                <TableCell>{h.holiday_name}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" onClick={() => remove(h.id)} aria-label="Delete">
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

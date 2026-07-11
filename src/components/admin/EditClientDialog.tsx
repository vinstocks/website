import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import type { Profile } from "@/lib/types";

interface EditClientDialogProps {
  client: Profile;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved?: () => void;
}

const EditClientDialog = ({ client, open, onOpenChange, onSaved }: EditClientDialogProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState(client.full_name);
  const [email, setEmail] = useState(client.email);
  const [phone, setPhone] = useState(client.phone || "");
  const [plan, setPlan] = useState(client.plan);
  const [hasStars, setHasStars] = useState(client.has_stars);
  const [allocatedAmount, setAllocatedAmount] = useState(String(client.allocated_amount || ""));
  const [starsAllocatedAmount, setStarsAllocatedAmount] = useState(String(client.stars_allocated_amount || ""));
  const [planStartDate, setPlanStartDate] = useState(client.plan_start_date?.split("T")[0] || "");
  const [newPassword, setNewPassword] = useState("");

  // Re-sync form when a different client is opened
  useEffect(() => {
    setFullName(client.full_name);
    setEmail(client.email);
    setPhone(client.phone || "");
    setPlan(client.plan);
    setHasStars(client.has_stars);
    setAllocatedAmount(String(client.allocated_amount || ""));
    setStarsAllocatedAmount(String(client.stars_allocated_amount || ""));
    setPlanStartDate(client.plan_start_date?.split("T")[0] || "");
    setNewPassword("");
  }, [client]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await supabase.functions.invoke("update-client", {
        body: {
          client_id: client.id,
          full_name: fullName,
          email,
          phone,
          plan,
          has_stars: plan === "stars" ? true : hasStars,
          allocated_amount: allocatedAmount ? Number(allocatedAmount) : 0,
          stars_allocated_amount: starsAllocatedAmount ? Number(starsAllocatedAmount) : null,
          plan_start_date: planStartDate || undefined,
          ...(newPassword ? { password: newPassword } : {}),
        },
      });
      if (res.error) throw new Error(res.error.message);
      if (res.data?.error) throw new Error(res.data.error);

      toast({ title: "Client updated", description: `${fullName}'s details saved.` });
      onOpenChange(false);
      onSaved?.();
    } catch (err: any) {
      toast({ title: "Failed to update client", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Client</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label htmlFor="edit-name">Full Name</Label>
            <Input id="edit-name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-email">Email</Label>
            <Input id="edit-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <p className="text-[11px] text-muted-foreground">Changing this changes their login email.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-phone">Phone</Label>
            <Input id="edit-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Plan</Label>
              <Select value={plan} onValueChange={(v: Profile["plan"]) => setPlan(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="elite">Elite (≥ ₹25L)</SelectItem>
                  <SelectItem value="prime">Prime (&lt; ₹25L)</SelectItem>
                  <SelectItem value="checkup">Portfolio Checkup</SelectItem>
                  <SelectItem value="stars">Stars Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-start">Plan Start Date</Label>
              <Input id="edit-start" type="date" value={planStartDate} onChange={(e) => setPlanStartDate(e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-allocated">Allocated Amount (₹)</Label>
              <Input id="edit-allocated" type="number" value={allocatedAmount} onChange={(e) => setAllocatedAmount(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-stars-allocated">Stars Allocated (₹)</Label>
              <Input id="edit-stars-allocated" type="number" value={starsAllocatedAmount} onChange={(e) => setStarsAllocatedAmount(e.target.value)} />
            </div>
          </div>

          {plan !== "stars" && (
            <div className="flex items-center justify-between rounded-lg border border-border p-3">
              <div>
                <Label className="text-sm font-medium">Stars Add-on</Label>
                <p className="text-xs text-muted-foreground">Mid-term stock recommendations</p>
              </div>
              <Switch checked={hasStars} onCheckedChange={setHasStars} />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="edit-password">Reset Password <span className="text-muted-foreground font-normal">(leave blank to keep current)</span></Label>
            <Input id="edit-password" type="text" placeholder="New password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} minLength={6} />
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditClientDialog;

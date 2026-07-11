import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";

interface CreateClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClientCreated?: () => void;
}

const CreateClientDialog = ({ open, onOpenChange, onClientCreated }: CreateClientDialogProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [plan, setPlan] = useState("prime");
  const [allocatedAmount, setAllocatedAmount] = useState("");
  const [hasStars, setHasStars] = useState(false);

  const resetForm = () => {
    setFullName("");
    setEmail("");
    setPhone("");
    setPassword("");
    setPlan("prime");
    setAllocatedAmount("");
    setHasStars(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const starsOnly = plan === "stars";
      const res = await supabase.functions.invoke("create-client", {
        body: {
          full_name: fullName,
          email,
          phone,
          password,
          plan,
          has_stars: hasStars || starsOnly,
          allocated_amount: starsOnly ? 0 : allocatedAmount ? Number(allocatedAmount) : 0,
          stars_allocated_amount: starsOnly && allocatedAmount ? Number(allocatedAmount) : null,
        },
      });

      if (res.error) throw new Error(res.error.message);
      if (res.data?.error) throw new Error(res.data.error);

      toast({
        title: "Client created",
        description: `Account for ${fullName} (${email}) has been created. Share the password with the client.`,
      });
      resetForm();
      onOpenChange(false);
      onClientCreated?.();
    } catch (err: any) {
      toast({
        title: "Failed to create client",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Client</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" placeholder="Client's full name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="client@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" type="tel" placeholder="+91 9876543210" value={phone} onChange={(e) => setPhone(e.target.value)} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="text" placeholder="Set login password for client" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
          </div>

          <div className="space-y-2">
            <Label>Plan</Label>
            <Select value={plan} onValueChange={setPlan}>
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
            <Label htmlFor="allocated">Allocated Amount (₹) <span className="text-muted-foreground font-normal">(optional)</span></Label>
            <Input id="allocated" type="number" placeholder="Can be set later" value={allocatedAmount} onChange={(e) => setAllocatedAmount(e.target.value)} />
          </div>

          {plan !== "stars" && (
            <div className="flex items-center justify-between rounded-lg border border-border p-3">
              <div>
                <Label htmlFor="stars" className="text-sm font-medium">Stars Add-on</Label>
                <p className="text-xs text-muted-foreground">Enable mid-term stock recommendations</p>
              </div>
              <Switch id="stars" checked={hasStars} onCheckedChange={setHasStars} />
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? "Creating..." : "Create Client"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateClientDialog;

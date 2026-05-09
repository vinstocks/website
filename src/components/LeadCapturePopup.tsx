import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const LEAD_POPUP_STATUS_KEY = "vinstocksLeadPopupStatus";
const WHATSAPP_NUMBER = "917977524553";
const INDIA_DIAL_CODE = "+91";
const POPUP_COOLDOWN_MS = 24 * 60 * 60 * 1000;

const LeadCapturePopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [nameError, setNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const normalizeIndianPhoneDigits = (value: string) => {
    let digits = value.replace(/\D/g, "");

    if (digits.startsWith("91") && digits.length > 10) {
      digits = digits.slice(2);
    }

    return digits.slice(0, 10);
  };

  useEffect(() => {
    const popupStatusRaw = localStorage.getItem(LEAD_POPUP_STATUS_KEY);

    if (popupStatusRaw) {
      try {
        const popupStatus = JSON.parse(popupStatusRaw) as { hiddenUntil?: number };
        if (popupStatus.hiddenUntil && Date.now() < popupStatus.hiddenUntil) return;
      } catch {
        // Backward compatibility for old string values in localStorage.
        localStorage.removeItem(LEAD_POPUP_STATUS_KEY);
      }
    }

    const timer = window.setTimeout(() => {
      setIsOpen(true);
    }, 15000);

    return () => window.clearTimeout(timer);
  }, []);

  const markPopupHandled = (status: "dismissed" | "submitted") => {
    localStorage.setItem(
      LEAD_POPUP_STATUS_KEY,
      JSON.stringify({
        status,
        hiddenUntil: Date.now() + POPUP_COOLDOWN_MS,
      }),
    );
  };

  const handleCancel = () => {
    markPopupHandled("dismissed");
    setIsOpen(false);
  };

  const handleDialogOpenChange = (open: boolean) => {
    if (!open) {
      handleCancel();
      return;
    }

    setIsOpen(open);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedName = fullName.trim();
    const digitsOnlyPhone = normalizeIndianPhoneDigits(phoneNumber);

    if (!trimmedName) {
      setNameError("Please enter your name.");
      return;
    }

    if (digitsOnlyPhone.length < 10) {
      setPhoneError("Please enter a valid phone number.");
      return;
    }

    setNameError("");
    setPhoneError("");

    const message = encodeURIComponent(
      `Hi Vinstocks, I want to start my wealth creation journey.\nName: ${trimmedName}\nPhone: ${INDIA_DIAL_CODE} ${digitsOnlyPhone}`,
    );
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
    const popupWindow = window.open(whatsappUrl, "_blank");

    // Fallback when popup blockers prevent opening a new tab.
    if (!popupWindow || popupWindow.closed || typeof popupWindow.closed === "undefined") {
      window.location.href = whatsappUrl;
    }

    markPopupHandled("submitted");
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Start Your Wealth Creation Journey</DialogTitle>
          <DialogDescription>
            Enter your name and number, and we will connect with you on WhatsApp.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="lead-name">Name</Label>
            <Input
              id="lead-name"
              type="text"
              value={fullName}
              onChange={(event) => {
                setFullName(event.target.value);
                if (nameError) setNameError("");
              }}
              placeholder="Enter your full name"
            />
            {nameError ? <p className="text-sm text-destructive">{nameError}</p> : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="lead-phone">Phone Number</Label>
            <div className="flex">
              <div className="inline-flex items-center rounded-l-md border border-r-0 border-input bg-muted px-3 text-sm text-muted-foreground">
                {INDIA_DIAL_CODE}
              </div>
              <Input
                id="lead-phone"
                type="text"
                inputMode="numeric"
                className="rounded-l-none"
                value={phoneNumber}
                onChange={(event) => {
                  setPhoneNumber(normalizeIndianPhoneDigits(event.target.value));
                  if (phoneError) setPhoneError("");
                }}
                placeholder="9876543210"
              />
            </div>
            {phoneError ? <p className="text-sm text-destructive">{phoneError}</p> : null}
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit">Send on WhatsApp</Button>
          </DialogFooter>
          <button
            type="button"
            onClick={handleCancel}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Not now
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LeadCapturePopup;

"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/hooks/use-toast";
import { addSavingsEntry } from "@/lib/storage";
import type { AssetType, GoldKarat } from "@/lib/types";

interface SavingsFormProps {
  onSavingsAdded: () => void;
}

export function SavingsForm({ onSavingsAdded }: SavingsFormProps) {
  const [assetType, setAssetType] = useState<AssetType>("currency");
  const [usdAmount, setUsdAmount] = useState("");
  const [goldGrams, setGoldGrams] = useState("");
  const [goldKarat, setGoldKarat] = useState<GoldKarat>("24k");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Enhanced validation for USD amounts
    if (assetType === "currency") {
      if (!usdAmount || usdAmount.trim() === "") {
        toast({
          title: "Error",
          description: "Please enter USD amount",
          variant: "destructive",
        });
        return;
      }

      const parsedAmount = Number.parseFloat(usdAmount);
      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        toast({
          title: "Error",
          description: "Please enter a valid USD amount greater than 0",
          variant: "destructive",
        });
        return;
      }
    }

    // Enhanced validation for gold amounts
    if (assetType === "gold") {
      if (!goldGrams || goldGrams.trim() === "") {
        toast({
          title: "Error",
          description: "Please enter gold amount in grams",
          variant: "destructive",
        });
        return;
      }

      const parsedGrams = Number.parseFloat(goldGrams);
      if (isNaN(parsedGrams) || parsedGrams <= 0) {
        toast({
          title: "Error",
          description:
            "Please enter a valid gold amount in grams greater than 0",
          variant: "destructive",
        });
        return;
      }
    }

    setIsLoading(true);

    try {
      const entryData: any = {
        assetType,
        usdAmount: assetType === "currency" ? Number.parseFloat(usdAmount) : 0,
        goldGrams: assetType === "gold" ? Number.parseFloat(goldGrams) : 0,
      };

      // Only include goldKarat if it's a gold entry
      if (assetType === "gold") {
        entryData.goldKarat = goldKarat;
      }

      const entryId = await addSavingsEntry(entryData);

      toast({
        title: "Success",
        description: `${
          assetType === "currency" ? "USD" : "Gold"
        } savings added successfully!`,
      });

      // Reset form
      setUsdAmount("");
      setGoldGrams("");
      setGoldKarat("24k");

      ("[v0] Savings added, refreshing...");
      onSavingsAdded();
    } catch (error: any) {
      console.error("[v0] Error adding savings:", error);

      // More specific error messages
      let errorMessage = "Failed to add savings entry. Please try again.";
      let isWarning = false;

      if (error.message?.includes("Data saved locally")) {
        errorMessage = error.message;
        isWarning = true;
      } else if (error.message?.includes("Firebase error")) {
        errorMessage =
          "Database connection issue. Please check your internet connection and try again.";
      } else if (error.message?.includes("permission")) {
        errorMessage = "Permission denied. Please check your account access.";
      }

      toast({
        title: isWarning ? "Warning" : "Error",
        description: errorMessage,
        variant: isWarning ? "default" : "destructive",
      });

      // If data was saved locally, still refresh the UI
      if (isWarning) {
        onSavingsAdded();
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-2xl">
          <span className="text-2xl">➕</span>
          Add New Savings
        </CardTitle>
        <CardDescription>
          Track your USD cash and gold investments
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Asset Type Selection */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Asset Type</Label>
            <RadioGroup
              value={assetType}
              onValueChange={value => setAssetType(value as AssetType)}
              className="grid grid-cols-2 gap-4"
              disabled={isLoading}>
              <div className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-accent cursor-pointer">
                <RadioGroupItem value="currency" id="currency" />
                <Label
                  htmlFor="currency"
                  className="flex items-center gap-2 cursor-pointer">
                  <span className="text-green-600">💵</span>
                  USD Currency
                </Label>
              </div>
              <div className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-accent cursor-pointer">
                <RadioGroupItem value="gold" id="gold" />
                <Label
                  htmlFor="gold"
                  className="flex items-center gap-2 cursor-pointer">
                  <span className="text-yellow-600">🪙</span>
                  Gold
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Currency Input */}
          {assetType === "currency" && (
            <div className="space-y-3">
              <Label
                htmlFor="usd-amount"
                className="flex items-center gap-2 text-base font-medium">
                <span className="text-green-600">💵</span>
                USD Amount
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                  $
                </span>
                <Input
                  id="usd-amount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="0.00"
                  value={usdAmount}
                  onChange={e => setUsdAmount(e.target.value)}
                  className="pl-8 text-right text-lg h-12"
                  disabled={isLoading}
                />
              </div>
            </div>
          )}

          {/* Gold Input */}
          {assetType === "gold" && (
            <div className="space-y-4">
              <div className="space-y-3">
                <Label
                  htmlFor="gold-grams"
                  className="flex items-center gap-2 text-base font-medium">
                  <span className="text-yellow-600">🪙</span>
                  Gold Weight (grams)
                </Label>
                <div className="relative">
                  <Input
                    id="gold-grams"
                    type="number"
                    step="0.01"
                    min="0.01"
                    placeholder="0.00"
                    value={goldGrams}
                    onChange={e => setGoldGrams(e.target.value)}
                    className="text-right text-lg h-12"
                    disabled={isLoading}
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                    g
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-base font-medium">Gold Karat</Label>
                <Select
                  value={goldKarat}
                  onValueChange={value => setGoldKarat(value as GoldKarat)}
                  disabled={isLoading}>
                  <SelectTrigger className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="18k">18K Gold (75% purity)</SelectItem>
                    <SelectItem value="21k">21K Gold (87.5% purity)</SelectItem>
                    <SelectItem value="22k">22K Gold (91.7% purity)</SelectItem>
                    <SelectItem value="24k">24K Gold (99.9% purity)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <Button
            type="submit"
            className="w-full h-12 text-lg"
            disabled={isLoading}>
            {isLoading ? (
              <>
                <span className="mr-2 animate-spin">⏳</span>
                Adding...
              </>
            ) : (
              <>
                <span className="mr-2">➕</span>
                Add {assetType === "currency" ? "USD" : "Gold"} Savings
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

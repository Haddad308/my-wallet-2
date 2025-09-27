"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { loadSavingsEntries, deleteSavingsEntry } from "@/lib/storage"
import type { SavingsEntry } from "@/lib/types"
import { toast } from "@/hooks/use-toast"
import { Sparkles } from "lucide-react"

interface SavingsListProps {
  refreshTrigger: number
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date)
}

export function SavingsList({ refreshTrigger }: SavingsListProps) {
  const [entries, setEntries] = useState<SavingsEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const loadEntries = async () => {
    try {
      console.log("[v0] Loading savings entries from Firestore")
      const data = await loadSavingsEntries()
      console.log("[v0] Loaded entries:", data)
      setEntries(data)
    } catch (error) {
      console.error("[v0] Error loading entries:", error)
      toast({
        title: "Error",
        description: "Failed to load savings entries",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadEntries()
  }, [refreshTrigger])

  const handleDelete = async (id: string) => {
    try {
      console.log("[v0] Deleting entry:", id)
      await deleteSavingsEntry(id)
      toast({
        title: "Success",
        description: "Savings entry deleted successfully",
      })
      loadEntries()
    } catch (error) {
      console.error("[v0] Error deleting entry:", error)
      toast({
        title: "Error",
        description: "Failed to delete savings entry",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Savings History
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">Loading...</div>
        </CardContent>
      </Card>
    )
  }

  if (entries.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Savings History
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            No savings entries yet. Add your first entry to get started!
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-xl">✨</span>
          Savings History ({entries.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {entries.map((entry) => (
          <Card key={entry.id} className="border-l-4 border-l-primary">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    {entry.assetType === "currency" && entry.usdAmount > 0 && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <span className="text-green-600">💵</span>${entry.usdAmount.toFixed(2)} USD
                      </Badge>
                    )}
                    {entry.assetType === "gold" && entry.goldGrams > 0 && (
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="flex items-center gap-1">
                          <span className="text-yellow-600">🪙</span>
                          {entry.goldGrams.toFixed(2)}g Gold
                        </Badge>
                        {entry.goldKarat && (
                          <Badge variant="default" className="text-xs">
                            {entry.goldKarat.toUpperCase()}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <span className="text-blue-500">📅</span>
                    {formatDate(entry.createdAt)}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => entry.id && handleDelete(entry.id)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <span className="text-red-500">🗑️</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  )
}

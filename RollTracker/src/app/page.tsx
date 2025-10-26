"use client";

import { useState } from "react";
import { RollDoc, RollMeta, Shot } from "@/types";
import { ThemeToggle } from "@/components/theme-toggle";
import { DatePicker } from "@/components/date-picker";
import { parseMarkdown } from "@/lib/markdown";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Plus, Trash2, Download, Github } from "lucide-react";

export default function Home() {
  const [rollDoc, setRollDoc] = useState<RollDoc>({
    meta: {
      rollId: "",
      date: "",
      camera: "",
      lens: "",
      filmStock: "",
      ratedISO: "",
      meterISO: "",
      exposures: 36,
    },
    shots: [],
  });

  const [newShot, setNewShot] = useState<Partial<Shot>>({
    shotNumber: 1,
    date: "",
    filmSpeed: "",
    aperture: "",
    exposureAdjustments: "",
    notes: "",
    imageUrl: "",
  });

  const [storageMode, setStorageMode] = useState<"download" | "github">("download");

  const handleRollMetaChange = (field: keyof RollMeta, value: string | number) => {
    setRollDoc(prev => ({
      ...prev,
      meta: {
        ...prev.meta,
        [field]: value,
      },
    }));
  };

  const handleNewShotChange = (field: keyof Shot, value: string | number) => {
    setNewShot(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const addShot = () => {
    if (!newShot.shotNumber) return;

    const shot: Shot = {
      shotNumber: newShot.shotNumber,
      date: newShot.date || undefined,
      filmSpeed: newShot.filmSpeed || undefined,
      aperture: newShot.aperture || undefined,
      exposureAdjustments: newShot.exposureAdjustments || undefined,
      notes: newShot.notes || undefined,
      imageUrl: newShot.imageUrl || undefined,
    };

    setRollDoc(prev => ({
      ...prev,
      shots: [...prev.shots, shot].sort((a, b) => a.shotNumber - b.shotNumber),
    }));

    // Reset form and set next shot number
    setNewShot({
      shotNumber: Math.max(...prev.shots.map(s => s.shotNumber), 0) + 1,
      date: "",
      filmSpeed: "",
      aperture: "",
      exposureAdjustments: "",
      notes: "",
      imageUrl: "",
    });
  };

  const removeShot = (shotNumber: number) => {
    setRollDoc(prev => ({
      ...prev,
      shots: prev.shots.filter(shot => shot.shotNumber !== shotNumber),
    }));
  };

  const handleSave = async () => {
    try {
      const response = await fetch("/api/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          doc: rollDoc,
          storageMode,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save");
      }

      const result = await response.json();
      
      if (storageMode === "download") {
        // Trigger download
        const blob = new Blob([result.content], { type: "text/markdown" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = result.filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else {
        // Show GitHub URL
        window.open(result.html_url, "_blank");
      }
    } catch (error) {
      console.error("Error saving:", error);
      alert("Failed to save roll");
    }
  };

  const handleImportFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const importedDoc = parseMarkdown(content);
        setRollDoc(importedDoc);
        // Set next shot number
        const maxShotNumber = Math.max(...importedDoc.shots.map(s => s.shotNumber), 0);
        setNewShot(prev => ({ ...prev, shotNumber: maxShotNumber + 1 }));
      } catch (error) {
        console.error("Error importing file:", error);
        alert("Failed to import file");
      }
    };
    reader.readAsText(file);
  };

  const handleImportGitHub = async () => {
    const path = prompt("Enter GitHub file path (e.g., rolls/2025-01-01-hp5-example.md):");
    if (!path) return;

    try {
      const response = await fetch(`/api/import-github?path=${encodeURIComponent(path)}`);
      if (!response.ok) {
        throw new Error("Failed to import from GitHub");
      }
      
      const result = await response.json();
      const importedDoc = parseMarkdown(result.content);
      setRollDoc(importedDoc);
      // Set next shot number
      const maxShotNumber = Math.max(...importedDoc.shots.map(s => s.shotNumber), 0);
      setNewShot(prev => ({ ...prev, shotNumber: maxShotNumber + 1 }));
    } catch (error) {
      console.error("Error importing from GitHub:", error);
      alert("Failed to import from GitHub");
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const result = await response.json();
      setNewShot(prev => ({ ...prev, imageUrl: result.url }));
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Film Shot Logger</h1>
          <div className="flex items-center gap-4">
            <Select value={storageMode} onValueChange={(value: "download" | "github") => setStorageMode(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="download">Download</SelectItem>
                <SelectItem value="github">GitHub</SelectItem>
              </SelectContent>
            </Select>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Roll Form */}
          <Card>
            <CardHeader>
              <CardTitle>Roll Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="rollId">Roll ID</Label>
                  <Input
                    id="rollId"
                    value={rollDoc.meta.rollId}
                    onChange={(e) => handleRollMetaChange("rollId", e.target.value)}
                    placeholder="e.g., hp5-kincardine-night"
                  />
                </div>
                <div>
                  <Label htmlFor="date">Date</Label>
                  <DatePicker
                    value={rollDoc.meta.date ? new Date(rollDoc.meta.date) : undefined}
                    onChange={(date) => handleRollMetaChange("date", date ? date.toISOString().split('T')[0] : "")}
                    placeholder="Select date"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="camera">Camera</Label>
                  <Input
                    id="camera"
                    value={rollDoc.meta.camera}
                    onChange={(e) => handleRollMetaChange("camera", e.target.value)}
                    placeholder="e.g., Canon AE-1 Program"
                  />
                </div>
                <div>
                  <Label htmlFor="lens">Lens</Label>
                  <Input
                    id="lens"
                    value={rollDoc.meta.lens}
                    onChange={(e) => handleRollMetaChange("lens", e.target.value)}
                    placeholder="e.g., FD 50/1.8"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="filmStock">Film Stock</Label>
                  <Input
                    id="filmStock"
                    value={rollDoc.meta.filmStock}
                    onChange={(e) => handleRollMetaChange("filmStock", e.target.value)}
                    placeholder="e.g., Ilford HP5"
                  />
                </div>
                <div>
                  <Label htmlFor="exposures">Exposures</Label>
                  <Input
                    id="exposures"
                    type="number"
                    min="1"
                    max="72"
                    value={rollDoc.meta.exposures}
                    onChange={(e) => handleRollMetaChange("exposures", parseInt(e.target.value) || 36)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="ratedISO">Rated ISO</Label>
                  <Input
                    id="ratedISO"
                    value={rollDoc.meta.ratedISO}
                    onChange={(e) => handleRollMetaChange("ratedISO", e.target.value)}
                    placeholder="e.g., 800"
                  />
                </div>
                <div>
                  <Label htmlFor="meterISO">Meter ISO</Label>
                  <Input
                    id="meterISO"
                    value={rollDoc.meta.meterISO}
                    onChange={(e) => handleRollMetaChange("meterISO", e.target.value)}
                    placeholder="e.g., 800"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleSave} className="flex-1">
                  <Download className="w-4 h-4 mr-2" />
                  Save {storageMode === "download" ? "Download" : "to GitHub"}
                </Button>
                <Button variant="outline" onClick={handleImportGitHub}>
                  <Github className="w-4 h-4 mr-2" />
                  Import from GitHub
                </Button>
                <label className="cursor-pointer">
                  <Button variant="outline" asChild>
                    <span>
                      <Upload className="w-4 h-4 mr-2" />
                      Import File
                    </span>
                  </Button>
                  <input
                    type="file"
                    accept=".md"
                    onChange={handleImportFile}
                    className="hidden"
                  />
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Shots Management */}
          <div className="space-y-6">
            {/* New Shot Form */}
            <Card>
              <CardHeader>
                <CardTitle>Add Shot</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="shotNumber">Shot Number</Label>
                    <Input
                      id="shotNumber"
                      type="number"
                      min="1"
                      value={newShot.shotNumber || ""}
                      onChange={(e) => handleNewShotChange("shotNumber", parseInt(e.target.value) || 1)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="shotDate">Date</Label>
                    <DatePicker
                      value={newShot.date ? new Date(newShot.date) : undefined}
                      onChange={(date) => handleNewShotChange("date", date ? date.toISOString().split('T')[0] : "")}
                      placeholder="Optional"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="filmSpeed">Film Speed</Label>
                    <Input
                      id="filmSpeed"
                      value={newShot.filmSpeed || ""}
                      onChange={(e) => handleNewShotChange("filmSpeed", e.target.value)}
                      placeholder="e.g., 800"
                    />
                  </div>
                  <div>
                    <Label htmlFor="aperture">Aperture</Label>
                    <Input
                      id="aperture"
                      value={newShot.aperture || ""}
                      onChange={(e) => handleNewShotChange("aperture", e.target.value)}
                      placeholder="e.g., f/2.8"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="exposureAdjustments">Exposure Adjustments</Label>
                  <Input
                    id="exposureAdjustments"
                    value={newShot.exposureAdjustments || ""}
                    onChange={(e) => handleNewShotChange("exposureAdjustments", e.target.value)}
                    placeholder="e.g., 1/60s, +1 EV, Y2 filter"
                  />
                </div>

                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={newShot.notes || ""}
                    onChange={(e) => handleNewShotChange("notes", e.target.value)}
                    placeholder="e.g., Streetlamp by harbour"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="imageUrl">Image URL</Label>
                  <div className="flex gap-2">
                    <Input
                      id="imageUrl"
                      value={newShot.imageUrl || ""}
                      onChange={(e) => handleNewShotChange("imageUrl", e.target.value)}
                      placeholder="https://i.imgur.com/abcd123.jpg"
                    />
                    <label className="cursor-pointer">
                      <Button variant="outline" size="icon" asChild>
                        <span>
                          <Upload className="w-4 h-4" />
                        </span>
                      </Button>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                <Button onClick={addShot} className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Shot
                </Button>
              </CardContent>
            </Card>

            {/* Shots List */}
            <Card>
              <CardHeader>
                <CardTitle>Shots ({rollDoc.shots.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {rollDoc.shots.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No shots added yet
                  </p>
                ) : (
                  <div className="space-y-3">
                    {rollDoc.shots.map((shot) => (
                      <div key={shot.shotNumber} className="flex items-start gap-3 p-3 border rounded-lg">
                        {shot.imageUrl && (
                          <img
                            src={shot.imageUrl}
                            alt={`Shot ${shot.shotNumber}`}
                            className="w-16 h-16 object-cover rounded"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">Shot {shot.shotNumber}</h4>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeShot(shot.shotNumber)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                          {shot.date && <p className="text-sm text-muted-foreground">{shot.date}</p>}
                          {shot.filmSpeed && <p className="text-sm">Speed: {shot.filmSpeed}</p>}
                          {shot.aperture && <p className="text-sm">Aperture: {shot.aperture}</p>}
                          {shot.exposureAdjustments && <p className="text-sm">Adjustments: {shot.exposureAdjustments}</p>}
                          {shot.notes && <p className="text-sm">{shot.notes}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
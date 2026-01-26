"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Search,
  Filter,
  Beaker,
  Edit2,
  Trash2,
  Eye,
  MoreVertical,
  Download,
  RefreshCw,
  CheckCircle2,
  IndianRupee,
  Clock,
  TestTube,
  Upload,
  X,
  Image as ImageIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import type { Test, TestFormData } from "./test.types";
import { fetchTests, createTest, updateTest, deleteTest } from "./test.data";

export default function ManageTestsPage() {
  const [tests, setTests] = useState<Test[]>([]);
  const [filteredTests, setFilteredTests] = useState<Test[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingTest, setEditingTest] = useState<Test | null>(null);
  const [deletingTestId, setDeletingTestId] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [formData, setFormData] = useState<TestFormData>({
    title: "",
    slug: "",
    image: "",
    price: { final: 0, currency: "INR" },
    category: "",
    description: "",
    turnaroundTime: "",
    sampleType: "Blood",
    preparationRequired: false,
    isActive: true,
    ctaText: "Book Now",
    iconType: "beaker",
  });

  useEffect(() => {
    loadTests();
  }, []);

  useEffect(() => {
    filterTests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, categoryFilter, statusFilter, tests]);

  const loadTests = async () => {
    setIsLoading(true);
    try {
      const data = await fetchTests();
      setTests(data);
      setFilteredTests(data);
    } catch (error) {
      console.error("Error loading tests:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterTests = () => {
    let filtered = [...tests];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (test) =>
          test.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          test.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
          test.category?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (categoryFilter && categoryFilter !== "all") {
      filtered = filtered.filter((test) => test.category === categoryFilter);
    }

    // Status filter
    if (statusFilter && statusFilter !== "all") {
      const isActive = statusFilter === "active";
      filtered = filtered.filter((test) => test.isActive === isActive);
    }

    setFilteredTests(filtered);
  };

  const categories = Array.from(new Set(tests.map((t) => t.category).filter(Boolean)));

  const handleOpenDialog = (test?: Test) => {
    if (test) {
      setEditingTest(test);
      setFormData({
        title: test.title,
        slug: test.slug,
        image: test.image,
        price: test.price,
        category: test.category || "",
        description: test.description || "",
        turnaroundTime: test.turnaroundTime || "",
        sampleType: test.sampleType || "Blood",
        preparationRequired: test.preparationRequired || false,
        isActive: test.isActive !== undefined ? test.isActive : true,
        ctaText: test.ctaText || "Book Now",
        iconType: test.iconType || "beaker",
      });
      setImagePreview(test.image || null);
      setImageFile(null);
    } else {
      setEditingTest(null);
      setFormData({
        title: "",
        slug: "",
        image: "",
        price: { final: 0, currency: "INR" },
        category: "",
        description: "",
        turnaroundTime: "",
        sampleType: "Blood",
        preparationRequired: false,
        isActive: true,
        ctaText: "Book Now",
        iconType: "beaker",
      });
      setImagePreview(null);
      setImageFile(null);
    }
    setIsDialogOpen(true);
  };

  const handleImageUpload = (file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    setImageFile(file);
    
    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
      // In a real app, you would upload to a server here
      // For now, we'll use a mock URL that would come from the upload endpoint
      setFormData({ ...formData, image: `/uploads/tests/${file.name}` });
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setFormData({ ...formData, image: "" });
  };

  const handleSave = async () => {
    try {
      // In a real app, you would upload the image file to your server/cloud storage here
      // const uploadedImageUrl = await uploadImage(imageFile);
      // const dataToSave = { ...formData, image: uploadedImageUrl };
      
      if (editingTest) {
        await updateTest(editingTest.id, formData);
      } else {
        await createTest(formData);
      }
      await loadTests();
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error saving test:", error);
    }
  };

  const handleDelete = async () => {
    if (!deletingTestId) return;
    try {
      await deleteTest(deletingTestId);
      await loadTests();
      setIsDeleteDialogOpen(false);
      setDeletingTestId(null);
    } catch (error) {
      console.error("Error deleting test:", error);
    }
  };

  const handleGenerateSlug = () => {
    const slug = formData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    setFormData({ ...formData, slug });
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      <div className="p-6 space-y-6 max-w-400 mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-primary/10">
                <Beaker className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Manage Tests</h1>
                <p className="text-sm text-muted-foreground">
                  Add, edit, and manage diagnostic tests
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2" onClick={loadTests}>
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button size="sm" className="gap-2" onClick={() => handleOpenDialog()}>
              <Plus className="h-4 w-4" />
              Add New Test
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Total Tests</p>
                  <p className="text-2xl font-bold mt-1">{tests.length}</p>
                </div>
                <div className="p-2 rounded-lg bg-primary/10">
                  <TestTube className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Active Tests</p>
                  <p className="text-2xl font-bold mt-1">
                    {tests.filter((t) => t.isActive).length}
                  </p>
                </div>
                <div className="p-2 rounded-lg bg-green-500/10">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Categories</p>
                  <p className="text-2xl font-bold mt-1">{categories.length}</p>
                </div>
                <div className="p-2 rounded-lg bg-amber-500/10">
                  <Filter className="h-5 w-5 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Avg Price</p>
                  <p className="text-2xl font-bold mt-1">
                    ₹{Math.round(tests.reduce((sum, t) => sum + t.price.final, 0) / (tests.length || 1))}
                  </p>
                </div>
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <IndianRupee className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters & Search */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search tests by name, category, or slug..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat!}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Tests Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Tests List</CardTitle>
                <CardDescription>
                  Showing {filteredTests.length} of {tests.length} tests
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/50 border-b">
                      <th className="text-left font-semibold h-11 px-4">Test Name</th>
                      <th className="text-left font-semibold h-11 px-4 hidden md:table-cell">Category</th>
                      <th className="text-left font-semibold h-11 px-4 hidden lg:table-cell">Sample</th>
                      <th className="text-left font-semibold h-11 px-4 hidden lg:table-cell">TAT</th>
                      <th className="text-right font-semibold h-11 px-4">Price</th>
                      <th className="text-center font-semibold h-11 px-4">Status</th>
                      <th className="text-center font-semibold h-11 px-4 w-20">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTests.map((test, i) => (
                      <motion.tr
                        key={test.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.02 }}
                        className="border-b hover:bg-muted/30 transition-colors"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/10">
                              <TestTube className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">{test.title}</p>
                              <p className="text-xs text-muted-foreground">{test.slug}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <Badge variant="secondary">{test.category}</Badge>
                        </td>
                        <td className="px-4 py-3 hidden lg:table-cell text-muted-foreground">
                          {test.sampleType}
                        </td>
                        <td className="px-4 py-3 hidden lg:table-cell">
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Clock className="h-3.5 w-3.5" />
                            <span className="text-xs">{test.turnaroundTime}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div>
                            {test.price.original && (
                              <p className="text-xs text-muted-foreground line-through">
                                ₹{test.price.original}
                              </p>
                            )}
                            <p className="font-semibold text-primary">₹{test.price.final}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          {test.isActive ? (
                            <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                              Active
                            </Badge>
                          ) : (
                            <Badge variant="secondary">Inactive</Badge>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleOpenDialog(test)}>
                                <Edit2 className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => {
                                  setDeletingTestId(test.id);
                                  setIsDeleteDialogOpen(true);
                                }}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Add/Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingTest ? "Edit Test" : "Add New Test"}</DialogTitle>
              <DialogDescription>
                {editingTest ? "Update test information" : "Create a new diagnostic test"}
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Test Name *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Complete Blood Count (CBC)"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="slug">Slug *</Label>
                <div className="flex gap-2">
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="e.g., complete-blood-count-cbc"
                  />
                  <Button variant="outline" onClick={handleGenerateSlug}>
                    Generate
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g., Blood Tests"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="sampleType">Sample Type</Label>
                  <Select
                    value={formData.sampleType}
                    onValueChange={(value) => setFormData({ ...formData, sampleType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Blood">Blood</SelectItem>
                      <SelectItem value="Urine">Urine</SelectItem>
                      <SelectItem value="Stool">Stool</SelectItem>
                      <SelectItem value="Saliva">Saliva</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="finalPrice">Price (₹) *</Label>
                  <Input
                    id="finalPrice"
                    type="number"
                    value={formData.price.final}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        price: { ...formData.price, final: Number(e.target.value) },
                      })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="originalPrice">Original Price (₹)</Label>
                  <Input
                    id="originalPrice"
                    type="number"
                    value={formData.price.original || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        price: {
                          ...formData.price,
                          original: e.target.value ? Number(e.target.value) : undefined,
                        },
                      })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="turnaroundTime">TAT</Label>
                  <Input
                    id="turnaroundTime"
                    value={formData.turnaroundTime}
                    onChange={(e) => setFormData({ ...formData, turnaroundTime: e.target.value })}
                    placeholder="e.g., 6-8 hours"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of the test"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="image">Test Image *</Label>
                <div className="space-y-3">
                  {/* Image Preview */}
                  {imagePreview && (
                    <div className="relative w-full h-48 rounded-lg overflow-hidden border-2 border-border">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-8 w-8"
                        onClick={handleRemoveImage}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}

                  {/* Upload Area */}
                  {!imagePreview && (
                    <div
                      className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                        isDragging
                          ? "border-primary bg-primary/5"
                          : "border-muted-foreground/25 hover:border-primary/50"
                      }`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      <input
                        type="file"
                        id="image-upload"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageUpload(file);
                        }}
                      />
                      <div className="flex flex-col items-center gap-3">
                        <div className="p-3 rounded-full bg-primary/10">
                          <Upload className="h-8 w-8 text-primary" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">
                            Drop your image here, or{" "}
                            <span className="text-primary">browse</span>
                          </p>
                          <p className="text-xs text-muted-foreground">
                            PNG, JPG, JPEG up to 5MB
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* File Info */}
                  {imageFile && (
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-muted">
                      <ImageIcon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm flex-1 truncate">{imageFile.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {(imageFile.size / 1024).toFixed(1)} KB
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="preparationRequired"
                  checked={formData.preparationRequired}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, preparationRequired: checked === true })
                  }
                />
                <Label htmlFor="preparationRequired" className="text-sm font-normal">
                  Preparation Required (e.g., fasting)
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isActive: checked === true })
                  }
                />
                <Label htmlFor="isActive" className="text-sm font-normal">
                  Active (visible to customers)
                </Label>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                {editingTest ? "Update Test" : "Create Test"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Test</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this test? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

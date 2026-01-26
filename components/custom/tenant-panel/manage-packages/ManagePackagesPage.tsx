"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Search,
  PackageOpen,
  Edit2,
  Trash2,
  MoreVertical,
  Download,
  RefreshCw,
  CheckCircle2,
  Tag,
  IndianRupee,
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
import { ScrollArea } from "@/components/ui/scroll-area";
import type { HealthPackage, PackageFormData } from "./package.types";
import { fetchPackages, createPackage, updatePackage, deletePackage } from "./package.data";
import { fetchTests } from "../manage-tests/test.data";
import type { Test } from "../manage-tests/test.types";

export default function ManagePackagesPage() {
  const [packages, setPackages] = useState<HealthPackage[]>([]);
  const [filteredPackages, setFilteredPackages] = useState<HealthPackage[]>([]);
  const [availableTests, setAvailableTests] = useState<Test[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<HealthPackage | null>(null);
  const [deletingPackageId, setDeletingPackageId] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [formData, setFormData] = useState<PackageFormData>({
    title: "",
    slug: "",
    subtitle: "",
    image: "",
    originalPrice: "",
    discountedPrice: "",
    discountBadge: "",
    primaryActionText: "Book Now",
    secondaryActionText: "View Details",
    testsIncluded: 0,
    parameters: 0,
    testIds: [],
    description: "",
    category: "",
    isActive: true,
  });

  useEffect(() => {
    loadPackages();
    loadAvailableTests();
  }, []);

  useEffect(() => {
    filterPackages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, categoryFilter, packages]);

  const loadPackages = async () => {
    setIsLoading(true);
    try {
      const data = await fetchPackages();
      setPackages(data);
      setFilteredPackages(data);
    } catch (error) {
      console.error("Error loading packages:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadAvailableTests = async () => {
    try {
      const tests = await fetchTests();
      setAvailableTests(tests.filter(t => t.isActive));
    } catch (error) {
      console.error("Error loading tests:", error);
    }
  };

  const filterPackages = () => {
    let filtered = [...packages];

    if (searchQuery) {
      filtered = filtered.filter(
        (pkg) =>
          pkg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          pkg.slug.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (categoryFilter && categoryFilter !== "all") {
      filtered = filtered.filter((pkg) => pkg.category === categoryFilter);
    }

    setFilteredPackages(filtered);
  };

  const categories = Array.from(new Set(packages.map((p) => p.category).filter(Boolean)));

  const handleOpenDialog = (pkg?: HealthPackage) => {
    if (pkg) {
      setEditingPackage(pkg);
      setFormData({
        title: pkg.title,
        slug: pkg.slug,
        subtitle: pkg.subtitle || "",
        image: pkg.image || "",
        originalPrice: pkg.originalPrice,
        discountedPrice: pkg.discountedPrice,
        discountBadge: pkg.discountBadge || "",
        primaryActionText: pkg.primaryActionText || "Book Now",
        secondaryActionText: pkg.secondaryActionText || "View Details",
        testsIncluded: pkg.testsIncluded || 0,
        parameters: pkg.parameters || 0,
        testIds: pkg.testIds || [],
        description: pkg.description || "",
        category: pkg.category || "",
        isActive: pkg.isActive !== undefined ? pkg.isActive : true,
      });
      setImagePreview(pkg.image || null);
      setImageFile(null);
    } else {
      setEditingPackage(null);
      setFormData({
        title: "",
        slug: "",
        subtitle: "",
        image: "",
        originalPrice: "",
        discountedPrice: "",
        discountBadge: "",
        primaryActionText: "Book Now",
        secondaryActionText: "View Details",
        testsIncluded: 0,
        parameters: 0,
        testIds: [],
        description: "",
        category: "",
        isActive: true,
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
      setFormData({ ...formData, image: `/uploads/packages/${file.name}` });
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
      
      if (editingPackage) {
        await updatePackage(editingPackage.id, formData);
      } else {
        await createPackage(formData);
      }
      await loadPackages();
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error saving package:", error);
    }
  };

  const handleDelete = async () => {
    if (!deletingPackageId) return;
    try {
      await deletePackage(deletingPackageId);
      await loadPackages();
      setIsDeleteDialogOpen(false);
      setDeletingPackageId(null);
    } catch (error) {
      console.error("Error deleting package:", error);
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
                <PackageOpen className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Manage Packages</h1>
                <p className="text-sm text-muted-foreground">
                  Add, edit, and manage health checkup packages
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2" onClick={loadPackages}>
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button size="sm" className="gap-2" onClick={() => handleOpenDialog()}>
              <Plus className="h-4 w-4" />
              Add New Package
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Total Packages</p>
                  <p className="text-2xl font-bold mt-1">{packages.length}</p>
                </div>
                <div className="p-2 rounded-lg bg-primary/10">
                  <PackageOpen className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Active Packages</p>
                  <p className="text-2xl font-bold mt-1">
                    {packages.filter((p) => p.isActive).length}
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
                  <Tag className="h-5 w-5 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Avg Tests</p>
                  <p className="text-2xl font-bold mt-1">
                    {Math.round(
                      packages.reduce((sum, p) => sum + (p.testsIncluded || 0), 0) /
                        (packages.length || 1)
                    )}
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
                    placeholder="Search packages..."
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
            </div>
          </CardContent>
        </Card>

        {/* Packages Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredPackages.map((pkg, i) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <CardTitle className="text-base leading-tight">{pkg.title}</CardTitle>
                      <CardDescription className="text-xs mt-1">{pkg.subtitle}</CardDescription>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleOpenDialog(pkg)}>
                          <Edit2 className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => {
                            setDeletingPackageId(pkg.id);
                            setIsDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-primary">{pkg.discountedPrice}</span>
                    <span className="text-sm text-muted-foreground line-through">
                      {pkg.originalPrice}
                    </span>
                    {pkg.discountBadge && (
                      <Badge variant="secondary" className="text-xs">
                        {pkg.discountBadge}
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{pkg.testsIncluded} Tests</span>
                    <span>•</span>
                    <span>{pkg.parameters} Parameters</span>
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <Badge variant={pkg.category ? "secondary" : "outline"} className="text-xs">
                      {pkg.category || "General"}
                    </Badge>
                    {pkg.isActive ? (
                      <Badge className="bg-green-100 text-green-700 text-xs dark:bg-green-900/30 dark:text-green-400">
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-xs">
                        Inactive
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Add/Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingPackage ? "Edit Package" : "Add New Package"}
              </DialogTitle>
              <DialogDescription>
                {editingPackage
                  ? "Update package information"
                  : "Create a new health checkup package"}
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Package Name *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Basic Health Checkup"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="slug">Slug *</Label>
                <div className="flex gap-2">
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="e.g., basic-health-checkup"
                  />
                  <Button variant="outline" onClick={handleGenerateSlug}>
                    Generate
                  </Button>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="subtitle">Subtitle</Label>
                <Input
                  id="subtitle"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="Brief tagline"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="originalPrice">Original Price *</Label>
                  <Input
                    id="originalPrice"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    placeholder="₹2,499"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="discountedPrice">Discounted Price *</Label>
                  <Input
                    id="discountedPrice"
                    value={formData.discountedPrice}
                    onChange={(e) =>
                      setFormData({ ...formData, discountedPrice: e.target.value })
                    }
                    placeholder="₹1,799"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="discountBadge">Discount Badge</Label>
                  <Input
                    id="discountBadge"
                    value={formData.discountBadge}
                    onChange={(e) => setFormData({ ...formData, discountBadge: e.target.value })}
                    placeholder="28% OFF"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="testsIncluded">Tests Included</Label>
                  <Input
                    id="testsIncluded"
                    type="number"
                    value={formData.testsIncluded}
                    onChange={(e) =>
                      setFormData({ ...formData, testsIncluded: Number(e.target.value) })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="parameters">Parameters</Label>
                  <Input
                    id="parameters"
                    type="number"
                    value={formData.parameters}
                    onChange={(e) =>
                      setFormData({ ...formData, parameters: Number(e.target.value) })
                    }
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g., Preventive Care"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Package description"
                />
              </div>

              {/* Test Selection */}
              <div className="grid gap-2">
                <Label>Select Tests Included *</Label>
                <div className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-muted-foreground">
                      {formData.testIds?.length || 0} test(s) selected
                    </p>
                    {formData.testIds && formData.testIds.length > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setFormData({ ...formData, testIds: [] })}
                      >
                        Clear All
                      </Button>
                    )}
                  </div>
                  <ScrollArea className="h-64 pr-4">
                    <div className="space-y-2">
                      {availableTests.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          No tests available. Please add tests first.
                        </p>
                      ) : (
                        availableTests.map((test) => (
                          <div
                            key={test.id}
                            className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors border"
                          >
                            <Checkbox
                              id={`test-${test.id}`}
                              checked={formData.testIds?.includes(test.id) || false}
                              onCheckedChange={(checked) => {
                                const currentIds = formData.testIds || [];
                                const newIds = checked
                                  ? [...currentIds, test.id]
                                  : currentIds.filter((id) => id !== test.id);
                                setFormData({ ...formData, testIds: newIds });
                              }}
                            />
                            <div className="flex-1 space-y-1">
                              <Label
                                htmlFor={`test-${test.id}`}
                                className="text-sm font-medium cursor-pointer"
                              >
                                {test.title}
                              </Label>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Badge variant="secondary" className="text-xs">
                                  {test.category}
                                </Badge>
                                <span>₹{test.price.final}</span>
                                {test.turnaroundTime && (
                                  <>
                                    <span>•</span>
                                    <span>{test.turnaroundTime}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </ScrollArea>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="image">Package Image *</Label>
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
                {editingPackage ? "Update Package" : "Create Package"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Package</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this package? This action cannot be undone.
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

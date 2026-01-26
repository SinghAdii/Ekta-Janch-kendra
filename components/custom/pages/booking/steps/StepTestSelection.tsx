"use client";

import React, { useState, useMemo } from "react";
import { UseFormReturn } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  TestTube,
  Package,
  Clock,
  IndianRupee,
  Filter,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { TestSelectionData } from "../booking.types";
import {
  availableTests,
  availablePackages,
  testCategories,
  packageCategories,
  calculateTestsTotal,
  calculatePackagesTotal,
} from "../booking.data";

interface StepTestSelectionProps {
  form: UseFormReturn<TestSelectionData>;
}

export function StepTestSelection({ form }: StepTestSelectionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"tests" | "packages">("tests");
  const [selectedTestCategory, setSelectedTestCategory] = useState("All");
  const [selectedPackageCategory, setSelectedPackageCategory] = useState("All");
  const [showFilters, setShowFilters] = useState(false);

  const selectedTests = form.watch("selectedTests") || [];
  const selectedPackages = form.watch("selectedPackages") || [];

  // Filter tests based on search and category
  const filteredTests = useMemo(() => {
    return availableTests.filter((test) => {
      const matchesSearch =
        test.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        test.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        test.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedTestCategory === "All" || test.category === selectedTestCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedTestCategory]);

  // Filter packages based on search and category
  const filteredPackages = useMemo(() => {
    return availablePackages.filter((pkg) => {
      const matchesSearch =
        pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pkg.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedPackageCategory === "All" || pkg.category === selectedPackageCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedPackageCategory]);

  // Calculate totals
  const testsTotal = calculateTestsTotal(selectedTests);
  const packagesTotal = calculatePackagesTotal(selectedPackages);
  const grandTotal = testsTotal + packagesTotal;

  // Handle test selection
  const handleTestToggle = (testId: string, checked: boolean) => {
    const current = form.getValues("selectedTests") || [];
    if (checked) {
      form.setValue("selectedTests", [...current, testId], {
        shouldValidate: true,
      });
    } else {
      form.setValue(
        "selectedTests",
        current.filter((id) => id !== testId),
        { shouldValidate: true }
      );
    }
  };

  // Handle package selection
  const handlePackageToggle = (packageId: string, checked: boolean) => {
    const current = form.getValues("selectedPackages") || [];
    if (checked) {
      form.setValue("selectedPackages", [...current, packageId], {
        shouldValidate: true,
      });
    } else {
      form.setValue(
        "selectedPackages",
        current.filter((id) => id !== packageId),
        { shouldValidate: true }
      );
    }
  };

  // Clear all selections
  const clearAllSelections = () => {
    form.setValue("selectedTests", [], { shouldValidate: true });
    form.setValue("selectedPackages", [], { shouldValidate: true });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          Select Tests & Packages
        </h2>
        <p className="text-gray-600 text-sm sm:text-base">
          Choose the tests or health packages you need
        </p>
      </div>

      <Form {...form}>
        <FormField
          control={form.control}
          name="selectedTests"
          render={() => (
            <FormItem>
              <FormControl>
                <div className="space-y-4">
                  {/* Search Bar */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      placeholder="Search tests or packages..."
                      className="pl-10 h-11"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                      >
                        <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                      </button>
                    )}
                  </div>

                  {/* Tabs */}
                  <Tabs
                    value={activeTab}
                    onValueChange={(v) => setActiveTab(v as "tests" | "packages")}
                    className="w-full"
                  >
                    <TabsList className="grid w-full grid-cols-2 mb-4">
                      <TabsTrigger value="tests" className="flex items-center gap-2">
                        <TestTube className="w-4 h-4" />
                        Tests
                        {selectedTests.length > 0 && (
                          <Badge className="ml-1 bg-blue-100 text-blue-700 hover:bg-blue-100">
                            {selectedTests.length}
                          </Badge>
                        )}
                      </TabsTrigger>
                      <TabsTrigger value="packages" className="flex items-center gap-2">
                        <Package className="w-4 h-4" />
                        Packages
                        {selectedPackages.length > 0 && (
                          <Badge className="ml-1 bg-purple-100 text-purple-700 hover:bg-purple-100">
                            {selectedPackages.length}
                          </Badge>
                        )}
                      </TabsTrigger>
                    </TabsList>

                    {/* Filter Toggle */}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowFilters(!showFilters)}
                      className="mb-4"
                    >
                      <Filter className="w-4 h-4 mr-2" />
                      Filters
                      {showFilters ? (
                        <ChevronUp className="w-4 h-4 ml-2" />
                      ) : (
                        <ChevronDown className="w-4 h-4 ml-2" />
                      )}
                    </Button>

                    {/* Category Filters */}
                    <AnimatePresence>
                      {showFilters && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden mb-4"
                        >
                          <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg">
                            {(activeTab === "tests" ? testCategories : packageCategories).map(
                              (category) => (
                                <Button
                                  key={category}
                                  type="button"
                                  variant={
                                    (activeTab === "tests"
                                      ? selectedTestCategory
                                      : selectedPackageCategory) === category
                                      ? "default"
                                      : "outline"
                                  }
                                  size="sm"
                                  onClick={() =>
                                    activeTab === "tests"
                                      ? setSelectedTestCategory(category)
                                      : setSelectedPackageCategory(category)
                                  }
                                  className="text-xs"
                                >
                                  {category}
                                </Button>
                              )
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Tests Tab */}
                    <TabsContent value="tests">
                      <ScrollArea className="h-75 sm:h-87.5 pr-4">
                        <div className="space-y-3">
                          {filteredTests.length > 0 ? (
                            filteredTests.map((test, index) => {
                              const isSelected = selectedTests.includes(test.id);
                              return (
                                <motion.div
                                  key={test.id}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: index * 0.03 }}
                                  onClick={() => handleTestToggle(test.id, !isSelected)}
                                  className={cn(
                                    "flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all",
                                    isSelected
                                      ? "border-blue-500 bg-blue-50"
                                      : "border-gray-200 hover:border-blue-200 hover:bg-gray-50"
                                  )}
                                >
                                  <Checkbox
                                    checked={isSelected}
                                    onCheckedChange={(checked) =>
                                      handleTestToggle(test.id, checked as boolean)
                                    }
                                    className="mt-1"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                      <div>
                                        <h4 className="font-medium text-gray-900">
                                          {test.name}
                                        </h4>
                                        <p className="text-xs text-gray-500">
                                          Code: {test.code}
                                        </p>
                                      </div>
                                      <div className="text-right shrink-0">
                                        <p className="font-semibold text-blue-600 flex items-center">
                                          <IndianRupee className="w-3 h-3" />
                                          {test.price}
                                        </p>
                                      </div>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1">
                                      {test.description}
                                    </p>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                      <Badge variant="outline" className="text-xs">
                                        {test.category}
                                      </Badge>
                                      <Badge variant="outline" className="text-xs">
                                        {test.sampleType}
                                      </Badge>
                                      <Badge variant="outline" className="text-xs flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {test.reportTime}
                                      </Badge>
                                    </div>
                                  </div>
                                </motion.div>
                              );
                            })
                          ) : (
                            <div className="text-center py-8 text-gray-500">
                              No tests found matching your search
                            </div>
                          )}
                        </div>
                      </ScrollArea>
                    </TabsContent>

                    {/* Packages Tab */}
                    <TabsContent value="packages">
                      <ScrollArea className="h-75 sm:h-87.5 pr-4">
                        <div className="space-y-3">
                          {filteredPackages.length > 0 ? (
                            filteredPackages.map((pkg, index) => {
                              const isSelected = selectedPackages.includes(pkg.id);
                              const discountedPrice = pkg.discount
                                ? pkg.price - (pkg.price * pkg.discount) / 100
                                : pkg.price;

                              return (
                                <motion.div
                                  key={pkg.id}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: index * 0.05 }}
                                  onClick={() => handlePackageToggle(pkg.id, !isSelected)}
                                  className={cn(
                                    "relative p-4 rounded-lg border-2 cursor-pointer transition-all",
                                    isSelected
                                      ? "border-purple-500 bg-purple-50"
                                      : "border-gray-200 hover:border-purple-200 hover:bg-gray-50"
                                  )}
                                >
                                  {pkg.discount && (
                                    <Badge className="absolute top-2 right-2 bg-green-500">
                                      {pkg.discount}% OFF
                                    </Badge>
                                  )}

                                  <div className="flex items-start gap-3">
                                    <Checkbox
                                      checked={isSelected}
                                      onCheckedChange={(checked) =>
                                        handlePackageToggle(pkg.id, checked as boolean)
                                      }
                                      className="mt-1"
                                    />
                                    <div className="flex-1">
                                      <h4 className="font-semibold text-gray-900 pr-16">
                                        {pkg.name}
                                      </h4>
                                      <p className="text-sm text-gray-600 mt-1">
                                        {pkg.description}
                                      </p>

                                      <Collapsible>
                                        <CollapsibleTrigger asChild>
                                          <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="text-xs text-blue-600 p-0 h-auto mt-2"
                                          >
                                            View {pkg.testCount} tests included
                                            <ChevronDown className="w-3 h-3 ml-1" />
                                          </Button>
                                        </CollapsibleTrigger>
                                        <CollapsibleContent>
                                          <div className="flex flex-wrap gap-1 mt-2">
                                            {pkg.testsIncluded.map((test, idx) => (
                                              <Badge
                                                key={idx}
                                                variant="secondary"
                                                className="text-xs"
                                              >
                                                {test}
                                              </Badge>
                                            ))}
                                          </div>
                                        </CollapsibleContent>
                                      </Collapsible>

                                      <div className="flex items-center justify-between mt-3">
                                        <div className="flex items-center gap-2">
                                          <Badge variant="outline" className="text-xs">
                                            {pkg.category}
                                          </Badge>
                                          <Badge
                                            variant="outline"
                                            className="text-xs flex items-center gap-1"
                                          >
                                            <Clock className="w-3 h-3" />
                                            {pkg.reportTime}
                                          </Badge>
                                        </div>
                                        <div className="text-right">
                                          {pkg.discount && (
                                            <p className="text-xs text-gray-400 line-through flex items-center">
                                              <IndianRupee className="w-3 h-3" />
                                              {pkg.price}
                                            </p>
                                          )}
                                          <p className="font-bold text-purple-600 flex items-center">
                                            <IndianRupee className="w-4 h-4" />
                                            {Math.round(discountedPrice)}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </motion.div>
                              );
                            })
                          ) : (
                            <div className="text-center py-8 text-gray-500">
                              No packages found matching your search
                            </div>
                          )}
                        </div>
                      </ScrollArea>
                    </TabsContent>
                  </Tabs>
                </div>
              </FormControl>
              <FormMessage className="text-center mt-4" />
            </FormItem>
          )}
        />
      </Form>

      {/* Selection Summary */}
      {(selectedTests.length > 0 || selectedPackages.length > 0) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-linear-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-100"
        >
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-gray-900">Selection Summary</h4>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clearAllSelections}
              className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              Clear All
            </Button>
          </div>

          <div className="space-y-2 text-sm">
            {selectedTests.length > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">
                  Tests ({selectedTests.length})
                </span>
                <span className="font-medium flex items-center">
                  <IndianRupee className="w-3 h-3" />
                  {testsTotal}
                </span>
              </div>
            )}
            {selectedPackages.length > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">
                  Packages ({selectedPackages.length})
                </span>
                <span className="font-medium flex items-center">
                  <IndianRupee className="w-3 h-3" />
                  {Math.round(packagesTotal)}
                </span>
              </div>
            )}
            <div className="border-t pt-2 flex justify-between">
              <span className="font-semibold text-gray-900">Total</span>
              <span className="font-bold text-lg text-blue-600 flex items-center">
                <IndianRupee className="w-4 h-4" />
                {Math.round(grandTotal)}
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

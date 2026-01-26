"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Search,
  IndianRupee,
  User,
  Mail,
  ChevronDown,
  ChevronUp,
  Filter,
  Check,
  X,
  Plus,
  Clock,
  CreditCard,
  Wallet,
  QrCode,
  Building,
  Building2,
  Printer,
  Send,
  FileText,
  CalendarPlus,
  UserPlus,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

import {
  walkInRegistrationFormSchema,
  type WalkInRegistrationForm,
  type SchedulePickupForm,
} from "./lab-management.types";
import {
  labTests,
  labPackages,
  testCategories,
  packageCategories,
  calculateTotal,
  generateOrderNumber,
  labBranches,
} from "./lab-management.data";

export interface WalkInToScheduleData {
  patientData: Partial<SchedulePickupForm>;
  tests: string[];
  packages: string[];
}

interface WalkInRegistrationPageProps {
  onSuccess?: (data: WalkInRegistrationForm & { orderNumber: string; totalAmount: number }) => void;
  onConvertToHomeCollection?: (data: WalkInToScheduleData) => void;
}

type PaymentMethodType = "Cash" | "UPI" | "Card" | "NetBanking" | "Cheque";

const paymentMethods: { id: PaymentMethodType; label: string; icon: React.ReactNode }[] = [
  { id: "Cash", label: "Cash", icon: <Wallet className="w-4 h-4" /> },
  { id: "Card", label: "Card", icon: <CreditCard className="w-4 h-4" /> },
  { id: "UPI", label: "UPI", icon: <QrCode className="w-4 h-4" /> },
  { id: "NetBanking", label: "NetBanking", icon: <Building className="w-4 h-4" /> },
];

export default function WalkInRegistrationPage({
  onSuccess,
  onConvertToHomeCollection,
}: WalkInRegistrationPageProps) {
  const [activeTab, setActiveTab] = useState<"tests" | "packages">("tests");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTestCategory, setSelectedTestCategory] = useState<string>("All");
  const [selectedPackageCategory, setSelectedPackageCategory] = useState<string>("All");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [showConvertDialog, setShowConvertDialog] = useState(false);
  const [showReceiptDialog, setShowReceiptDialog] = useState(false);
  const [selectedTests, setSelectedTests] = useState<string[]>([]);
  const [selectedPackages, setSelectedPackages] = useState<string[]>([]);
  const [lastOrderData, setLastOrderData] = useState<{
    orderNumber: string;
    patientName: string;
    totalAmount: number;
    paymentMethod: PaymentMethodType;
  } | null>(null);

  const form = useForm<WalkInRegistrationForm>({
    resolver: zodResolver(walkInRegistrationFormSchema),
    defaultValues: {
      fullName: "",
      mobile: "",
      email: "",
      age: undefined,
      gender: undefined,
      selectedTests: [],
      selectedPackages: [],
      branchId: "",
      paymentMode: "Cash",
    },
    mode: "onChange",
  });

  const filteredTests = useMemo(() => {
    let filtered = labTests;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.code.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q)
      );
    }
    if (selectedTestCategory && selectedTestCategory !== "All") {
      filtered = filtered.filter((t) => t.category === selectedTestCategory);
    }
    return filtered;
  }, [searchQuery, selectedTestCategory]);

  const filteredPackages = useMemo(() => {
    let filtered = labPackages;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.testsIncluded.some((t) => t.toLowerCase().includes(q))
      );
    }
    if (selectedPackageCategory && selectedPackageCategory !== "All") {
      filtered = filtered.filter((p) => p.category === selectedPackageCategory);
    }
    return filtered;
  }, [searchQuery, selectedPackageCategory]);

  const { grandTotal } = useMemo(
    () => calculateTotal(selectedTests, selectedPackages),
    [selectedTests, selectedPackages]
  );

  const handleTestToggle = (testId: string) => {
    setSelectedTests((prev) => {
      const newTests = prev.includes(testId)
        ? prev.filter((id) => id !== testId)
        : [...prev, testId];
      form.setValue("selectedTests", newTests);
      return newTests;
    });
  };

  const handlePackageToggle = (packageId: string) => {
    setSelectedPackages((prev) => {
      const newPackages = prev.includes(packageId)
        ? prev.filter((id) => id !== packageId)
        : [...prev, packageId];
      form.setValue("selectedPackages", newPackages);
      return newPackages;
    });
  };

  const clearAllSelections = () => {
    setSelectedTests([]);
    setSelectedPackages([]);
    form.setValue("selectedTests", []);
    form.setValue("selectedPackages", []);
  };

  const handleConvertToHomeCollection = () => {
    const formData = form.getValues();
    const data: WalkInToScheduleData = {
      patientData: {
        fullName: formData.fullName,
        mobile: formData.mobile,
        email: formData.email,
        age: formData.age,
        gender: formData.gender,
      },
      tests: selectedTests,
      packages: selectedPackages,
    };
    onConvertToHomeCollection?.(data);
    setShowConvertDialog(false);
    form.reset();
    setSelectedTests([]);
    setSelectedPackages([]);
  };

  const onSubmit = async (data: WalkInRegistrationForm) => {
    setIsSubmitting(true);
    try {
      const orderNumber = generateOrderNumber();
      const orderData = {
        ...data,
        selectedTests,
        selectedPackages,
        orderNumber,
        totalAmount: grandTotal,
        createdAt: new Date().toISOString(),
      };
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setLastOrderData({
        orderNumber,
        patientName: data.fullName,
        totalAmount: grandTotal,
        paymentMethod: data.paymentMode as PaymentMethodType,
      });

      onSuccess?.(orderData);
      setSubmitSuccess(true);
      setShowReceiptDialog(true);
      form.reset();
      setSelectedTests([]);
      setSelectedPackages([]);
      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (error) {
      console.error("Error registering walk-in:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  const handleSendReceipt = () => {
    setShowReceiptDialog(false);
  };

  return (
    <div className="h-full flex flex-col overflow-hidden bg-gradient-to-br from-blue-50 via-white to-slate-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="flex-1 p-4 md:p-6 space-y-4 overflow-y-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-100 rounded-xl dark:bg-blue-900/30 shrink-0">
              <UserPlus className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-bold tracking-tight">Walk-In Registration</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">
                Register walk-in patients for sample collection
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {onConvertToHomeCollection && (selectedTests.length > 0 || selectedPackages.length > 0) && (
              <Button variant="outline" size="sm" onClick={() => setShowConvertDialog(true)}>
                <CalendarPlus className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Convert to Home Collection</span>
                <span className="sm:hidden">Home</span>
              </Button>
            )}
          </div>
        </div>

        <AnimatePresence>
          {submitSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="border-green-200 bg-green-50">
                <CardContent className="p-3 flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-full">
                    <Check className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-green-800 text-sm">Patient Registered!</p>
                    <p className="text-xs text-green-600">Order Number: {lastOrderData?.orderNumber}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid lg:grid-cols-2 gap-4">
          <div className="space-y-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <Card>
                  <CardHeader className="pb-2 px-4 pt-3">
                    <CardTitle className="flex items-center gap-2 text-sm font-medium">
                      <User className="h-4 w-4 text-blue-600" />
                      Patient Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-4 pb-4 grid gap-3 grid-cols-2">
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <FormLabel className="text-xs">Full Name *</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input placeholder="Enter name" className="pl-9 h-9" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="mobile"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">Mobile *</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">+91</span>
                              <Input placeholder="9876543210" className="pl-10 h-9" maxLength={10} {...field} />
                            </div>
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">Email</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input type="email" placeholder="email@example.com" className="pl-9 h-9" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="age"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">Age *</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Age"
                              className="h-9"
                              min={1}
                              max={120}
                              {...field}
                              onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                            />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">Gender *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-9">
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Male">Male</SelectItem>
                              <SelectItem value="Female">Female</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="branchId"
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <FormLabel className="text-xs">Branch *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-9">
                                <Building2 className="h-4 w-4 text-muted-foreground mr-2" />
                                <SelectValue placeholder="Select Branch" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {labBranches.filter(b => b.isActive).map((branch) => (
                                <SelectItem key={branch.id} value={branch.id}>
                                  {branch.code} - {branch.name}, {branch.city}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2 px-4 pt-3">
                    <CardTitle className="flex items-center gap-2 text-sm font-medium">
                      <CreditCard className="h-4 w-4 text-blue-600" />
                      Payment Mode
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-4 pb-4">
                    <FormField
                      control={form.control}
                      name="paymentMode"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="grid grid-cols-2 gap-2">
                              {paymentMethods.map((method) => (
                                <Button
                                  key={method.id}
                                  type="button"
                                  variant={field.value === method.id ? "default" : "outline"}
                                  className={cn(
                                    "h-12 flex flex-col gap-1",
                                    field.value === method.id && "bg-blue-600 hover:bg-blue-700"
                                  )}
                                  onClick={() => field.onChange(method.id)}
                                >
                                  {method.icon}
                                  <span className="text-[10px]">{method.label}</span>
                                </Button>
                              ))}
                            </div>
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {(selectedTests.length > 0 || selectedPackages.length > 0) && (
                  <Card className="border-blue-200 bg-blue-50/50">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-muted-foreground">Selected Items</p>
                          <p className="text-sm">{selectedTests.length} tests, {selectedPackages.length} packages</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">Total Amount</p>
                          <p className="text-xl font-bold text-blue-600 flex items-center justify-end">
                            <IndianRupee className="w-4 h-4" />{grandTotal}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Button
                  type="submit"
                  className="w-full h-10 bg-blue-600 hover:bg-blue-700"
                  disabled={isSubmitting || (selectedTests.length === 0 && selectedPackages.length === 0)}
                >
                  {isSubmitting ? "Registering..." : (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Register Walk-In Patient
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </div>

          <Card className="h-fit">
            <CardHeader className="pb-2 px-4 pt-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-sm font-medium">
                  <Plus className="h-4 w-4 text-blue-600" />
                  Select Tests / Packages
                </CardTitle>
                {(selectedTests.length > 0 || selectedPackages.length > 0) && (
                  <Button type="button" variant="ghost" size="sm" onClick={clearAllSelections} className="text-red-600 h-7 text-xs">
                    <X className="h-3 w-3 mr-1" />
                    Clear
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="mb-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search tests or packages..."
                    className="pl-9 h-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "tests" | "packages")}>
                <TabsList className="grid w-full grid-cols-2 mb-3 h-9">
                  <TabsTrigger value="tests" className="flex items-center gap-1 text-xs">
                    Tests
                    {selectedTests.length > 0 && (
                      <Badge variant="secondary" className="ml-1 h-4 px-1 text-[10px]">{selectedTests.length}</Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="packages" className="flex items-center gap-1 text-xs">
                    Packages
                    {selectedPackages.length > 0 && (
                      <Badge variant="secondary" className="ml-1 h-4 px-1 text-[10px]">{selectedPackages.length}</Badge>
                    )}
                  </TabsTrigger>
                </TabsList>

                <Button type="button" variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)} className="mb-3 h-7 text-xs">
                  <Filter className="w-3 h-3 mr-1" />
                  Filters
                  {showFilters ? <ChevronUp className="w-3 h-3 ml-1" /> : <ChevronDown className="w-3 h-3 ml-1" />}
                </Button>

                <AnimatePresence>
                  {showFilters && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mb-3">
                      <div className="flex flex-wrap gap-1.5 p-2.5 bg-gray-50 rounded-lg dark:bg-gray-800/50">
                        <Button
                          type="button"
                          variant={(activeTab === "tests" ? selectedTestCategory : selectedPackageCategory) === "All" ? "default" : "outline"}
                          size="sm"
                          onClick={() => activeTab === "tests" ? setSelectedTestCategory("All") : setSelectedPackageCategory("All")}
                          className="h-6 text-[10px] px-2"
                        >
                          All
                        </Button>
                        {(activeTab === "tests" ? testCategories : packageCategories).map((category) => (
                          <Button
                            key={category}
                            type="button"
                            variant={(activeTab === "tests" ? selectedTestCategory : selectedPackageCategory) === category ? "default" : "outline"}
                            size="sm"
                            onClick={() => activeTab === "tests" ? setSelectedTestCategory(category) : setSelectedPackageCategory(category)}
                            className="h-6 text-[10px] px-2"
                          >
                            {category}
                          </Button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <TabsContent value="tests" className="mt-0">
                  <ScrollArea className="h-[400px] pr-2">
                    <div className="space-y-2">
                      {filteredTests.length > 0 ? (
                        filteredTests.map((test) => {
                          const isSelected = selectedTests.includes(test.id);
                          return (
                            <div
                              key={test.id}
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleTestToggle(test.id);
                              }}
                              className={cn(
                                "flex items-start gap-2 p-2.5 rounded-lg border cursor-pointer transition-all select-none",
                                isSelected ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : "border-gray-200 hover:border-blue-200 dark:border-gray-700"
                              )}
                            >
                              <Checkbox
                                checked={isSelected}
                                onCheckedChange={() => handleTestToggle(test.id)}
                                onClick={(e) => e.stopPropagation()}
                                className="mt-0.5"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                  <div>
                                    <h4 className="font-medium text-xs">{test.name}</h4>
                                    <p className="text-[10px] text-gray-500">Code: {test.code}</p>
                                  </div>
                                  <p className="font-semibold text-blue-600 text-xs flex items-center shrink-0">
                                    <IndianRupee className="w-3 h-3" />{test.price}
                                  </p>
                                </div>
                                <div className="flex flex-wrap gap-1 mt-1.5">
                                  <Badge variant="outline" className="text-[10px] px-1.5 py-0">{test.category}</Badge>
                                  <Badge variant="outline" className="text-[10px] px-1.5 py-0">{test.sampleType}</Badge>
                                  <Badge variant="outline" className="text-[10px] px-1.5 py-0 flex items-center gap-0.5">
                                    <Clock className="w-2.5 h-2.5" />{test.reportTime}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="text-center py-6 text-gray-500 text-xs">No tests found</div>
                      )}
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="packages" className="mt-0">
                  <ScrollArea className="h-[400px] pr-2">
                    <div className="space-y-2">
                      {filteredPackages.length > 0 ? (
                        filteredPackages.map((pkg) => {
                          const isSelected = selectedPackages.includes(pkg.id);
                          const discountedPrice = pkg.discount ? pkg.price - (pkg.price * pkg.discount) / 100 : pkg.price;

                          return (
                            <div
                              key={pkg.id}
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handlePackageToggle(pkg.id);
                              }}
                              className={cn(
                                "relative p-2.5 rounded-lg border cursor-pointer transition-all select-none",
                                isSelected ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20" : "border-gray-200 hover:border-purple-200 dark:border-gray-700"
                              )}
                            >
                              {pkg.discount && (
                                <Badge className="absolute top-1.5 right-1.5 bg-green-500 text-[10px] px-1.5 py-0">{pkg.discount}% OFF</Badge>
                              )}

                              <div className="flex items-start gap-2">
                                <Checkbox
                                  checked={isSelected}
                                  onCheckedChange={() => handlePackageToggle(pkg.id)}
                                  onClick={(e) => e.stopPropagation()}
                                  className="mt-0.5"
                                />
                                <div className="flex-1">
                                  <h4 className="font-semibold text-xs pr-14">{pkg.name}</h4>
                                  <p className="text-[10px] text-gray-600 mt-0.5 dark:text-gray-400">{pkg.description}</p>

                                  <Collapsible>
                                    <CollapsibleTrigger asChild>
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="text-[10px] text-blue-600 p-0 h-auto mt-1"
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        View {pkg.testCount} tests <ChevronDown className="w-2.5 h-2.5 ml-0.5" />
                                      </Button>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent>
                                      <div className="flex flex-wrap gap-1 mt-1.5">
                                        {pkg.testsIncluded.map((test, idx) => (
                                          <Badge key={idx} variant="secondary" className="text-[10px] px-1.5 py-0">{test}</Badge>
                                        ))}
                                      </div>
                                    </CollapsibleContent>
                                  </Collapsible>

                                  <div className="flex items-center justify-between mt-2">
                                    <div className="flex items-center gap-1.5">
                                      <Badge variant="outline" className="text-[10px] px-1.5 py-0">{pkg.category}</Badge>
                                      <Badge variant="outline" className="text-[10px] px-1.5 py-0 flex items-center gap-0.5">
                                        <Clock className="w-2.5 h-2.5" />{pkg.reportTime}
                                      </Badge>
                                    </div>
                                    <div className="text-right">
                                      {pkg.discount && (
                                        <p className="text-[10px] text-gray-400 line-through flex items-center">
                                          <IndianRupee className="w-2.5 h-2.5" />{pkg.price}
                                        </p>
                                      )}
                                      <p className="font-bold text-purple-600 text-xs flex items-center">
                                        <IndianRupee className="w-3 h-3" />{Math.round(discountedPrice)}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="text-center py-6 text-gray-500 text-xs">No packages found</div>
                      )}
                    </div>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={showConvertDialog} onOpenChange={setShowConvertDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-base">Convert to Home Collection?</DialogTitle>
            <DialogDescription className="text-xs">
              Patient details and selected tests will be transferred to the Schedule Home Collection form.
            </DialogDescription>
          </DialogHeader>
          <div className="p-3 bg-gray-50 rounded-lg text-xs dark:bg-gray-800/50">
            <p><strong>Patient:</strong> {form.watch("fullName") || "Not entered"}</p>
            <p><strong>Tests:</strong> {selectedTests.length}</p>
            <p><strong>Packages:</strong> {selectedPackages.length}</p>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowConvertDialog(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleConvertToHomeCollection}>
              <CalendarPlus className="w-4 h-4 mr-2" />
              Convert
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showReceiptDialog} onOpenChange={setShowReceiptDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-base flex items-center gap-2">
              <FileText className="w-4 h-4 text-green-600" />
              Registration Complete
            </DialogTitle>
          </DialogHeader>
          {lastOrderData && (
            <div className="space-y-3">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200 dark:bg-green-900/20 dark:border-green-800">
                <div className="text-center">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Order Number</p>
                  <p className="text-lg font-bold text-green-700 dark:text-green-400">{lastOrderData.orderNumber}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 bg-gray-50 rounded dark:bg-gray-800/50">
                  <p className="text-gray-500 dark:text-gray-400">Patient</p>
                  <p className="font-medium">{lastOrderData.patientName}</p>
                </div>
                <div className="p-2 bg-gray-50 rounded dark:bg-gray-800/50">
                  <p className="text-gray-500 dark:text-gray-400">Amount</p>
                  <p className="font-medium flex items-center">
                    <IndianRupee className="w-3 h-3" />{lastOrderData.totalAmount}
                  </p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" size="sm" className="w-full sm:w-auto" onClick={handlePrintReceipt}>
              <Printer className="w-4 h-4 mr-2" />
              Print Receipt
            </Button>
            <Button size="sm" className="w-full sm:w-auto" onClick={handleSendReceipt}>
              <Send className="w-4 h-4 mr-2" />
              Send & Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

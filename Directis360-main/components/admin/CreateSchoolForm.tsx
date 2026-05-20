"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createSchool } from "@/services/adminSchoolsService"; // Direct service usage
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle, CardDescription as CardDesc } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, AlertCircle, School, Lock, CreditCard } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

// Schema Validation
const formSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").max(50, "Name must be less than 50 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  schoolType: z.enum(["primaire", "cem", "lycee"]),
  derivationKey: z
    .string()
    .min(3, "Key must be at least 3 characters")
    .regex(/^[a-z0-9]+$/, "Key must contain only lowercase letters and numbers")
    .trim(),
  isActive: z.boolean().default(false),
  planName: z.enum(["Basic", "Standard", "Premium"]).default("Basic"),
  planDuration: z.enum(["Monthly", "Yearly"]).default("Yearly"),
  planPrice: z.coerce.number().min(0).default(20000), 
});

type FormValues = z.infer<typeof formSchema>;

export function CreateSchoolForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      schoolType: "primaire",
      derivationKey: "",
      isActive: false,
      planName: "Basic",
      planDuration: "Yearly",
      planPrice: 20000,
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    setGlobalError(null);
    const token = localStorage.getItem("adminToken");
    
    if (!token) {
        setGlobalError("Authentication expired. Please logging in again.");
        setIsSubmitting(false);
        return;
    }

    try {
        const payload = {
            name: values.name,
            email: values.email,
            password: values.password,
            schoolType: values.schoolType,
            derivationKey: values.derivationKey,
            initialSubscription: {
                active: values.isActive,
                plan: values.isActive ? {
                    name: values.planName,
                    price: values.planPrice,
                    duration: values.planDuration
                } : undefined
            }
        };

        await createSchool(token, payload);
        
        toast({
            title: "School Created",
            description: `${values.name} has been successfully registered.`,
        });

        router.push("/admin");

    } catch (error: any) {
        console.error("Submission Error:", error);
        
        // Handle specific field errors
        const errorMessage = error.message?.toLowerCase() || "";
        
        if (errorMessage.includes("derivation key already taken")) {
            form.setError("derivationKey", { 
                type: "manual", 
                message: "This key is already in use by another school." 
            });
            form.setFocus("derivationKey");
        } else if (errorMessage.includes("email already registered")) {
            form.setError("email", { 
                type: "manual", 
                message: "This email address is already registered." 
            });
            form.setFocus("email");
        } else {
            setGlobalError(error.message || "An unexpected error occurred. Please try again.");
        }
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        
        {globalError && (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{globalError}</AlertDescription>
            </Alert>
        )}

        <div className="grid gap-8 md:grid-cols-2">
            {/* Left Column: Identity & Access */}
            <div className="space-y-6">
                 <Card>
                    <CardHeader className="pb-4">
                        <div className="flex items-center gap-2">
                             <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                <School className="h-5 w-5" />
                             </div>
                             <div>
                                <CardTitle className="text-lg">School Identity</CardTitle>
                                <CardDesc>Basic information and structure.</CardDesc>
                             </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>School Name</FormLabel>
                                <FormControl>
                                <Input placeholder="e.g. Al-Manar Academy" {...field} disabled={isSubmitting} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="schoolType"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>School Level</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                                <FormControl>
                                    <SelectTrigger>
                                    <SelectValue placeholder="Select level" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="primaire">Primaire (Primary)</SelectItem>
                                    <SelectItem value="cem">CEM (Middle)</SelectItem>
                                    <SelectItem value="lycee">Lycée (High School)</SelectItem>
                                </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="derivationKey"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Derivation Key (Unique ID)</FormLabel>
                                <FormControl>
                                <Input placeholder="unique-school-id" {...field} disabled={isSubmitting} />
                                </FormControl>
                                <FormDescription>
                                  Used for internal routing. Must be unique.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                    </CardContent>
                 </Card>

                 <Card>
                    <CardHeader className="pb-4">
                        <div className="flex items-center gap-2">
                             <div className="p-2 bg-slate-100 text-slate-600 rounded-lg">
                                <Lock className="h-5 w-5" />
                             </div>
                             <div>
                                <CardTitle className="text-lg">Admin Access</CardTitle>
                                <CardDesc>Credentials for the school administrator.</CardDesc>
                             </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Admin Email</FormLabel>
                                <FormControl>
                                <Input placeholder="admin@school.com" {...field} disabled={isSubmitting} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                <Input type="password" placeholder="••••••••" {...field} disabled={isSubmitting} />
                                </FormControl>
                                <FormDescription>
                                    Min. 8 characters.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                    </CardContent>
                 </Card>
            </div>

            {/* Right Column: Subscription */}
            <div className="space-y-6">
                <Card className="h-full border-slate-200 shadow-sm">
                    <CardHeader className="pb-4 bg-slate-50/50 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                             <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                                <CreditCard className="h-5 w-5" />
                             </div>
                             <div>
                                <CardTitle className="text-lg">Subscription & Billing</CardTitle>
                                <CardDesc>Configure initial access rights.</CardDesc>
                             </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                         <div className="rounded-lg border p-4 bg-white shadow-sm">
                             <FormField
                                control={form.control}
                                name="isActive"
                                render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between space-y-0">
                                    <div className="space-y-1">
                                       <FormLabel className="text-base font-semibold">Activate Immediately?</FormLabel>
                                       <FormDescription>
                                         If unchecked, the school will be created in an <strong>Inactive</strong> state.
                                       </FormDescription>
                                    </div>
                                    <FormControl>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        disabled={isSubmitting}
                                        className="h-5 w-5"
                                    />
                                    </FormControl>
                                </FormItem>
                                )}
                            />
                         </div>

                        {form.watch("isActive") && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-top-2 pt-2">
                                <FormLabel className="text-sm font-semibold text-slate-900">Subscription Plan Details</FormLabel>
                                <div className="grid grid-cols-1 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="planName"
                                        render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Plan Tier</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select plan" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="Basic">Basic</SelectItem>
                                                    <SelectItem value="Standard">Standard</SelectItem>
                                                    <SelectItem value="Premium">Premium</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                        )}
                                    />

                                    <div className="grid grid-cols-2 gap-4">
                                         <FormField
                                            control={form.control}
                                            name="planDuration"
                                            render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Duration</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select duration" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="Monthly">Monthly</SelectItem>
                                                        <SelectItem value="Yearly">Yearly</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                            )}
                                        />
                                         <FormField
                                            control={form.control}
                                            name="planPrice"
                                            render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Price (DZD)</FormLabel>
                                                <FormControl>
                                                <Input type="number" {...field} disabled={isSubmitting} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        {!form.watch("isActive") && (
                             <div className="p-4 bg-slate-50 text-slate-500 text-sm rounded-lg border border-slate-100 italic text-center">
                                 The school will be created but users cannot log in until you activate a subscription in the dashboard.
                             </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>

        <div className="flex justify-end gap-4 pt-4 border-t">
           <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
             Cancel
           </Button>
           <Button type="submit" disabled={isSubmitting} className="min-w-[150px]">
             {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
             {isSubmitting ? "Creating..." : "Create School"}
           </Button>
        </div>
      </form>
    </Form>
  );
}

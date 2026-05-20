"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Check, Loader2, School, Users, Building } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/context/language-context";
import api from "@/lib/api";


// Form validation schema
const signupSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^[0-9+\-\s()]+$/, "Please enter a valid phone number"),
  plan: z.enum(["starter", "professional", "enterprise"], {
    required_error: "Please select a plan",
  }),
  schoolName: z.string().min(2, "School name must be at least 2 characters"),
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
});

type SignupFormData = z.infer<typeof signupSchema>;

const plans = [
  {
    id: "starter",
    name: "Starter",
    price: "1,500 DZD/student",
    description: "Perfect for small schools up to 100 students",
    icon: <School className="h-5 w-5" />,
    features: ["Up to 100 students", "Basic dashboards", "Grade management"],
    popular: false,
  },
  {
    id: "professional",
    name: "Professional",
    price: "3,000 DZD/month",
    description: "Ideal for most of schools up to 300 students",
    icon: <Users className="h-5 w-5" />,
    features: [
      "Up to 300 students",
      "Advanced analytics",
      "API access",
      "Priority support",
    ],
    popular: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Custom pricing",
    description: "For large institutions with unlimited students",
    icon: <Building className="h-5 w-5" />,
    features: [
      "Unlimited students",
      "Multi-school management",
      "Custom features",
      "Dedicated support",
    ],
    popular: false,
  },
];

export default function SignupForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const { t, isRTL } = useLanguage();

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      phone: "",
      plan: undefined,
      schoolName: "",
      fullName: "",
    },
  });

  const selectedPlan = form.watch("plan");
  const selectedPlanDetails = plans.find((plan) => plan.id === selectedPlan);

  const onSubmit = async (data: SignupFormData) => {
    setIsSubmitting(true);

    try {
      // const response = await fetch("/tg/signup", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(data),
      // });

      const response = api.post("/tgbot/signup",JSON.stringify(data));

      // if (!response.ok) {
      //   throw new Error("Failed to submit signup");
      // }

      setSubmitSuccess(true);
      form.reset();
    } catch (error) {
      console.error("Signup error:", error);
      // Handle error (you might want to show a toast notification)
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl">
            {t.signup_success_title}
          </CardTitle>
          <CardDescription className="text-base">
            {t.signup_success_desc}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Button onClick={() => setSubmitSuccess(false)} variant="outline">
            {t.signup_submit_another}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col items-center justify-center  text-center space-y-4">
        <Link href={"/"}>
          <Image src={"/logoDirectis.png"} alt="logo" width={40} height={40} />
        </Link>
        <h1 className="text-3xl md:text-4xl font-bold">
          {t.signup_title} <span className="text-indigo-600">{t.signup_title_suffix}</span>
          <span className="text-orange-600">{t.signup_title_suffix_2}</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          {t.signup_subtitle}
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Signup Form */}
        {selectedPlanDetails ? (
          <Card className="bg-indigo-600/5 border-indigo-600/20">
            <CardHeader>
              <CardTitle className="text-lg">
                {t.signup_selected_plan}: {selectedPlanDetails.name}
              </CardTitle>
              <CardDescription>{selectedPlanDetails.price}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                {selectedPlanDetails.description}
              </p>
              <div className="text-sm">
                <strong>{t.signup_plan_includes}:</strong>
                <ul className="mt-2 space-y-1">
                  {selectedPlanDetails.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Check className="h-3 w-3 text-indigo-600 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            <Card className="bg-indigo-600/5 border-indigo-600/20">
              <CardHeader>
                <CardTitle className="text-lg">{t.signup_selected_plan_placeholder} </CardTitle>
                {/* <CardDescription>{selectedPlanDetails.price}</CardDescription> */}
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  {/* {selectedPlanDetails.description} */}
                  {t.signup_plan_see_included}
                </p>
              </CardContent>
            </Card>
          </>
        )}
        <div className="space-y-6">
          <div>
            <div className="space-y-4">
              {plans.map((plan) => (
                <Card
                  key={plan.id}
                  className={`cursor-pointer transition-all ${
                    selectedPlan === plan.id
                      ? "border-indigo-600 border-2 shadow-md"
                      : "hover:border-indigo-600/50"
                  }`}
                  onClick={() => form.setValue("plan", plan.id as any)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-600/10 rounded-lg flex items-center justify-center text-indigo-600">
                          {plan.icon}
                        </div>
                        <div>
                          <CardTitle className="text-lg flex items-center gap-2">
                            {plan.name}
                            {plan.popular && (
                              <Badge className="bg-indigo-600 text-indigo-200">
                                {t.signup_plan_popular}
                              </Badge>
                            )}
                          </CardTitle>
                          <CardDescription className="text-sm">
                            {plan.price}
                          </CardDescription>
                        </div>
                      </div>
                      {selectedPlan === plan.id && (
                        <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center">
                          <Check className="h-4 w-4 text-indigo-200" />
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground mb-3">
                      {plan.description}
                    </p>
                    <ul className="space-y-1">
                      {plan.features.slice(0, 3).map((feature, index) => (
                        <li
                          key={index}
                          className="flex items-center gap-2 text-sm"
                        >
                          <Check className="h-3 w-3 text-indigo-600 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                      {plan.features.length > 3 && (
                        <li className="text-xs text-muted-foreground">
                          +{plan.features.length - 3} {t.signup_plan_more_features}
                        </li>
                      )}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>{t.signup_school_info_title}</CardTitle>
            <CardDescription>
              {t.signup_school_info_desc}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t.signup_fullname_label}</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="schoolName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t.signup_schoolname_label}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your school name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t.signup_email_label}</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="school@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t.signup_phone_label}</FormLabel>
                      <FormControl>
                        <Input placeholder="+213 XXX XXX XXX" {...field} />
                      </FormControl>
                      <FormDescription>
                        {t.signup_phone_desc}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t.signup_submitting}
                    </>
                  ) : (
                    "Get Started"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        {/* Plan Details */}
      </div>
    </div>
  );
}

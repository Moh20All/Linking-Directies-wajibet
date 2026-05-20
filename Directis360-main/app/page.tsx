"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  GraduationCap,
  Users,
  BookOpen,
  BarChart3,
  UserCheck,
  School,
  Menu,
  X,
  ChevronRight,
  Github,
  Check,
} from "lucide-react";

import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { useLanguage } from "@/context/language-context";

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t, isRTL } = useLanguage();
  const features = [
    {
      icon: <School className="h-6 w-6" />,
      title: "Headmaster Dashboard",
      description:
        "Complete school oversight with analytics, reports, and administrative controls.",
    },
    {
      icon: <GraduationCap className="h-6 w-6" />,
      title: "Teacher Portal",
      description:
        "Manage classes, grades, attendance, and communicate with students and parents.",
    },
    {
      icon: <BookOpen className="h-6 w-6" />,
      title: "Student Hub",
      description:
        "Access assignments, grades, schedules, and collaborate with classmates.",
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Parent Access",
      description:
        "Monitor your child's progress, attendance, and communicate with teachers.",
    },
    {
      icon: <UserCheck className="h-6 w-6" />,
      title: "Admin Panel",
      description:
        "System administration, user management, and technical configurations.",
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Analytics & Reports",
      description:
        "Comprehensive insights into academic performance and school operations.",
    },
  ];

  const teamMembers = [
    {
      name: "Merad Mohamed Said",
      role: "Back End Developer",
      github: "MeradMohamedSaid",
      bio: "Full-stack developer with 4+ years in the field",
    },
    {
      name: "Amrane Mohamed Aymen",
      role: "Front End Developer",
      github: "mou-ny",
      bio: "Web Developer with 3+ years in the field",
    },
  ];

  const pricingPlans = [
    {
      name: "Starter",
      price: "1,500",
      period: "DZD/student",
      description: "Perfect for small schools up to 100 students",
      features: [
        "Up to 100 students",
        "Grade management",
        "Attendance tracking",
        "Parent communication",
        "Email support",
      ],
    },
    {
      name: "Professional",
      price: "3,000",
      period: "DZD/student",
      description: "Ideal for medium schools up to 300 students",
      features: [
        "All starter features",
        "Up to 300 students",
        "Bulk operations",
        "API access",
        "Priority support",
        "Data export tools",
      ],
      popular: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "Contact us",
      description: "For large institutions with unlimited students",
      features: [
        "Unlimited students",
        "Multi-school management",
        "Advanced integrations",
        "Custom features",
        "Dedicated support",
        "On-premise deployment",
        "Training & onboarding",
      ],
    },
  ];

  // --- Animation variants ---
  const fadeSlide = {
    hidden: { opacity: 0, y: 80, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.8, ease: [0.25, 0.8, 0.25, 1] },
    },
  };

  // --- Section Wrapper for animation control ---
  const Section = ({
    id,
    children,
  }: {
    id: string;
    children: React.ReactNode;
  }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, {
      margin: "-40% 0px -40% 0px",
      once: false,
    });

    return (
      <motion.section
        id={id}
        ref={ref}
        variants={fadeSlide}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="h-screen snap-start flex flex-col justify-center px-4"
      >
        {children}
      </motion.section>
    );
  };

  return (
    <div className="h-screen overflow-y-scroll scroll-smooth snap-y snap-mandatory bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur border-b">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logoDirectis.png"
              alt="Directis 360"
              width={40}
              height={40}
            />
            <span className="text-xl font-bold">Directis 360</span>
          </Link>

          <nav className="hidden md:flex gap-8">
            {["about", "features", "dev-team", "pricing"].map((item) => (
              <a
                key={item}
                href={`#${item}`}
                className="hover:text-indigo-600 text-sm font-medium"
              >
                {item.charAt(0).toUpperCase() + item.slice(1).replace("-", " ")}
              </a>
            ))}
          </nav>

          <Link href="/dashboard">
            <Button className="hidden md:inline-flex">Dashboard</Button>
          </Link>

          <div className={`absolute top-4 ${isRTL ? "left-4" : "right-4"}`}>
            <LanguageSwitcher />
          </div>

          <Button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </header>

      {/* Sections */}
      <main className="snap-y snap-mandatory">
        {/* About */}
        <Section id="about">
          <div className="text-center space-y-6">
            <Badge variant="secondary">
              {t.lp_about_badge}
            </Badge>
            <h1 className="text-5xl font-bold max-w-4xl mx-auto">
              {t.lp_about_title_part1}
              <span className="text-indigo-600"> {t.lp_about_title_highlight} </span>
              {t.lp_about_title_part2}
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.lp_about_desc}
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/signup">
                <Button size="lg">
                  {t.lp_about_get_started} <ChevronRight />
                </Button>
              </Link>
              <Button variant="outline" size="lg">
                {t.lp_about_watch_demo}
              </Button>
            </div>
          </div>
        </Section>

        {/* Features */}
        <Section id="features">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">
              {t.lp_features_title}
            </h2>
            <p className="text-muted-foreground mb-12">
              {t.lp_features_desc}
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((f, i) => (
                <motion.div
                  key={i}
                  variants={fadeSlide}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-shadow hover:border-indigo-500 border-2">
                    <CardHeader>
                      <div className="bg-indigo-600/10 p-3 rounded-lg w-fit text-indigo-600 mb-3">
                        {f.icon}
                      </div>
                      <CardTitle>{f.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>{f.description}</CardDescription>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </Section>

        {/* Team */}
        <Section id="dev-team">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-12">{t.lp_team_title}</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {teamMembers.map((m, i) => (
                <motion.div key={i} variants={fadeSlide}>
                  <Card className="hover:shadow-lg transition">
                    <CardHeader>
                      <div className="w-24 h-24 mx-auto rounded-full overflow-hidden mb-4">
                        <Image
                          src={`https://github.com/${m.github}.png`}
                          alt={m.name}
                          width={96}
                          height={96}
                        />
                      </div>
                      <CardTitle>{m.name}</CardTitle>
                      <CardDescription className="text-indigo-600 font-medium">
                        {m.role}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Link
                        href={`https://github.com/${m.github}`}
                        target="_blank"
                        className="text-indigo-600 hover:underline flex justify-center items-center gap-2 mb-2"
                      >
                        @{m.github} <Github className="w-4 h-4" />
                      </Link>
                      <p className="text-sm text-muted-foreground">{m.bio}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </Section>

        {/* Pricing */}
        <Section id="pricing">
          <div className="max-w-7xl mx-auto text-center space-y-8">
            <h2 className="text-3xl font-bold">{t.lp_pricing_title}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t.lp_pricing_desc}
            </p>
            <div className="grid lg:grid-cols-3 gap-8 mt-8">
              {pricingPlans.map((p, i) => (
                <motion.div key={i} variants={fadeSlide}>
                  <Card
                    className={`relative border-2 transition-transform hover:-translate-y-2 h-[45vh] ${
                      p.popular
                        ? "border-indigo-600 shadow-lg bg-indigo-50"
                        : "border-gray-200"
                    }`}
                  >
                    {p.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <Badge className="bg-indigo-600 text-white">
                          {t.lp_pricing_plan_popular}
                        </Badge>
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle className="text-2xl">{p.name}</CardTitle>
                      <div className="text-4xl font-bold mt-2">
                        {p.price}{" "}
                        <span className="text-sm text-muted-foreground">
                          {p.period}
                        </span>
                      </div>
                      <CardDescription>{p.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="text-left space-y-2">
                        {p.features.map((f, j) => (
                          <li key={j} className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-indigo-600" /> {f}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
          <div className="w-full flex justify-center mt-6">
            <Button className="w-[30%] bg-indigo-600 text-white hover:bg-indigo-700">
              <Link
                href="/signup"
                className="w-full h-full flex justify-center items-center"
              >
                {t.lp_pricing_footer_btn}
              </Link>
            </Button>
          </div>
        </Section>
      </main>

      <footer className="bg-muted/40 py-6 text-center text-sm text-muted-foreground">
        <p>
          © {new Date().getFullYear()} Directis 360. {t.lp_footer_text_part2}
        </p>
      </footer>
    </div>
  );
}

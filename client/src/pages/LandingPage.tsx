"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, Users, Calendar, Stethoscope, Shield, Star, ArrowRight, Menu, X } from "lucide-react"
import { useState } from "react"

export function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Stethoscope className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">ClinicDesk</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
                Features
              </a>
              <a href="#benefits" className="text-muted-foreground hover:text-foreground transition-colors">
                Benefits
              </a>

              <div className="hidden md:flex items-center space-x-4">
                <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                    Sign In
                </Button>
                <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">Get Started</Button>
              </div>
            </nav>

            

            {/* Mobile menu button */}
            <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-border">
              <nav className="flex flex-col space-y-4">
                <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
                  Features
                </a>
                <a href="#benefits" className="text-muted-foreground hover:text-foreground transition-colors">
                  Benefits
                </a>

                <div className="flex flex-col space-y-2 pt-4">
                  <Button variant="ghost" className="justify-start">
                    Sign In
                  </Button>
                  <Button className="bg-accent hover:bg-accent/90 text-accent-foreground justify-start">
                    Get Started
                  </Button>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-b from-muted/50 to-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-balance mb-6">
              Streamline Your Clinic's
              <span className="text-primary"> Front Desk Operations</span>
            </h1>
            <p className="text-xl text-muted-foreground text-pretty mb-8 max-w-2xl mx-auto">
              Manage appointments, queue patients, and organize doctor schedules with our comprehensive front desk
              management system designed specifically for healthcare providers.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-12 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-balance mb-4">
              Everything You Need to Run Your Front Desk
            </h2>
            <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
              Powerful features designed to improve patient experience and staff efficiency
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Smart Queue Management</CardTitle>
                <CardDescription>
                  Efficiently manage walk-in patients with automated queue numbers, priority handling, and real-time
                  wait time tracking.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    Automatic queue number assignment
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    Priority patient handling
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    Real-time status updates
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <Calendar className="w-6 h-6 text-accent" />
                </div>
                <CardTitle>Appointment Scheduling</CardTitle>
                <CardDescription>
                  Book, reschedule, and manage appointments with integrated calendar views and automated availability
                  checking.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-accent" />
                    Calendar integration
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-accent" />
                    Availability checking
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-accent" />
                    Automated reminders
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-secondary" />
                </div>
                <CardTitle>Doctor Management</CardTitle>
                <CardDescription>
                  Comprehensive doctor profiles with specializations, schedules, and availability management for optimal
                  patient matching.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-secondary" />
                    Detailed doctor profiles
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-secondary" />
                    Schedule management
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-secondary" />
                    Specialization filtering
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-balance mb-6">
                Reduce Wait Times, Increase Patient Satisfaction
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Our system helps clinics reduce average wait times by 40% while improving staff efficiency and patient
                experience through intelligent queue management and streamlined workflows.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center mt-1">
                    <CheckCircle className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">40% Faster Patient Processing</h3>
                    <p className="text-muted-foreground">
                      Streamlined workflows reduce bottlenecks and improve throughput
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-accent/10 rounded-full flex items-center justify-center mt-1">
                    <CheckCircle className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">95% Patient Satisfaction</h3>
                    <p className="text-muted-foreground">
                      Clear communication and reduced wait times improve patient experience
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-secondary/10 rounded-full flex items-center justify-center mt-1">
                    <CheckCircle className="w-4 h-4 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">30% Staff Efficiency Gain</h3>
                    <p className="text-muted-foreground">Automated processes free up staff for patient care</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-card border border-border rounded-lg p-6 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Queue Status</h3>
                  <Badge className="bg-primary/10 text-primary">Live</Badge>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-bold">
                        12
                      </div>
                      <div>
                        <p className="font-medium">Rajesh</p>
                        <p className="text-sm text-muted-foreground">General Checkup</p>
                      </div>
                    </div>
                    <Badge className="bg-accent/10 text-accent">In Progress</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-muted border-2 border-primary rounded-full flex items-center justify-center text-primary text-sm font-bold">
                        13
                      </div>
                      <div>
                        <p className="font-medium">Shubham Singh</p>
                        <p className="text-sm text-muted-foreground">Follow-up</p>
                      </div>
                    </div>
                    <Badge variant="outline">Waiting</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-muted border rounded-full flex items-center justify-center text-muted-foreground text-sm font-bold">
                        14
                      </div>
                      <div>
                        <p className="font-medium">Shreya</p>
                        <p className="text-sm text-muted-foreground">Consultation</p>
                      </div>
                    </div>
                    <Badge variant="outline">Waiting</Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-balance mb-4">Ready to Transform Your Front Desk?</h2>
          <p className="text-xl text-primary-foreground/80 text-pretty mb-8 max-w-2xl mx-auto">
            Join hundreds of clinics already using ClinicDesk to improve patient experience and staff efficiency
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-background border-t border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Stethoscope className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold">ClinicDesk</span>
              </div>
              <p className="text-muted-foreground text-sm">
                Professional front desk management system designed specifically for healthcare providers.
              </p>
            </div>
            
            
            
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 ClinicDesk. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

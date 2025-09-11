
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
// import { useAuth } from "./auth-provider"
import {
  Users,
  Calendar,
  UserCheck,
  Clock,
  LogOut,
  Stethoscope,
  Activity,
  TrendingUp,
} from "lucide-react"
import { DoctorManagement } from "../components/DoctorManagement"
import { QueueManagement } from "../components/QueueManagement"
import { AppointmentManagement } from "../components/AppointmentManagement"


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export function Dashboard() {
  // const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState("overview");

  const logout = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include', 
      });

      if (response.ok) {
        window.location.href = '/login';
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('An error occurred during logout:', error);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-sm">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-primary rounded-lg">
                <Stethoscope className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-primary">Clinic Front Desk</h1>
                <p className="text-xs text-muted-foreground">Patient Management System</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">

            <div className="h-6 w-px bg-border" />

            <Button variant="outline" size="sm" onClick={logout}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="border-b bg-card">
        <div className="flex space-x-8 px-6">
          {[
            { id: "overview", label: "Overview", icon: Activity },
            { id: "queue", label: "Queue Management", icon: Clock },
            { id: "appointments", label: "Appointments", icon: Calendar },
            { id: "doctors", label: "Doctors", icon: UserCheck },
          ].map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            )
          })}
        </div>
      </nav>

      {/* Main Content */}
      <main className="p-6">
        {activeTab === "overview" && <OverviewTab />}
        {activeTab === "queue" && <QueueManagement />}
        {activeTab === "appointments" && <AppointmentManagement />}
        {activeTab === "doctors" && <DoctorManagement />}
      </main>
    </div>
  )
}

function OverviewTab() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-balance">Dashboard Overview</h2>
          <p className="text-muted-foreground">Monitor clinic operations at a glance</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <p className="text-xs text-muted-foreground">{new Date().toLocaleTimeString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Patients in Queue</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">12</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              +2 from yesterday
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">24</div>
            <p className="text-xs text-muted-foreground">8 completed, 16 remaining</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Doctors</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">6</div>
            <p className="text-xs text-muted-foreground">Out of 8 total doctors</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Wait Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">18m</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              -5m from yesterday
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>Recent Activity</span>
            </CardTitle>
            <CardDescription>Latest updates from the clinic</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  time: "2 min ago",
                  action: "Patient checked in",
                  details: "John Smith - Q001",
                  type: "queue",
                },
                {
                  time: "5 min ago",
                  action: "Appointment completed",
                  details: "Alice Wilson with Dr. Smith",
                  type: "appointment",
                },
                {
                  time: "12 min ago",
                  action: "New appointment booked",
                  details: "Carol White - Tomorrow 2:00 PM",
                  type: "appointment",
                },
                {
                  time: "18 min ago",
                  action: "Doctor status updated",
                  details: "Dr. Johnson marked as available",
                  type: "doctor",
                },
              ].map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-muted/50">
                  <div
                    className={`w-2 h-2 rounded-full mt-2 ${
                      activity.type === "queue"
                        ? "bg-blue-500"
                        : activity.type === "appointment"
                          ? "bg-green-500"
                          : "bg-purple-500"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.details}</p>
                    <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="h-20 flex-col space-y-2 bg-transparent">
                <Users className="h-5 w-5" />
                <span className="text-xs">Add Patient to Queue</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2 bg-transparent">
                <Calendar className="h-5 w-5" />
                <span className="text-xs">Book Appointment</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2 bg-transparent">
                <UserCheck className="h-5 w-5" />
                <span className="text-xs">Add Doctor</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2 bg-transparent">
                <Activity className="h-5 w-5" />
                <span className="text-xs">View Reports</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Today's Schedule Preview</CardTitle>
          <CardDescription>Upcoming appointments and queue status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                id: 1,
                time: "09:00",
                patient: "Alice Wilson",
                doctor: "Dr. Smith",
                status: "completed",
                type: "appointment",
              },
              {
                id: 2,
                time: "09:30",
                patient: "Bob Davis",
                doctor: "Dr. Johnson",
                status: "in-progress",
                type: "appointment",
              },
              { id: 3, time: "Current", patient: "John Smith", doctor: "Queue", status: "waiting", type: "queue" },
              {
                id: 4,
                time: "10:00",
                patient: "Carol White",
                doctor: "Dr. Smith",
                status: "scheduled",
                type: "appointment",
              },
              {
                id: 5,
                time: "10:30",
                patient: "David Lee",
                doctor: "Dr. Brown",
                status: "scheduled",
                type: "appointment",
              },
            ].map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div
                    className={`text-sm font-mono px-2 py-1 rounded ${
                      item.type === "queue" ? "bg-blue-100 text-blue-800" : "bg-muted"
                    }`}
                  >
                    {item.time}
                  </div>
                  <div>
                    <p className="font-medium">{item.patient}</p>
                    <p className="text-sm text-muted-foreground">{item.doctor}</p>
                  </div>
                </div>
                <Badge
                  variant={
                    item.status === "completed"
                      ? "default"
                      : item.status === "in-progress"
                        ? "secondary"
                        : item.status === "waiting"
                          ? "secondary"
                          : "outline"
                  }
                >
                  {item.status === "completed"
                    ? "Completed"
                    : item.status === "in-progress"
                      ? "In Progress"
                      : item.status === "waiting"
                        ? "In Queue"
                        : "Scheduled"}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

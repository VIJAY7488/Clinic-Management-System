import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Plus, CalendarIcon, Clock, User, Phone, Edit, Trash2, Search, RefreshCw } from "lucide-react"
import { format, isSameDay, parseISO } from "date-fns"
import axios from "axios"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api"

interface Appointment {
  _id: string
  patient: string
  phone: string
  doctor: string
  reason: string
  notes?: string
  date: string
  time: string
  duration: number
  status: "booked" | "completed" | "cancelled"
  createdAt: string
  updatedAt: string
}

type Doctor = {
  _id: string
  name: string
  specialization?: string
  gender?: string
  location?: string
  availability?: any[]
  status?: boolean
  isActive?: boolean
  currentPatients?: number
  createdAt?: string
  updatedAt?: string
}

export function AppointmentManagement() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedDoctor, setSelectedDoctor] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false)
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null)
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list")
  const [error, setError] = useState<string | null>(null)

  // Fetch appointments from backend
  const fetchAppointments = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${API_BASE_URL}/appointments`)
      setAppointments(response.data.appointments || response.data || [])
      setError(null)
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch appointments")
      console.error("Error fetching appointments:", err)
    } finally {
      setLoading(false)
    }
  }

  // Fetch doctors from backend
  const fetchDoctors = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/doctors`)
      setDoctors(response.data.data || [])
    } catch (err: any) {
      console.error("Error fetching doctors:", err)
      setError(err.response?.data?.message || "Failed to fetch doctors")
    }
  }

  // Create new appointment
  const createAppointment = async (appointmentData: Partial<Appointment>) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/appointments`, appointmentData)
      const newAppointment = response.data.appointment || response.data
      setAppointments((prev) => [...prev, newAppointment])
      setIsBookingDialogOpen(false)
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to create appointment")
      throw err
    }
  }

  // Update appointment
  const updateAppointment = async (id: string, updates: Partial<Appointment>) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/appointments/${id}`, updates)
      const updatedAppointment = response.data.appointment || response.data
      setAppointments((prev) => prev.map((a) => (a._id === id ? updatedAppointment : a)))
      setEditingAppointment(null)
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to update appointment")
      throw err
    }
  }

  // Update appointment status
  const updateAppointmentStatus = async (id: string, status: Appointment["status"]) => {
    try {
      const response = await axios.patch(`${API_BASE_URL}/appointments/${id}/status`, { status })
      const updatedAppointment = response.data.appointment || response.data
      setAppointments((prev) => prev.map((a) => (a._id === id ? updatedAppointment : a)))
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to update status")
      throw err
    }
  }

  // Delete appointment
  const deleteAppointment = async (id: string) => {
    if (!confirm("Are you sure you want to delete this appointment?")) return
    
    try {
      await axios.delete(`${API_BASE_URL}/appointments/${id}`)
      setAppointments((prev) => prev.filter((a) => a._id !== id))
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to delete appointment")
      throw err
    }
  }

  // Load data on component mount
  useEffect(() => {
    fetchAppointments()
    fetchDoctors()
  }, [])

  const filteredAppointments = appointments.filter((appointment) => {
    const appointmentDate = new Date(appointment.date)
    const matchesDate = viewMode === "calendar" ? isSameDay(appointmentDate, selectedDate) : true
    const matchesDoctor = selectedDoctor === "all" || appointment.doctor === selectedDoctor
    const matchesStatus = selectedStatus === "all" || appointment.status === selectedStatus
    
    const matchesSearch = 
      (appointment.patient?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (getDoctorName(appointment.doctor)?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (appointment.reason?.toLowerCase() || "").includes(searchTerm.toLowerCase())

    return matchesDate && matchesDoctor && matchesStatus && matchesSearch
  })

  const generateTimeSlots = (doctor: Doctor, date: Date) => {
  
    if (!doctor.availability || doctor.availability.length === 0) {
      return [];
    }

    const dayName = format(date, "EEEE"); 
  
  
    const availability = doctor.availability.find(
      (slot) => slot.day.toLowerCase() === dayName.toLowerCase()
    );

  
    if (!availability) return [];

    const slots = [];
  
  
    const startTime = parseISO(`2000-01-01T${availability.startTime}:00`);
    const endTime = parseISO(`2000-01-01T${availability.endTime}:00`);
  
    let currentTime = startTime;
    while (currentTime < endTime) {
      const timeString = format(currentTime, "HH:mm");
      
      // Check if this slot is already booked
      const isBooked = appointments.some(
        (apt) =>
          apt.doctor === doctor._id &&
          isSameDay(new Date(apt.date), date) &&
          apt.time === timeString &&
          apt.status !== "cancelled"
      );
  
      if (!isBooked) {
        slots.push(timeString);
      }
  
      // Move to next 30-minute slot
      currentTime = new Date(currentTime.getTime() + 30 * 60 * 1000);
    }
  
    return slots;
  };

  const handleStatusChange = (appointmentId: string, newStatus: Appointment["status"]) => {
    updateAppointmentStatus(appointmentId, newStatus)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "booked":
        return "default"
      case "completed":
        return "secondary"
      case "cancelled":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "booked":
        return "Booked"
      case "completed":
        return "Completed"
      case "cancelled":
        return "Cancelled"
      default:
        return status
    }
  }

  const getDoctorName = (doctor: string | Doctor | null | undefined): string => {
    if (!doctor) return "Unknown Doctor"

    if (typeof doctor === "string") {
      const found = doctors.find((d) => d._id === doctor)
      return found?.name || "Unknown Doctor"
    }

    return doctor.name || "Unknown Doctor"
  } 



  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading appointments...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Appointment Management</h2>
            <p className="text-muted-foreground">Schedule and manage patient appointments</p>
          </div>
          <Button onClick={() => { fetchAppointments(); fetchDoctors(); }}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-red-600">
              <p>Error: {error}</p>
              <p className="text-sm text-muted-foreground mt-2">
                Please check your backend connection and try again.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Appointment Management</h2>
          <p className="text-muted-foreground">Schedule and manage patient appointments</p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={() => { fetchAppointments(); fetchDoctors(); }} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant={viewMode === "list" ? "default" : "outline"} onClick={() => setViewMode("list")}>
            List View
          </Button>
          <Button variant={viewMode === "calendar" ? "default" : "outline"} onClick={() => setViewMode("calendar")}>
            Calendar View
          </Button>
          <Dialog open={isBookingDialogOpen} onOpenChange={setIsBookingDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Book Appointment
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <AppointmentForm
                doctors={doctors}
                onSubmit={async (data) => {
                  await createAppointment(data);
                  setIsBookingDialogOpen(false); 
                }}
                onCancel={() => setIsBookingDialogOpen(false)}
                generateTimeSlots={generateTimeSlots}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {appointments.filter((apt) => isSameDay(new Date(apt.date), new Date())).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Booked</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {appointments.filter((apt) => apt.status === "booked").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {appointments.filter((apt) => apt.status === "completed").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {appointments.filter((apt) => apt.status === "completed" && isSameDay(new Date(apt.date), new Date())).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search appointments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={selectedDoctor} onValueChange={(value) => setSelectedDoctor(value)}>
              <SelectTrigger>
                <SelectValue placeholder="All Doctors" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Doctors</SelectItem>
                {doctors.map((doctor) => (
                  <SelectItem key={doctor._id.toString()} value={doctor._id.toString()}>
                    {doctor.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="booked">Booked</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            {viewMode === "calendar" && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(selectedDate, "PPP")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Appointments List */}
      <Card>
        <CardHeader>
          <CardTitle>
            {viewMode === "calendar" ? `Appointments for ${format(selectedDate, "PPP")}` : "All Appointments"}
          </CardTitle>
          <CardDescription>{filteredAppointments.length} appointment(s) found</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredAppointments
              .sort((a, b) => {
                const dateCompare = new Date(a.date).getTime() - new Date(b.date).getTime()
                if (dateCompare !== 0) return dateCompare
                return a.time.localeCompare(b.time)
              })
              .map((appointment) => (
                <div key={appointment._id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline"   className="font-mono">
                          {appointment.date ? format(new Date(appointment.date), "MMM dd") : "No Date"}
                        </Badge>

                        <Badge variant="outline" className="font-mono">
                          {appointment.time}
                        </Badge>
                        <Badge variant={getStatusColor(appointment.status)}>{getStatusLabel(appointment.status)}</Badge>
                      </div>
                      <div>
                        <p className="font-medium">{appointment.patient}</p>
                        <p className="text-sm text-muted-foreground">{getDoctorName(appointment.doctor)}</p>
                      </div>
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <span className="flex items-center">
                          <Phone className="h-3 w-3 mr-1" />
                          {appointment.phone}
                        </span>
                        <span>{appointment.reason}</span>
                        <span>{appointment.duration} min</span>
                      </div>
                      {appointment.notes && (
                        <p className="text-xs text-muted-foreground">Notes: {appointment.notes}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {appointment.status === "booked" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusChange(appointment._id, "completed")}
                      >
                        Complete
                      </Button>
                    )}

                    <Button variant="outline" size="sm" onClick={() => setEditingAppointment(appointment)}>
                      <Edit className="h-4 w-4" />
                    </Button>

                    {appointment.status !== "completed" && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleStatusChange(appointment._id, "cancelled")}
                      >
                        Cancel
                      </Button>
                    )}

                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => deleteAppointment(appointment._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}

            {filteredAppointments.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No appointments found matching the current filters.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      {editingAppointment && (
        <Dialog open={!!editingAppointment} onOpenChange={(open) => { if (!open) setEditingAppointment(null) }}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <AppointmentForm
              appointment={editingAppointment}
              doctors={doctors}
              onSubmit={(data) => updateAppointment(editingAppointment._id, data)}
              onCancel={() => setEditingAppointment(null)}
              generateTimeSlots={generateTimeSlots}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

interface AppointmentFormProps {
  appointment?: Appointment
  doctors: Doctor[]
  onSubmit: (appointment: any) => void
  onCancel: () => void
  generateTimeSlots: (doctor: Doctor, date: Date) => string[]
}

function AppointmentForm({ appointment, doctors, onSubmit, onCancel, generateTimeSlots }: AppointmentFormProps) {
  const [formData, setFormData] = useState({
    patient: appointment?.patient || "",
    phone: appointment?.phone || "",
    doctor: appointment?.doctor || "",
    date: appointment ? new Date(appointment.date) : new Date(),
    time: appointment?.time || "",
    duration: appointment?.duration || 30,
    reason: appointment?.reason || "",
    status: appointment?.status || "booked",
    notes: appointment?.notes || "",
  })

  const selectedDoctor = doctors.find((d) => d._id === formData.doctor)
  const availableSlots = selectedDoctor ? generateTimeSlots(selectedDoctor, formData.date) : []

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const submitData = {
        ...formData,
        date: formData.date.toISOString(), // full ISO string
      }
      await onSubmit(submitData)
    } catch (err) {
      console.error("Error submitting form:", err)
    }
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>{appointment ? "Edit Appointment" : "Book New Appointment"}</DialogTitle>
        <DialogDescription>
          {appointment ? "Update appointment details." : "Schedule a new appointment for a patient."}
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Patient */}
          <div className="space-y-2">
            <Label htmlFor="patient">Patient Name</Label>
            <Input
              id="patient"
              value={formData.patient}
              onChange={(e) => setFormData({ ...formData, patient: e.target.value })}
              required
            />
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
          </div>

          {/* Doctor */}
          <div className="space-y-2">
            <Label htmlFor="doctor">Doctor</Label>
            <Select
              value={formData.doctor}
              onValueChange={(value) => setFormData({ ...formData, doctor: value, time: "" })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a doctor" />
              </SelectTrigger>
              <SelectContent>
                {doctors.map((doctor) => (
                  <SelectItem key={doctor._id} value={doctor._id}>
                    {doctor.name} - {doctor.specialization}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label>Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(formData.date, "PPP")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.date}
                  onSelect={(date) => date && setFormData({ ...formData, date, time: "" })}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Time */}
          <div className="space-y-2">
            <Label htmlFor="time">Time</Label>
            <Select value={formData.time} onValueChange={(value) => setFormData({ ...formData, time: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select time" />
              </SelectTrigger>
              <SelectContent>
                {availableSlots.map((slot) => (
                  <SelectItem key={slot} value={slot}>
                    {slot}
                  </SelectItem>
                ))}
                {availableSlots.length === 0 && (
                  <SelectItem value="no-slots" disabled>
                    No available slots
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <Label htmlFor="duration">Duration (minutes)</Label>
            <Select
              value={formData.duration.toString()}
              onValueChange={(value) => setFormData({ ...formData, duration: Number.parseInt(value) })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 minutes</SelectItem>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="45">45 minutes</SelectItem>
                <SelectItem value="60">60 minutes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Reason */}
          <div className="space-y-2">
            <Label htmlFor="reason">Reason for Visit</Label>
            <Input
              id="reason"
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              required
            />
          </div>
        </div>

        {/* Status (only when editing) */}
        {appointment && (
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value: Appointment["status"]) => setFormData({ ...formData, status: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="booked">Booked</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Notes */}
        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Additional notes..."
            rows={3}
          />
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {appointment ? "Update Appointment" : "Book Appointment"}
          </Button>
        </DialogFooter>
      </form>
    </>
  )
}
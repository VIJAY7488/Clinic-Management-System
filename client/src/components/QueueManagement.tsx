
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
import { Plus, Clock, User, Phone, AlertCircle, CheckCircle, Timer, Edit, Trash2 } from "lucide-react"
import axios from "axios"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface Doctor {
  _id: string
  name: string
  specialization: string
}

interface QueuePatient {
  _id: string
  name: string
  phone: string
  reason: string
  priority: "normal" | "urgent" | "emergency"
  status: "waiting" | "with-doctor" | "completed" | "cancelled"
  notes?: string
  doctor?: Doctor
  assignedDoctor?: string // Added missing property
  queueNumber: string // Added missing property  
  waitingTime: number
  checkedInAt: Date // Added missing property
  createdAt: Date
  updatedAt: Date
}

export function QueueManagement() {
  const [queue, setQueue] = useState<QueuePatient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingPatient, setEditingPatient] = useState<QueuePatient | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [filterPriority, setFilterPriority] = useState<string>("all")

  // Fetching patient and doctor data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [patientsRes, doctorsRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/patients`),
          axios.get(`${API_BASE_URL}/doctors`)
        ]);

        // Ensure proper date parsing for patient data
        const patientsWithDates = patientsRes.data.map((patient: any) => ({
          ...patient,
          createdAt: new Date(patient.createdAt),
          updatedAt: new Date(patient.updatedAt),
          checkedInAt: new Date(patient.checkedInAt || patient.createdAt), // Fallback if checkedInAt is missing
        }));

        setQueue(patientsWithDates);
        setDoctors(doctorsRes.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Adding new patient to the queue
  const handleAddPatient = async (newPatient: Omit<QueuePatient, "_id" | "queueNumber">) => {
    try {
      const queueNumber = generateQueueNumber(queue);
  
      const res = await axios.post(`${API_BASE_URL}/patients`, {
        ...newPatient,
        queueNumber,
      });
  
      setQueue((prev) => [...prev, res.data]);
    } catch (error) {
      console.error("Error adding patient:", error);
    }
  };


  // Updating an existing patient
  const handleUpdatePatient = async (patientData: QueuePatient) => {
    try {
      const res = await axios.put(
        `${API_BASE_URL}/patients/${patientData._id}`,
        patientData,
        {
          headers: { "Content-Type": "application/json" },
        }
      )
  
      const updated = {
        ...res.data,
        createdAt: new Date(res.data.createdAt),
        updatedAt: new Date(res.data.updatedAt),
        checkedInAt: new Date(res.data.checkedInAt),
      }
      
      setQueue(prevQueue => prevQueue.map((p) => (p._id === updated._id ? updated : p)))
      setEditingPatient(null)
    } catch (error) {
      console.error("Error updating patient:", error)
    }
  }

  // Update status and assigned doctor
  const handleUpdateStatus = async (
    patientId: string,
    newStatus: QueuePatient["status"],
    doctorId?: string
  ) => {
    try {
      const updateData: any = { 
        status: newStatus,
        ...(doctorId && { doctor: doctorId }),
        ...(newStatus === "with-doctor" && { waitingTime: 0 })
      }

      const res = await axios.put(
        `${API_BASE_URL}/patients/${patientId}`,
        updateData,
        {
          headers: { "Content-Type": "application/json" },
        }
      )
  
      const updated = {
        ...res.data,
        createdAt: new Date(res.data.createdAt),
        updatedAt: new Date(res.data.updatedAt),
        checkedInAt: new Date(res.data.checkedInAt),
      }
      
      setQueue(prevQueue => prevQueue.map((p) => (p._id === updated._id ? updated : p)))
    } catch (error) {
      console.error("Error updating status:", error)
    }
  }  
  
  // Deleting a patient from the queue
  const handleDeletePatient = async (patientId: string) => {
    try {
      await axios.delete(`${API_BASE_URL}/patients/${patientId}`)
      setQueue(prevQueue => prevQueue.filter((p) => p._id !== patientId))
    } catch (error) {
      console.error("Error deleting patient:", error)
    }
  }

  // Calculate wait time from checkedInAt
  const getWaitTime = (patient: QueuePatient) => {
    const checkedInAt = new Date(patient.checkedInAt)
    const now = new Date()
    const diffMs = now.getTime() - checkedInAt.getTime()
  
    if (diffMs < 0) return "0m" // in case of bad timestamp
  
    const minutes = Math.floor(diffMs / (1000 * 60))
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
  
    if (hours > 0) {
      return `${hours}h ${remainingMinutes}m`
    }
    return `${minutes}m`
  }

  // Generate queue number based on existing queue
  const generateQueueNumber = (patients: QueuePatient[]) => {
    if (!patients || patients.length === 0) {
      return "Q1"; 
    }

    const lastPatient = patients[patients.length - 1];
    const lastNumber = lastPatient?.queueNumber?.slice(1); // safe access
    const nextNumber = lastNumber ? parseInt(lastNumber, 10) + 1 : 1;

    return `Q${nextNumber}`
  }

  const filteredQueue = queue.filter((patient) => {
    const matchesStatus = filterStatus === "all" || patient.status === filterStatus
    const matchesPriority = filterPriority === "all" || patient.priority === filterPriority
    return matchesStatus && matchesPriority
  })

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "emergency":
        return "destructive"
      case "urgent":
        return "secondary"
      default:
        return "outline"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "default"
      case "with-doctor":
        return "secondary"
      case "cancelled":
        return "destructive"
      default:
        return "outline"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Queue Management</h2>
          <p className="text-muted-foreground">Manage walk-in patients and queue status</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Patient to Queue
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <PatientForm 
              doctors={doctors} 
              onSubmit={handleAddPatient} 
              onCancel={() => setIsAddDialogOpen(false)} 
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Queue Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total in Queue</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {queue.filter((p) => p.status !== "completed" && p.status !== "cancelled").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Waiting</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{queue.filter((p) => p.status === "waiting").length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">With Doctor</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{queue.filter((p) => p.status === "with-doctor").length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Urgent Cases</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {queue.filter((p) => p.priority === "urgent" || p.priority === "emergency").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Queue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="waiting">Waiting</SelectItem>
                <SelectItem value="with-doctor">With Doctor</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="emergency">Emergency</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Queue List */}
      <Card>
        <CardHeader>
          <CardTitle>Current Queue</CardTitle>
          <CardDescription>Patients in order of arrival and priority</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredQueue
              .sort((a, b) => {
                // Sort by priority first (emergency > urgent > normal), then by check-in time
                const priorityOrder = { emergency: 3, urgent: 2, normal: 1 }
                if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
                  return priorityOrder[b.priority] - priorityOrder[a.priority]
                }
                return new Date(a.checkedInAt).getTime() - new Date(b.checkedInAt).getTime()
              })
              .map((patient) => (
                <div key={patient._id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <Badge variant="outline" className="font-mono">
                      {patient.queueNumber}
                    </Badge>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <p className="font-medium">{patient.name}</p>
                        <Badge variant={getPriorityColor(patient.priority)} className="text-xs">
                          {patient.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{patient.reason}</p>
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <span className="flex items-center">
                          <Phone className="h-3 w-3 mr-1" />
                          {patient.phone}
                        </span>
                        <span className="flex items-center">
                          <Timer className="h-3 w-3 mr-1" />
                          Wait: {getWaitTime(patient)}
                        </span>
                        {patient.assignedDoctor && <span>Doctor: {patient.assignedDoctor}</span>}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Badge variant={getStatusColor(patient.status)}>
                      {patient.status === "waiting"
                        ? "Waiting"
                        : patient.status === "with-doctor"
                          ? "With Doctor"
                          : patient.status === "completed"
                            ? "Completed"
                            : "Cancelled"}
                    </Badge>

                    {patient.status === "waiting" && (
                      <Button 
                        size="sm" 
                        onClick={() => handleUpdateStatus(patient._id, "with-doctor", doctors[0]?._id)}
                        disabled={doctors.length === 0}
                      >
                        Call Patient
                      </Button>
                    )}

                    {patient.status === "with-doctor" && (
                      <Button size="sm" variant="outline" onClick={() => handleUpdateStatus(patient._id, "completed")}>
                        Mark Complete
                      </Button>
                    )}

                    <Button variant="outline" size="sm" onClick={() => setEditingPatient(patient)}>
                      <Edit className="h-4 w-4" />
                    </Button>

                    <Button variant="outline" size="sm" onClick={() => handleDeletePatient(patient._id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}

            {filteredQueue.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No patients in queue matching the current filters.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      {editingPatient && (
        <Dialog open={!!editingPatient} onOpenChange={() => setEditingPatient(null)}>
          <DialogContent className="max-w-md">
            <PatientForm
              patient={editingPatient}
              doctors={doctors}
              onSubmit={handleUpdatePatient}
              onCancel={() => setEditingPatient(null)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

interface PatientFormProps {
  patient?: QueuePatient
  doctors: Doctor[] // Fixed: was Doctor[] instead of doctor: Doctor[]
  onSubmit: (patient: any) => void
  onCancel: () => void
}

function PatientForm({ patient, doctors, onSubmit, onCancel }: PatientFormProps) {
  const [formData, setFormData] = useState({
    name: patient?.name || "",
    phone: patient?.phone || "",
    reason: patient?.reason || "",
    priority: patient?.priority || "normal" as const,
    status: patient?.status || "waiting" as const,
    doctor: patient?.doctor?._id || "",
    notes: patient?.notes || "",
    waitingTime: patient?.waitingTime || 0
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (patient) {
      onSubmit({ ...patient, ...formData })
    } else {
      onSubmit(formData)
    }
    onCancel()
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>{patient ? "Edit Patient" : "Add Patient to Queue"}</DialogTitle>
        <DialogDescription>
          {patient ? "Update patient information." : "Enter patient details to add them to the queue."}
        </DialogDescription>
      </DialogHeader>

      <div className="max-h-96 overflow-y-auto">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Patient Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Reason for Visit</Label>
            <Input
              id="reason"
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Select
              value={formData.priority}
              onValueChange={(value: "normal" | "urgent" | "emergency") => setFormData({ ...formData, priority: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="emergency">Emergency</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Doctor Assignment */}
          <div className="space-y-2">
            <Label htmlFor="doctor">Assign Doctor</Label>
            <Select
              value={formData.doctor || ""}
              onValueChange={(value) => setFormData({ ...formData, doctor: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Doctor" />
              </SelectTrigger>
              <SelectContent>
                {doctors.map((doc) => (
                  <SelectItem key={doc._id} value={doc._id}>
                    {doc.name} ({doc.specialization})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {patient && (
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: QueuePatient["status"]) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="waiting">Waiting</SelectItem>
                  <SelectItem value="with-doctor">With Doctor</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
  
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
            <Button type="submit">{patient ? "Update Patient" : "Add to Queue"}</Button>
          </DialogFooter>
        </form>
      </div>
    </>
  )
}
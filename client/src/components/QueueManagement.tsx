import { useState, useEffect } from "react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Clock,
  User,
  Phone,
  CheckCircle,
  Timer,
  Trash2,
} from "lucide-react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface Appointment {
  _id: string;
  patient: {
    _id: string;
    name: string;
    phone: string;
    age: number;
    queueNumber?: number;
    queueStatus?: "waiting" | "with-doctor" | "completed" | "cancelled";
  };
  doctor: {
    _id: string;
    name: string;
    specialization: string;
    gender: string;
    location: string;
    createdAt: string;
    updatedAt: string;
  };
  reason: string;
  notes?: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}



export function QueueManagement() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  // Fetching all appointments
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/appointments`);
        console.log("Appointments API response:", res.data.appointments);
        setAppointments(res.data.appointments || []);
      } catch (err: any) {
        console.error("Failed to fetch appointments", err);
      }
    };
    fetchAppointments();
  }, []);

  // Update status
  const handleUpdateStatus = async (
    patientId: string,
    newQueueStatus: "waiting" | "with-doctor" | "completed" | "cancelled"
  ) => {
    try {
      await axios.patch(
        `${API_BASE_URL}/appointments/${patientId}/status`,
        { queueStatus: newQueueStatus }
      );

      // Update appointments state
      setAppointments(prevAppointments =>
        prevAppointments.map(appointment =>
          appointment.patient._id === patientId
            ? {
                ...appointment,
                patient: {
                  ...appointment.patient,
                  queueStatus: newQueueStatus
                }
              }
            : appointment
        )
      );
    } catch (error) {
      console.error("Error updating queue status:", error);
    }
  };

  // Deleting a patient from the queue
  const handleDeletePatient = async (patientId: string) => {
    try {
      await axios.delete(`${API_BASE_URL}/patients/${patientId}`);
      setAppointments(prevAppointments =>
        prevAppointments.filter(appointment => appointment.patient._id !== patientId)
      );
    } catch (error) {
      console.error("Error deleting patient:", error);
    }
  };

  const getStatusColor = (status: string | undefined): "default" | "destructive" | "outline" | "secondary" => {
    switch (status) {
      case "waiting":
        return "default";
      case "with-doctor":
        return "secondary";
      case "completed":
        return "outline";
      case "cancelled":
        return "destructive";
      default:
        return "default";
    }
  };

  // Filter appointments based on status
  const filteredAppointments = appointments.filter(appointment => {
    if (filterStatus === "all") return true;
    return appointment.patient.queueStatus === filterStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Queue Management</h2>
          <p className="text-muted-foreground">
            Manage walk-in patients and queue status
          </p>
        </div>
      </div>

      {/* Queue Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total in Queue
            </CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                appointments.filter(
                  (p) => p.patient.queueStatus !== "completed"
                ).length
              }
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Waiting</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                appointments.filter((p) => p.patient.queueStatus === "waiting")
                  .length
              }
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">With Doctor</CardTitle>
            <Timer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                appointments.filter((p) => p.patient.queueStatus === "with-doctor")
                  .length
              }
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                appointments.filter(
                  (p) => p.patient.queueStatus === "completed"
                ).length
              }
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
          </div>
        </CardContent>
      </Card>

      {/* Queue List */}
      <Card>
        <CardHeader>
          <CardTitle>Current Queue</CardTitle>
          <CardDescription>
            Patients in order of arrival and priority
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredAppointments.map((entry) => (
              <div
                key={entry._id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <Badge variant="outline" className="font-mono">
                    {entry.patient?.queueNumber || "—"}
                  </Badge>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <p className="font-medium">{entry.patient?.name}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Age: {entry.patient?.age || "—"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {entry.reason || "—"}
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <span className="flex items-center">
                        <Phone className="h-3 w-3 mr-1" />
                        {entry.patient?.phone}
                      </span>
                      <span>
                        Doctor: {entry.doctor?.name} (
                        {entry.doctor?.specialization})
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Badge variant={getStatusColor(entry.patient.queueStatus)}>
                    {entry.patient.queueStatus === "waiting"
                      ? "Waiting"
                      : entry.patient.queueStatus === "with-doctor"
                      ? "With Doctor"
                      : entry.patient.queueStatus === "completed"
                      ? "Completed"
                      : "Cancelled"}
                  </Badge>

                  {entry.patient.queueStatus === "waiting" && (
                    <Button
                      size="sm"
                      onClick={() =>
                        handleUpdateStatus(
                          entry.patient._id,
                          "with-doctor"
                        )
                      }
                    >
                      Call Patient
                    </Button>
                  )}

                  {entry.patient.queueStatus === "with-doctor" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleUpdateStatus(entry.patient._id, "completed")}
                    >
                      Mark Complete
                    </Button>
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeletePatient(entry.patient._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}

            {filteredAppointments.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No patients in queue matching the current filters.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
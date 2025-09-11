import type React from "react";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Search, Edit, Trash2, MapPin, Clock, User } from "lucide-react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface Doctor {
  _id: string;
  name: string;
  specialization: string;
  gender: "Male" | "Female" | "Other";
  location: string;
  phone: string;
  email: string;
  availability: Array<{
    day: string;
    startTime: string;
    endTime: string;
  }>;
  status: boolean;
  currentPatients: number;
  notes?: string;
}

export function DoctorManagement() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSpecialty, setFilterSpecialty] = useState("all");
  const [filterLocation, setFilterLocation] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetching doctors from backend
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get(`${API_BASE_URL}/doctors`);
        setDoctors(res.data.data || res.data);
      } catch (error) {
        console.error("Error fetching doctors", error);
        setError("Failed to fetch doctors. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  // Adding a new doctor
  const handleAddDoctor = async (doctorData: Omit<Doctor, "_id">) => {
    try {
      setError(null);

      const res = await axios.post(`${API_BASE_URL}/doctors`, doctorData);
      const newDoctor = res.data.data || res.data;
      setDoctors((prev) => [...prev, newDoctor]);
      setIsAddDialogOpen(false);
    } catch (err: any) {
      console.error("Error adding doctor", err);
      setError(err.response?.data?.message || "Failed to add doctor");
    }
  };

  // Updating an existing doctor
  // Updating an existing doctor
  const handleEditDoctor = async (doctorData: Doctor | Omit<Doctor, "_id">) => {
    try {
      setError(null);

      if (!("_id" in doctorData)) {
        throw new Error("Cannot update doctor without an _id");
      }

      const res = await axios.put(
        `${API_BASE_URL}/doctors/${doctorData._id}`,
        doctorData
      );
      const updatedDoctor = res.data.data || res.data;

      setDoctors((prev) =>
        prev.map((d) => (d._id === doctorData._id ? updatedDoctor : d))
      );
      setEditingDoctor(null);
    } catch (error: any) {
      console.error("Error updating doctor", error);
      setError(error.response?.data?.message || "Failed to update doctor");
    }
  };

  // Deleting a doctor
  const handleDeleteDoctor = async (doctorId: string) => {
    try {
      setError(null);
      await axios.delete(`${API_BASE_URL}/doctors/${doctorId}`);
      setDoctors((prev) => prev.filter((d) => d._id !== doctorId));
    } catch (error: any) {
      console.error("Error deleting doctor", error);
      setError(error.response?.data?.message || "Failed to delete doctor");
    }
  };

  const specialties = Array.from(new Set(doctors.map((d) => d.specialization))); // Changed from specialty
  const locations = Array.from(new Set(doctors.map((d) => d.location)));

  // Filetered doctors based on search and filters
  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch =
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty =
      filterSpecialty === "all" || doctor.specialization === filterSpecialty;
    const matchesLocation =
      filterLocation === "all" || doctor.location === filterLocation;

    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "available" && doctor.status === true) ||
      (filterStatus === "unavailable" && doctor.status === false);

    return (
      matchesSearch && matchesSpecialty && matchesLocation && matchesStatus
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-lg">Loading doctors...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
          <button
            onClick={() => setError(null)}
            className="ml-2 text-red-500 hover:text-red-700"
          >
            ×
          </button>
        </div>
      )}

      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Doctor Management</h2>
          <p className="text-muted-foreground">
            Manage doctor profiles and availability
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Doctor
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DoctorForm
              onSubmit={handleAddDoctor}
              onCancel={() => setIsAddDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search doctors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterSpecialty} onValueChange={setFilterSpecialty}>
              <SelectTrigger>
                <SelectValue placeholder="All Specialties" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Specialties</SelectItem>
                {specialties.map((specialty) => (
                  <SelectItem key={specialty} value={specialty}>
                    {specialty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterLocation} onValueChange={setFilterLocation}>
              <SelectTrigger>
                <SelectValue placeholder="All Locations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {locations.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="unavailable">Unavailable</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Doctor Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.length === 0 ? (
          <div className="col-span-full text-center py-8 text-muted-foreground">
            No doctors found matching your criteria.
          </div>
        ) : (
          filteredDoctors.map((doctor) => (
            <Card key={doctor._id} className="relative">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{doctor.name}</CardTitle>
                    <CardDescription>{doctor.specialization}</CardDescription>
                  </div>

                  <Badge variant={doctor.status ? "default" : "secondary"}>
                    {doctor.status ? "Available" : "Unavailable"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <User className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{doctor.gender}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{doctor.location}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>Current Patients: {doctor.currentPatients}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <div className="text-sm text-muted-foreground">
                    {doctor.phone}
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingDoctor(doctor)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteDoctor(doctor._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Edit Dialog */}
      {editingDoctor && (
        <Dialog
          open={!!editingDoctor}
          onOpenChange={(open) => !open && setEditingDoctor(null)}
        >
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DoctorForm
              doctor={editingDoctor}
              onSubmit={handleEditDoctor}
              onCancel={() => setEditingDoctor(null)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

type DoctorFormProps =
  | {
      doctor: Doctor
      onSubmit: (doctor: Doctor) => void | Promise<void>
      onCancel: () => void
    }
  | {
      doctor?: undefined
      onSubmit: (doctor: Omit<Doctor, "_id">) => void | Promise<void>
      onCancel: () => void
    }


// Form component for adding/editing a doctor
function DoctorForm({ doctor, onSubmit, onCancel }: DoctorFormProps) {
  const [formData, setFormData] = useState<Omit<Doctor, "_id">>({
    name: doctor?.name || "",
    specialization: doctor?.specialization || "",
    gender: doctor?.gender || "Female",
    location: doctor?.location || "",
    phone: doctor?.phone || "",
    email: doctor?.email || "",
    availability: doctor?.availability || [],
    status: doctor?.status ?? true,
    currentPatients: doctor?.currentPatients || 0,
    notes: doctor?.notes || "",
  });

  const [availabilityForm, setAvailabilityForm] = useState({
    monday: { startTime: "09:00", endTime: "17:00", available: true },
    tuesday: { startTime: "09:00", endTime: "17:00", available: true },
    wednesday: { startTime: "09:00", endTime: "17:00", available: true },
    thursday: { startTime: "09:00", endTime: "17:00", available: true },
    friday: { startTime: "09:00", endTime: "17:00", available: true },
    saturday: { startTime: "09:00", endTime: "12:00", available: false },
    sunday: { startTime: "09:00", endTime: "12:00", available: false },
  });

  // Populate availability form if editing an existing doctor
  useEffect(() => {
    if (doctor?.availability) {
      const newAvailabilityForm = { ...availabilityForm };
      doctor.availability.forEach((slot) => {
        const day = slot.day.toLowerCase() as keyof typeof availabilityForm;
        if (newAvailabilityForm[day]) {
          newAvailabilityForm[day] = {
            startTime: slot.startTime,
            endTime: slot.endTime,
            available: true,
          };
        }
      });
      setAvailabilityForm(newAvailabilityForm);
    }
  }, [doctor]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Construct availability array from form state
    const availability = Object.entries(availabilityForm)
      .filter(([_, slot]) => slot.available)
      .map(([day, slot]) => ({
        day: day.charAt(0).toUpperCase() + day.slice(1),
        startTime: slot.startTime,
        endTime: slot.endTime,
      }));

    const submitData: Omit<Doctor, "_id"> = {
      ...formData,
      availability,
    };

    if (doctor) {
      onSubmit({ ...submitData, _id: doctor._id });
    } else {
      onSubmit(submitData as Omit<Doctor, "_id">)
    }
  };

  const days = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ] as const;

  return (
    <>
      <DialogHeader>
        <DialogTitle>{doctor ? "Edit Doctor" : "Add New Doctor"}</DialogTitle>
        <DialogDescription>
          {doctor
            ? "Update doctor information and availability."
            : "Enter doctor information and set availability schedule."}
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="specialization">Specialization</Label>
            <Input
              id="specialization"
              value={formData.specialization}
              onChange={(e) =>
                setFormData({ ...formData, specialization: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="gender">Gender</Label>
            <Select
              value={formData.gender}
              onValueChange={(value: "Male" | "Female" | "Other") =>
                setFormData({ ...formData, gender: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Female">Female</SelectItem>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location/Room</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={formData.status ? "available" : "unavailable"}
            onValueChange={(value) =>
              setFormData({ ...formData, status: value === "available" })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="unavailable">Unavailable</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <Label>Weekly Availability</Label>
          <div className="space-y-3">
            {days.map((day) => (
              <div key={day} className="flex items-center space-x-4">
                <div className="w-20 text-sm font-medium capitalize">{day}</div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={availabilityForm[day].available}
                    onChange={(e) =>
                      setAvailabilityForm({
                        ...availabilityForm,
                        [day]: {
                          ...availabilityForm[day],
                          available: e.target.checked,
                        },
                      })
                    }
                    className="rounded"
                  />
                  <span className="text-sm">Available</span>
                </div>
                {availabilityForm[day].available && (
                  <>
                    <Input
                      type="time"
                      value={availabilityForm[day].startTime}
                      onChange={(e) =>
                        setAvailabilityForm({
                          ...availabilityForm,
                          [day]: {
                            ...availabilityForm[day],
                            startTime: e.target.value,
                          },
                        })
                      }
                      className="w-32"
                    />
                    <span className="text-sm">to</span>
                    <Input
                      type="time"
                      value={availabilityForm[day].endTime}
                      onChange={(e) =>
                        setAvailabilityForm({
                          ...availabilityForm,
                          [day]: {
                            ...availabilityForm[day],
                            endTime: e.target.value,
                          },
                        })
                      }
                      className="w-32"
                    />
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={(e) =>
              setFormData({ ...formData, notes: e.target.value })
            }
            placeholder="Additional notes about the doctor..."
            rows={3}
          />
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {doctor ? "Update Doctor" : "Add Doctor"}
          </Button>
        </DialogFooter>
      </form>
    </>
  );
}

import React, { useState} from 'react';
import { Users, Calendar, UserPlus, Clock, Search, Edit2, Trash2, Plus, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

// Types
interface Doctor {
  id: string;
  name: string;
  specialization: string;
  gender: 'Male' | 'Female';
  location: string;
  availability: string[];
  isAvailable: boolean;
}

interface Patient {
  id: string;
  name: string;
  phone: string;
  queueNumber: number;
  status: 'Waiting' | 'With Doctor' | 'Completed';
  joinTime: string;
  doctorId?: string;
}

interface Appointment {
  id: string;
  patientName: string;
  patientPhone: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  status: 'Booked' | 'Completed' | 'Cancelled';
  notes?: string;
}

// Mock Data
const mockDoctors: Doctor[] = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    specialization: 'Cardiology',
    gender: 'Female',
    location: 'Building A - Room 101',
    availability: ['09:00', '10:00', '11:00', '14:00', '15:00'],
    isAvailable: true
  },
  {
    id: '2',
    name: 'Dr. Michael Chen',
    specialization: 'Orthopedics',
    gender: 'Male',
    location: 'Building B - Room 205',
    availability: ['08:30', '09:30', '13:30', '14:30', '16:00'],
    isAvailable: true
  },
  {
    id: '3',
    name: 'Dr. Emily Davis',
    specialization: 'Pediatrics',
    gender: 'Female',
    location: 'Building A - Room 103',
    availability: ['10:00', '11:00', '15:00', '16:00'],
    isAvailable: false
  }
];

const FrontDeskSystem: React.FC = () => {
  const [currentView, setCurrentView] = useState<'login' | 'dashboard' | 'queue' | 'appointments' | 'doctors'>('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [doctors, setDoctors] = useState<Doctor[]>(mockDoctors);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [nextQueueNumber, setNextQueueNumber] = useState(1);

  // Login Component
  const LoginPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e: React.FormEvent) => {
      e.preventDefault();
      if (username === 'admin' && password === 'password') {
        setIsAuthenticated(true);
        setCurrentView('dashboard');
      } else {
        alert('Invalid credentials. Use admin/password');
      }
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg w-96">
          <div className="text-center mb-8">
            <div className="bg-blue-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Clinic Front Desk</h1>
            <p className="text-gray-600">Please sign in to continue</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter username"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter password"
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
            >
              Sign In
            </button>
          </form>
          
          <div className="mt-4 text-center text-sm text-gray-500">
            Demo credentials: admin / password
          </div>
        </div>
      </div>
    );
  };

  // Navigation Component
  const Navigation: React.FC = () => (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-500 w-10 h-10 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-800">Clinic Management</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setCurrentView('dashboard')}
              className={`px-4 py-2 rounded-md ${currentView === 'dashboard' ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setCurrentView('queue')}
              className={`px-4 py-2 rounded-md ${currentView === 'queue' ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              Queue
            </button>
            <button
              onClick={() => setCurrentView('appointments')}
              className={`px-4 py-2 rounded-md ${currentView === 'appointments' ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              Appointments
            </button>
            <button
              onClick={() => setCurrentView('doctors')}
              className={`px-4 py-2 rounded-md ${currentView === 'doctors' ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              Doctors
            </button>
            <button
              onClick={() => {
                setIsAuthenticated(false);
                setCurrentView('login');
              }}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );

  // Dashboard Component
  const Dashboard: React.FC = () => (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="bg-blue-500 p-3 rounded-full">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-800">Patients in Queue</h3>
              <p className="text-2xl font-bold text-blue-500">{patients.filter(p => p.status !== 'Completed').length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="bg-green-500 p-3 rounded-full">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-800">Today's Appointments</h3>
              <p className="text-2xl font-bold text-green-500">{appointments.filter(a => a.status === 'Booked').length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="bg-purple-500 p-3 rounded-full">
              <UserPlus className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-800">Available Doctors</h3>
              <p className="text-2xl font-bold text-purple-500">{doctors.filter(d => d.isAvailable).length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="bg-orange-500 p-3 rounded-full">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-800">Completed Today</h3>
              <p className="text-2xl font-bold text-orange-500">{patients.filter(p => p.status === 'Completed').length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Queue Activity</h3>
          <div className="space-y-3">
            {patients.slice(-3).map(patient => (
              <div key={patient.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{patient.name}</p>
                  <p className="text-sm text-gray-600">Queue #{patient.queueNumber}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  patient.status === 'Waiting' ? 'bg-yellow-100 text-yellow-800' :
                  patient.status === 'With Doctor' ? 'bg-blue-100 text-blue-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {patient.status}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Upcoming Appointments</h3>
          <div className="space-y-3">
            {appointments.filter(a => a.status === 'Booked').slice(0, 3).map(appointment => (
              <div key={appointment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{appointment.patientName}</p>
                  <p className="text-sm text-gray-600">Dr. {appointment.doctorName}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{appointment.time}</p>
                  <p className="text-xs text-gray-600">{appointment.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Queue Management Component
  const QueueManagement: React.FC = () => {
    const [showAddPatient, setShowAddPatient] = useState(false);
    const [newPatient, setNewPatient] = useState({ name: '', phone: '' });

    const addPatient = () => {
      if (newPatient.name && newPatient.phone) {
        const patient: Patient = {
          id: Date.now().toString(),
          name: newPatient.name,
          phone: newPatient.phone,
          queueNumber: nextQueueNumber,
          status: 'Waiting',
          joinTime: new Date().toLocaleTimeString()
        };
        setPatients([...patients, patient]);
        setNextQueueNumber(nextQueueNumber + 1);
        setNewPatient({ name: '', phone: '' });
        setShowAddPatient(false);
      }
    };

    const updatePatientStatus = (patientId: string, status: Patient['status']) => {
      setPatients(patients.map(p => p.id === patientId ? { ...p, status } : p));
    };

    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Queue Management</h2>
          <button
            onClick={() => setShowAddPatient(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-600"
          >
            <Plus className="w-4 h-4" />
            <span>Add Walk-in Patient</span>
          </button>
        </div>

        {showAddPatient && (
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h3 className="text-lg font-semibold mb-4">Add New Patient to Queue</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Patient Name"
                value={newPatient.name}
                onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={newPatient.phone}
                onChange={(e) => setNewPatient({ ...newPatient, phone: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex space-x-2 mt-4">
              <button
                onClick={addPatient}
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
              >
                Add to Queue
              </button>
              <button
                onClick={() => setShowAddPatient(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b">
            <h3 className="text-lg font-semibold">Current Queue</h3>
          </div>
          
          <div className="divide-y">
            {patients.map(patient => (
              <div key={patient.id} className="p-6 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-500 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold">
                    {patient.queueNumber}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">{patient.name}</h4>
                    <p className="text-sm text-gray-600">{patient.phone}</p>
                    <p className="text-xs text-gray-500">Joined at {patient.joinTime}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    patient.status === 'Waiting' ? 'bg-yellow-100 text-yellow-800' :
                    patient.status === 'With Doctor' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {patient.status}
                  </span>
                  
                  <div className="flex space-x-1">
                    {patient.status === 'Waiting' && (
                      <button
                        onClick={() => updatePatientStatus(patient.id, 'With Doctor')}
                        className="p-2 text-blue-500 hover:bg-blue-50 rounded"
                        title="Move to Doctor"
                      >
                        <AlertCircle className="w-4 h-4" />
                      </button>
                    )}
                    {patient.status === 'With Doctor' && (
                      <button
                        onClick={() => updatePatientStatus(patient.id, 'Completed')}
                        className="p-2 text-green-500 hover:bg-green-50 rounded"
                        title="Mark as Completed"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {patients.length === 0 && (
              <div className="p-6 text-center text-gray-500">
                No patients in queue. Add walk-in patients to get started.
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Appointment Management Component
  const AppointmentManagement: React.FC = () => {
    const [showBooking, setShowBooking] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
    const [newAppointment, setNewAppointment] = useState({
      patientName: '',
      patientPhone: '',
      date: '',
      time: '',
      notes: ''
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [filterSpecialization, setFilterSpecialization] = useState('');

    const bookAppointment = () => {
      if (selectedDoctor && newAppointment.patientName && newAppointment.patientPhone && newAppointment.date && newAppointment.time) {
        const appointment: Appointment = {
          id: Date.now().toString(),
          patientName: newAppointment.patientName,
          patientPhone: newAppointment.patientPhone,
          doctorId: selectedDoctor.id,
          doctorName: selectedDoctor.name,
          date: newAppointment.date,
          time: newAppointment.time,
          status: 'Booked',
          notes: newAppointment.notes
        };
        setAppointments([...appointments, appointment]);
        setNewAppointment({ patientName: '', patientPhone: '', date: '', time: '', notes: '' });
        setSelectedDoctor(null);
        setShowBooking(false);
      }
    };

    const cancelAppointment = (appointmentId: string) => {
      setAppointments(appointments.map(a => a.id === appointmentId ? { ...a, status: 'Cancelled' } : a));
    };

    const completeAppointment = (appointmentId: string) => {
      setAppointments(appointments.map(a => a.id === appointmentId ? { ...a, status: 'Completed' } : a));
    };

    const filteredDoctors = doctors.filter(doctor => 
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterSpecialization === '' || doctor.specialization === filterSpecialization)
    );

    const specializations = [...new Set(doctors.map(d => d.specialization))];

    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Appointment Management</h2>
          <button
            onClick={() => setShowBooking(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-600"
          >
            <Plus className="w-4 h-4" />
            <span>Book Appointment</span>
          </button>
        </div>

        {showBooking && (
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h3 className="text-lg font-semibold mb-4">Book New Appointment</h3>
            
            {!selectedDoctor ? (
              <div>
                <div className="flex space-x-4 mb-4">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Search doctors..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <select
                    value={filterSpecialization}
                    onChange={(e) => setFilterSpecialization(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Specializations</option>
                    {specializations.map(spec => (
                      <option key={spec} value={spec}>{spec}</option>
                    ))}
                  </select>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredDoctors.map(doctor => (
                    <div key={doctor.id} className="border rounded-lg p-4">
                      <h4 className="font-medium text-gray-800">{doctor.name}</h4>
                      <p className="text-sm text-gray-600">{doctor.specialization}</p>
                      <p className="text-sm text-gray-600">{doctor.location}</p>
                      <div className={`inline-block px-2 py-1 rounded-full text-xs mt-2 ${
                        doctor.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {doctor.isAvailable ? 'Available' : 'Busy'}
                      </div>
                      {doctor.isAvailable && (
                        <button
                          onClick={() => setSelectedDoctor(doctor)}
                          className="w-full mt-3 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
                        >
                          Select Doctor
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium">Selected Doctor: {selectedDoctor.name}</h4>
                  <p className="text-sm text-gray-600">{selectedDoctor.specialization} • {selectedDoctor.location}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Patient Name"
                    value={newAppointment.patientName}
                    onChange={(e) => setNewAppointment({ ...newAppointment, patientName: e.target.value })}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={newAppointment.patientPhone}
                    onChange={(e) => setNewAppointment({ ...newAppointment, patientPhone: e.target.value })}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="date"
                    value={newAppointment.date}
                    onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value })}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <select
                    value={newAppointment.time}
                    onChange={(e) => setNewAppointment({ ...newAppointment, time: e.target.value })}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Time</option>
                    {selectedDoctor.availability.map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>
                
                <textarea
                  placeholder="Notes (optional)"
                  value={newAppointment.notes}
                  onChange={(e) => setNewAppointment({ ...newAppointment, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>
            )}
            
            <div className="flex space-x-2 mt-4">
              {selectedDoctor && (
                <button
                  onClick={bookAppointment}
                  className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                >
                  Book Appointment
                </button>
              )}
              <button
                onClick={() => {
                  setShowBooking(false);
                  setSelectedDoctor(null);
                  setNewAppointment({ patientName: '', patientPhone: '', date: '', time: '', notes: '' });
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b">
            <h3 className="text-lg font-semibold">All Appointments</h3>
          </div>
          
          <div className="divide-y">
            {appointments.map(appointment => (
              <div key={appointment.id} className="p-6 flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-800">{appointment.patientName}</h4>
                  <p className="text-sm text-gray-600">{appointment.patientPhone}</p>
                  <p className="text-sm text-gray-600">Dr. {appointment.doctorName}</p>
                  <p className="text-sm text-gray-600">{appointment.date} at {appointment.time}</p>
                  {appointment.notes && (
                    <p className="text-xs text-gray-500 mt-1">Notes: {appointment.notes}</p>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    appointment.status === 'Booked' ? 'bg-blue-100 text-blue-800' :
                    appointment.status === 'Completed' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {appointment.status}
                  </span>
                  
                  {appointment.status === 'Booked' && (
                    <div className="flex space-x-1">
                      <button
                        onClick={() => completeAppointment(appointment.id)}
                        className="p-2 text-green-500 hover:bg-green-50 rounded"
                        title="Mark as Completed"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => cancelAppointment(appointment.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded"
                        title="Cancel Appointment"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {appointments.length === 0 && (
              <div className="p-6 text-center text-gray-500">
                No appointments scheduled. Book your first appointment to get started.
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Doctor Management Component
  const DoctorManagement: React.FC = () => {
    const [showAddDoctor, setShowAddDoctor] = useState(false);
    const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
    const [doctorForm, setDoctorForm] = useState({
      name: '',
      specialization: '',
      gender: 'Male' as 'Male' | 'Female',
      location: '',
      availability: [] as string[],
      isAvailable: true
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [filterSpecialization, setFilterSpecialization] = useState('');

    const timeSlots = ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'];

    const resetForm = () => {
      setDoctorForm({
        name: '',
        specialization: '',
        gender: 'Male',
        location: '',
        availability: [],
        isAvailable: true
      });
    };

    const handleAddDoctor = () => {
      if (doctorForm.name && doctorForm.specialization && doctorForm.location) {
        const newDoctor: Doctor = {
          id: Date.now().toString(),
          ...doctorForm
        };
        setDoctors([...doctors, newDoctor]);
        resetForm();
        setShowAddDoctor(false);
      }
    };

    const handleEditDoctor = (doctor: Doctor) => {
      setEditingDoctor(doctor);
      setDoctorForm({
        name: doctor.name,
        specialization: doctor.specialization,
        gender: doctor.gender,
        location: doctor.location,
        availability: doctor.availability,
        isAvailable: doctor.isAvailable
      });
    };

    const handleUpdateDoctor = () => {
      if (editingDoctor && doctorForm.name && doctorForm.specialization && doctorForm.location) {
        setDoctors(doctors.map(d => d.id === editingDoctor.id ? { ...editingDoctor, ...doctorForm } : d));
        resetForm();
        setEditingDoctor(null);
      }
    };

    const handleDeleteDoctor = (doctorId: string) => {
      if (window.confirm('Are you sure you want to delete this doctor?')) {
        setDoctors(doctors.filter(d => d.id !== doctorId));
      }
    };

    const toggleAvailabilitySlot = (slot: string) => {
      const currentSlots = doctorForm.availability;
      if (currentSlots.includes(slot)) {
        setDoctorForm({
          ...doctorForm,
          availability: currentSlots.filter(s => s !== slot)
        });
      } else {
        setDoctorForm({
          ...doctorForm,
          availability: [...currentSlots, slot].sort()
        });
      }
    };

    const filteredDoctors = doctors.filter(doctor => 
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterSpecialization === '' || doctor.specialization === filterSpecialization)
    );

    const specializations = [...new Set(doctors.map(d => d.specialization))];

    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Doctor Management</h2>
          <button
            onClick={() => setShowAddDoctor(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-600"
          >
            <Plus className="w-4 h-4" />
            <span>Add Doctor</span>
          </button>
        </div>

        {/* Search and Filter */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search doctors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <select
              value={filterSpecialization}
              onChange={(e) => setFilterSpecialization(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Specializations</option>
              {specializations.map(spec => (
                <option key={spec} value={spec}>{spec}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Add/Edit Doctor Form */}
        {(showAddDoctor || editingDoctor) && (
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h3 className="text-lg font-semibold mb-4">
              {editingDoctor ? 'Edit Doctor' : 'Add New Doctor'}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="Doctor Name"
                value={doctorForm.name}
                onChange={(e) => setDoctorForm({ ...doctorForm, name: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Specialization"
                value={doctorForm.specialization}
                onChange={(e) => setDoctorForm({ ...doctorForm, specialization: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={doctorForm.gender}
                onChange={(e) => setDoctorForm({ ...doctorForm, gender: e.target.value as 'Male' | 'Female' })}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              <input
                type="text"
                placeholder="Location (e.g., Building A - Room 101)"
                value={doctorForm.location}
                onChange={(e) => setDoctorForm({ ...doctorForm, location: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={doctorForm.isAvailable}
                  onChange={(e) => setDoctorForm({ ...doctorForm, isAvailable: e.target.checked })}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Available for appointments</span>
              </label>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Available Time Slots</label>
              <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                {timeSlots.map(slot => (
                  <button
                    key={slot}
                    onClick={() => toggleAvailabilitySlot(slot)}
                    className={`px-3 py-2 text-sm rounded-md border ${
                      doctorForm.availability.includes(slot)
                        ? 'bg-blue-500 text-white border-blue-500'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={editingDoctor ? handleUpdateDoctor : handleAddDoctor}
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
              >
                {editingDoctor ? 'Update Doctor' : 'Add Doctor'}
              </button>
              <button
                onClick={() => {
                  setShowAddDoctor(false);
                  setEditingDoctor(null);
                  resetForm();
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Doctors List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b">
            <h3 className="text-lg font-semibold">All Doctors ({filteredDoctors.length})</h3>
          </div>
          
          <div className="divide-y">
            {filteredDoctors.map(doctor => (
              <div key={doctor.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-500 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold">
                        {doctor.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800">{doctor.name}</h4>
                        <p className="text-sm text-gray-600">{doctor.specialization} • {doctor.gender}</p>
                        <p className="text-sm text-gray-600">{doctor.location}</p>
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          doctor.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {doctor.isAvailable ? 'Available' : 'Unavailable'}
                        </span>
                      </div>
                      
                      {doctor.availability.length > 0 && (
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Available slots:</p>
                          <div className="flex flex-wrap gap-1">
                            {doctor.availability.map(slot => (
                              <span key={slot} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded">
                                {slot}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditDoctor(doctor)}
                      className="p-2 text-blue-500 hover:bg-blue-50 rounded"
                      title="Edit Doctor"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteDoctor(doctor.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded"
                      title="Delete Doctor"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            {filteredDoctors.length === 0 && (
              <div className="p-6 text-center text-gray-500">
                {searchTerm || filterSpecialization ? 'No doctors match your search criteria.' : 'No doctors added yet. Add your first doctor to get started.'}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Main App Render
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main>
        {currentView === 'dashboard' && <Dashboard />}
        {currentView === 'queue' && <QueueManagement />}
        {currentView === 'appointments' && <AppointmentManagement />}
        {currentView === 'doctors' && <DoctorManagement />}
      </main>
    </div>
  );
};

export default FrontDeskSystem;
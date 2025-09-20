import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL!;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Database types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'doctor' | 'patient';
  created_at: string;
  updated_at: string;
}

export interface Patient {
  id: string;
  user_id: string;
  health_id: string;
  phone: string;
  date_of_birth: string;
  address: string;
  emergency_contact: string;
  medical_history: string;
  created_at: string;
  updated_at: string;
  // User profile data (joined from users table)
  name?: string;
  email?: string;
}

export interface Doctor {
  id: string;
  user_id: string;
  license_number: string;
  specialization: string;
  experience_years: number;
  hospital_affiliation: string;
  created_at: string;
  updated_at: string;
}

export interface Emergency {
  id: string;
  patient_id: string;
  doctor_id?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'in_progress' | 'resolved';
  description: string;
  location: string;
  reported_at: string;
  resolved_at?: string;
  created_at: string;
  updated_at: string;
}

export interface MedicalRecord {
  id: string;
  patient_id: string;
  doctor_id: string;
  title: string;
  description: string;
  diagnosis: string;
  treatment: string;
  medications: string[];
  follow_up_date?: string;
  created_at: string;
  updated_at: string;
}

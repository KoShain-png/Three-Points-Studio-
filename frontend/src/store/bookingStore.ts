import { create } from 'zustand';
import { Service } from '@/types';

interface BookingState {
  selectedService: Service | null;
  selectedDate: string | null;
  selectedTime: string | null;
  notes: string;
  step: number;
  setService: (service: Service) => void;
  setDate: (date: string) => void;
  setTime: (time: string) => void;
  setNotes: (notes: string) => void;
  setStep: (step: number) => void;
  reset: () => void;
}

export const useBookingStore = create<BookingState>((set) => ({
  selectedService: null,
  selectedDate: null,
  selectedTime: null,
  notes: '',
  step: 1,
  setService: (service) => set({ selectedService: service }),
  setDate: (date) => set({ selectedDate: date, selectedTime: null }),
  setTime: (time) => set({ selectedTime: time }),
  setNotes: (notes) => set({ notes }),
  setStep: (step) => set({ step }),
  reset: () => set({ selectedService: null, selectedDate: null, selectedTime: null, notes: '', step: 1 }),
}));

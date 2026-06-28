import { createReservationFromForm } from '../types/reservation.js';
import { createReservation } from './reservationRepository.js';

export async function createBooking(formData) {
  const reservation = createReservationFromForm(formData);
  const result = await createReservation(reservation);

  return {
    booking: result.reservation,
    storage: result.storage,
    supabaseSaved: result.supabaseSaved,
  };
}

export async function fetchBookings() {
  return [];
}

export function getBookingStorageMode() {
  return 'localStorage';
}

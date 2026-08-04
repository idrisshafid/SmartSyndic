export type PaymentStatus 

=| "pending"| "validated"| "overdue";

export interface Charge {
  id: string;
  syndic_id: string;
  owner_id: string;
  apartment_id: string;
  title: string;
  description?: string;
  amount: number;
  due_date: Date;
  status: PaymentStatus;
  created_at: Date;
  updated_at: Date;
}

export interface CreateChargeInput {
  syndic_id: string;
  owner_id: string;
  apartment_id: string;
  title: string;
  description?: string;
  amount: number;
  due_date: Date;
}

export interface UpdateChargeStatusInput {
  status: PaymentStatus;
}

export interface ChargeFilters {
  
  owner_id?: string;
  syndic_id?: string;
  apartment_id?: string;
  status?: PaymentStatus;
}
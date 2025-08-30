export type Client = {
  pickupAddress: string;
  scheduledDate?: any;
  firstName: string;
  lastName: string;
  email?: string;
  phoneCode: string;
  phoneNumber: string;
  recipientAddress: string;
  department?: string;
  municipality?: string;
  referencePoint?: string;
  notes?: string;
};

export type Pkg = {
  description: string;
  weight: number;   // en libras (según diseño)
  l?: number;       // Largo (cm)
  h?: number;       // Alto  (cm)
  w?: number;       // Ancho (cm)
};

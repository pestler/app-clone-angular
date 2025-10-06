interface ContactModal {
  email: string;
  'email-epam': string;
  phone: string;
  telegram: string;
  whatsapp: string;
  notes: string;
}

export type Contact = Partial<ContactModal>;

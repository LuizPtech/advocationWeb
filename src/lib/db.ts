import { createId } from "@paralleldrive/cuid2";
import { supabaseAdmin } from "@/lib/supabase";

function requireData<T>(data: T | null, error: { message: string } | null): T {
  if (error) throw new Error(error.message);
  if (data === null) throw new Error("Registro não encontrado.");
  return data;
}

export type UserRow = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: string;
  phone: string | null;
  createdAt: string;
  updatedAt: string;
  _count?: { cases: number };
};

export type LeadRow = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  area: string | null;
  lgpdConsent: boolean;
  status: string;
  createdAt: string;
};

export type BookingRow = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  type: string;
  area: string;
  notes: string | null;
  scheduledAt: string;
  status: string;
  lgpdConsent: boolean;
  userId: string | null;
  createdAt: string;
};

export type CaseRow = {
  id: string;
  title: string;
  description: string | null;
  area: string;
  status: string;
  nextStep: string | null;
  deadline: string | null;
  tags: string;
  clientId: string;
  createdAt: string;
  updatedAt: string;
  client?: UserRow;
};

export type DocumentRow = {
  id: string;
  name: string;
  filename: string;
  mimeType: string;
  size: number;
  path: string;
  visibleToClient: boolean;
  caseId: string | null;
  uploadedById: string;
  createdAt: string;
  case?: CaseRow | null;
};

export type MessageRow = {
  id: string;
  body: string;
  caseId: string;
  authorId: string;
  createdAt: string;
  author?: UserRow;
};

export type NoteRow = {
  id: string;
  body: string;
  caseId: string;
  authorId: string;
  createdAt: string;
  author?: UserRow;
};

export type PaymentRow = {
  id: string;
  description: string;
  amount: number;
  status: string;
  dueDate: string | null;
  paidAt: string | null;
  receiptUrl: string | null;
  caseId: string | null;
  clientId: string;
  createdAt: string;
};

export type BlogRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  area: string | null;
  published: boolean;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
};

export type SettingsRow = {
  id: string;
  name: string;
  shortName: string;
  title: string;
  oab: string;
  tagline: string;
  headline: string;
  about: string;
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  city: string;
  photoUrl: string | null;
  heroImageUrl: string | null;
  showPhoto: boolean;
  updatedAt: string;
};

function mapUser(row: Record<string, unknown>): UserRow {
  const cases = row.cases as Array<{ count: number }> | undefined;
  return {
    id: String(row.id),
    name: String(row.name),
    email: String(row.email),
    passwordHash: String(row.password_hash),
    role: String(row.role),
    phone: (row.phone as string) || null,
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
    _count: cases ? { cases: cases[0]?.count || 0 } : undefined,
  };
}

function mapLead(row: Record<string, unknown>): LeadRow {
  return {
    id: String(row.id),
    name: String(row.name),
    email: String(row.email),
    phone: (row.phone as string) || null,
    subject: String(row.subject),
    message: String(row.message),
    area: (row.area as string) || null,
    lgpdConsent: Boolean(row.lgpd_consent),
    status: String(row.status),
    createdAt: String(row.created_at),
  };
}

function mapBooking(row: Record<string, unknown>): BookingRow {
  return {
    id: String(row.id),
    name: String(row.name),
    email: String(row.email),
    phone: (row.phone as string) || null,
    type: String(row.type),
    area: String(row.area),
    notes: (row.notes as string) || null,
    scheduledAt: String(row.scheduled_at),
    status: String(row.status),
    lgpdConsent: Boolean(row.lgpd_consent),
    userId: (row.user_id as string) || null,
    createdAt: String(row.created_at),
  };
}

function mapCase(row: Record<string, unknown>): CaseRow {
  return {
    id: String(row.id),
    title: String(row.title),
    description: (row.description as string) || null,
    area: String(row.area),
    status: String(row.status),
    nextStep: (row.next_step as string) || null,
    deadline: (row.deadline as string) || null,
    tags: String(row.tags || "[]"),
    clientId: String(row.client_id),
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
    client: row.client
      ? mapUser(row.client as Record<string, unknown>)
      : undefined,
  };
}

function mapDocument(row: Record<string, unknown>): DocumentRow {
  return {
    id: String(row.id),
    name: String(row.name),
    filename: String(row.filename),
    mimeType: String(row.mime_type),
    size: Number(row.size),
    path: String(row.path),
    visibleToClient: Boolean(row.visible_to_client),
    caseId: (row.case_id as string) || null,
    uploadedById: String(row.uploaded_by_id),
    createdAt: String(row.created_at),
    case: row.case ? mapCase(row.case as Record<string, unknown>) : null,
  };
}

function mapMessage(row: Record<string, unknown>): MessageRow {
  return {
    id: String(row.id),
    body: String(row.body),
    caseId: String(row.case_id),
    authorId: String(row.author_id),
    createdAt: String(row.created_at),
    author: row.author
      ? mapUser(row.author as Record<string, unknown>)
      : undefined,
  };
}

function mapNote(row: Record<string, unknown>): NoteRow {
  return {
    id: String(row.id),
    body: String(row.body),
    caseId: String(row.case_id),
    authorId: String(row.author_id),
    createdAt: String(row.created_at),
    author: row.author
      ? mapUser(row.author as Record<string, unknown>)
      : undefined,
  };
}

function mapPayment(row: Record<string, unknown>): PaymentRow {
  return {
    id: String(row.id),
    description: String(row.description),
    amount: Number(row.amount),
    status: String(row.status),
    dueDate: (row.due_date as string) || null,
    paidAt: (row.paid_at as string) || null,
    receiptUrl: (row.receipt_url as string) || null,
    caseId: (row.case_id as string) || null,
    clientId: String(row.client_id),
    createdAt: String(row.created_at),
  };
}

function mapBlog(row: Record<string, unknown>): BlogRow {
  return {
    id: String(row.id),
    slug: String(row.slug),
    title: String(row.title),
    excerpt: String(row.excerpt),
    content: String(row.content),
    area: (row.area as string) || null,
    published: Boolean(row.published),
    publishedAt: String(row.published_at),
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  };
}

function mapSettings(row: Record<string, unknown>): SettingsRow {
  return {
    id: String(row.id),
    name: String(row.name),
    shortName: String(row.short_name),
    title: String(row.title),
    oab: String(row.oab),
    tagline: String(row.tagline),
    headline: String(row.headline),
    about: String(row.about),
    email: String(row.email),
    phone: String(row.phone),
    whatsapp: String(row.whatsapp),
    address: String(row.address),
    city: String(row.city),
    photoUrl: (row.photo_url as string) || null,
    heroImageUrl: (row.hero_image_url as string) || null,
    showPhoto: row.show_photo === undefined ? true : Boolean(row.show_photo),
    updatedAt: String(row.updated_at),
  };
}

export const db = {
  id: () => createId(),

  users: {
    async findByEmail(email: string) {
      const { data, error } = await supabaseAdmin
        .from("users")
        .select("*")
        .eq("email", email.toLowerCase())
        .maybeSingle();
      if (error) throw new Error(error.message);
      return data ? mapUser(data) : null;
    },
    async findById(id: string) {
      const { data, error } = await supabaseAdmin
        .from("users")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (error) throw new Error(error.message);
      return data ? mapUser(data) : null;
    },
    async create(input: {
      name: string;
      email: string;
      passwordHash: string;
      role?: string;
      phone?: string | null;
    }) {
      const row = {
        id: createId(),
        name: input.name,
        email: input.email.toLowerCase(),
        password_hash: input.passwordHash,
        role: input.role || "CLIENT",
        phone: input.phone || null,
        updated_at: new Date().toISOString(),
      };
      const { data, error } = await supabaseAdmin
        .from("users")
        .insert(row)
        .select("*")
        .single();
      return mapUser(requireData(data, error));
    },
    async listClients() {
      const { data, error } = await supabaseAdmin
        .from("users")
        .select("*, cases(count)")
        .eq("role", "CLIENT")
        .order("created_at", { ascending: false });
      if (error) throw new Error(error.message);
      return (data || []).map((row) => mapUser(row));
    },
    async countClients() {
      const { count, error } = await supabaseAdmin
        .from("users")
        .select("*", { count: "exact", head: true })
        .eq("role", "CLIENT");
      if (error) throw new Error(error.message);
      return count || 0;
    },
  },

  leads: {
    async create(input: {
      name: string;
      email: string;
      phone?: string | null;
      subject: string;
      message: string;
      area?: string | null;
      lgpdConsent: boolean;
    }) {
      const row = {
        id: createId(),
        name: input.name,
        email: input.email.toLowerCase(),
        phone: input.phone || null,
        subject: input.subject,
        message: input.message,
        area: input.area || null,
        lgpd_consent: input.lgpdConsent,
        status: "NEW",
      };
      const { data, error } = await supabaseAdmin
        .from("leads")
        .insert(row)
        .select("*")
        .single();
      return mapLead(requireData(data, error));
    },
    async list() {
      const { data, error } = await supabaseAdmin
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw new Error(error.message);
      return (data || []).map((row) => mapLead(row));
    },
    async recent(limit = 5) {
      const { data, error } = await supabaseAdmin
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(limit);
      if (error) throw new Error(error.message);
      return (data || []).map((row) => mapLead(row));
    },
    async countNew() {
      const { count, error } = await supabaseAdmin
        .from("leads")
        .select("*", { count: "exact", head: true })
        .eq("status", "NEW");
      if (error) throw new Error(error.message);
      return count || 0;
    },
    async updateStatus(id: string, status: string) {
      const { error } = await supabaseAdmin
        .from("leads")
        .update({ status })
        .eq("id", id);
      if (error) throw new Error(error.message);
    },
  },

  bookings: {
    async create(input: {
      name: string;
      email: string;
      phone: string;
      type: string;
      area: string;
      notes?: string | null;
      scheduledAt: string;
      lgpdConsent: boolean;
      userId?: string | null;
      status?: string;
    }) {
      const row = {
        id: createId(),
        name: input.name,
        email: input.email.toLowerCase(),
        phone: input.phone,
        type: input.type,
        area: input.area,
        notes: input.notes || null,
        scheduled_at: input.scheduledAt,
        lgpd_consent: input.lgpdConsent,
        status: input.status || "PENDING",
        user_id: input.userId || null,
      };
      const { data, error } = await supabaseAdmin
        .from("bookings")
        .insert(row)
        .select("*")
        .single();
      return mapBooking(requireData(data, error));
    },
    async findConflict(scheduledAt: string) {
      const { data, error } = await supabaseAdmin
        .from("bookings")
        .select("id")
        .eq("scheduled_at", scheduledAt)
        .in("status", ["PENDING", "CONFIRMED"])
        .maybeSingle();
      if (error) throw new Error(error.message);
      return data;
    },
    async list() {
      const { data, error } = await supabaseAdmin
        .from("bookings")
        .select("*")
        .order("scheduled_at", { ascending: true });
      if (error) throw new Error(error.message);
      return (data || []).map((row) => mapBooking(row));
    },
    async upcoming(limit = 5) {
      const { data, error } = await supabaseAdmin
        .from("bookings")
        .select("*")
        .order("scheduled_at", { ascending: true })
        .limit(limit);
      if (error) throw new Error(error.message);
      return (data || []).map((row) => mapBooking(row));
    },
    async byEmail(email: string, limit = 5) {
      const { data, error } = await supabaseAdmin
        .from("bookings")
        .select("*")
        .eq("email", email.toLowerCase())
        .order("scheduled_at", { ascending: false })
        .limit(limit);
      if (error) throw new Error(error.message);
      return (data || []).map((row) => mapBooking(row));
    },
    async countPending() {
      const { count, error } = await supabaseAdmin
        .from("bookings")
        .select("*", { count: "exact", head: true })
        .eq("status", "PENDING");
      if (error) throw new Error(error.message);
      return count || 0;
    },
    async updateStatus(id: string, status: string) {
      const { error } = await supabaseAdmin
        .from("bookings")
        .update({ status })
        .eq("id", id);
      if (error) throw new Error(error.message);
    },
    async update(
      id: string,
      input: {
        name?: string;
        email?: string;
        phone?: string | null;
        type?: string;
        area?: string;
        notes?: string | null;
        scheduledAt?: string;
        status?: string;
      },
    ) {
      const patch: Record<string, unknown> = {};
      if (input.name !== undefined) patch.name = input.name;
      if (input.email !== undefined) patch.email = input.email.toLowerCase();
      if (input.phone !== undefined) patch.phone = input.phone || null;
      if (input.type !== undefined) patch.type = input.type;
      if (input.area !== undefined) patch.area = input.area;
      if (input.notes !== undefined) patch.notes = input.notes || null;
      if (input.scheduledAt !== undefined)
        patch.scheduled_at = input.scheduledAt;
      if (input.status !== undefined) patch.status = input.status;
      const { error } = await supabaseAdmin
        .from("bookings")
        .update(patch)
        .eq("id", id);
      if (error) throw new Error(error.message);
    },
    async findById(id: string) {
      const { data, error } = await supabaseAdmin
        .from("bookings")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (error) throw new Error(error.message);
      return data ? mapBooking(data) : null;
    },
    async remove(id: string) {
      const { error } = await supabaseAdmin
        .from("bookings")
        .delete()
        .eq("id", id);
      if (error) throw new Error(error.message);
    },
  },

  cases: {
    async list() {
      const { data, error } = await supabaseAdmin
        .from("cases")
        .select("*, client:users!cases_client_id_fkey(*)")
        .order("updated_at", { ascending: false });
      if (error) throw new Error(error.message);
      return (data || []).map((row) => mapCase(row));
    },
    async recent(limit = 5) {
      const { data, error } = await supabaseAdmin
        .from("cases")
        .select("*, client:users!cases_client_id_fkey(*)")
        .order("updated_at", { ascending: false })
        .limit(limit);
      if (error) throw new Error(error.message);
      return (data || []).map((row) => mapCase(row));
    },
    async byClient(clientId: string) {
      const { data, error } = await supabaseAdmin
        .from("cases")
        .select("*")
        .eq("client_id", clientId)
        .order("updated_at", { ascending: false });
      if (error) throw new Error(error.message);
      return (data || []).map((row) => mapCase(row));
    },
    async findById(id: string) {
      const { data, error } = await supabaseAdmin
        .from("cases")
        .select("*, client:users!cases_client_id_fkey(*)")
        .eq("id", id)
        .maybeSingle();
      if (error) throw new Error(error.message);
      return data ? mapCase(data) : null;
    },
    async create(input: {
      title: string;
      description?: string | null;
      area: string;
      nextStep?: string | null;
      clientId: string;
      status?: string;
      tags?: string;
      deadline?: string | null;
    }) {
      const now = new Date().toISOString();
      const row = {
        id: createId(),
        title: input.title,
        description: input.description || null,
        area: input.area,
        next_step: input.nextStep || null,
        client_id: input.clientId,
        status: input.status || "OPEN",
        tags: input.tags || "[]",
        deadline: input.deadline || null,
        created_at: now,
        updated_at: now,
      };
      const { data, error } = await supabaseAdmin
        .from("cases")
        .insert(row)
        .select("*")
        .single();
      return mapCase(requireData(data, error));
    },
    async update(
      id: string,
      input: {
        status?: string;
        nextStep?: string | null;
        description?: string | null;
        deadline?: string | null;
        tags?: string;
      },
    ) {
      const { error } = await supabaseAdmin
        .from("cases")
        .update({
          status: input.status,
          next_step: input.nextStep,
          description: input.description,
          deadline: input.deadline,
          tags: input.tags,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);
      if (error) throw new Error(error.message);
    },
    async countOpen() {
      const { count, error } = await supabaseAdmin
        .from("cases")
        .select("*", { count: "exact", head: true })
        .neq("status", "CLOSED");
      if (error) throw new Error(error.message);
      return count || 0;
    },
  },

  documents: {
    async byCase(caseId: string, onlyVisible = false) {
      let query = supabaseAdmin
        .from("documents")
        .select("*")
        .eq("case_id", caseId)
        .order("created_at", { ascending: false });
      if (onlyVisible) query = query.eq("visible_to_client", true);
      const { data, error } = await query;
      if (error) throw new Error(error.message);
      return (data || []).map((row) => mapDocument(row));
    },
    async findById(id: string) {
      const { data, error } = await supabaseAdmin
        .from("documents")
        .select("*, case:cases(*)")
        .eq("id", id)
        .maybeSingle();
      if (error) throw new Error(error.message);
      return data ? mapDocument(data) : null;
    },
    async create(input: {
      name: string;
      filename: string;
      mimeType: string;
      size: number;
      path: string;
      caseId: string;
      uploadedById: string;
      visibleToClient?: boolean;
    }) {
      const row = {
        id: createId(),
        name: input.name,
        filename: input.filename,
        mime_type: input.mimeType,
        size: input.size,
        path: input.path,
        case_id: input.caseId,
        uploaded_by_id: input.uploadedById,
        visible_to_client: input.visibleToClient ?? true,
      };
      const { data, error } = await supabaseAdmin
        .from("documents")
        .insert(row)
        .select("*")
        .single();
      return mapDocument(requireData(data, error));
    },
  },

  messages: {
    async byCase(caseId: string) {
      const { data, error } = await supabaseAdmin
        .from("messages")
        .select("*, author:users!messages_author_id_fkey(*)")
        .eq("case_id", caseId)
        .order("created_at", { ascending: true });
      if (error) throw new Error(error.message);
      return (data || []).map((row) => mapMessage(row));
    },
    async create(input: { body: string; caseId: string; authorId: string }) {
      const row = {
        id: createId(),
        body: input.body,
        case_id: input.caseId,
        author_id: input.authorId,
      };
      const { data, error } = await supabaseAdmin
        .from("messages")
        .insert(row)
        .select("*")
        .single();
      return mapMessage(requireData(data, error));
    },
  },

  notes: {
    async byCase(caseId: string) {
      const { data, error } = await supabaseAdmin
        .from("notes")
        .select("*, author:users!notes_author_id_fkey(*)")
        .eq("case_id", caseId)
        .order("created_at", { ascending: false });
      if (error) throw new Error(error.message);
      return (data || []).map((row) => mapNote(row));
    },
    async create(input: { body: string; caseId: string; authorId: string }) {
      const row = {
        id: createId(),
        body: input.body,
        case_id: input.caseId,
        author_id: input.authorId,
      };
      const { data, error } = await supabaseAdmin
        .from("notes")
        .insert(row)
        .select("*")
        .single();
      return mapNote(requireData(data, error));
    },
  },

  payments: {
    async all() {
      const { data, error } = await supabaseAdmin
        .from("payments")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw new Error(error.message);
      return (data || []).map((row) => mapPayment(row));
    },
    async byClient(clientId: string) {
      const { data, error } = await supabaseAdmin
        .from("payments")
        .select("*")
        .eq("client_id", clientId)
        .order("created_at", { ascending: false });
      if (error) throw new Error(error.message);
      return (data || []).map((row) => mapPayment(row));
    },
    async byCase(caseId: string) {
      const { data, error } = await supabaseAdmin
        .from("payments")
        .select("*")
        .eq("case_id", caseId)
        .order("created_at", { ascending: false });
      if (error) throw new Error(error.message);
      return (data || []).map((row) => mapPayment(row));
    },
    async create(input: {
      description: string;
      amount: number;
      caseId: string;
      clientId: string;
      dueDate?: string | null;
      status?: string;
      paidAt?: string | null;
    }) {
      const row = {
        id: createId(),
        description: input.description,
        amount: input.amount,
        case_id: input.caseId,
        client_id: input.clientId,
        due_date: input.dueDate || null,
        status: input.status || "PENDING",
        paid_at: input.paidAt || null,
      };
      const { data, error } = await supabaseAdmin
        .from("payments")
        .insert(row)
        .select("*")
        .single();
      return mapPayment(requireData(data, error));
    },
    async markPaid(id: string) {
      const { error } = await supabaseAdmin
        .from("payments")
        .update({ status: "PAID", paid_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw new Error(error.message);
    },
    async updateStatus(id: string, status: string) {
      const patch: Record<string, unknown> = { status };
      if (status === "PAID") patch.paid_at = new Date().toISOString();
      else if (status !== "PAID") patch.paid_at = null;
      const { error } = await supabaseAdmin
        .from("payments")
        .update(patch)
        .eq("id", id);
      if (error) throw new Error(error.message);
    },
  },

  expenses: {
    async list() {
      const { data, error } = await supabaseAdmin
        .from("expenses")
        .select("*")
        .order("incurred_at", { ascending: false });
      if (error) {
        if (error.code === "42P01" || error.code === "42703") return [];
        throw new Error(error.message);
      }
      return (data || []).map((row) => ({
        id: String(row.id),
        description: String(row.description),
        amount: Number(row.amount),
        category: String(row.category || "geral"),
        incurredAt: String(row.incurred_at),
        notes: (row.notes as string) || null,
        createdAt: String(row.created_at),
      }));
    },
    async create(input: {
      description: string;
      amount: number;
      category?: string;
      incurredAt?: string;
      notes?: string | null;
    }) {
      const { error } = await supabaseAdmin.from("expenses").insert({
        id: createId(),
        description: input.description,
        amount: input.amount,
        category: input.category || "geral",
        incurred_at: input.incurredAt || new Date().toISOString(),
        notes: input.notes || null,
      });
      if (error) throw new Error(error.message);
    },
    async remove(id: string) {
      const { error } = await supabaseAdmin
        .from("expenses")
        .delete()
        .eq("id", id);
      if (error) throw new Error(error.message);
    },
  },

  blog: {
    async listPublished() {
      const { data, error } = await supabaseAdmin
        .from("blog_posts")
        .select("*")
        .eq("published", true)
        .order("published_at", { ascending: false });
      if (error) throw new Error(error.message);
      return (data || []).map((row) => mapBlog(row));
    },
    async listAll() {
      const { data, error } = await supabaseAdmin
        .from("blog_posts")
        .select("*")
        .order("published_at", { ascending: false });
      if (error) throw new Error(error.message);
      return (data || []).map((row) => mapBlog(row));
    },
    async bySlug(slug: string) {
      const { data, error } = await supabaseAdmin
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw new Error(error.message);
      return data ? mapBlog(data) : null;
    },
    async create(input: {
      slug: string;
      title: string;
      excerpt: string;
      content: string;
      area?: string | null;
    }) {
      const now = new Date().toISOString();
      const row = {
        id: createId(),
        slug: input.slug,
        title: input.title,
        excerpt: input.excerpt,
        content: input.content,
        area: input.area || null,
        published: true,
        published_at: now,
        created_at: now,
        updated_at: now,
      };
      const { data, error } = await supabaseAdmin
        .from("blog_posts")
        .insert(row)
        .select("*")
        .single();
      return mapBlog(requireData(data, error));
    },
    async upsertBySlug(input: {
      slug: string;
      title: string;
      excerpt: string;
      content: string;
      area?: string | null;
    }) {
      const existing = await this.bySlug(input.slug);
      if (existing) {
        const { error } = await supabaseAdmin
          .from("blog_posts")
          .update({
            title: input.title,
            excerpt: input.excerpt,
            content: input.content,
            area: input.area || null,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existing.id);
        if (error) throw new Error(error.message);
        return existing;
      }
      return this.create(input);
    },
    async setPublished(id: string, published: boolean) {
      const { error } = await supabaseAdmin
        .from("blog_posts")
        .update({ published, updated_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw new Error(error.message);
    },
  },

  settings: {
    async get() {
      const { data, error } = await supabaseAdmin
        .from("site_settings")
        .select("*")
        .eq("id", "default")
        .maybeSingle();
      if (error) throw new Error(error.message);
      return data ? mapSettings(data) : null;
    },
    async upsert(input: {
      name: string;
      shortName: string;
      title: string;
      oab: string;
      tagline: string;
      headline: string;
      about: string;
      email: string;
      phone: string;
      whatsapp: string;
      address: string;
      city: string;
      photoUrl?: string | null;
      heroImageUrl?: string | null;
      showPhoto?: boolean;
    }) {
      const baseRow: Record<string, unknown> = {
        id: "default",
        name: input.name,
        short_name: input.shortName,
        title: input.title,
        oab: input.oab,
        tagline: input.tagline,
        headline: input.headline,
        about: input.about,
        email: input.email,
        phone: input.phone,
        whatsapp: input.whatsapp,
        address: input.address,
        city: input.city,
        updated_at: new Date().toISOString(),
      };
      const extended: Record<string, unknown> = {
        ...baseRow,
        photo_url: input.photoUrl || null,
        hero_image_url: input.heroImageUrl || null,
        show_photo: input.showPhoto ?? true,
      };

      let attempt = await supabaseAdmin
        .from("site_settings")
        .upsert(extended)
        .select("*")
        .single();

      // Retry sem show_photo (coluna nova)
      if (attempt.error?.code === "42703" && "show_photo" in extended) {
        const withoutShow: Record<string, unknown> = { ...extended };
        delete withoutShow.show_photo;
        attempt = await supabaseAdmin
          .from("site_settings")
          .upsert(withoutShow)
          .select("*")
          .single();
      }

      // Retry sem photo/hero (colunas mais antigas)
      if (attempt.error?.code === "42703") {
        attempt = await supabaseAdmin
          .from("site_settings")
          .upsert(baseRow)
          .select("*")
          .single();
      }
      return mapSettings(requireData(attempt.data, attempt.error));
    },
  },

  templates: {
    async list() {
      const { data, error } = await supabaseAdmin
        .from("document_templates")
        .select("*")
        .order("name", { ascending: true });
      if (error) {
        if (error.code === "42P01") return [];
        throw new Error(error.message);
      }
      return (data || []).map((row) => ({
        id: String(row.id),
        name: String(row.name),
        category: String(row.category || "geral"),
        content: String(row.content || ""),
        createdAt: String(row.created_at),
        updatedAt: String(row.updated_at),
      }));
    },
    async findById(id: string) {
      const { data, error } = await supabaseAdmin
        .from("document_templates")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (error) throw new Error(error.message);
      if (!data) return null;
      return {
        id: String(data.id),
        name: String(data.name),
        category: String(data.category || "geral"),
        content: String(data.content || ""),
        createdAt: String(data.created_at),
        updatedAt: String(data.updated_at),
      };
    },
    async create(input: {
      name: string;
      category?: string;
      content: string;
    }) {
      const id = createId();
      const { error } = await supabaseAdmin.from("document_templates").insert({
        id,
        name: input.name,
        category: input.category || "geral",
        content: input.content,
        updated_at: new Date().toISOString(),
      });
      if (error) throw new Error(error.message);
      return id;
    },
    async update(
      id: string,
      input: { name: string; category?: string; content: string },
    ) {
      const { error } = await supabaseAdmin
        .from("document_templates")
        .update({
          name: input.name,
          category: input.category || "geral",
          content: input.content,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);
      if (error) throw new Error(error.message);
    },
    async remove(id: string) {
      const { error } = await supabaseAdmin
        .from("document_templates")
        .delete()
        .eq("id", id);
      if (error) throw new Error(error.message);
    },
  },

  nav: {
    async list() {
      const { data, error } = await supabaseAdmin
        .from("nav_items")
        .select("*")
        .order("position", { ascending: true });
      if (error) {
        if (error.code === "42P01") return [];
        throw new Error(error.message);
      }
      return (data || []).map((row) => ({
        id: String(row.id),
        label: String(row.label),
        href: String(row.href),
        position: Number(row.position || 0),
        visible: Boolean(row.visible),
      }));
    },
    async listVisible() {
      const items = await this.list();
      return items.filter((item) => item.visible);
    },
    async create(input: { label: string; href: string; position?: number }) {
      const { error } = await supabaseAdmin.from("nav_items").insert({
        id: createId(),
        label: input.label,
        href: input.href.startsWith("/") ? input.href : `/${input.href}`,
        position: input.position ?? 999,
        visible: true,
      });
      if (error) throw new Error(error.message);
    },
    async update(
      id: string,
      input: { label: string; href: string; position: number; visible: boolean },
    ) {
      const { error } = await supabaseAdmin
        .from("nav_items")
        .update({
          label: input.label,
          href: input.href.startsWith("/") ? input.href : `/${input.href}`,
          position: input.position,
          visible: input.visible,
        })
        .eq("id", id);
      if (error) throw new Error(error.message);
    },
    async remove(id: string) {
      const { error } = await supabaseAdmin
        .from("nav_items")
        .delete()
        .eq("id", id);
      if (error) throw new Error(error.message);
    },
  },
};

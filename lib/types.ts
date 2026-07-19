// Database entity types matching Supabase tables

export interface Workspace {
  id: string;
  name: string;
  owner_id: string;
  plan: 'free' | 'starter' | 'pro' | 'enterprise';
  created_at: string;
}

export interface WorkspaceMember {
  workspace_id: string;
  user_id: string;
  role: 'owner' | 'admin' | 'editor' | 'viewer';
  created_at: string;
}

export interface Domain {
  id: string;
  workspace_id: string;
  hostname: string;
  status: 'pending' | 'verified' | 'failed';
  verification_token: string;
  is_default: boolean;
  created_at: string;
}

export interface Offer {
  id: string;
  workspace_id: string;
  name: string;
  network: string;
  canonical_url: string;
  fallback_url: string;
  commission_label: string;
  status: 'active' | 'paused' | 'archived';
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface Link {
  id: string;
  workspace_id: string;
  domain_id: string;
  offer_id: string;
  name: string;
  slug: string;
  status: 'active' | 'paused' | 'archived';
  redirect_code: 301 | 302 | 307 | 308;
  preserve_query: boolean;
  starts_at: string | null;
  ends_at: string | null;
  tags: string[];
  social_meta: SocialMeta;
  created_at: string;
  updated_at: string;
}

export interface SocialMeta {
  title?: string;
  description?: string;
  image?: string;
}

export interface Destination {
  id: string;
  link_id: string;
  label: string;
  url: string;
  weight: number;
  priority: number;
  is_fallback: boolean;
  active: boolean;
  created_at: string;
}

export interface RoutingRule {
  id: string;
  link_id: string;
  destination_id: string;
  rule_type: 'country' | 'device' | 'language' | 'referrer' | 'query_param' | 'time' | 'custom';
  operator: 'equals' | 'not_equals' | 'contains' | 'not_contains' | 'in' | 'not_in' | 'matches' | 'gt' | 'lt';
  value: string;
  priority: number;
  active: boolean;
  created_at: string;
}

export interface ClickEvent {
  id: string;
  workspace_id: string;
  link_id: string;
  destination_id: string;
  occurred_at: string;
  visitor_hash: string;
  country_code: string;
  device_type: 'desktop' | 'mobile' | 'tablet' | 'unknown';
  referrer_host: string;
  user_agent: string;
  query: Record<string, string>;
}

export interface Conversion {
  id: string;
  workspace_id: string;
  link_id: string;
  click_event_id: string;
  external_id: string;
  event_type: 'click' | 'lead' | 'sale' | 'signup' | 'custom';
  amount: number;
  currency: string;
  occurred_at: string;
  payload: Record<string, unknown>;
}

export interface HealthCheck {
  id: string;
  destination_id: string;
  checked_at: string;
  status: 'healthy' | 'degraded' | 'down';
  http_status: number;
  final_url: string;
  redirect_count: number;
  latency_ms: number;
  error_message: string | null;
}

// Auth types
export interface UserProfile {
  id: string;
  email: string;
  created_at: string;
}

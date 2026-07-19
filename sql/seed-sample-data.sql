-- OfferRoute Seed Data
-- NOTE: Do NOT run this in production. This is for development/testing only.
-- Adjust UUIDs and workspace_id references to match your environment.

-- ============================================================
-- 1. Workspace for testing
-- ============================================================
INSERT INTO workspaces (id, name, owner_id, plan, created_at)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Test Workspace',
  -- Replace with an actual auth.users UUID after registering
  '00000000-0000-0000-0000-000000000099',
  'free',
  now()
) ON CONFLICT (id) DO NOTHING;

-- Workspace member (owner)
INSERT INTO workspace_members (workspace_id, user_id, role, created_at)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000099',
  'owner',
  now()
) ON CONFLICT (workspace_id, user_id) DO NOTHING;

-- ============================================================
-- 2. Domains
-- ============================================================
INSERT INTO domains (id, workspace_id, hostname, status, verification_token, is_default, created_at)
VALUES
  (
    '10000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    'go.incomecloser.com',
    'verified',
    'verify_token_1',
    true,
    now()
  ),
  (
    '10000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000001',
    'go.healthyzo.com',
    'pending',
    'verify_token_2',
    false,
    now()
  )
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 3. Offers
-- ============================================================
INSERT INTO offers (id, workspace_id, name, network, canonical_url, fallback_url, commission_label, status, metadata, created_at, updated_at)
VALUES
  (
    '20000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    'Email Toolkit',
    'ClickBank',
    'https://vendor.com/email-toolkit?aff=demo',
    'https://vendor.com/email-toolkit',
    '$14.00',
    'active',
    '{}',
    now(),
    now()
  ),
  (
    '20000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000001',
    'Sleep Reset',
    'ClickBank',
    'https://vendor.com/sleep-reset?aff=demo',
    'https://vendor.com/sleep-reset',
    '$18.00',
    'active',
    '{}',
    now(),
    now()
  ),
  (
    '20000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000001',
    'AI Funnel Builder',
    'WarriorPlus',
    'https://vendor.com/ai-funnel?aff=demo',
    'https://vendor.com/ai-funnel',
    '$12.00',
    'active',
    '{}',
    now(),
    now()
  ),
  (
    '20000000-0000-0000-0000-000000000004',
    '00000000-0000-0000-0000-000000000001',
    'Wellness Guide',
    'Direct',
    'https://vendor.com/wellness?aff=demo',
    'https://vendor.com/wellness',
    '$9.00',
    'active',
    '{}',
    now(),
    now()
  )
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 4. Links with Destinations
-- ============================================================

-- Link 1: Email Toolkit Promo
INSERT INTO links (id, workspace_id, domain_id, offer_id, name, slug, status, redirect_code, preserve_query, starts_at, ends_at, tags, social_meta, created_at, updated_at)
VALUES (
  '30000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  '10000000-0000-0000-0000-000000000001',
  '20000000-0000-0000-0000-000000000001',
  'Email Toolkit Promo',
  'email-toolkit',
  'active',
  302,
  true,
  null,
  null,
  '{"email","evergreen"}',
  '{"title":"Email Toolkit - Best Email Marketing Tool","description":"Grow your email list fast"}',
  now(),
  now()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO destinations (id, link_id, label, url, weight, priority, is_fallback, active, created_at)
VALUES (
  '40000000-0000-0000-0000-000000000001',
  '30000000-0000-0000-0000-000000000001',
  'Primary',
  'https://vendor.com/email-toolkit?aff=demo',
  100,
  0,
  false,
  true,
  now()
) ON CONFLICT (id) DO NOTHING;

-- Link 2: Sleep Reset Guide
INSERT INTO links (id, workspace_id, domain_id, offer_id, name, slug, status, redirect_code, preserve_query, starts_at, ends_at, tags, social_meta, created_at, updated_at)
VALUES (
  '30000000-0000-0000-0000-000000000002',
  '00000000-0000-0000-0000-000000000001',
  '10000000-0000-0000-0000-000000000002',
  '20000000-0000-0000-0000-000000000002',
  'Sleep Reset Guide',
  'sleep',
  'active',
  302,
  true,
  null,
  null,
  '{"sleep","pinterest"}',
  '{}',
  now(),
  now()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO destinations (id, link_id, label, url, weight, priority, is_fallback, active, created_at)
VALUES (
  '40000000-0000-0000-0000-000000000002',
  '30000000-0000-0000-0000-000000000002',
  'Primary',
  'https://vendor.com/sleep-reset?aff=demo',
  100,
  0,
  false,
  true,
  now()
) ON CONFLICT (id) DO NOTHING;

-- Link 3: AI Funnel Builder
INSERT INTO links (id, workspace_id, domain_id, offer_id, name, slug, status, redirect_code, preserve_query, starts_at, ends_at, tags, social_meta, created_at, updated_at)
VALUES (
  '30000000-0000-0000-0000-000000000003',
  '00000000-0000-0000-0000-000000000001',
  '10000000-0000-0000-0000-000000000001',
  '20000000-0000-0000-0000-000000000003',
  'AI Funnel Builder',
  'funnel-ai',
  'active',
  302,
  true,
  null,
  null,
  '{"ai","launch"}',
  '{}',
  now(),
  now()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO destinations (id, link_id, label, url, weight, priority, is_fallback, active, created_at)
VALUES (
  '40000000-0000-0000-0000-000000000003',
  '30000000-0000-0000-0000-000000000003',
  'Primary',
  'https://vendor.com/ai-funnel?aff=demo',
  100,
  0,
  false,
  true,
  now()
) ON CONFLICT (id) DO NOTHING;

-- Link 4: Wellness Starter Guide
INSERT INTO links (id, workspace_id, domain_id, offer_id, name, slug, status, redirect_code, preserve_query, starts_at, ends_at, tags, social_meta, created_at, updated_at)
VALUES (
  '30000000-0000-0000-0000-000000000004',
  '00000000-0000-0000-0000-000000000001',
  '10000000-0000-0000-0000-000000000002',
  '20000000-0000-0000-0000-000000000004',
  'Wellness Starter Guide',
  'wellness',
  'active',
  302,
  true,
  null,
  null,
  '{"wellness"}',
  '{}',
  now(),
  now()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO destinations (id, link_id, label, url, weight, priority, is_fallback, active, created_at)
VALUES (
  '40000000-0000-0000-0000-000000000004',
  '30000000-0000-0000-0000-000000000004',
  'Primary',
  'https://vendor.com/wellness?aff=demo',
  100,
  0,
  false,
  true,
  now()
) ON CONFLICT (id) DO NOTHING;

-- Link 5: Old Product Redirect (warning status)
INSERT INTO links (id, workspace_id, domain_id, offer_id, name, slug, status, redirect_code, preserve_query, starts_at, ends_at, tags, social_meta, created_at, updated_at)
VALUES (
  '30000000-0000-0000-0000-000000000005',
  '00000000-0000-0000-0000-000000000001',
  '10000000-0000-0000-0000-000000000001',
  null,
  'Old Product Redirect',
  'old-offer',
  'paused',
  302,
  true,
  null,
  null,
  '{"archive"}',
  '{}',
  now(),
  now()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO destinations (id, link_id, label, url, weight, priority, is_fallback, active, created_at)
VALUES (
  '40000000-0000-0000-0000-000000000005',
  '30000000-0000-0000-0000-000000000005',
  'Primary',
  'https://vendor.com/old-offer',
  100,
  0,
  false,
  true,
  now()
) ON CONFLICT (id) DO NOTHING;

-- Link 6: Pinterest Lead Magnet (paused)
INSERT INTO links (id, workspace_id, domain_id, offer_id, name, slug, status, redirect_code, preserve_query, starts_at, ends_at, tags, social_meta, created_at, updated_at)
VALUES (
  '30000000-0000-0000-0000-000000000006',
  '00000000-0000-0000-0000-000000000001',
  '10000000-0000-0000-0000-000000000001',
  null,
  'Pinterest Lead Magnet',
  'pin-kit',
  'paused',
  302,
  true,
  null,
  null,
  '{"pinterest","leadgen"}',
  '{}',
  now(),
  now()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO destinations (id, link_id, label, url, weight, priority, is_fallback, active, created_at)
VALUES (
  '40000000-0000-0000-0000-000000000006',
  '30000000-0000-0000-0000-000000000006',
  'Primary',
  'https://vendor.com/pinterest-kit',
  100,
  0,
  false,
  true,
  now()
) ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 5. Sample Click Events
-- ============================================================
INSERT INTO click_events (id, workspace_id, link_id, destination_id, occurred_at, visitor_hash, country_code, device_type, referrer_host, user_agent, query)
VALUES
  (
    '50000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    '30000000-0000-0000-0000-000000000001',
    '40000000-0000-0000-0000-000000000001',
    now() - interval '2 hours',
    'hash_visitor_001',
    'US',
    'desktop',
    'google.com',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    '{}'
  ),
  (
    '50000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000001',
    '30000000-0000-0000-0000-000000000001',
    '40000000-0000-0000-0000-000000000001',
    now() - interval '3 hours',
    'hash_visitor_002',
    'US',
    'mobile',
    'pinterest.com',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0)',
    '{}'
  ),
  (
    '50000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000001',
    '30000000-0000-0000-0000-000000000002',
    '40000000-0000-0000-0000-000000000002',
    now() - interval '4 hours',
    'hash_visitor_003',
    'ID',
    'mobile',
    'pinterest.com',
    'Mozilla/5.0 (Linux; Android 14)',
    '{}'
  ),
  (
    '50000000-0000-0000-0000-000000000004',
    '00000000-0000-0000-0000-000000000001',
    '30000000-0000-0000-0000-000000000003',
    '40000000-0000-0000-0000-000000000003',
    now() - interval '5 hours',
    'hash_visitor_004',
    'GB',
    'desktop',
    'google.com',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0)',
    '{}'
  ),
  (
    '50000000-0000-0000-0000-000000000005',
    '00000000-0000-0000-0000-000000000001',
    '30000000-0000-0000-0000-000000000004',
    '40000000-0000-0000-0000-000000000004',
    now() - interval '6 hours',
    'hash_visitor_005',
    'CA',
    'tablet',
    'direct',
    'Mozilla/5.0 (iPad; CPU OS 17_0)',
    '{}'
  ),
  (
    '50000000-0000-0000-0000-000000000006',
    '00000000-0000-0000-0000-000000000001',
    '30000000-0000-0000-0000-000000000001',
    '40000000-0000-0000-0000-000000000001',
    now() - interval '1 day',
    'hash_visitor_006',
    'US',
    'desktop',
    'email',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    '{}'
  ),
  (
    '50000000-0000-0000-0000-000000000007',
    '00000000-0000-0000-0000-000000000001',
    '30000000-0000-0000-0000-000000000002',
    '40000000-0000-0000-0000-000000000002',
    now() - interval '1 day',
    'hash_visitor_001',
    'US',
    'mobile',
    'pinterest.com',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0)',
    '{}'
  ),
  (
    '50000000-0000-0000-0000-000000000008',
    '00000000-0000-0000-0000-000000000001',
    '30000000-0000-0000-0000-000000000003',
    '40000000-0000-0000-0000-000000000003',
    now() - interval '2 days',
    'hash_visitor_007',
    'DE',
    'desktop',
    'google.com',
    'Mozilla/5.0 (X11; Linux x86_64)',
    '{}'
  ),
  (
    '50000000-0000-0000-0000-000000000009',
    '00000000-0000-0000-0000-000000000001',
    '30000000-0000-0000-0000-000000000004',
    '40000000-0000-0000-0000-000000000004',
    now() - interval '2 days',
    'hash_visitor_008',
    'IN',
    'mobile',
    'direct',
    'Mozilla/5.0 (Linux; Android 14)',
    '{}'
  ),
  (
    '50000000-0000-0000-0000-000000000010',
    '00000000-0000-0000-0000-000000000001',
    '30000000-0000-0000-0000-000000000001',
    '40000000-0000-0000-0000-000000000001',
    now() - interval '3 days',
    'hash_visitor_009',
    'BR',
    'desktop',
    'google.com',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    '{}'
  );

-- ============================================================
-- 6. Sample Health Checks
-- ============================================================
INSERT INTO health_checks (id, destination_id, checked_at, status, http_status, final_url, redirect_count, latency_ms, error_message)
VALUES
  (
    '60000000-0000-0000-0000-000000000001',
    '40000000-0000-0000-0000-000000000001',
    now() - interval '2 hours',
    'healthy',
    200,
    'https://vendor.com/email-toolkit?aff=demo',
    1,
    342,
    null
  ),
  (
    '60000000-0000-0000-0000-000000000002',
    '40000000-0000-0000-0000-000000000002',
    now() - interval '2 hours',
    'degraded',
    200,
    'https://vendor.com/sleep-reset?aff=demo',
    5,
    1205,
    'Excessive redirect chain (5 hops)'
  ),
  (
    '60000000-0000-0000-0000-000000000003',
    '40000000-0000-0000-0000-000000000003',
    now() - interval '2 hours',
    'healthy',
    200,
    'https://vendor.com/ai-funnel?aff=demo',
    2,
    450,
    null
  ),
  (
    '60000000-0000-0000-0000-000000000004',
    '40000000-0000-0000-0000-000000000004',
    now() - interval '2 hours',
    'healthy',
    200,
    'https://vendor.com/wellness?aff=demo',
    1,
    310,
    null
  ),
  (
    '60000000-0000-0000-0000-000000000005',
    '40000000-0000-0000-0000-000000000005',
    now() - interval '2 hours',
    'down',
    404,
    'https://vendor.com/old-offer',
    0,
    180,
    '404 Not Found'
  ),
  (
    '60000000-0000-0000-0000-000000000006',
    '40000000-0000-0000-0000-000000000006',
    now() - interval '1 day',
    'healthy',
    200,
    'https://vendor.com/pinterest-kit',
    1,
    295,
    null
  );

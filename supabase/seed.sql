-- Sample seed data for Ma & Co CRM
-- Replace {{OWNER_ID}} with the Supabase user UUID that owns this workspace before running.
-- Apply with: supabase db remote commit supabase/seed.sql

insert into clients (id, owner_id, name, utr, vat_number, paye_reference, companies_house_number, email, phone)
values
  ('00000000-0000-4000-8000-000000000001', '{{OWNER_ID}}', 'Aurora Construction Ltd', '1234567890', 'GB123456789', '123/AB4567', '12345678', 'finance@auroraconstruction.co.uk', '0207 111 2222'),
  ('00000000-0000-4000-8000-000000000002', '{{OWNER_ID}}', 'Willow Retail Group', null, 'GB234567890', null, '87654321', 'accounts@willowretail.co.uk', '0207 333 4444');

insert into workers (id, owner_id, name, email, specialties)
values
  ('10000000-0000-4000-8000-000000000001', '{{OWNER_ID}}', 'Hannah Mason', 'hannah@maaccountants.co.uk', '{"CIS","Payroll"}'),
  ('10000000-0000-4000-8000-000000000002', '{{OWNER_ID}}', 'James Patel', 'james@maaccountants.co.uk', '{"VAT","CT600"}');

insert into tasks (id, owner_id, client_id, assignee_id, title, description, due_date, category, status)
values
  ('20000000-0000-4000-8000-000000000001', '{{OWNER_ID}}', '00000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', 'Submit CIS return', 'Compile subcontractor statements and submit CIS return for June.', current_date + interval '5 day', 'Compliance', 'Pending'),
  ('20000000-0000-4000-8000-000000000002', '{{OWNER_ID}}', '00000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000002', 'Prepare VAT return', 'Reconcile Q2 VAT and schedule payment.', current_date + interval '12 day', 'Tax', 'In Progress');

insert into documents (id, owner_id, client_id, filename, original_name, storage_path, description, category)
values
  ('30000000-0000-4000-8000-000000000001', '{{OWNER_ID}}', '00000000-0000-4000-8000-000000000001', 'cis-summary.pdf', 'CIS Summary May 2024.pdf', 'backend/uploads/cis-summary.pdf', 'Signed CIS summary for May 2024', 'Payroll'),
  ('30000000-0000-4000-8000-000000000002', '{{OWNER_ID}}', '00000000-0000-4000-8000-000000000002', 'vat-working.xlsx', 'VAT Working Q2.xlsx', 'backend/uploads/vat-working.xlsx', 'VAT calculations ready for submission', 'VAT');

insert into payments (id, owner_id, client_id, stripe_session_id, amount, currency, description, status, url)
values
  ('40000000-0000-4000-8000-000000000001', '{{OWNER_ID}}', '00000000-0000-4000-8000-000000000001', 'cs_test_00000000000001', 450, 'gbp', 'Monthly CIS compliance retainer', 'open', 'https://checkout.stripe.com/pay/cs_test_00000000000001'),
  ('40000000-0000-4000-8000-000000000002', '{{OWNER_ID}}', '00000000-0000-4000-8000-000000000002', 'cs_test_00000000000002', 780, 'gbp', 'Quarterly VAT support', 'complete', 'https://checkout.stripe.com/pay/cs_test_00000000000002');

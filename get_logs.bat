@echo off
curl -s --max-time 10 -H "apikey: sb_publishable_3DWLrcWUpjuE_gNKEivM8A_UHOmJLgu" -H "Authorization: Bearer sb_publishable_3DWLrcWUpjuE_gNKEivM8A_UHOmJLgu" "https://hniqpnuqqsmqpolxgbav.supabase.co/rest/v1/sds_admin_logs?select=*&order=created_at.desc&limit=30"

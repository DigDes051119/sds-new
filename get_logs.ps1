$headers = @{
  "apikey" = "sb_publishable_3DWLrcWUpjuE_gNKEivM8A_UHOmJLgu"
  "Authorization" = "Bearer sb_publishable_3DWLrcWUpjuE_gNKEivM8A_UHOmJLgu"
}
$res = Invoke-RestMethod -Uri "https://hniqpnuqqsmqpolxgbav.supabase.co/rest/v1/sds_admin_logs?select=*&order=created_at.desc&limit=30" -Headers $headers
$res | ConvertTo-Json -Depth 100

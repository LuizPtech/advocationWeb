import { AdminShell } from "@/components/admin/AdminShell";
import { ensureSiteSettings } from "@/lib/site-settings";
import { SiteForm } from "./SiteForm";

export const dynamic = "force-dynamic";

export default async function AdminSitePage() {
  const settings = await ensureSiteSettings();

  return (
    <AdminShell
      title="Editar site"
      subtitle="Altere fotos, textos e informações de contato. As mudanças aparecem imediatamente no site público."
    >
      <SiteForm settings={settings} />
    </AdminShell>
  );
}

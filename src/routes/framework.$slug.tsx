import { createFileRoute } from "@tanstack/react-router";
import { FrameworkView } from "@/features/matriks/framework-view";
import { SLUG_TO_FRAMEWORK_NAME } from "@/frameworkData";

export const Route = createFileRoute("/framework/$slug")({
  component: FrameworkSlugPage,
});

function FrameworkSlugPage() {
  const { slug } = Route.useParams();
  const frameworkName = SLUG_TO_FRAMEWORK_NAME[slug] || decodeURIComponent(slug.replace(/-/g, " "));

  return <FrameworkView frameworkName={frameworkName} />;
}

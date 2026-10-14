import { Suspense, use } from "react";
import UserDetailContent from "./UserDetailContent";

export function generateStaticParams() {
  return [
    { id: "emp-1001" },
    { id: "emp-1014" },
    { id: "emp-1022" },
    { id: "emp-1035" },
    { id: "emp-1049" },
    { id: "emp-1056" },
    { id: "emp-1062" },
    { id: "emp-1070" },
  ];
}

function UserDetailResolver({
  paramsPromise,
}: {
  paramsPromise: Promise<{ id: string }>;
}) {
  const { id } = use(paramsPromise);
  return <UserDetailContent userId={id} />;
}

export default function UserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background text-on-surface">
          <div className="flex items-center gap-2 text-sm text-secondary">
            <span className="material-symbols-outlined animate-spin text-primary">
              progress_activity
            </span>
            <span>Loading user profile...</span>
          </div>
        </div>
      }
    >
      <UserDetailResolver paramsPromise={params} />
    </Suspense>
  );
}

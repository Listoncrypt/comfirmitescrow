import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { format } from "date-fns";
import { AdminUserActions } from "@/components/admin/user-actions";
import { UserSearch } from "@/components/admin/user-search";

export const dynamic = "force-dynamic";

// Helper component for highlighting text
function HighlightText({ text, highlight }: { text: string; highlight: string }) {
  if (!highlight.trim()) {
    return <span>{text}</span>;
  }

  const parts = text.split(new RegExp(`(${highlight})`, "gi"));

  return (
    <span>
      {parts.map((part, i) =>
        part.toLowerCase() === highlight.toLowerCase() ? (
          <span key={i} className="bg-yellow-200 dark:bg-yellow-900/50 font-bold">
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  );
}

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: { query?: string };
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const query = searchParams?.query || "";

  // Get users logic
  let queryBuilder = supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (query) {
    queryBuilder = queryBuilder.or(
      `email.ilike.%${query}%,full_name.ilike.%${query}%`
    );
  }

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const { data: users } = await queryBuilder as { data: any[] };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Users</h1>
          <p className="text-muted-foreground">
            Manage all registered users on the platform
          </p>
        </div>
        <UserSearch />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>
            {users?.length || 0} users registered
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Balance</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users?.map((profile) => {
                const initials = profile.full_name
                  ? profile.full_name
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)
                  : "U";

                return (
                  <TableRow key={profile.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">
                          <HighlightText
                            text={profile.full_name || ""}
                            highlight={query}
                          />
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      <HighlightText
                        text={profile.email || ""}
                        highlight={query}
                      />
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          profile.role === "admin" ? "default" : "secondary"
                        }
                      >
                        {profile.role}
                      </Badge>
                    </TableCell>
                    <TableCell>₦{profile.balance?.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || "0.00"}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {format(new Date(profile.created_at), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell className="text-right">
                      <AdminUserActions user={profile} />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

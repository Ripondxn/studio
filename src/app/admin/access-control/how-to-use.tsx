
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function HowToUse() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>How to Use</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold">1. Role-Based Access Control (Primary Method)</h3>
          <p className="text-sm text-muted-foreground">
            Assign permissions to roles, and then assign users to those roles. This is the recommended way to manage permissions for most users.
          </p>
          <ul className="list-disc list-inside text-sm space-y-1 mt-2">
            <li>Define a role (e.g., "Accountant", "Property Manager").</li>
            <li>Assign permissions for actions (e.g., `view`, `edit`) to each role for a specific feature.</li>
            <li>Assign a user to the appropriate role.</li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold">2. User Permission Overrides (For Special Cases)</h3>
          <p className="text-sm text-muted-foreground">
            For exceptional situations where a user needs a unique set of permissions that don't fit into a standard role, you can use individual overrides.
          </p>
          <ul className="list-disc list-inside text-sm space-y-1 mt-2">
            <li>Select a specific user in the access control settings.</li>
            <li>Grant that user access to specific modules or features.</li>
            <li>This overrides the permissions of their assigned role for those specific modules.</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

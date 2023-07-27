import { UserButton } from "@clerk/nextjs";

export interface IDashboardPageProps {}

export default function DashboardPage(props: IDashboardPageProps) {
  return (
    <div>
      Dashboard page
      <UserButton afterSignOutUrl="/" />
    </div>
  );
}

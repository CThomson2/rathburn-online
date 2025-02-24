import { paths } from "@/config/paths";
import { DashboardContent } from "./_components/content";
import { DashboardProvider } from "@/features/dashboard/context/dashboard-context";

const DashboardPage = () => {
  return (
    <DashboardProvider>
      <DashboardContent />
    </DashboardProvider>
  );
};

export default DashboardPage;

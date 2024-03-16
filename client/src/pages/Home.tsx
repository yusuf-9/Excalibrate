import { useSearchParams } from "react-router-dom";

// components
import ThemeToggle from "@/components/theme";
import WelcomeForm from "@/components/welcome-form";

const WelcomePage = () => {
    const [searchParams] = useSearchParams();
  return (
    <>
      <WelcomeForm searchParams={searchParams} />
      <ThemeToggle className="absolute right-1 top-2 !text-white" />
    </>
  );
};

export default WelcomePage;

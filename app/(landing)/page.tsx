import { Button } from "../../src/components/ui/button";
import Link from "next/link";

export interface ILandingPageProps {}

export default function LandingPage(props: ILandingPageProps) {
  return (
    <div>
      Landing page
      <div>
        <Link href="/sign-in">
          <Button>Login</Button>
        </Link>
        <Link href="/sign-up">
          <Button>Register</Button>
        </Link>
      </div>
    </div>
  );
}

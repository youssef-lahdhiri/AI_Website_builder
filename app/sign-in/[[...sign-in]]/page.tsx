import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="absolute top-0 mx-auto">
        <div>Email: test+clerk_test@test.com</div>
      <div>Password: testbuildifyai</div>
      </div>
      <SignIn/>
    </div>
  );
}

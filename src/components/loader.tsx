import Image from "next/image";

const Loader = ({ message = "AI is thinking..." }: { message?: string }) => {
  return (
    <div className="h-full gap-y-4 flex flex-col justify-center items-center">
      <div className="relative w-10 h-10 animate-spin">
        <Image alt="logo" src="/logo.png" fill />
      </div>
      <p className="text-sm text-muted-foreground text-center">{message}</p>
    </div>
  );
};

export default Loader;

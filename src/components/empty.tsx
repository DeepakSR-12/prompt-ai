import Image from "next/image";

interface EmptyProps {
  label: string;
}

const Empty = ({ label }: EmptyProps) => {
  return (
    <div className="h-full p-20 flex flex-col justify-center items-center">
      <div className="relative w-72 h-72">
        <Image alt="empty" src="/empty.png" fill />
      </div>
      <p className="text-sm text-muted-foreground text-center">{label}</p>
    </div>
  );
};

export default Empty;

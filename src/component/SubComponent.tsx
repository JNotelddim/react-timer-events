import clsx from "clsx";
import { useToast } from "component/provider";
export type SubComponentVariant = "red" | "blue" | "green" | "yellow";

export const SubComponent = ({ variant }: { variant: SubComponentVariant }) => {
  const { addToast } = useToast();

  const onClick = () => {
    addToast({ variant });
  };

  return (
    <div
      className={clsx("flex flex-1 p-12 justify-center items-center", {
        "bg-red-500": variant === "red",
        "bg-blue-500": variant === "blue",
        "bg-green-500": variant === "green",
        "bg-yellow-500": variant === "yellow",
      })}
    >
      <button
        className="border rounded border-black py-2 px-3 bg-white"
        onClick={onClick}
      >
        Add Toast
      </button>
    </div>
  );
};

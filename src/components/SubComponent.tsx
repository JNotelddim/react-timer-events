import clsx from "clsx";
export type SubComponentVariant = "red" | "blue" | "green" | "yellow";

export const SubComponent = ({ variant }: { variant: SubComponentVariant }) => {
  return (
    <div
      className={clsx("flex flex-1 p-12 justify-center items-center", {
        "bg-red-500": variant === "red",
        "bg-blue-500": variant === "blue",
        "bg-green-500": variant === "green",
        "bg-yellow-500": variant === "yellow",
      })}
    >
      <button className="border rounded border-black py-2 px-3 bg-white">
        Action
      </button>
    </div>
  );
};

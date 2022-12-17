import clsx from "clsx";
import { SubComponentVariant } from "./SubComponent";

export const Toast = ({
  variant = "green",
}: {
  variant?: SubComponentVariant;
}) => {
  return (
    <div className="flex py-3 px-4 border rounded-lg shadow-lg items-center">
      <svg
        width={24}
        height={24}
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        className={clsx("stroke-[6px] fill-none", {
          "stroke-red-500": variant === "red",
          "stroke-blue-500": variant === "blue",
          "stroke-green-500": variant === "green",
          "stroke-yellow-500": variant === "yellow",
        })}
      >
        <circle cx="50" cy="50" r="45" />
      </svg>
      <span className="ml-4">Text</span>
    </div>
  );
};

import clsx from "clsx";
import { SubComponentVariant } from "./SubComponent";

export const Toast = ({
  variant = "green",
  isPaused,
}: {
  variant?: SubComponentVariant;
  isPaused?: boolean;
}) => {
  // console.log({ isPaused });
  const strokeClassName = {
    "stroke-red-500": variant === "red",
    "stroke-blue-500": variant === "blue",
    "stroke-green-500": variant === "green",
    "stroke-yellow-500": variant === "yellow",
  };

  return (
    <div className="flex py-3 px-4 border rounded-lg shadow-lg items-center">
      {isPaused ? (
        <svg width={24} height={24} viewBox="0 0 100 100">
          <path
            x={20}
            y={20}
            width={20}
            height={60}
            fill={clsx(strokeClassName)}
          />
          <path
            x={60}
            y={20}
            width={20}
            height={60}
            fill={clsx(strokeClassName)}
          />
        </svg>
      ) : (
        <svg
          width={24}
          height={24}
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
          className={clsx("stroke-[6px] fill-none", strokeClassName)}
        >
          <circle cx="50" cy="50" r="45" />
        </svg>
      )}
      <span className="ml-4">Text</span>
    </div>
  );
};

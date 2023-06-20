import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/solid";

const colorClasses = {
  red: "bg-red-500",
  blue: "bg-blue-500",
  green: "bg-green-500",
};

export default function Snackbar({ message, color }) {
  return (
    <div
      className={`fixed top-0 right-0 z-50 py-4 px-6 transform translate-y-2 ${colorClasses[color]} text-white shadow-lg rounded-lg m-4 max-w-[25%]`}
    >
      <div className="flex">
        <div className="flex-shrink-0">
          {(() => {
            if (color === "green") {
              return (
                <CheckCircleIcon
                  className="h-6 w-6 text-white"
                  aria-hidden="true"
                />
              );
            } else if (color === "red") {
              return (
                <XCircleIcon
                  className="h-6 w-6 text-white"
                  aria-hidden="true"
                />
              );
            } else {
              // return null;
            }
          })()}
        </div>

        <div className="ml-3">
          <p className="text-sm font-medium text-white ">{message}</p>
        </div>
      </div>
    </div>
  );
}

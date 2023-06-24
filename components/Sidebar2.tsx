import { useState, Fragment } from "react";
import { useRouter } from "next/router";
import { FiGrid, FiLogOut, FiMail, FiSettings, FiX } from "react-icons/fi";
import { HiOutlinePaperAirplane } from "react-icons/hi";
import { Dialog, Transition } from "@headlessui/react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebaseClient";

const Menus = [
  { title: "Dashboard", src: FiGrid, path: "/dashboard" },
  { title: "Campaigns", src: HiOutlinePaperAirplane, path: "/dashboard/send" },
  { title: "Settings", src: FiSettings, path: "/settings" },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const { asPath } = useRouter();

  return (
    <>
      {/* <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 flex z-40 md:hidden"
          onClose={() => setOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
              <div className="absolute top-0 right-0 -mr-12 pt-2">
                <button
                  onClick={() => setOpen(false)}
                  className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                >
                  <span className="sr-only">Close sidebar</span>
                  <FiX className="h-6 w-6 text-black" aria-hidden="true" />
                </button>
              </div>

              <div className="flex-shrink-0 flex items-center px-4 py-5 hover:cursor-pointer">
                <img
                  className="h-8 w-auto"
                  src="/templogo.svg"
                  alt="Pipeline AI"
                />
                <span className="ml-3 text-gray-900 text-2xl font-semibold">
                  Pipeline AI
                </span>
              </div>

              <div className="mt-5 flex-1 h-0 overflow-y-auto">
                <nav className="px-2 space-y-1">
                  {Menus.map((Menu, index) => (
                    <a
                      key={index}
                      href={Menu.path}
                      className={classNames(
                        asPath === Menu.path
                          ? "bg-gray-100 text-gray-900"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                        "group flex items-center px-2 py-2 text-base font-medium rounded-md"
                      )}
                    >
                      <Menu.src className="text-gray-400 group-hover:text-gray-500 mr-4 h-6 w-6" />
                      {Menu.title}
                    </a>
                  ))}
                </nav>
              </div>
            </div>
          </Transition.Child>
        </Dialog>
      </Transition.Root> */}

      {/* Static sidebar for desktop */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1 border-r border-gray-200 bg-white">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div
                className="flex items-center flex-shrink-0 px-4 hover:cursor-pointer"
                onClick={() => {}}
              >
                <img
                  className="h-8 w-auto"
                  src="/templogo.svg"
                  alt="Pipeline AI"
                />
                <span className="ml-3 text-gray-900 text-2xl font-semibold">
                  Pipeline AI
                </span>
              </div>

              <nav className="mt-5 flex-1 px-2 space-y-1">
                {Menus.map((Menu, index) => (
                  <a
                    key={index}
                    href={Menu.path}
                    className={classNames(
                      asPath === Menu.path
                        ? "bg-gray-100 text-gray-900"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                      "group flex items-center px-2 py-2 text-base font-medium rounded-md"
                    )}
                  >
                    <Menu.src className="text-gray-400 group-hover:text-gray-500 mr-4 h-6 w-6" />
                    <p className="">{Menu.title}</p>
                  </a>
                ))}
              </nav>
            </div>
            <div className="flex-shrink-0 flex bg-gray-50 p-4">
              <button
                onClick={() => signOut(auth)}
                className="flex-shrink-0 w-full group block"
              >
                <div className="flex items-center">
                  <div>
                    <FiLogOut className="text-gray-400 group-hover:text-red-500 h-6 w-6" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                      Sign out
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;

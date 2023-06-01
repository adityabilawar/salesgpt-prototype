import Image from "next/image";
import { useState } from "react";
import { FiGrid, FiMail } from 'react-icons/fi';
import { HiOutlinePaperAirplane } from 'react-icons/hi';
import { useRouter } from 'next/router';
import Link from "next/link";

const Sidebar = () => {
  const [open, setOpen] = useState(true);
  const { asPath } = useRouter();
  console.log(asPath);

  const Menus = [
    { title: "Dashboard", src: (<FiGrid />), path: "/dashboard" },
    { title: "Leads", src: (<FiMail />), path: "/leads" },
    { title: "Campaigns", src: (<HiOutlinePaperAirplane className="rotate-[45deg]" />), path: "/dashboard/send" },
  ];

  return (
    <div className="flex border-r-[1px]">
      <div
        className={` ${open ? "w-72" : "w-20 "
          } bg-dark-purple h-screen p-5  pt-8 relative duration-300`}
      >
        <div
          className={`absolute cursor-pointer -right-4 top-11 w-7 bg-[#1D203E]
           border-2 rounded-full  ${!open && "rotate-180"}`}
          onClick={() => setOpen(!open)}
        ><div className="h-4 w-4 bg-white rounded-full">
          </div></div>
        <div className="flex gap-x-4 items-center">
          <Image
            src="/templogo.svg" height={40} width={40}
            alt=""
            className={`cursor-pointer duration-500 ${open && "rotate-[360deg]"
              }`}
          />
          <h1
            className={`text-white origin-left font-bold text-xl duration-200 ${!open && "scale-0"
              }`}
          >
            Pipeline AI
          </h1>
        </div>
        <ul className="pt-6 flex flex-col space-y-2">
          {Menus.map((Menu, index) => (
            <Link href={Menu.path} key={index}>
              <div
                className={`flex justify-left rounded-md p-2 cursor-pointer duration-50 ease-in-out text-lg items-center gap-x-4 
      text-white hover:bg-white hover:text-black ${asPath === Menu.path ? 'bg-[#292c50]' : ''}`}
              >
                {Menu.src}
                <span className={`${!open && "hidden"} origin-left duration-200`}>
                  {Menu.title}
                </span>
              </div>
            </Link>
          ))}

        </ul>
      </div>
    </div>
  );
};
export default Sidebar;

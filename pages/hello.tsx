/*
  This example requires Tailwind CSS v2.0+ 
  
  This example requires some changes to your config:
  
  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/forms'),
    ],
  }
  ```
*/
import { Fragment } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { FiArrowDown, FiMenu, FiCheck, FiChevronDown, FiChevronRight, FiStar, FiSearch, FiX } from 'react-icons/fi'
import Sidebar from '@/components/Sidebar2'
import Wrapper from '@/components/Test/Wrapper'
import Navbar from '@/components/Test/Navbar'

const navigation = [
  { name: 'Dashboard', href: '#', current: true },
  { name: 'Domains', href: '#', current: false },
]
const userNavigation = [
  { name: 'Your Profile', href: '#' },
  { name: 'Settings', href: '#' },
  { name: 'Sign out', href: '#' },
]
const projects = [
  {
    name: 'Workcation',
    href: '#',
    siteHref: '#',
    repoHref: '#',
    repo: 'debbielewis/workcation',
    tech: 'Laravel',
    lastDeploy: '3h ago',
    location: 'United states',
    starred: true,
    active: true,
  },
  // More projects...
]
const activityItems = [
  { project: 'Workcation', commit: '2d89f0c8', environment: 'production', time: '1h' },
  // More items...
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Example() {
  return (
    <>
      <div className="text-white h-screen flex flex-col overflow-hidden">
      <div className="grid grid-cols-5 h-full overflow-hidden">
        <div className="col-span-4 flex flex-col">
          <Navbar />
          <div className="overflow-auto">
              <Wrapper />
            </div>
          </div>
        </div>
    </div>
    </>
  )
}

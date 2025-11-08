'use client';
import React, { useState } from 'react';
import Image from 'next/image';

export default function MenuDesplegable() {
  const [isOpen, setIsOpen] = useState(false);

  function toggleMenu() {
    setIsOpen(!isOpen);
  }

  return (
    <div className="relative">
     <button onClick={toggleMenu} >
      <Image
        src="/menuBurguer.svg"
        alt="menu"
        width={32}
        height={32}
        className="cursor-pointer lg:hidden"
      />
     </button>
      {/* Menú lateral */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-green-200 shadow-lg transform ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } transition-transform duration-300 ease-in-out lg:hidden z-50`}
      >
       <button onClick={toggleMenu}>
        <div className="flex justify-end p-4">
          <Image
            src="/close.svg"
            alt="close menu"
            width={24}
            height={24}
            className="cursor-pointer"
          />
        </div>
       </button>
      </div>
    </div>
  );
}

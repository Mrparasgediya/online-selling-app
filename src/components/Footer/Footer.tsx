import React from "react";
import WhatsAppIcon from "components/Icons/WhatsAppIcon";
import CustomLink from "components/NextImageLink/NextImageLink";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="h-24 md:h-16 border w-[95%] mx-auto shadow-lg bg-white/70 backdrop-filter backdrop-blur-lg rounded-t-lg py-4 px-12">
      <div className="flex items-center justify-between flex-wrap">
        <Link href="/" passHref>
          <a>
            <h3 className="font-semibold text-xl">Arth Creation</h3>
          </a>
        </Link>
        <div className="text-md flex items-center gap-4">
          <p>Contact Us: +91 8140329445</p>
          <CustomLink link="https://wa.me/+918140329445">
            <WhatsAppIcon />
          </CustomLink>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

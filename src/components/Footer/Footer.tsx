import React from "react";
import WhatsAppIcon from "components/Icons/WhatsAppIcon";
import CustomLink from "components/NextImageLink/NextImageLink";

const Footer = () => {
  return (
    <div className="absolute bottom-0 left-1/2 right-0 border-2 w-[95%] -translate-x-1/2 shadow-lg bg-white/70 backdrop-filter backdrop-blur-lg rounded-t-lg p-4">
      <div>
        <h3 className="font-semibold text-xl">Arth Creation</h3>
        <div className="text-md flex items-center gap-4">
          <p>Contact Us: +91 8140329445</p>
          <CustomLink link="https://wa.me/+918140329445">
            <WhatsAppIcon />
          </CustomLink>
        </div>
      </div>
    </div>
  );
};

export default Footer;

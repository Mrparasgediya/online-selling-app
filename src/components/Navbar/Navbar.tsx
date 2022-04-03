import NextLink from "next/link";

const Navbar = () => {
  return (
    <nav className="px-8 py-4 h-auto w-full shadow-lg bg-white/70 backdrop-filter backdrop-blur-md">
      <NextLink href="/" passHref>
        <a className="font-medium text-lg ">Arth Creation</a>
      </NextLink>
    </nav>
  );
};

export default Navbar;

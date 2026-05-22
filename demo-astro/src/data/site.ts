export type NavLink = {
  href: string;
  label: string;
};

export const navLinks: NavLink[] = [
  { href: "/", label: "Inicio" },
  { href: "/servicios", label: "Servicios" },
  { href: "/productos/portik", label: "Portik" },
  { href: "/casos", label: "Casos" },
  { href: "/contacto", label: "Contacto" },
  { href: "/diagnostico", label: "Diagnostico" }
];

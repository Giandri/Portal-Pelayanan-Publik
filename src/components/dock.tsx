"use client";

import { cn } from "@/lib/utils";

import {
  easeIn,
  easeOut,
  LazyMotion,
  domAnimation,
  m,
  AnimatePresence,
} from "motion/react";
import Link from "next/link";
import Image from "next/image";
import React, {
  useState,
  useRef,
  useCallback,
  createContext,
  useContext,
  useEffect,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { X, Menu } from "lucide-react";

// Context to manage dock state
interface DockContextType {
  openDropdowns: Record<string, boolean>;
  hoveredLink: string | null;
  setHoveredLink: (href: string | null) => void;
  handleDropdownEnter: (id: string) => void;
  handleDropdownLeave: (id: string) => void;
  activePage?: string;
  isDark: boolean;
  pendingNavigation: string | null;
  triggerNavigation: (href: string) => void;
}

const DockContext = createContext<DockContextType | undefined>(undefined);

const useDock = () => {
  const context = useContext(DockContext);
  if (!context) {
    throw new Error("useDock must be used within a Dock component");
  }
  return context;
};

interface DockProps {
  children: React.ReactNode;
  closeDelay?: number;
  bottomOffset?: string;
  activePage?: string;
  className?: string;
}

export const Dock = ({
  children,
  closeDelay = 100,
  bottomOffset = "60px",
  activePage,
  className,
}: DockProps) => {
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>(
    {}
  );
  const closeTimeoutsRef = useRef<Record<string, NodeJS.Timeout | null>>({});
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);
  const router = useRouter();

  const { theme } = useTheme();
  const isDark = theme === "dark";

  const handleDropdownEnter = (id: string): void => {
    if (closeTimeoutsRef.current[id]) {
      clearTimeout(closeTimeoutsRef.current[id]!);
    }
    setOpenDropdowns((prev) => ({ ...prev, [id]: true }));
  };

  const handleDropdownLeave = (id: string): void => {
    closeTimeoutsRef.current[id] = setTimeout(() => {
      setOpenDropdowns((prev) => ({ ...prev, [id]: false }));
      setHoveredLink(null);
    }, closeDelay);
  };

  const triggerNavigation = useCallback((href: string) => {
    setPendingNavigation(href);
    // Wait for the sliding animation to finish, then navigate
    // Don't clear pendingNavigation — let the component unmount naturally on navigation
    setTimeout(() => {
      router.push(href);
    }, 400);
  }, [router]);

  return (
    <LazyMotion features={domAnimation}>
      <DockContext.Provider
        value={{
          openDropdowns,
          hoveredLink,
          setHoveredLink,
          handleDropdownEnter,
          handleDropdownLeave,
          activePage,
          isDark,
          pendingNavigation,
          triggerNavigation,
        }}
      >
        <div className="w-full">
          {/* Mobile Only Dock (Non-Fixed) */}
          <div className="md:hidden w-full flex justify-center mt-6">
            <div className="relative">
              <div
                className="bg-white/90 backdrop-blur-md border border-blue-950/20 rounded-full flex items-center p-1 gap-1"
              >
                {React.Children.map(children, (child) => {
                  if (React.isValidElement(child)) {
                    return React.cloneElement(
                      child as React.ReactElement<
                        DockItemProps | DockIconProps | DockLinkProps
                      >,
                      { renderType: "trigger" }
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          </div>
        </div>
      </DockContext.Provider>
    </LazyMotion>
  );
};

interface DockItemProps {
  children: React.ReactNode;
  label: string;
  id?: string;
  renderType?: "content" | "trigger";
  className?: string;
}

export const DockItem = ({
  children,
  label,
  id,
  renderType,
  className,
}: DockItemProps) => {
  const {
    openDropdowns,
    handleDropdownEnter,
    handleDropdownLeave,
    isDark,
    activePage,
  } = useDock();
  const pathname = usePathname();

  const itemId = id || label.toLowerCase().replace(/\s+/g, "-");
  const isOpen = openDropdowns[itemId] || false;

  const isAnyChildActive = React.Children.toArray(children).some((child) => {
    if (
      React.isValidElement<DockDropdownItemProps>(child) &&
      (child.type as { displayName?: string }).displayName ===
      "DockDropdownItem" &&
      child.props.href
    ) {
      const currentPath = activePage !== undefined ? activePage : pathname;
      return currentPath === child.props.href;
    }
    return false;
  });

  if (renderType === "content") {
    return (
      <m.div
        initial={{ opacity: 0, height: 0 }}
        animate={{
          opacity: isOpen ? 1 : 0,
          height: isOpen ? "auto" : 0,
        }}
        transition={{
          duration: 0.3,
          ease: "easeInOut",
        }}
        className={cn(
          "w-full overflow-hidden",
          isOpen ? "pointer-events-auto min-h-[100px]" : "pointer-events-none"
        )}
        onMouseEnter={() => handleDropdownEnter(itemId)}
        onMouseLeave={() => handleDropdownLeave(itemId)}
      >
        <div className="px-[15px] pt-[15px] pb-[30px] flex justify-between items-start w-full min-w-[400px] bg-white dark:bg-transparent">
          <div className="gap-[12.5px] flex flex-col">{children}</div>
          <DockItemImagePreview>{children}</DockItemImagePreview>
        </div>
      </m.div>
    );
  }

  return (
    <m.div
      className={cn(
        "transition-colors duration-200 text-[6px] leading-[2px] flex items-center gap-1 h-[28px] rounded-full cursor-pointer px-[10px]",
        isAnyChildActive
          ? "text-black dark:text-white font-medium"
          : "text-black dark:text-white",
        className
      )}
      onMouseEnter={() => handleDropdownEnter(itemId)}
      onMouseLeave={() => handleDropdownLeave(itemId)}
      animate={{
        backgroundColor:
          isOpen || isAnyChildActive
            ? isDark
              ? "#262626"
              : "#F0F0F0"
            : "transparent",
      }}
      whileHover={{
        backgroundColor:
          isOpen || isAnyChildActive
            ? isDark
              ? "#262626"
              : "#F0F0F0"
            : isDark
              ? "#262626"
              : "#F0F0F0",
      }}
      transition={{ duration: 0.2 }}
    >
      {label}
      <m.svg
        width="14"
        height="14"
        viewBox="0 0 16 16"
        className="text-black dark:text-white"
        xmlns="http://www.w3.org/2000/svg"
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{ duration: 0.2 }}
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M8 8.93934L4.53033 5.46967L3.46967 6.53033L6.58578 9.64645C7.36683 10.4275 8.63316 10.4275 9.41421 9.64645L12.5303 6.53033L11.4697 5.46967L8 8.93934Z"
          fill="currentColor"
        ></path>
      </m.svg>
    </m.div>
  );
};
DockItem.displayName = "DockItem";

const DockItemImagePreview = ({ children }: { children: React.ReactNode }) => {
  const { hoveredLink, activePage } = useDock();
  const pathname = usePathname();

  const activeChild = React.Children.toArray(children).find((child) => {
    if (
      React.isValidElement<DockDropdownItemProps>(child) &&
      (child.type as { displayName?: string }).displayName ===
      "DockDropdownItem" &&
      child.props.href
    ) {
      const currentPath = activePage !== undefined ? activePage : pathname;
      return currentPath === child.props.href;
    }
    return false;
  }) as React.ReactElement<DockDropdownItemProps> | undefined;

  const hoveredChild = React.Children.toArray(children).find((child) => {
    return (
      React.isValidElement<DockDropdownItemProps>(child) &&
      (child.type as { displayName?: string }).displayName ===
      "DockDropdownItem" &&
      child.props.href === hoveredLink
    );
  }) as React.ReactElement<DockDropdownItemProps> | undefined;

  const displayImage = hoveredChild?.props.image || activeChild?.props.image;
  const shouldShowImage = hoveredLink || activeChild;

  if (!displayImage) return null;

  return (
    <div className="flex flex-col items-end gap-2">
      <m.img
        key={displayImage}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: shouldShowImage ? 1 : 0.8,
          scale: shouldShowImage ? 1 : 0.9,
        }}
        transition={{
          ease: shouldShowImage ? easeIn : easeOut,
          duration: 0.2,
        }}
        src={displayImage}
        className="rounded-[15px] w-[80px] h-[80px] object-cover"
        alt=""
      />
    </div>
  );
};

interface DockDropdownItemProps {
  href: string;
  label: string;
  image?: string;
  className?: string;
}

export const DockDropdownItem = ({
  href,
  label,
  className,
}: DockDropdownItemProps) => {
  const { hoveredLink, setHoveredLink, activePage } = useDock();
  const pathname = usePathname();

  const currentPath = activePage !== undefined ? activePage : pathname;
  const isMenuItemActive = currentPath === href;
  const isHovered = hoveredLink === href;

  return (
    <m.a
      href={href}
      whileHover={{ x: 5 }}
      transition={{ duration: 0.1 }}
      onMouseEnter={() => setHoveredLink(href)}
      className={cn(
        "block text-[14px] leading-[10px] transition-colors",
        isMenuItemActive || isHovered
          ? "text-black dark:text-white font-medium"
          : "text-neutral-500 dark:text-black hover:text-black dark:hover:text-white",
        className
      )}
    >
      {label}
    </m.a>
  );
};
DockDropdownItem.displayName = "DockDropdownItem";

interface DockIconProps {
  icon: React.ReactNode;
  href: string;
  renderType?: "content" | "trigger";
  className?: string;
}

export const DockIcon = ({
  icon,
  href,
  renderType,
  className,
}: DockIconProps) => {
  const { isDark, activePage } = useDock();
  const pathname = usePathname();

  if (renderType === "content") return null;

  const currentPath = activePage !== undefined ? activePage : pathname;
  const isActive = currentPath === href;

  return (
    <Link href={href}>
      <m.div
        className={cn(
          "flex items-center justify-center w-[36px] h-[28px] rounded-full cursor-pointer",
          className
        )}
        animate={{
          backgroundColor: isActive
            ? isDark
              ? "#262626"
              : "#F0F0F0"
            : "transparent",
        }}
        whileHover={{
          backgroundColor: isDark ? "#262626" : "#F0F0F0",
        }}
        transition={{ duration: 0.2 }}
      >
        {icon}
      </m.div>
    </Link>
  );
};
DockIcon.displayName = "DockIcon";

interface DockLinkProps {
  label: string;
  href: string;
  icon?: React.ReactNode;
  external?: boolean;
  renderType?: "content" | "trigger";
  id?: string;
  className?: string;
}

export const DockLink = ({
  label,
  href,
  icon,
  external,
  renderType,
  className,
}: DockLinkProps) => {
  const { isDark, activePage, pendingNavigation, triggerNavigation } = useDock();
  const pathname = usePathname();
  const [isHovered, setIsHovered] = useState(false);

  if (renderType === "content") return null;

  const currentPath = activePage !== undefined ? activePage : pathname;
  const isActive = currentPath === href;
  // Show as "active" if this is the tab being navigated to
  const isPending = pendingNavigation === href;
  const showActive = isActive || isPending;

  const handleClick = (e: React.MouseEvent) => {
    if (!external && !isActive) {
      e.preventDefault();
      triggerNavigation(href);
    }
  };

  const linkContent = (
    <>
      {label}
      {icon && (
        <m.div
          initial={{ x: 0, y: 0 }}
          animate={{
            x: isHovered || isPending ? 2 : 0,
            y: isHovered || isPending ? -2 : 0,
          }}
          transition={{ duration: 0.2 }}
        >
          {icon}
        </m.div>
      )}
    </>
  );

  if (external) {
    const externalClassName = cn(
      "transition-colors duration-200 text-[10px] leading-[10px] flex items-center gap-1 h-[28px] rounded-full px-[10px] font-bold",
      isActive
        ? "bg-blue-950 text-yellow-400"
        : "text-blue-950/70 hover:text-blue-950 hover:bg-blue-950/5",
      className
    );
    return (
      <m.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={externalClassName}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{
          backgroundColor: isActive
            ? isDark
              ? "#404040"
              : "#E0E0E0"
            : isDark
              ? "#262626"
              : "#F0F0F0",
        }}
        transition={{ duration: 0.2 }}
      >
        {linkContent}
      </m.a>
    );
  }

  return (
    <m.div
      className="relative inline-block rounded-full"
      transition={{ duration: 0.2 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Sliding active indicator - shared layoutId for smooth animation */}
      {showActive && (
        <m.div
          layoutId="dock-active-indicator"
          className="absolute inset-0 bg-blue-950 rounded-full"
          transition={{
            type: "spring",
            stiffness: 350,
            damping: 30,
            mass: 0.8,
          }}
        />
      )}
      <button
        onClick={handleClick}
        className={cn(
          "relative z-10 text-[10px] leading-[10px] flex items-center gap-1 h-[28px] rounded-full px-[10px] font-bold transition-colors duration-200 cursor-pointer",
          showActive
            ? "text-yellow-400"
            : "text-blue-950/70 hover:text-blue-950",
          className
        )}
      >
        {linkContent}
      </button>
    </m.div>
  );
};
DockLink.displayName = "DockLink";

export default Dock;

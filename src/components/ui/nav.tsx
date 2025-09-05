
"use client";

import Link from "next/link";
import { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { TooltipProvider } from "@radix-ui/react-tooltip";

interface NavProps {
  isCollapsed: boolean;
  links: {
    title: string;
    label?: string;
    icon: LucideIcon;
    variant: "default" | "ghost";
    href: string;
    subLinks?: {
      title: string;
      label?: string;
      icon: LucideIcon;
      variant: "default" | "ghost";
      href: string;
    }[];
  }[];
}

export function Nav({ links, isCollapsed }: NavProps) {
  return (
    <TooltipProvider>
      <div
        data-collapsed={isCollapsed}
        className="group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2"
      >
        <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
          {links.map((link, index) =>
            isCollapsed ? (
              <Tooltip key={index} delayDuration={0}>
                <TooltipTrigger asChild>
                  <Link
                    href={link.href}
                    className={cn(
                      buttonVariants({ variant: link.variant, size: "icon" }),
                      "h-9 w-9",
                      link.variant === "default" &&
                        "dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white"
                    )}
                  >
                    <link.icon className="h-4 w-4" />
                    <span className="sr-only">{link.title}</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right" className="flex flex-col items-start gap-2 p-2">
                  <div className="font-bold">{link.title}</div>
                  {link.subLinks && (
                    <div className="grid gap-1">
                      {link.subLinks.map((subLink, subIndex) => (
                        <Link
                          key={subIndex}
                          href={subLink.href}
                          className={cn(
                            buttonVariants({ variant: subLink.variant, size: "sm" }),
                            "justify-start"
                          )}
                        >
                          <subLink.icon className="mr-2 h-4 w-4" />
                          {subLink.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </TooltipContent>
              </Tooltip>
            ) : (
              <div key={index}>
                 <Link
                  href={link.href}
                  className={cn(
                    buttonVariants({ variant: link.variant, size: "sm" }),
                    link.variant === "default" &&
                      "dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white",
                    "justify-start"
                  )}
                >
                  <link.icon className="mr-2 h-4 w-4" />
                  {link.title}
                  {link.label && (
                    <span
                      className={cn(
                        "ml-auto",
                        link.variant === "default" &&
                          "text-background dark:text-white"
                      )}
                    >
                      {link.label}
                    </span>
                  )}
                </Link>
                {link.subLinks && (
                  <div className="ml-7 mt-2 grid gap-1">
                    {link.subLinks.map((subLink, subIndex) => (
                      <Link
                        key={subIndex}
                        href={subLink.href}
                        className={cn(
                          buttonVariants({ variant: subLink.variant, size: "sm" }),
                          subLink.variant === "default" &&
                            "dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white",
                          "justify-start"
                        )}
                      >
                        <subLink.icon className="mr-2 h-4 w-4" />
                        {subLink.title}
                        {subLink.label && (
                          <span
                            className={cn(
                              "ml-auto",
                              subLink.variant === "default" &&
                                "text-background dark:text-white"
                            )}
                          >
                            {subLink.label}
                          </span>
                        )}
                      </Link>
                    ))}
                   </div>
                )}
              </div>
            )
          )}
        </nav>
      </div>
    </TooltipProvider>
  );
}

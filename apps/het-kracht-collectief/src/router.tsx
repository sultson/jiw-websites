import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type AnchorHTMLAttributes,
  type ReactNode,
} from "react";
import type { Lang } from "./content";
import { localizePath, matchPath, type PageKey } from "./routes";

type RouterValue = { path: string; page: PageKey | null; lang: Lang; navigate: (to: string) => void };

const RouterContext = createContext<RouterValue>({ path: "/", page: "home", lang: "nl", navigate: () => {} });

export function useRouter() {
  return useContext(RouterContext);
}

export function RouterProvider({ initialPath, children }: { initialPath?: string; children: ReactNode }) {
  const [path, setPath] = useState(() =>
    typeof window === "undefined" ? initialPath ?? "/" : window.location.pathname,
  );

  useEffect(() => {
    const onPop = () => setPath(window.location.pathname);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const navigate = useCallback((to: string) => {
    const [rawPath, hash] = to.split("#");
    const targetPath = rawPath || "/";
    window.history.pushState({}, "", to);
    setPath(targetPath);
    if (hash) {
      // Let the destination render before scrolling to the anchor.
      window.setTimeout(() => {
        document.getElementById(hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 70);
    } else {
      window.scrollTo({ top: 0, left: 0 });
    }
  }, []);

  const { page, lang } = matchPath(path);
  return <RouterContext.Provider value={{ path, page, lang, navigate }}>{children}</RouterContext.Provider>;
}

// `to` is the Dutch path; it is rewritten to the current language unless `raw`.
type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { to: string; raw?: boolean };

export function Link({ to, raw, children, onClick, ...rest }: LinkProps) {
  const { navigate, lang } = useRouter();
  const href = raw ? to : localizePath(to, lang);
  return (
    <a
      href={href}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented) return;
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
        if (rest.target === "_blank") return;
        e.preventDefault();
        navigate(href);
      }}
      {...rest}
    >
      {children}
    </a>
  );
}

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type AnchorHTMLAttributes,
  type ReactNode,
} from "react";

type RouterValue = { path: string; navigate: (to: string) => void };

const RouterContext = createContext<RouterValue>({ path: "/", navigate: () => {} });

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

  return <RouterContext.Provider value={{ path, navigate }}>{children}</RouterContext.Provider>;
}

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { to: string };

export function Link({ to, children, onClick, ...rest }: LinkProps) {
  const { navigate } = useRouter();
  return (
    <a
      href={to}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented) return;
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
        if (rest.target === "_blank") return;
        e.preventDefault();
        navigate(to);
      }}
      {...rest}
    >
      {children}
    </a>
  );
}

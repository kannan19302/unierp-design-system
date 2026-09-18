import React from "react";

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children?: React.ReactNode;
}

const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ href, children, ...rest }, ref) => {
    return (
      <a ref={ref} href={href} {...rest}>
        {children}
      </a>
    );
  }
);

Link.displayName = "Link";

export default Link;

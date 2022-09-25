import React from "react";
import Link from "next/link";

// I EMPLOYED forwardRef TO AVOID ERROR MESSAGES FROM THE BROWSER
// export default function DropdownLink(props) {
//   const { href, children, ...rest } = props;
//   return (
//     <Link href={href}>
//       <a {...rest}>{children}</a>
//     </Link>
//   );
// }

const DropdownLink = React.forwardRef(({ href, children, ...rest }, ref) => (
  <Link ref={ref} href={href}>
    <a {...rest}>{children}</a>
  </Link>
));

export default DropdownLink;

import { Link } from '@remix-run/react';
import React from 'react';

type AnchorProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: React.ReactNode;
};

const Anchor: React.FC<AnchorProps> = ({ children, href }) => {
  const classNames = 'font-medium text-indigo-600 hover:text-indigo-500';

  if (href?.startsWith('https://')) {
    return (
      <a className={classNames} href={href} rel="noopener noreferrer">
        {children}
      </a>
    );
  }

  return (
    <Link className={classNames} to={href || '/'}>
      {children}
    </Link>
  );
};

export default Anchor;

import { Form, Link } from '@remix-run/react';
import IconCart from './IconCart';
import RemixLogo from './RemixLogo';

const Header = ({ cartCount }: { cartCount?: number }) => {
  return (
    <nav className="bg-black">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-row items-end justify-between pt-4 pb-4">
          <div className="max-w-48 flex flex-row bg-black text-white sm:mr-16 sm:max-w-none">
            <Link to="/">
              <RemixLogo /> <span>Shop</span>
            </Link>
          </div>
          <Form
            action="/search"
            className="mx-auto hidden max-w-lg flex-1 lg:block"
          >
            <input
              name="q"
              className="w-full border border-zinc-700 bg-zinc-900 p-2 text-white"
              placeholder="Search"
            />
          </Form>
          <Link
            to="/cart"
            data-testid="cart-link"
            className="relative ml-4 inline-block"
          >
            <IconCart cartCount={cartCount} />
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Header;

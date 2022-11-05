import Anchor from './Anchor';

const Footer = () => {
  return (
    <footer className="mx-auto flex max-w-screen-xl justify-center px-4 sm:px-6 lg:px-8">
      <div className="flex w-full flex-col border-t border-solid border-gray-300 px-12 py-8 sm:flex-row sm:items-center">
        <span className="mx-auto block text-xs text-gray-700">
          Made with <Anchor href="https://remix.run/">GitHub</Anchor>. Source
          code available on{' '}
          <Anchor href="https://github.com/petermekhaeil/remix-ecommerce">
            GitHub
          </Anchor>
          .
        </span>
      </div>
    </footer>
  );
};

export default Footer;

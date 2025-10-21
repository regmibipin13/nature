import Link from "next/link";

export const Newsletter = () => {
  return (
    <section className="flex flex-col md:flex-row items-center justify-between w-full mx-auto mt-20 max-w-7xl">
      <div className="md:w-1/2 w-full mb-10 md:mb-0">
        <h2 className="text-4xl md:text-6xl font-light leading-tight">
          Want product{" "}
          <span className="italic font-serif">news and updates?</span> <br />
          <span className="font-normal text-4xl">
            Sign up for our newsletter.
          </span>
        </h2>
      </div>
      <div className="md:w-1/2 w-full flex flex-col items-center">
        <form className="flex w-full max-w-xl">
          <input
            type="email"
            placeholder="ENTER YOUR EMAIL"
            className="flex-1 rounded-l-full border border-gray-300 px-6 py-4 text-lg outline-none focus:border-black"
          />
          <button
            type="submit"
            className="bg-neutral-900 rounded-full w-16 h-16 flex items-center justify-center -ml-4 hover:bg-neutral-800 transition"
            aria-label="Submit"
          >
            <svg
              width="24"
              height="24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </form>
        <p className="mt-6 text-center text-lg text-neutral-700">
          WE CARE ABOUT YOUR DATA. READ OUR{" "}
          <Link href="/privacy" className="underline">
            PRIVACY POLICY
          </Link>
          .
        </p>
      </div>
    </section>
  );
};

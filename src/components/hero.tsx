export default function HeroSection() {
  return (
    <section className="bg-black">
      <section className="bg-white lg:grid lg:h-screen lg:place-content-center dark:bg-black">
        <div
          className="mx-auto w-screen max-w-screen-2xl px-4 py-16 sm:px-6 sm:py-24 
          md:grid md:grid-cols-2 md:items-center md:gap-4 lg:px-8 lg:py-32"
        >
          {/* Text Section */}
          <div
            className="
              max-w-prose 
              text-center md:text-left     /* ✅ Center text on small screens, left align on md+ */
              flex flex-col items-center md:items-start /* ✅ Center elements on small, align left on large */
            "
          >
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl dark:text-white">
              Chat Smarter.
              <strong className="text-green-500"> Connect </strong>
              Faster.
            </h1>

            <p className="mt-4 text-base text-pretty text-gray-700 sm:text-lg/relaxed dark:text-gray-200 max-w-md">
              A beautiful, real-time chat experience with end-to-end encryption.
              Connect with friends and colleagues seamlessly across devices.
              Join now and experience the future of communication!
            </p>

            {/* Buttons */}
            <div
              className="mt-6 flex  sm:flex-row gap-4 justify-center md:justify-start"
            >
              <a
                href="/signup"
                className="inline-block rounded border border-green-500 bg-green-500 px-5 py-3 font-medium text-white shadow-sm transition-colors hover:bg-green-700"
              >
                Get Started
              </a>

              <a
                href="#"
                className="inline-block rounded border border-gray-200 px-5 py-3 font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 hover:text-gray-900 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800 dark:hover:text-white"
              >
                Learn More
              </a>
            </div>
          </div>

          {/* Image (only visible on md+) */}
          <img
            className="hidden md:block rounded-[30px] bg-gray-100"
            src="/hero.jpg"
            alt="Chat illustration"
          />
        </div>
      </section>
    </section>
  );
}

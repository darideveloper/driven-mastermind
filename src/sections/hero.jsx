export default function Hero () {
  return (
    <section className="hero">
      <div className="wrapper-logo mx-auto my-0">
      </div>

      <div className="hero-image relative">

        <div className="text-wrapper mt-16 mb-10 w-full z-10 text-center flex flex-col items-center justify-center sm:absolute sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:m-0">
          <h2 className='py-2 px-4 text-lg sm:text-2xl md:text-4xl lg:text-6xl leading-snug bg-white inline-block lg:py-5 lg:px-20 '>
            Complimentary transportation will be provided
            <br />
            <span
              className={`
                text-sm sm:text-lg md:text-2xl lg:text-3xl
              `}
            >
              Please book your airport transportation at your earliest convenience
            </span>
          </h2>
        </div>

        <img src="./imgs/hero.png" alt="transport image" className="w-full"/>

        <img 
          src="./imgs/logo.png"
          alt="Driven Mastermind logo"
          className={`
            w-2/3 sm:w-1/3 
            mx-auto
            mt-24
          `}
        />
      </div>
    </section>
  )
}
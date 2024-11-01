export default function About() {
  return (
    <div className="container pt-5 text-center" style="max-width: 700px;">
      <h1>About</h1>
      <p>
        Here at DividendSpot, we care about only one thing: <b>dividends</b>
      </p>

      <p>
        Most stock websites out there feature a ton of unnecessary information,
        which can be distracting when all you care about is dividends.
      </p>

      <p>
        Try visiting Yahoo Finance right now, it's a disaster. At any given
        moment there could be 100 different irrelevant pieces of information
        floating around on your screen and the only thing you care about is
        hidden and difficult to find. DividendSpot attempts to fix that
        annoyance.
      </p>

      <div class="mt-5">
        <a
          href="https://awoldt.com"
          style="text-decoration: none; color: rgb(108, 117, 125)"
          target="_blank"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="20"
            viewBox="0 -960 960 960"
            width="20"
            fill="rgb(108, 117, 125)"
          >
            <path d="M238-99q-48 0-100.25-28.5T47-216q35-1.5 61.5-17.5T139-290q5-51.5 42.75-88.75T277-416q57.5 0 98.25 41.25T416-276q0 75-51.5 126T238-99Zm251-254L353-488l396-396q11-11 27-11.5t28 11.5l80 81q12 12 12 27.5T884-748L489-353Z" />
          </svg>{" "}
          <b b-dccayrtai0="">Made by Awoldt</b>
        </a>
      </div>
    </div>
  );
}

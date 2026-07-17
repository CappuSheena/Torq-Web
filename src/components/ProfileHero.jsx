import profileHeroImg from '../assets/trackProfileImg.png';

// Full-bleed banner for the Profile page, same layered-fade treatment as the home page Hero (top/bottom edge fades + a left-to-right page-colour gradient so text stays readable over the photo), just shorter and with no CTA buttons since the user is already signed in.
function ProfileHero({ displayName }) {
  return (
    <div className="relative left-1/2 -mx-[50vw] w-screen min-h-[320px] overflow-hidden">
      <img
        src={profileHeroImg}
        alt="Rider leaning into a corner on a track day"
        className="absolute inset-0 h-full w-full object-cover object-[center_30%]"
      />

      <div className="absolute inset-0 bg-gradient-to-r from-page via-page/85 to-page/10" />

      {/* Top edge fade */}
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-page to-transparent" />

      {/* Bottom edge fade */}
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-page to-transparent" />

      <div className="relative z-10 mx-auto flex h-full max-w-6xl items-end p-8">
        <div>
          <p className="text-sm font-medium text-accent">Your garage</p>
          <h1 className="font-display mt-2 text-4xl font-bold sm:text-5xl">
            Welcome back{displayName ? `, ${displayName}` : ''}.
          </h1>
          <p className="mt-4 w-3/5 text-sm leading-6 text-muted sm:text-base">
            This is your bike profile. Manage your bike here and keep track of maintenance.
          </p>
        </div>
      </div>
    </div>
  );
}

export default ProfileHero;

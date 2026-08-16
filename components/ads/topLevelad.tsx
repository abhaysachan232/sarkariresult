import GoogleAd from "./GoogleAd";

interface TopLevelAdProps {
  instance?: string;
}

export default function TopLevelAd({
  instance = "1",
}: TopLevelAdProps) {
  return (
    <div className="w-full flex justify-center my-4 overflow-hidden">
      <GoogleAd
        adUnitPath="/22711673431/Abhay/top-banner"
        divId={`div-gpt-ad-top-banner-${instance}`}
        sizes={[
          [970, 66],
          [980, 120],
          [960, 90],
          [320, 50],
          [970, 90],
          [728, 90],
          [320, 480],
          [980, 90],
          [970, 250],
          [930, 180],
          [336, 280],
          [320, 100],
          [950, 90],
        ]}
        className="min-h-[50px]"
      />
    </div>
  );
}
import GoogleAd from "./GoogleAd";

interface BottomBannerProps {
  instance?: string;
}

export default function BottomBanner({
  instance = "1",
}: BottomBannerProps) {
  return (
    <div className="w-full flex justify-center my-6 overflow-hidden">
      <GoogleAd
        adUnitPath="/22711673431/Abhay/BottomBanner"
        divId={`div-gpt-ad-bottom-banner-${instance}`}
        sizes={[
          [970, 90],
          [728, 90],
          [320, 50],
          [320, 100],
        ]}
        className="min-h-[50px]"
      />
    </div>
  );
}
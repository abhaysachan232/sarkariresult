import GoogleAd from "./GoogleAd";

interface InArticleAdProps {
  instance?: string;
}

export default function InArticleAd({
  instance = "1",
}: InArticleAdProps) {
  return (
    <div className="w-full flex justify-center my-5 overflow-hidden">
      <GoogleAd
        adUnitPath="/22711673431/Abhay/InArticleAd"
        divId={`div-gpt-ad-inarticle-${instance}`}
        sizes={[
          [300, 250],
          [336, 280],
        ]}
        className="min-h-[250px]"
      />
    </div>
  );
}
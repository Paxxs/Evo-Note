"use client";

import Script from "next/script";

const Clarity = () => {
  return (
    <>
      <Script strategy="afterInteractive" id="clarity-script">
        {`  (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID}");`}
      </Script>
    </>
  );
};

export default Clarity;

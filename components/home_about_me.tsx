import backPanel from "../public/images/home/about_me/back-panel.png";
import logo from "../public/images/Logo.svg";
import Image from "next/image";

function HomeAboutMe() {
  return (
    <>
      {/* <div className="sticky top-0 h-[100vh]">
        <div className="el">
          <Image src={BackPanel} fill alt="Back Panel" />
        </div>
      </div> */}
      {/* <div
        style={{
          width: "calc(100vw)",
          height: "calc(100vh)",
          //   margin: "30px",
          backgroundImage: `url(${BackPanel.src})`,
          //   backgroundSize: "cover",
          //   backgroundPosition: "center",
        }}
      /> */}

      {/* <div className="flex items-center justify-center h-[100vh] w-[100vw] p-[25px]">
        <img
          src="/images/home/about_me/back-panel.svg"
          alt="Back Panel"
          className="h-full w-full object-fill"
        />
      </div> */}

      <div className="h-[100vh] w-[100vw] p-[25px]">
        <div
          className="h-full w-full bg-center"
          style={{
            backgroundImage: "url('/images/home/about_me/back-panel.svg')",
            backgroundSize: "100% 100%",
            backgroundRepeat: "no-repeat",
          }}
        >
          <img src={logo.src} className="w-[9%] h-[9%]"/>
        </div>
      </div>
    </>
  );
}

export default HomeAboutMe;

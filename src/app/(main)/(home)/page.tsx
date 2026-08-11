'use client'

import FeaturedNews from "./components/featured-news";
import Advertisements from "./components/quick-links";
import HorizontalAdBanner from "./components/horizontal-ad-banner";
import News from "./components/news";
import Events from "./components/events";
import BusinessOpportunities from "./components/business-opportunities";
import PolicyAndLaws from "./components/policies-and-laws";
import EventsCalendar from "./components/events-calendar";
import Banner from "./components/banner";
import Members from './components/members';
import VideoAndPartners from './components/video-and-patners';

const Page = () => {
  return (
    <div>
      <Banner />
      {/* contents */}
      <div className="container mx-auto px-3 sm:px-6 lg:px-10 space-y-6">
        <FeaturedNews />


        <section className="flex flex-col xl:flex-row pb-8 gap-5 mb-0">
          <News />
          <Advertisements count={3} startIndex={0} />
        </section >

        <HorizontalAdBanner />

        <section className="flex flex-col gap-5 xl:flex-row xl:items-stretch" >
          <Events />
          <EventsCalendar />
        </section >

        <div className="flex flex-col lg:flex-row gap-5" >
          <div className="flex flex-col flex-1">
            {/* <div>
              <Link href="https://vcci-hcm.org.vn/wp-content/uploads/2022/11/MEDIA-KIT_VCCI-HCM-2022-Final.pdf">
                <ImageNext
                  src="/home/Standard-Banner-1-2024.png.webp"
                  alt="banner"
                  width={2560}
                  height={720}
                />
              </Link>
            </div> */}

            <section className="flex flex-col xl:flex-row gap-5">
              <div className="flex flex-col md:flex-row gap-5 pt-8 flex-1 order-2 xl:order-1">
                <BusinessOpportunities />
                <PolicyAndLaws />
              </div>
              <Advertisements count={2} startIndex={3} />
            </section>
          </div>

          {/* <div className="w-full lg:w-[30%] justify-center items-start flex">
            <Link href="https://smartgara.ecaraid.com/">
              <ImageNext
                src="/home/eCarAid_web_banner_600x400.webp"
                alt="banner"
                width={600}
                height={400}
              />
            </Link>
          </div> */}
        </div >

        <Members />
        <VideoAndPartners />
      </div>
    </div>
  );
};

export default Page;

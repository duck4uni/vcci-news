'use client'

import Link from 'next/link'
import ImageNext from '@/components/shared/image-next';
import FeaturedNews from "./components/featured-news";
import QuickLinks from "./components/quick-links";
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
      <div className="container mx-auto px-3 sm:px-6 lg:px-10 space-y-12">
        <FeaturedNews />
        <div>
          <Link href="https://hardwaretools.com.vn/">
            <ImageNext
              src="/home/Standard-Banner-1-2024.png.webp"
              alt="banner"
              width={2560}
              height={720}
            />
          </Link>
        </div>

        <section className="flex flex-col lg:flex-row gap-5 pb-10 mb-0">
          <News />
          <QuickLinks />
        </section >

        <section className="flex flex-col lg:flex-row gap-5 pb-10 mb-0" >
          <Events />
          <EventsCalendar />
        </section >

        {/* <div className="flex flex-col lg:flex-row gap-5 pb-10 mb-0" >
          <div className="flex flex-col flex-1">
            <div>
              <Link href="https://vcci-hcm.org.vn/wp-content/uploads/2022/11/MEDIA-KIT_VCCI-HCM-2022-Final.pdf">
                <ImageNext
                  src="/home/Standard-Banner-1-2024.png.webp"
                  alt="banner"
                  width={2560}
                  height={720}
                />
              </Link>
            </div>

            <section className="flex flex-col md:flex-row gap-5 pt-8">
              <BusinessOpportunities />
              <PolicyAndLaws />
            </section>
          </div>

          <div className="w-full lg:w-[30%] justify-center items-start flex">
            <Link href="https://smartgara.ecaraid.com/">
              <ImageNext
                src="/home/eCarAid_web_banner_600x400.webp"
                alt="banner"
                width={600}
                height={400}
              />
            </Link>
          </div>
        </div> */}

        <Members />
        <VideoAndPartners />
      </div>
    </div >
  );
};

export default Page;
